# 12 大类标签库管理系统实现计划

## 背景与目标

当前 `policy-analysis.js` 中已硬编码 12 个大类标签，但缺少统一的分类元数据、层级扩展能力和管理界面。用户要求将其重构为一个具备完整治理能力的“12 大类标签库”：

- 明确 12 个主要类别，定义分类标准与边界，避免重叠或遗漏。
- 支持大类下的子分类（子标签）扩展。
- 为每个大类记录元数据：创建时间、负责人、使用说明、维护日志。
- 提供查询、新增、编辑、删除功能，并加入权限控制。
- 完成全面测试，验证完整性、准确性和兼容性。

## 约束与现状

1. 后端仅有一个静态文件服务器 `server.js`（Node.js `http` 模块），无 API/数据库。
2. 公共组件已提供 `openModal` / `openDrawer` / `showToast` / `escapeHtml` 等工具（`js/common.js`、`js/policy-analysis.js`）。
3. 侧边栏导航有硬约束，不能新增全局菜单项，因此管理入口放在 `policy-analysis.html` 内部。
4. 权限控制在无后端场景下采用浏览器 `localStorage` 模拟角色（admin / editor / viewer）。

## 推荐方案

采用“客户端标签库治理层 + 抽屉式管理界面”方案，对现有功能影响最小。

### 1. 数据模型：TagCategoryManager

新建 `js/tag-category-manager.js`：

```js
const DEFAULT_CATEGORIES = [ /* 12 个大类元数据 */ ];

class TagCategoryManager {
  constructor() {
    this.categories = this.load();
  }
  load() { /* 优先 localStorage，否则 DEFAULT_CATEGORIES */ }
  save() { /* 写入 localStorage */ }
  getAll() { return this.categories; }
  getById(id) { ... }
  create(category) { ... }   // 校验互斥/边界
  update(id, data) { ... }
  remove(id) { ... }         // 有子标签时确认
  addSubTag(catId, subTag) { ... }
  updateSubTag(catId, subTagId, data) { ... }
  removeSubTag(catId, subTagId) { ... }
  addLog(catId, action, operator) { ... } // 维护日志
}
```

每个大类结构：

```js
{
  id: 'cat-01',
  name: '一、产业专项特征维度',
  order: 1,
  description: '...',
  scope: '...',
  owner: '产业研究组',
  createdAt: '2026-08-03T10:00:00Z',
  updatedAt: '...',
  usageNote: '...',
  logs: [{ time, operator, action, detail }],
  subTags: [
    { id: 'tag-01-01', name: '低空无人机及航线证明', prob: 0.55, count: 0 }
  ]
}
```

### 2. 权限控制

新建 `js/tag-auth.js`（或并入 manager）：

- 角色：`admin`（可删改）、`editor`（可新增/编辑，不可删大类）、`viewer`（只读）。
- 角色存储在 `localStorage.tagLibraryRole`，页面顶部提供切换入口（仅演示用）。
- UI 根据角色隐藏/禁用按钮。

### 3. 管理界面

在 `policy-analysis.html` 新增“标签库管理”按钮，点击打开右侧抽屉 `#tagManagerDrawer`：

- 左侧/顶部：12 大类列表（可拖拽排序或上下调整）。
- 右侧/详情区：选中大类的元数据表单 + 子标签表格。
- 功能按钮（受权限控制）：
  - 新增大类
  - 编辑大类元数据
  - 删除大类（仅 admin，有确认）
  - 新增/编辑/删除子标签
  - 查看维护日志
  - 导出 JSON / 重置默认

使用现有 `openDrawer` / `openModal` 组件，保持政府蓝白视觉风格。

### 4. 与现有筛选逻辑集成

- `policy-analysis.js` 不再硬编码 `TAG_CATEGORIES`，改为从 `TagCategoryManager` 实例读取。
- 初始化时：`tagManager = new TagCategoryManager(); TAG_CATEGORIES = tagManager.getAll()`。
- 标签库修改后，触发 `policy-analysis.js` 重新渲染标签树与重新计算结果。
- 保留现有 AND 过滤逻辑与漏斗数据模型。

### 5. 校验规则

- 大类名称唯一、排序唯一。
- 子标签名称在其所属大类内唯一。
- 删除大类前校验是否被筛选规则引用（当前会话内）。
- 元数据必填项：名称、描述、边界范围、负责人。

### 6. 测试验证

- 语法检查：对新增/修改 JS 使用 `new Function` 检查。
- 数据模拟：验证 12 大类完整、子标签可扩展、元数据可持久化。
- 权限验证：viewer 下新增/删除按钮禁用或隐藏；admin 可执行全部操作。
- 兼容性：刷新后 `localStorage` 数据不丢失；重置默认可恢复。
- 集成验证：修改子标签概率/数量后，`policy-analysis` 筛选结果实时更新。

## 关键修改文件

| 文件 | 说明 |
|---|---|
| `js/tag-category-manager.js` | 新增，标签库核心模型与持久化 |
| `js/tag-auth.js` | 新增，角色与权限控制 |
| `policy-analysis.html` | 新增管理入口按钮与抽屉容器，更新脚本引用版本号 |
| `css/policy-analysis.css` | 新增管理抽屉/表单/表格样式 |
| `js/policy-analysis.js` | 移除硬编码 `TAG_CATEGORIES`，改为从 manager 加载；监听标签库变化重渲染 |
| `server.js` | 无需修改（仍为静态服务） |

## 实施步骤

1. 创建 `TagCategoryManager` 与默认 12 大类元数据。
2. 创建 `TagAuth` 角色与权限工具。
3. 在 `policy-analysis.html` 添加管理抽屉 UI 骨架。
4. 实现 CRUD 渲染与事件绑定。
5. 改造 `policy-analysis.js` 读取动态标签库。
6. 补充 CSS 样式与响应式适配。
7. 版本号升级与语法/功能测试。

## 风险与回退

- 风险：`policy-analysis.js` 中 `TAG_CATEGORIES` 被多处引用，需统一改为 manager 读取。
- 回退：保留 `DEFAULT_CATEGORIES` 作为默认种子；localStorage 损坏时可一键重置。
