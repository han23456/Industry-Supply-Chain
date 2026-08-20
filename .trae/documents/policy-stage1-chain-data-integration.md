# policy-stage1.html 产业链下拉与节点接入真实数据计划

## 1. 摘要

将 `policy-stage1.html` 中的产业链下拉框与产业链环节/节点按钮从硬编码改为读取项目现有数据：

- 下拉框展示 `MOCK_INDUSTRY_CHAINS` 中的 12 条产业链，首项为 “-- 不限产业链 (全域) --”。
- 选择某条产业链后，下方环节/节点按钮动态渲染该链在 `MOCK_CATEGORY_TREES` 中根节点的直接子节点（一级产业链节点）。
- 未选择产业链时，显示 “该产业链暂无下设细分环节”。

## 2. 当前状态分析

- **数据来源**：`js/data.js` 已定义 `MOCK_INDUSTRY_CHAINS`（12 条产业链）与 `MOCK_CATEGORY_TREES`（各链拓扑树）。
- **页面现状**：`policy-stage1.html` 的产业链下拉框与环节按钮均为硬编码，未加载 `js/data.js`。
- **脚本现状**：`js/policy-stage1.js` 仅处理标签/数值/复选框状态、Tag 栏、漏斗模拟，未涉及产业链数据。
- **依赖关系**：改造后 `policy-stage1.html` 需先加载 `js/data.js`，业务脚本才能访问 `MOCK_INDUSTRY_CHAINS` 与 `MockAPI.getCategoryTree()`。

## 3. 拟议变更

### 3.1 `policy-stage1.html`

**操作**：

1. 在 `<head>` 中 `js/config/menu-config.js` 之后、`GovHeader.js` 之前添加：
   ```html
   <script src="js/data.js?v=4"></script>
   ```
2. 将产业链下拉框：
   ```html
   <select id="chainSelect" class="ps1-select">
     <option value="low_sky">低空经济与空天产业链</option>
     <option value="ai_robot">人工智能与机器人产业链</option>
     <option value="biomed">生物医药与大健康产业链</option>
   </select>
   ```
   替换为仅保留占位结构：
   ```html
   <select id="chainSelect" class="ps1-select">
     <option value="">-- 不限产业链 (全域) --</option>
   </select>
   ```
3. 将硬编码的 4 个 `.ps1-chain-node-btn` 替换为容器：
   ```html
   <div id="chainNodeContainer" class="ps1-chain-node-group">
     <span class="ps1-text-muted ps1-text-2xs">该产业链暂无下设细分环节</span>
   </div>
   ```

**原因**：剥离硬编码数据，为 JS 动态渲染提供挂载点。

### 3.2 `js/policy-stage1.js`

**操作**：新增一个 `ChainSelector` 模块，包含以下函数，并调整 `init()` 初始化顺序。

#### 3.2.1 新增常量

```javascript
/** 产业链下拉框空值文案 */
const CHAIN_SELECT_PLACEHOLDER = '-- 不限产业链 (全域) --';

/** 产业链节点为空时的提示文案 */
const CHAIN_NODE_EMPTY_TEXT = '该产业链暂无下设细分环节';
```

#### 3.2.2 新增 DOM 引用

```javascript
chainSelect: document.getElementById('chainSelect'),
chainNodeContainer: document.getElementById('chainNodeContainer'),
```

#### 3.2.3 新增 `renderChainOptions()`

- 读取 `window.MOCK_INDUSTRY_CHAINS` 数组。
- 若数据不存在，保留默认的 “-- 不限产业链 (全域) --” 选项并退出。
- 遍历数组，按 `name` 生成 `<option value="${chain.id}">${chain.name}</option>` 并追加到下拉框。
- 保持首项 `value=""` 为默认选中。

#### 3.2.4 新增 `renderChainNodes(chainId)`

- 若 `chainId` 为空，清空容器并显示 `CHAIN_NODE_EMPTY_TEXT`。
- 获取产业链拓扑树：
  - 优先使用 `window.MOCK_CATEGORY_TREES[chainId]`。
  - 若不存在，调用 `window.MockAPI.getCategoryTree(chainId)`（返回 Promise）获取默认生成树。
- 取树的根节点：`treeData.tree[0]`。
- 取根节点的直接子节点：`rootNode.children`（即一级产业链节点）。
- 若子节点不存在或为空，显示 `CHAIN_NODE_EMPTY_TEXT`。
- 否则，为每个子节点生成 `.ps1-chain-node-btn` 按钮，按钮文案使用 `child.name`，并绑定 `onclick="toggleChainNode(this)"`。
- 清空 `chainNodeContainer` 后插入生成的按钮。

#### 3.2.5 新增 `bindChainSelectEvent()`

- 为 `#chainSelect` 绑定 `change` 事件。
- 事件触发时调用 `renderChainNodes(chainSelect.value)` 并调用 `handleInputChange()` 更新漏斗与 Tags。

#### 3.2.6 调整 `init()`

在现有初始化逻辑之前调用：

```javascript
renderChainOptions();
bindChainSelectEvent();
renderChainNodes(''); // 默认不选产业链，显示空提示
```

### 3.3 `css/policy-stage1.css`

**操作**：在文件末尾追加一个空提示样式（可选，若复用现有 `.ps1-text-muted` 与 `.ps1-text-2xs` 则无需新增）：

```css
.ps1-chain-node-empty {
  color: var(--ps1-slate-400);
  font-size: 12px;
}
```

HTML 中可直接使用现有类，因此此步骤为可选。若要保持语义清晰，将空提示 `<span>` 改为 `.ps1-chain-node-empty`。

### 3.4 版本号升级

**操作**：

- `policy-stage1.html` 中 `js/data.js?v=4` 为新引入，版本号设为 4 以与 `chain-graph.html` 保持一致。
- `policy-stage1.js?v=1` 升级为 `?v=2`，`policy-stage1.css?v=1` 升级为 `?v=2`（因业务脚本和样式均有变更）。

## 4. 假设与决策

- **“一级产业链节点” 指根节点的直接子节点**：即 `MOCK_CATEGORY_TREES[chainId].tree[0].children`，对应参考页面中“产业链环节/节点”的展示层级。
- **默认不选产业链**：下拉框首项为 “-- 不限产业链 (全域) --”，下方显示 “该产业链暂无下设细分环节”。
- **切换产业链时动态刷新节点按钮**：原“链主/龙头企业”等硬编码按钮不再保留，完全由图谱数据驱动。
- **数据缺失兜底**：若某条产业链没有拓扑树定义，`MockAPI.getCategoryTree()` 会生成默认三档树，仍可读取 `tree[0].children`。
- **使用项目全局变量**：沿用 `js/data.js` 挂载到 `window` 的方式，不引入新的请求层。
- **不改动 `js/data.js`**：仅读取现有数据，不调整数据结构。

## 5. 验证步骤

1. 打开 `policy-stage1.html`，确认产业链下拉框首项为 “-- 不限产业链 (全域) --”。
2. 展开下拉框，确认列出 12 条产业链名称（与 `MOCK_INDUSTRY_CHAINS` 一致）。
3. 未选择产业链时，确认 “产业链环节/节点” 区域显示 “该产业链暂无下设细分环节”。
4. 选择 “低空经济”，确认节点按钮更新为：低空制造、低空保障、低空飞行活动、低空综合服务。
5. 选择 “人工智能与具身智能机器人”，确认节点按钮更新为：核心零部件、机器人本体、集成系统、应用终端。
6. 切换产业链后，确认原选中节点状态被清空，漏斗与生效规则 Tag 栏重新计算。
7. 选择一个产业链节点，确认 Tag 栏出现 “环节: xxx” 并触发漏斗递减。
8. 检查浏览器控制台无 `MOCK_INDUSTRY_CHAINS` / `MOCK_CATEGORY_TREES` / `MockAPI` 未定义错误。
