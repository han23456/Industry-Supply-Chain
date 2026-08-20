# 增加“政策分析”一级导航及二级导航实施计划

## 1. 摘要

在现有基于 `<side-nav>` Web Component 的侧边栏导航中，增加一个“政策分析”一级导航项。该一级项仅用于展开/收起其下的四个二级导航；每个二级导航均链接到一个独立的 HTML 页面。

## 2. 当前状态分析

- 导航配置中心：`js/config/menu-config.js` 通过 `window.menuList` 提供 3 个一级导航项（产业全景看板、招商库、集团系挖潜），结构为扁平数组，不支持层级。
- 侧边栏渲染组件：`js/components/SideNav.js` 读取 `window.menuList` 并渲染为 `<side-nav>`，每个菜单项为单一层级，无展开/收起能力。
- 公共样式：`css/common.css` 中定义了 `.sidebar-item`、`.sidebar-menu` 等样式，无二级菜单样式。
- 目标页面：四个二级导航对应的页面（`policy-stage1.html` ~ `policy-stage4.html`）目前不存在。
- 版本号：现有页面引用 `menu-config.js?v=3`、`SideNav.js`（部分带版本部分不带）、`common.css?v=X`。因本次要修改这三个文件，需统一升级版本号以冲破缓存。

## 3. 拟议变更

### 3.1 `js/config/menu-config.js`

**操作**：扩展 `window.menuList`，在保留现有 3 个一级项的基础上，增加“政策分析”分组项。

**数据结构**：

```javascript
window.menuList = [
  { name: "产业全景看板", pagePath: "index.html", icon: "🖥️" },
  { name: "招商库", pagePath: "investment-pool.html", icon: "🏢" },
  { name: "集团系挖潜", pagePath: "indexGroup.html", icon: "🤝" },
  {
    name: "政策分析",
    icon: "<i class=\"fa-solid fa-landmark\"></i>",
    type: "group",
    children: [
      { name: "政策筛选与匹配", pagePath: "policy-stage1.html", icon: "<i class=\"fa-solid fa-filter\"></i>" },
      { name: "获补履历回测", pagePath: "policy-stage2.html", icon: "<i class=\"fa-solid fa-clock-rotate-left\"></i>" },
      { name: "资金风控监管", pagePath: "policy-stage3.html", icon: "<i class=\"fa-solid fa-shield-halved\"></i>" },
      { name: "成效绩效评估", pagePath: "policy-stage4.html", icon: "<i class=\"fa-solid fa-chart-line\"></i>" }
    ]
  }
];
```

**原因**：使导航配置支持分组，为 `SideNav.js` 提供可渲染的层级数据。

### 3.2 `js/components/SideNav.js`

**操作**：重写 `connectedCallback` 中的菜单渲染逻辑，区分普通项与分组项：

1. 普通项：保持现有单行链接样式与高亮规则。
2. 分组项：
   - 渲染带图标、名称和右箭头（`▸`）的父级行。
   - 渲染子菜单容器，默认隐藏（`max-height: 0`）。
   - 若当前页面属于该分组任一子项，则默认展开父级并高亮对应子项。
   - 点击父级行切换 `expanded` 类，展开/收起子菜单；不跳转。
   - 子菜单项点击后正常跳转。

**关键代码结构**：

```javascript
const isGroup = item.children && item.children.length > 0;
const isGroupActive = isGroup && item.children.some(c => c.pagePath === currentPage);
const expandedClass = isGroupActive ? 'expanded' : '';
const groupTitleActive = isGroupActive ? 'active' : '';
```

**原因**：实现一级项的展开/收起交互，并正确高亮当前二级页面。

### 3.3 `css/common.css`

**操作**：在现有 `.sidebar-*` 样式之后追加二级菜单样式：

```css
/* 分组父级 */
.sidebar-group-title {
  justify-content: space-between;
}
.sidebar-chevron {
  margin-left: auto;
  font-size: 12px;
  transition: transform 0.2s ease;
}
.sidebar-group.expanded .sidebar-chevron {
  transform: rotate(90deg);
}

/* 子菜单容器 */
.sidebar-submenu {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.2s ease;
  padding-left: 8px;
}
.sidebar-group.expanded .sidebar-submenu {
  max-height: 300px; /* 足够展示 4 个子项 */
}

/* 子菜单项 */
.sidebar-subitem {
  padding-left: 48px;
  font-size: 13px;
}
.sidebar-subitem .sidebar-icon {
  width: 16px;
  font-size: 14px;
}
.sidebar-subitem.active {
  background: var(--primary-light);
  color: var(--primary);
  border-right-color: var(--primary);
  font-weight: 600;
}
```

**原因**：为分组项提供展开/收起动画、缩进对齐和当前页高亮。

### 3.4 新增 4 个二级导航页面

**操作**：创建以下 4 个最小可用页面，保持与现有页面一致的头部、侧边栏和面包屑结构：

| 文件 | 页面标题 | 二级导航名称 |
|------|---------|------------|
| `policy-stage1.html` | 多维政策筛选器 - 产业链/供应链图谱系统 | 政策筛选与匹配 |
| `policy-stage2.html` | 企业获补履历回测与交叉分析 - 政策分析第二阶段 | 获补履历回测 |
| `policy-stage3.html` | 政策财政资金风控平台 - 第三阶段：事中事后监管期 | 资金风控监管 |
| `policy-stage4.html` | 第四阶段：政策成效分析（对比与绩效评估） | 成效绩效评估 |

每个页面包含：

- `<!DOCTYPE html>`、中文 lang、viewport meta。
- 引用 `css/common.css?v=14`（升级后版本，见 3.5）。
- 引用 `js/config/menu-config.js?v=4`。
- 引用 `js/components/GovHeader.js?v=3`。
- 引用 `js/components/SideNav.js?v=3`。
- `<gov-header></gov-header>` + `.page-layout`（含 `<side-nav></side-nav>`）+ `<main class="page-content">`。
- 顶部面包屑和页面标题占位区域。
- 一个卡片区域，显示当前页面名称提示，便于验证导航跳转。

**原因**：让四个二级导航链接都有真实可访问的落地页，避免 404。

### 3.5 更新现有页面的版本号

**操作**：在所有已引用 `menu-config.js`、`SideNav.js`、`common.css` 的 HTML 页面中，升级对应版本号（无版本号的加上 `?v=1`）：

- `menu-config.js`：所有 `?v=3` 升级为 `?v=4`。
- `SideNav.js`：
  - 无版本号的统一加 `?v=3`。
  - 已有 `?v=2` 的升级为 `?v=3`。
- `common.css`：
  - 已有版本号的统一加 1（如 `v=13` → `v=14`，`v=11` → `v=12`，`v=10` → `v=11`，`v=3` → `v=4`）。
  - 无版本号的统一加 `?v=14`（与最高版本保持一致，避免缓存问题）。

涉及页面：

- `index.html`
- `chain-graph.html`
- `enterprise-network.html`
- `chain-node-detail.html`
- `supply-demand.html`
- `risk-warning.html`
- `investment-pool.html`
- `chain-gap.html`
- `enterprise-profile.html`
- `indexGroup.html`

**原因**：本次修改了 `menu-config.js`、`SideNav.js`、`common.css`，升级版本号确保浏览器加载最新导航结构和样式。

### 3.6 处理 `indexGroup.html` 和 `chain-graph.html` 的特殊情况

- `indexGroup.html` 不使用 `<side-nav>`，但其引用了 `common.css`，因此只升级 `common.css` 版本号。
- `chain-graph.html` 加载了 `menu-config.js` 和 `SideNav.js` 但未使用 `<side-nav>`，本次仍升级其引用版本号；是否启用 `<side-nav>` 不在本次任务范围内，保持现状。

## 4. 假设与决策

- **保留现有 3 个一级项**：本次只新增“政策分析”分组，不调整“产业全景看板”“招商库”“集团系挖潜”。
- **一级项不跳转**：用户确认“政策分析”仅作为展开/收起开关，不链接到任何汇总页。
- **二级项使用阶段编号页面**：四个二级页面分别命名为 `policy-stage1.html` ~ `policy-stage4.html`。
- **政策分析分组图标统一使用内联 SVG**：将 FontAwesome 图标转换为内联 SVG（使用 `currentColor` 填充），彻底摆脱对外部字体/CSS 的加载依赖，确保首次加载即可显示；同时保留 SideNav 的资源就绪后重绘机制作为双保险。图标含义：一级项为 `landmark`（政府建筑），二级项分别为 `filter`（筛选）、`clock-rotate-left`（回测）、`shield-halved`（风控）、`chart-line`（评估）。
- **缓存策略**：统一升级版本号，避免旧缓存导致导航不生效或样式错乱。
- **最小可运行页面**：四个新页面先以占位内容实现，后续可再填充业务模块。

## 5. 验证步骤

1. 打开任意使用侧边栏的页面（如 `index.html`），确认侧边栏出现“政策分析”一级项。
2. 点击“政策分析”，确认下方滑出 4 个二级导航；再次点击收起。
3. 依次点击四个二级导航，确认跳转到对应 `policy-stage*.html` 页面且无 404。
4. 在每个 `policy-stage*.html` 页面，确认侧边栏中“政策分析”处于展开状态，且对应子项高亮。
5. 切换回其他一级页面（如 `index.html`、`enterprise-network.html`），确认这些页面的原有导航和高亮不受影响。
6. 在 Chrome/Firefox/Edge 中验证展开动画、高亮状态、响应式表现正常。
