# 视觉风格统一实施计划

## Context

`index.html`（产业全景看板）与 `indexGroup.html`（集团系挖潜）目前分别使用两套视觉体系：
- `index.html` 采用 `css/common.css` + `css/panorama.css`，主色 `#165DFF`，卡片 `#FFFFFF`，圆角 `12px/16px`，部分组件使用渐变/发光效果。
- `indexGroup.html` 采用独立的 `css/style.css` + `js/app.js`，为深色科技风，包含大量渐变、发光、深色背景，与系统其他页面差异明显。

根据用户提供的图片规范，两页需统一为“政务蓝白”设计语言：主色 `#2563EB`、页面背景 `#FFFFFF`、卡片背景 `#F8FAFC`、圆角统一 `6px`、轻阴影无发光/深色渐变、tab 激活态蓝底白字/非激活浅灰底深灰字。

## Recommended Approach

### 1. 建立/刷新 `css/common.css` 设计令牌
在 `:root` 中统一如下变量（保留现有选择器，避免大范围结构改动）：

```css
--primary: #2563EB;
--primary-dark: #1D4ED8;
--primary-light: #EEF4FF;
--bg: #FFFFFF;
--card-bg: #F8FAFC;
--card-bg-hover: #F1F5F9;
--text: #1E293B;
--text-secondary: #64748B;
--text-tertiary: #94A3B8;
--border: #E2E8F0;
--success: #10B981; --warning: #F59E0B; --danger: #EF4444;
--radius: 6px;
--radius-sm: 4px;
--radius-md: 6px;
--radius-lg: 8px;
--shadow-sm: 0 1px 3px rgba(0,0,0,0.05);
--shadow-md: 0 4px 6px rgba(0,0,0,0.05);
--transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
```

并同步更新以下公共组件样式：
- `.gov-header`：改为政府蓝纯色背景，移除深蓝渐变与发光阴影。
- `.sidebar` / `.sidebar-item.active`：active 态改为 `--primary-light` 背景 + `--primary` 右边框，移除旧蓝色投影。
- `.card`：背景 `--card-bg`、圆角 `6px`、阴影 `--shadow-sm`、hover 阴影 `--shadow-md`。
- `.btn` / `.btn-primary` / `.btn-default` / `.btn-text`：统一圆角 `6px`、主色 `#2563EB`、hover `#1D4ED8`；次按钮白底灰边框。
- `.tabs` / `.tab.active`：激活态 `#2563EB` 背景白字、无下三角；非激活态 `#F1F5F9` 背景 `#64748B` 文字。
- `.data-table` / `.tag` / `.metric-card`：表头 `#F8FAFC`、行 hover `#EEF4FF`、标签使用新的功能色。

### 2. 重写 `css/style.css` 为浅色主题
`indexGroup.html` 当前依赖 `style.css`，需彻底移除深色/渐变/发光样式：
- 删除 `#02093A` 背景、青色 glow、radial-gradient 等。
- `.header` / `.nav-tabs` / `.nav-tab.active` 改为与公共 tab 一致。
- `.overview-card` / `.detail-kpi-item` / `.card` / `.table-section` 统一使用 `.card` 变量。
- `.sheet-tabs` / `.sheet-tab` 对齐新 tab 规范。
- DataTables 覆盖样式改为浅色：表头、行 hover、分页 active 态。
- 删除 `.tech-icon` 等青色发光元素，改为统一图标。

### 3. 调整 `css/panorama.css`
在不影响页面结构的前提下：
- `.industry-card`、`.dashboard-card`、`.stage-card`、`.health-card` 圆角改为 `6px`、背景改为 `#F8FAFC`、移除渐变/发光。
- `.metric-card`、`.filter-card` 统一使用新的变量。
- `.tab.active::after` 下三角移除，激活态直接蓝底白字。
- 产业卡片区域彩色大背景块（`#E6F0FF` 等）改为白色/浅灰分组或极淡色条。

### 4. 更新 JS 图表与表格主题
- `js/app.js`：将 `C` 与 `PALETTE` 改为浅色主题；DataTables 初始化覆盖为浅色系。
- `js/panorama.js`、`panorama-support.js`、`panorama-lifecycle.js`：检查硬编码颜色，统一改为新变量或公共色值；ECharts 背景保持透明。

### 5. 页面 HTML 微调
- `index.html`：更新 `common.css`、`panorama.css` 版本戳（如 `?v=10`）。
- `indexGroup.html`：
  - 引入 `css/common.css?v=10` 作为变量与公共组件来源。
  - 更新 `style.css?v=18`、`app.js?v=37` 版本戳。
  - 可选：将独立 `.header` 替换为 `<gov-header></gov-header>` + `<side-nav></side-nav>`，并把原 `.nav-tabs` 下移到 `main-content` 顶部作为页面内 tab 栏。若风险过高，可先保留独立 header 但按公共 header 样式重写。

### 6. 可复用规范沉淀
以 `css/common.css` 为唯一设计令牌源，统一公共类：`.gov-header`、`.sidebar`、`.page-layout`、`.page-content`、`.card`、`.btn-*`、`.tabs`、`.data-table`、`.tag-*`、`.metric-card`。未来新页面直接引入 `common.css` 即可获得一致风格。

## Verification

1. 本地启动 `node server.js`，访问：
   - `http://localhost:8082/index.html`
   - `http://localhost:8082/indexGroup.html`
2. 使用 Chrome DevTools 整页截图，裁剪对比头部、tab、卡片、按钮、表格、图表区域。
3. 按检查项清单逐项核对：页面背景 `#FFFFFF`、卡片 `#F8FAFC`、圆角 `6px`、主色 `#2563EB`、tab 蓝底白字/灰底深灰字、表格表头/行 hover、无发光/深色渐变。
4. 在 1920px / 1440px / 1200px / 768px 断点下检查布局与响应式一致性。
5. 修改完成后刷新浏览器并清空缓存（或递增 `?v=`），确保加载最新样式。

## Critical Files to Modify

- `css/common.css`
- `css/style.css`
- `css/panorama.css`
- `js/app.js`
- `indexGroup.html`
- `index.html`（版本戳更新）
- 可选：`js/panorama.js`、`js/panorama-support.js`、`js/panorama-lifecycle.js`、`js/components/GovHeader.js`
