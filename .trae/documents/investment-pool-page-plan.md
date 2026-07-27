# 招商库页面（招商引资模拟推演）实施计划

## 1. 背景与目标

基于原型图片，需要新增一个**招商库页面**，核心功能是**招商引资模拟推演**：用户从招商库中勾选意向招商企业，系统实时计算并展示招商落地后对产业链关键指标的预测提升效果。该页面需严格复用现有设计系统与组件，保持政务系统视觉风格统一，并具备完整交互、响应式布局和性能优化。

## 2. 推荐方案

### 2.1 页面定位

- 新页面作为**强链补链**模块的下一级功能页，从 `chain-gap.html` 的“补链分析/招商方案”入口跳转进入。
- 不在侧边栏新增一级菜单，以遵守“侧边栏保持 5 个固定菜单项”的硬约束。
- 在 `SideNav` 中增加子页面到父菜单的激活映射，使进入招商库页面时，**强链补链**菜单项保持高亮。

### 2.2 新增文件

| 文件 | 说明 |
|------|------|
| `investment-pool.html` | 页面主体，复用 `gov-header`、`side-nav` 布局 |
| `css/investment-pool.css` | 页面级样式，仅在 `common.css` 基础上补充招商库特有布局 |
| `js/investment-pool.js` | 页面交互逻辑：勾选、搜索、分页、推演计算、导出、确认方案 |

### 2.3 需修改的现有文件

| 文件 | 修改内容 |
|------|----------|
| `js/config/menu-config.js` | 取消 `供需对接` 的注释，恢复为 5 个固定菜单项，满足硬约束 |
| `js/components/SideNav.js` | 增加 `activePageMap`：子页面映射到父菜单（如 `investment-pool.html` → `chain-gap.html`） |
| `js/common.js` | 在 `BREADCRUMB_CONFIG` 中新增 `investment-pool.html` 的面包屑配置 |
| `js/data.js` | 新增 `MOCK_INVESTMENT_POOL` 招商库模拟数据、基线指标和推演计算所需数据 |
| `chain-gap.html` / `js/chain-gap.js` | 在补链方案区域增加“招商库模拟推演”入口按钮，跳转到 `investment-pool.html` |

## 3. 功能模块与实现细节

### 3.1 页面结构（investment-pool.html）

```
├─ gov-header
├─ page-layout
│  ├─ side-nav
│  └─ page-content
│     ├─ top-bar（面包屑 + 返回看板 + 导出报告）
│     ├─ 模块一：招商引资模拟推演
│     │  └─ header（标题/说明 + 重置选择 + 导出报告）
│     ├─ 模块二：意向招商企业清单
│     │  ├─ header（标题 + 招商库企业共 X 家，已勾选 Y 家）
│     │  ├─ 搜索/筛选栏（企业名称关键词、省份、产品品类）
│     │  ├─ 数据表格（复选框、企业名称、关联系统、所在省份、产品品类、预估新增产值、预估完整度提升、操作）
│     │  └─ 分页组件（每页条数选择 + 页码 + 上一页/下一页）
│     └─ 模块三：推演结果对比
│        ├─ 对比卡片：当前基线 vs 推演预测
│        ├─ 新增纳税/就业指标条
│        └─ 底部操作：关闭/重置、确定招商方案
└─ common modal（确认方案、导出成功提示）
```

### 3.2 数据模型（js/data.js）

新增常量：

```js
const MOCK_INVESTMENT_POOL = {
  chainId: 'chain-robot',
  baseline: {
    completeness: 42.8,           // 产业链完备度
    leaderOutput: 1286.5,         // 龙头/链主合计产值（亿元）
    localSupportingRate: 32.6     // 产业链本地配套率
  },
  enterprises: [
    {
      id: 'inv-001',
      name: '大疆创新科技股份有限公司',
      relationSystem: '华为技术有限公司 / AI驱动控制系统',
      province: '广东省',
      provinceCode: 'gd',
      productCategory: '电解液',
      estimatedOutput: 35.2,      // 预估新增产值（亿元）
      completenessImprovement: 5.8 // 预估完整度提升（%）
    },
    // 至少 12 条...
  ],
  prediction: {
    newTax: 20.7,                 // 预估引入新增年度纳税总额（亿元）
    newJobs: 8950                 // 预估带动新增就业岗位（人）
  }
};
```

### 3.3 核心交互（js/investment-pool.js）

- **初始化**：
  - 渲染面包屑、全局搜索（如需要）。
  - 加载 `MOCK_INVESTMENT_POOL` 数据。
  - 默认选中前 N 家企业（与原型中“已勾选 10 家”对齐）。
  - 渲染表格、分页、推演结果。
- **勾选交互**：
  - 表头全选/取消全选。
  - 单行勾选切换选中状态。
  - 选中变化时实时重新计算并动画更新推演结果卡片。
- **搜索与筛选**：
  - 企业名称关键词实时搜索（debounce 300ms）。
  - 省份、产品品类下拉筛选。
  - 筛选结果同步更新分页和统计文案。
- **分页**：
  - 支持 `5 / 10 / 20` 条每页。
  - 展示“显示第 X 至 Y 条，共 Z 条企业记录”。
  - 页码按钮高亮当前页，上一页/下一页禁用边界状态。
- **操作按钮**：
  - **重置选择**：恢复默认选中状态。
  - **导出报告**：调用 `exportCSV` 导出选中企业清单，并弹出 `openModal` 提示导出成功。
  - **确定招商方案**：弹出确认弹窗，展示已选企业列表；点击确定后再次提示“招商方案确认成功”。
  - **关闭/重置**：返回 `chain-gap.html` 或重置选择。
- **推演计算**：
  - 基线指标 + 已选企业 `estimatedOutput` 合计 → 预测龙头/链主合计产值。
  - 基线 `completeness` + 已选企业 `completenessImprovement` 合计 → 预测产业链完备度（上限 100%）。
  - 本地配套率按加权公式计算：`(基线产值 × 基线配套率 + Σ新增产值 × 0.75) / (基线产值 + Σ新增产值) × 100`，展示提升百分点。
  - 纳税、就业根据选中企业数量及规模线性估算。

### 3.4 样式设计（css/investment-pool.css）

- 复用 `common.css` 中的 `.card`、`.btn`、`.data-table`、`.tag`、`.modal-overlay` 等组件。
- 新增：
  - `.ip-header-card`：模块一标题区，右侧操作按钮组。
  - `.ip-table-toolbar`：清单头部统计 + 搜索筛选区。
  - `.ip-table-wrap`：表格容器，支持横向滚动，表头 sticky。
  - `.ip-province-tag`：省份标签，按省份使用不同颜色（如广东蓝、浙江橙、上海紫、北京红）。
  - `.ip-improvement`：完整度提升文字，绿色正增长前缀 `+`。
  - `.ip-comparison-grid`：基线 vs 预测双列卡片布局，桌面端 2 列，平板/移动端堆叠为 1 列。
  - `.ip-metric-row`：对比指标行，当前值右对齐，预测值展示绝对值与提升量。
  - `.ip-bottom-bar`：底部操作栏，固定或随内容流排布。
- 动画：
  - 卡片加载 `fadeIn`。
  - 指标数字变化使用 `transition` 或 ECharts 动画效果。
  - 行悬停背景色过渡、按钮悬停缩放。

### 3.5 响应式适配

- 桌面端（≥1280px）：完整双栏/多列布局。
- 平板端（768px–1279px）：对比卡片保持双列，表格可横向滚动。
- 移动端（<768px）：
  - 侧边栏隐藏或折叠（保持现有系统行为）。
  - 对比卡片堆叠为单列。
  - 表格转换为横向滚动容器。
  - 底部操作按钮宽度自适应，主按钮全宽。
  - 搜索筛选区垂直堆叠。

### 3.6 性能与可访问性

- 图片资源：本页面不使用图片，全部使用 CSS/图标/SVG，无需额外压缩。
- 表格大数据量时采用分页+虚拟滚动备选方案（首期实现分页即可）。
- 复选框使用原生 `<input type="checkbox">` 并设置 `aria-label`。
- 按钮、链接具备清晰的 focus 状态。
- 颜色对比度符合 WCAG 2.1 AA。
- 键盘可操作：Tab 切换焦点、Enter 触发按钮。

## 4. 复用现有工具

- `renderBreadcrumb('investment-pool.html')`：`js/common.js:367`
- `openModal / closeModal`：`js/common.js:203`
- `showToast`：`js/common.js:276`
- `exportCSV`：`js/common.js:266`
- `formatNumber / formatMoney / formatPercent`：`js/common.js:74`
- `debounce`：`js/common.js:66`
- `renderTag`：`js/common.js:89`
- `getUrlParams / setUrlParams`：`js/common.js:116`
- `gov-header` / `side-nav` Web Components：`js/components/GovHeader.js`、`js/components/SideNav.js`

## 5. 实施步骤

1. **数据准备**：在 `js/data.js` 末尾追加 `MOCK_INVESTMENT_POOL` 数据（12 家以上企业）。
2. **导航修复**：
   - 恢复 `js/config/menu-config.js` 中 `供需对接` 菜单。
   - 在 `js/components/SideNav.js` 增加 `activePageMap` 及映射逻辑。
   - 在 `js/common.js` 增加 `investment-pool.html` 面包屑配置。
3. **入口添加**：在 `chain-gap.html` 或 `js/chain-gap.js` 的补链方案区增加“招商库模拟推演”入口按钮。
4. **创建页面**：
   - 编写 `investment-pool.html` 结构。
   - 编写 `css/investment-pool.css` 样式。
   - 编写 `js/investment-pool.js` 逻辑。
5. **联调验证**：
   - 页面加载、侧边栏高亮、面包屑正确。
   - 勾选/取消勾选实时更新推演结果。
   - 搜索、筛选、分页功能正常。
   - 导出报告、确认方案弹窗正常。
   - 响应式布局在常见分辨率下无错位。
   - Chrome、Firefox、Safari、Edge 下功能一致。

## 6. 验证方式

- 在本地启动静态服务器（如 `npx serve` 或 VS Code Live Server），访问 `investment-pool.html`。
- 测试流程：
  1. 从 `chain-gap.html` 点击“招商库模拟推演”进入新页面。
  2. 观察默认勾选状态与推演结果是否匹配原型。
  3. 勾选/取消勾选企业，确认右侧/下方指标数值动画更新。
  4. 输入关键词搜索，确认表格结果过滤。
  5. 切换每页条数与页码，确认分页正确。
  6. 点击“导出报告”，确认 CSV 下载与成功弹窗。
  7. 点击“确定招商方案”，确认确认弹窗与成功提示。
  8. 使用浏览器开发者工具切换至移动端视口，确认布局堆叠与表格横向滚动。
  9. 在 Chrome、Firefox、Edge 中重复上述步骤（Safari 如无环境可稍后补充）。

## 7. 风险与注意事项

- **颜色冲突**：项目记忆要求主色 `#2563EB`，而 `common.css` 实际使用 `#165DFF`。本页面以 `common.css` 现有变量为准，确保与现有页面一致；若需调整全局主色，应单独评估影响范围。
- **菜单激活**：`SideNav.js` 目前只按 `pathname` 精确匹配，必须增加映射逻辑，否则子页面无高亮菜单。
- **数据一致性**：推演公式中的数值需与原型展示（42.8% → 84.7%，1286.5亿 → 1556.0亿）大致对齐，必要时微调 mock 数据。
