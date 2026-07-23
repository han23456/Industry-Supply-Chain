# 产业链节点详情独立页面重构计划

## 一、背景与目标

当前产业链树形结构节点点击后，通过 `openSegmentModal(nodeId)` 在 `chain-graph.html` 中打开模态弹窗展示节点详情。为提升信息展示空间、支持 URL 直达与独立访问，需将弹窗内容重构为一个独立的页面组件。

目标：
- 保留原弹窗全部 5 个模块信息（产业产值、专利科创、市场竞争力、龙头企业统计、全国 Top100 分布）。
- 新页面具备独立 URL，可通过 `chainId` + `nodeId` 直接访问。
- 符合项目现有的 gov-header / side-nav / page-layout / 面包屑导航规范。
- 原所有点击触发位置改为跳转到新页面，并保留返回来源上下文。
- 实现平滑的跳转过渡效果。

## 二、现状梳理

### 2.1 弹窗触发位置

| 文件 | 位置 | 触发方式 |
|------|------|----------|
| `js/chain-graph.js:1135` | 强链补链列表中的“定位图谱”按钮 | `onclick="locateInGraph('${gap.nodeId}')"` |
| `js/chain-graph.js:1162` | `locateInGraph` 函数内部 | 叶子节点调用 `openSegmentModal(nodeId)` |
| `js/chain-graph.js:2260` | 结构视图 chain panel header | `onclick="onChainPanelHeaderClick('${node.id}', ${hasChildren})"` |
| `js/chain-graph.js:2298` | 结构视图叶子节点 `.chain-sub-row` | `onclick="openSegmentModal('${node.id}')"` |

### 2.2 弹窗相关函数

均位于 `js/chain-graph.js`：
- `openSegmentModal(nodeId)`：组装弹窗 HTML 并调用 `openModal`。
- `buildSegmentStats(node)`：生成 5 大模块的指标数据。
- `classifyNode(node)`：返回节点状态标签（核/优/弱/断）与颜色。
- `findNodeInTree(nodes, nodeId)`：在树中递归查找节点（原文件存在两处重复定义）。
- `hashCode(str)` / `seededRandom(seed)`：`buildSegmentStats` 依赖的确定性随机函数。

### 2.3 页面公共规范

- 头部组件：`<gov-header></gov-header>` + `<side-nav></side-nav>`。
- 布局：`.page-layout` > `.page-content`。
- 面包屑：`BREADCRUMB_CONFIG`（`js/common.js`）+ `renderBreadcrumb(pageId)`。
- URL 参数：`getUrlParams()`（`js/common.js`）。
- 详情页参考：`enterprise-profile.html`、`chain-gap.html`。

## 三、重构方案

### 3.1 新建公共逻辑文件 `js/chain-node-common.js`

将弹窗的数据计算与 HTML 生成逻辑抽离，供原页面和新详情页复用：

- `findNodeInTree(nodes, nodeId)`
- `classifyNode(node)`
- `buildSegmentStats(node)`
- `hashCode(str)` / `seededRandom(seed)`
- `renderSegmentHeadHTML(node, cfg)`：节点名称 + 状态标签。
- `renderSegmentModulesHTML(node, stats)`：5 个模块卡片网格。
- `renderSegmentDetailHTML(node)`：完整内容 HTML（head + modules）。
- `getNodeDetailPageUrl(chainId, nodeId, from)`：生成详情页 URL。
- `navigateToNodeDetail(chainId, nodeId, event, from)`：带过渡动画的跳转入口。

### 3.2 新建页面 `chain-node-detail.html`

页面结构：
- 复用 `gov-header` + `side-nav` + `page-layout`。
- 顶部 `top-bar`：面包屑 + “返回产业链图谱”按钮。
- 主体：
  - 节点标题卡片：节点名称 + 状态标签 + 本区/全国企业数 + 覆盖率。
  - 5 个模块内容区（复用 `.segment-modal-grid`、`.segment-module` 等现有样式）。
- 底部：返回按钮 + “查看企业关系网络”入口（可选）。

### 3.3 新建页面脚本 `js/chain-node-detail.js`

职责：
- 从 URL 解析 `chainId`、`nodeId`、`from`。
- 调用 `MockAPI.getCategoryTree(chainId)` 加载数据。
- 使用 `findNodeInTree` 找到节点，调用 `renderSegmentDetailHTML` 渲染内容。
- 渲染面包屑（当前项显示节点名，图谱链接带 `chainId` 与 `nodeId`）。
- 绑定返回按钮。
- 处理缺失参数、节点不存在等异常。
- 执行页面入场淡入动画。

### 3.4 新建页面样式 `css/chain-node-detail.css`

- 节点标题卡片样式。
- 页面主体在桌面端更舒展的间距。
- 入场过渡遮罩 `.page-transition-overlay` 样式。

### 3.5 修改 `js/chain-graph.js`

- 删除本地定义的 `buildSegmentStats`、`classifyNode`、两处 `findNodeInTree`、`hashCode`、`seededRandom`。
- 保留 `openSegmentModal` 作为兼容壳，内部调用 `navigateToNodeDetail(chainId, nodeId, null, 'chain-graph')`。
- 修改三个触发点的 onclick 为跳转逻辑：
  - “定位图谱”按钮：`onclick="event.stopPropagation();navigateToNodeDetail(chainId, '${gap.nodeId}', event, 'chain-graph')"`。
  - `.chain-sub-row` 叶子节点：`onclick="navigateToNodeDetail(chainId, '${node.id}', event, 'chain-graph')"`。
  - `onChainPanelHeaderClick`：无子节点时调用 `navigateToNodeDetail`。
- 在 `init()` 数据加载完成后，若 URL 存在 `nodeId`，自动定位并高亮该节点（提升往返体验）。

### 3.6 修改 `chain-graph.html`

在 `chain-graph.js` 之前引入 `chain-node-common.js`：

```html
<script src="js/chain-node-common.js?v=1"></script>
<script src="js/chain-graph.js?v=15"></script>
```

### 3.7 修改 `js/common.js`

在 `BREADCRUMB_CONFIG` 中增加：

```js
'chain-node-detail.html': [
  { label: '首页', url: 'index.html' },
  { label: '产业全景', url: 'index.html' },
  { label: '产业链结构图谱', url: 'chain-graph.html' },
  { label: '产业链环节详情', url: '#', current: true }
]
```

### 3.8 平滑跳转过渡效果

采用“当前页面淡出 → 跳转 → 新页面淡入”的可靠方案：

- 旧页面点击时：
  1. 创建白色遮罩层并淡入。
  2. 将被点击元素高亮或缩放。
  3. 200ms 后执行 `window.location.href` 跳转。
- 新页面加载时：
  1. 默认执行 `.fade-in` 动画。
  2. 若检测到来自前序页面的过渡标记，先显示白色遮罩再淡出，形成连贯过渡。

不依赖 `document.startViewTransition`（兼容旧浏览器），使用 CSS transition 实现。

## 四、URL 设计

```
chain-node-detail.html?chainId=chain-robot&nodeId=xxx&from=chain-graph
```

| 参数 | 必填 | 说明 |
|------|------|------|
| `chainId` | 是 | 产业链 ID |
| `nodeId` | 是 | 节点 ID |
| `from` | 否 | 来源页，`chain-graph` 或 `chain-gap`，影响返回按钮文案与目标 |

## 五、关键文件

- 新建：`chain-node-detail.html`
- 新建：`js/chain-node-detail.js`
- 新建：`js/chain-node-common.js`
- 新建：`css/chain-node-detail.css`
- 修改：`chain-graph.html`
- 修改：`js/chain-graph.js`
- 修改：`js/common.js`

## 六、验证步骤

1. 确认 4 个新文件已创建，3 个存量文件已修改。
2. 在产业链图谱页点击结构视图叶子节点，验证跳转至 `chain-node-detail.html` 并正确展示 5 个模块。
3. 点击无子节点 panel header，验证同样跳转。
4. 在“强链补链”tab 点击“定位图谱”，验证叶子节点跳转。
5. 验证面包屑：首页 / 产业全景 / 产业链结构图谱 / [节点名]。
6. 验证返回按钮回到 `chain-graph.html?chainId=...&nodeId=...`，并自动定位高亮原节点。
7. 直接访问 URL（无前置点击），页面正常加载并淡入。
8. 缺少 `chainId` 或 `nodeId` 时，页面给出错误提示。
9. 验证其它使用 `openModal` 的功能未受影响。
