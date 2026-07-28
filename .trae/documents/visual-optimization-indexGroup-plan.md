# 集团系挖潜页面视觉优化实施计划

## Context

`indexGroup.html`（集团系挖潜）已完成与系统其他页面的浅色化统一，但视觉表现仍偏“平”，存在以下问题：
- 字体层级单一，KPI 数字与标签缺乏对比，行高/字间距未系统优化。
- 卡片视觉层次弱，缺少顶部强调色、内部分隔与精致悬停反馈。
- Header tab 与内容区 sheet tab 风格不统一。
- 表格表头视觉弱，搜索框、分页缺乏现代感。
- 图表容器与卡片融合度一般，legend/tooltip 与整体风格可进一步对齐。
- 响应式断点简单，小屏可读性一般。

本次优化目标：在保持系统视觉一致的前提下，提升页面现代感、信息层级、可读性与响应式表现。

## Recommended Approach

### 1. 字体层级规范（写入 `css/style.css` 顶部）

| 元素 | 字号 | 字重 | 行高 | 字间距 | 颜色 |
|---|---|---|---|---|---|
| `.header-title` | 20px | 700 | 1.2 | 0.5px | `--text-inverse` |
| `.card-title` / `.section-title` | 15px | 600 | 1.4 | 0.3px | `--text` |
| `.kpi-value` / `.overview-card-metric` | 36px | 700 | 1.05 | -0.5px | `--text` |
| KPI 单位/后缀 | 14px | 500 | 1.2 | 0 | `--text-secondary` |
| `.kpi-label` | 13px | 500 | 1.4 | 0.2px | `--text-secondary` |
| `.overview-card-desc` | 13px | 400 | 1.7 | 0.2px | `--text-secondary` |
| 表头 | 12px | 600 | 1.4 | 0.2px | `--text-secondary` |
| 表格单元格 | 13px | 400 | 1.5 | 0 | `--text` |
| `.nav-tab` / `.sheet-tab` | 14px / 13px | 500 | 1.4 | 0 | 按状态变化 |

数字建议增加 `font-feature-settings: 'tnum';` 以提升对齐稳定性。

### 2. Header / nav-tab 优化

在 `css/style.css` 中：
- `.header` 高度固定 60px，`padding: 0 28px`，`box-shadow: var(--shadow-sm)`。
- `.header-title` 20px / 700。
- `.nav-tabs` 改为胶囊容器：`background: rgba(255,255,255,0.12)`，`border-radius: var(--radius-lg)`，`padding: 4px`。
- `.nav-tab`：默认 `color: rgba(255,255,255,0.85)`；hover 半透明白底；active 白底蓝字 + 阴影 + 过渡动画。

### 3. 概览卡片升级

在 `css/style.css` 与 `js/app.js` 中：
- `.overview-card` 顶部增加 3px 彩色强调条（按模块区分：primary/success/warning/purple）。
- `.tech-icon` 背景改为强调色 8% 透明度，图标线条使用强调色。
- 内部结构分为：图标标题行、大数字+单位、描述、底部“进入 ›”。
- 数字 36px / 700，单位 14px；描述行高 1.7。
- 悬停：`translateY(-2px)` + `--shadow-md` + 强调条高亮 + 箭头右移。

### 4. KPI 卡片升级

- `.detail-kpis` 保持 4 列，卡片上下结构，顶部增加小圆点/图标。
- `.kpi-value` 36px / 700 / `-0.5px`；`.kpi-label` 13px。
- 增加 `.kpi-trend`（若数据无趋势字段则隐藏或显示占位）。
- 悬停数字短暂变 `--primary`。
- `js/app.js` 的 `renderKpis` 支持传入 `{value, trend, trendUp}` 对象。

### 5. 图表卡片升级

- `.card-title` 装饰条：4px 宽、16px 高、`border-radius: 2px`、颜色 `--primary`。
- 图表容器 `.chart-container` 高度保持 320px，顶部间距 12px。
- `js/app.js` 中 `CHART_THEME`：tooltip 白底、浅边框、6px 圆角、柔和阴影；legend 文字 `--text-secondary`。
- 柱状图网格线颜色改为 `--border`；饼图悬停放大系数降至 6。

### 6. 表格与 sheet tab 升级

- 表头：`background: var(--gray-50)`，文字 `--text-secondary`，字重 600，底部边框 `--border`。
- 行 hover：`background: var(--primary-light)`，过渡 0.15s；移除斑马纹。
- `.sheet-tabs` 改为胶囊容器；`.sheet-tab` 默认灰底深灰字，active 蓝底白字。
- 搜索框：宽度 240px，左侧预留搜索图标位，focus 蓝色外发光，placeholder 更明确。
- 分页：active 蓝底白字圆角 6px + 阴影；hover `--primary-light` 背景。

### 7. 页面切换与加载状态

- `.page-section` 初始 `opacity: 0; transform: translateY(12px);`。
- `switchPage` 使用双 `requestAnimationFrame` 过渡到 `opacity:1; translateY(0)`，0.35s。
- 未加载页面先显示 `.page-loading`（spinner + 文案），渲染完成后淡出。
- `.page-error` 增加图标与重试按钮。
- 图表 resize 在 CSS transition end 后触发。

### 8. 响应式优化

调整为三级断点：
- `>= 1400px`：4 列 KPI/概览、2 列图表。
- `768px ~ 1399px`：2 列 KPI/概览、1 列图表，表格横向滚动。
- `< 768px`：全部 1 列；Header tab 改为横向滚动容器；标题/KPI 字号缩小；表格强制横向滚动。

### 9. 可复用规范与一致性

- 全部颜色/圆角/阴影引用 `css/common.css` 变量，禁止硬编码。
- 复用 `.card`、`.metric-card`、`.tabs`、`.data-table` 等公共类模式。
- 修改后更新 `indexGroup.html` 中 `style.css` 与 `app.js` 版本戳。

## Verification

1. 本地启动 `node server.js`，访问 `http://localhost:8082/indexGroup.html`。
2. 检查清单：
   - 页面背景纯白，Header 政府蓝，tab 白底蓝字激活态。
   - 概览卡片 4 列等高，顶部彩色强调条，悬停上移。
   - KPI 数字 36px / 700，标签/trend 层级清晰。
   - 图表 tooltip 白底浅边框；legend 文字灰色。
   - 表格表头浅灰底，行 hover 浅蓝底，分页 active 蓝底白字。
   - 页面切换动画流畅，控制台无报错。
3. 在 1920px、1440px、1200px、768px、375px 下截图对比。
4. 切换所有 tab（在地未纳统、产贸一体化、全国产值统筹、500强未投资）验证一致性与 DataTables 正常。

## Critical Files to Modify

- `css/style.css`
- `js/app.js`
- `indexGroup.html`
- `css/common.css`（补充/刷新令牌，可选）
