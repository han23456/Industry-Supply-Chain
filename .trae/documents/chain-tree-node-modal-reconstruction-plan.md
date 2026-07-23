# 产业链树形结构节点点击弹窗重构计划

## 一、背景与目标

当前产业链树形结构（结构视图 / 产业图谱 tab）的节点点击弹窗已实现基本功能，但模块数量、布局与视觉细节和原型图存在偏差。本次重构目标：

- 严格按照前两张原型图还原弹窗视觉与交互。
- 弹窗内容限定为 5 个模块：产业产值、专利科创、市场竞争力、龙头企业统计、全国 Top100 分布。
- 优化弹窗宽度、间距、字体、按钮、状态标签等视觉细节。
- 保证快速响应、居中定位及多屏幕尺寸下的响应式表现。
- 不影响系统其它弹窗（如新闻详情、完整度评分明细）的默认样式。

> 说明：用户共提供 4 张图片，本计划仅针对前两张“产业链节点详情弹窗”原型进行重构；后两张为产业概览驾驶舱模块，不在本次弹窗重构范围内。

## 二、现状梳理

| 位置 | 说明 |
|------|------|
| `js/chain-graph.js:2328` | `openSegmentModal(nodeId)` 弹窗主函数，当前生成 8 个模块的 HTML。 |
| `js/chain-graph.js:2411` | `buildSegmentStats(node)` 生成弹窗所需统计数据，包含 8 个模块的字段。 |
| `js/chain-graph.js:2204` | `classifyNode(node)` 返回节点状态：核（蓝 #165DFF）、优（橙 #FA8C16）、弱（绿 #52C41A）、断（灰 #9CA3AF）。 |
| `js/chain-graph.js:1162` / `2298` / `2312` | 三处触发点：图谱定位叶子节点、结构视图叶子行点击、无子节点 panel header 点击。 |
| `js/common.js:203` | 通用 `openModal(title, content, footer)`，默认宽度 640px，底部默认“知道了”按钮。 |
| `css/chain-graph.css:2339` | `.segment-modal*` 系列样式，当前支撑 8 模块布局。 |

## 三、重构方案

### 3.1 弹窗内容重构（js/chain-graph.js）

将 `openSegmentModal` 中的弹窗 HTML 替换为仅包含 5 个模块的结构：

- 弹窗 body 顶部显示节点名称大标题 + 状态标签（实心彩色背景 + 白色文字，与原型一致）。
- 模块布局使用 2 列网格：
  - 第 1 行：① 产业产值 | ② 专利科创
  - 第 2 行：③ 市场竞争力 | ④ 龙头企业统计
  - 第 3 行：⑤ 全国 Top100 分布（占满整行）
- 底部复用 `openModal` 默认的“知道了”按钮。

状态标签不再复用树形结构中的 `.chain-status-tag`（浅色背景深色字），而是在弹窗内使用实心彩色背景 + 白色字的专用标签样式，以贴合原型。

### 3.2 数据字段精简（js/chain-graph.js）

`buildSegmentStats` 删除已被移除模块的字段：

- 删除：⑥ 本地产业特色（parks、policies、shenzhenHongKong）
- 删除：⑦ 科创能力（rdRatio、researchPlatforms、industryProjects）
- 删除：⑧ 行业影响力（nationalRank、radiation、discourseRating）

保留前 5 个模块所需全部字段。

### 3.3 弹窗宽度加宽（不修改通用 common.js）

为避免影响其它页面/弹窗，不修改 `js/common.js`。

在 `openSegmentModal` 中调用 `openModal(node.name, content)` 后，通过 JS 为当前弹窗容器动态添加 `.modal-segment` 类：

```js
openModal(node.name, content);
const modalBox = document.querySelector('#commonModal .modal');
if (modalBox) modalBox.classList.add('modal-segment');
```

### 3.4 样式调整（css/chain-graph.css）

- 新增 `.modal.modal-segment`：宽度 `760px`，`max-width: 90vw`，保持居中。
- 调整 `.segment-modal-head`：标题字号 `20px`、加粗、底部边框。
- 调整 `.segment-modal-tag`：实心彩色背景 + 白色文字、圆角、`12px` 字号。
- 调整 `.segment-module`：背景 `#F8FAFC`、边框 `#E5E6EB`、圆角 `6px`、内边距 `12px`。
- 调整 `.segment-module-title`：左侧 `3px` 蓝色竖条、内边距左 `8px`、字号 `14px`、加粗。
- 调整 `.segment-metric-value`：数值加粗右对齐。
- 新增响应式规则：
  - `≤768px`：弹窗宽度 `90vw`，模块单列堆叠。
  - `≤480px`：适当缩小字号与内边距，避免横向滚动。

## 四、关键文件

- `d:\skill\AIcoding\Industry-Supply Chain2\js\chain-graph.js`
- `d:\skill\AIcoding\Industry-Supply Chain2\css\chain-graph.css`

> `js/common.js` 不修改，通过动态类名方式实现弹窗加宽，降低对全局通用组件的影响。

## 五、验证步骤

1. 打开 `chain-graph.html?chainId=chain-robot`，切换到“产业图谱” tab。
2. 点击结构视图中任意无子节点的叶子节点行，验证：
   - 弹窗标题栏显示节点名称，右上角有“×”关闭按钮。
   - body 顶部显示节点名称大标题 + 状态标签（核/优/弱/断）。
   - 仅出现 5 个模块，前 4 个呈 2×2 排布，第 5 个占满一行。
   - 模块标题左侧有蓝色竖条，指标行两端对齐，数值右对齐加粗。
   - 底部右侧有蓝色“知道了”按钮。
3. 点击无子节点的 chain panel header，验证同样弹出弹窗。
4. 在“强链补链”tab 点击某缺失环节节点的“定位图谱”，验证叶子节点定位后弹出弹窗。
5. 验证关闭方式：点击关闭按钮、点击遮罩、按 `Esc` 均可关闭。
6. 响应式测试：
   - 浏览器宽度 `768px` 以下：弹窗宽度不超过 `90vw`，模块单列显示。
   - 浏览器宽度 `480px` 以下：字号/间距收缩，无横向滚动条。
7. 回归测试：打开其它使用 `openModal` 的功能（如完整度评分明细、新闻详情），确认仍保持默认 640px 宽度。
