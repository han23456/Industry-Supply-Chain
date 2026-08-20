---
name: "page-replicator"
description: "将本地参考 HTML 页面完整迁移/复刻到项目统一技术栈（自定义 CSS + 原生 JS + 统一 header/sidebar）。Invoke when user asks to replicate a reference HTML page, migrate Tailwind/Lucide pages to the project stack, or create a new policy analysis stage page."
---

# 页面复刻师（Page Replicator）

## 功能描述

本 Skill 用于将用户提供的本地参考 HTML 页面（如 `政策分析第X阶段V2.0.html`）完整迁移到项目统一技术栈，生成新的目标页面文件。迁移过程保留参考页的全部视觉风格、布局结构、交互逻辑与响应式行为，同时集成项目统一的顶部导航 `<gov-header>` 和侧边栏 `<side-nav>`，并替换为项目主流技术方案（自定义 CSS + FontAwesome + 原生 JS）。

## 适用场景

在以下场景下必须调用本 Skill：

- 用户要求“复刻/参考/仿制某个 HTML 页面”生成新页面。
- 用户要求将 Tailwind CSS + Lucide Icons 实现的参考页迁移到项目统一技术栈。
- 用户需要新增政策分析阶段页（如 `policy-stageN.html`）。
- 用户需要保持新页面与参考页在视觉、布局、交互上的高度一致。

## 输入参数规范

调用时由用户提供以下参数，若缺失需主动询问：

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `sourcePath` | string | 是 | 参考页面绝对路径，例如 `d:\project\政策分析第四阶段V2.0.html`。 |
| `targetPath` | string | 是 | 目标页面绝对路径，例如 `d:\project\policy-stage4.html`。 |
| `stageName` | string | 是 | 阶段/页面名称，例如“第四阶段：政策成效分析”。 |
| `cssPrefix` | string | 否 | 自定义样式前缀，默认根据目标页自动推导（如 `ps4-*`）。 |
| `viewport` | boolean | 否 | 是否保留 viewport meta 标签。默认 `true`，若用户明确要求去掉则设为 `false`。 |

## 输出/返回值格式

执行完成后返回结构化的完成报告：

```json
{
  "status": "success | partial | failed",
  "files": [
    { "type": "html", "path": "...", "version": "v=1" },
    { "type": "css", "path": "...", "version": "v=1" },
    { "type": "js", "path": "...", "version": "v=1" }
  ],
  "modules": ["统计卡片", "筛选面板", "企业列表", "图表", "抽屉/弹窗"],
  "validation": {
    "jsSyntax": true,
    "cssBracesMatch": true,
    "idReferences": "all-matched"
  },
  "notes": ["..."]
}
```

## 执行步骤

1. **读取参考页**
   - 使用 `Read` 读取 `sourcePath` 文件完整内容。
   - 分析页面结构、样式来源（Tailwind/Lucide/Chart.js 等）、功能模块和交互逻辑。

2. **确定目标技术栈**
   - HTML：集成 `<gov-header>`、`<side-nav>`，保留/去掉 viewport。
   - CSS：禁用 Tailwind，创建 `css/<target-base>.css`，使用 `psN-*` / 项目约定的 BEM-like 前缀。
   - JS：禁用 Lucide，创建 `js/<target-base>.js`，使用原生 JS + FontAwesome 类名。
   - 图表：若参考页使用 Chart.js，继续引入 Chart.js CDN。

3. **创建样式文件**
   - 定义 CSS 变量（背景、表面、文本、边框、主色、状态色、阴影、圆角、过渡）。
   - 复刻卡片、按钮、表单、表格、图表容器、弹窗/抽屉、响应式网格。
   - 添加滚动条、动画、响应式媒体查询。

4. **创建脚本文件**
   - 使用 IIFE 封装，`'use strict'`。
   - 实现 mock 数据生成、DOM 渲染、事件绑定、图表初始化。
   - 所有通过内联 `onclick` 触发的函数必须挂载到 `window`。
   - 包含 `escapeHtml`、数字格式化等工具函数。
   - 对金额、计数等输入做合法性校验，防止 NaN 或负数。

5. **重写目标 HTML**
   - 引用 `css/common.css?v=<current>`、`css/<target-base>.css?v=1`。
   - 引用 FontAwesome CDN、Chart.js CDN（如需要）。
   - 引用 `js/config/menu-config.js?v=<current>`、`js/components/GovHeader.js?v=<current>`、`js/components/SideNav.js?v=<current>`。
   - 在 `</body>` 前引用 `js/<target-base>.js?v=1`。
   - 添加面包屑、阶段指示器、页面标题、操作区、各功能模块。

6. **验证**
   - 运行 `node --check js/<target-base>.js` 检查 JS 语法。
   - 检查 CSS 大括号匹配。
   - 检查 HTML 中所有 `id` 在 JS 中均有引用。
   - 确认侧边栏导航配置已包含目标页面。

## 错误处理机制

| 错误场景 | 处理策略 |
|----------|----------|
| 参考文件不存在 | 立即报错，提示用户检查 `sourcePath`。 |
| 缺少必要参数 | 使用 `AskUserQuestion` 询问用户补充。 |
| JS 语法检查失败 | 返回 `failed` 状态，定位错误行并修复。 |
| CSS 括号不匹配 | 返回 `failed` 状态，逐层排查并修复。 |
| HTML ID 未在 JS 中引用 | 返回 `partial` 状态，补充遗漏的 DOM 缓存或渲染逻辑。 |
| 浏览器/运行时测试环境不可用 | 明确告知用户已通过静态检查，建议在浏览器中二次验证。 |

## 使用示例

### 示例 1：新增政策分析第四阶段页面

用户输入：

> 请以 `d:\skill\AIcoding\Industry-Supply Chain2\政策分析第四阶段V2.0.html` 为参考，完成 `d:\skill\AIcoding\Industry-Supply Chain2\policy-stage4.html` 的开发。

Skill 执行：

1. 读取参考页，识别出 6 个模块：政策批次卡片、核心指标、双曲线对比图、就业趋势图、企业维护面板、结论速记面板。
2. 创建 `css/policy-stage4.css`（前缀 `ps4-*`）和 `js/policy-stage4.js`。
3. 重写 `policy-stage4.html`，集成 `<gov-header>`、`<side-nav>`，保留 viewport。
4. 运行 `node --check js/policy-stage4.js`，确认通过。
5. 返回完成报告。

### 示例 2：不带 viewport 的页面复刻

用户输入：

> 复刻 `policy-stage2.html` 并去掉 viewport。

Skill 执行：

- 在 HTML 中省略 `<meta name="viewport" ...>`。
- 其余流程与示例 1 一致。

## 最佳实践

- **优先编辑现有文件**：除非目标页不存在，否则重写而非新建。
- **版本号管理**：新增/修改 CSS/JS 后，引用链接带 `?v=<递增版本号>`，首次使用 `v=1`。
- **色彩一致性**：主色使用政府蓝 `#2563EB`，背景 `#FFFFFF`，卡片背景 `#F8FAFC`。
- **响应式**：使用 CSS Grid + Flexbox + 媒体查询，适配桌面、平板、手机。
- **图标替换**：Lucide 图标映射为 FontAwesome 6 等价图标。
- **XSS 防护**：所有动态插入的文本必须经 `escapeHtml` 处理。
- **避免过度工程**：仅迁移参考页已有功能，不额外添加配置项或抽象层。

## 注意事项

- 不主动修改参考源文件。
- 不创建不必要的文档文件（如 README、设计稿），除非用户明确要求。
- 若浏览器自动化测试环境受限，需说明已完成静态验证，并建议用户手动在浏览器中打开目标页复核。
