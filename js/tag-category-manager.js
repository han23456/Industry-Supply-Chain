/**
 * 12 大类标签库管理器
 * 提供分类元数据、层级子标签、CRUD、维护日志与权限控制入口
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'tagCategoryLibrary_v1';

  function escapeHtml(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }

  function nowISO() {
    return new Date().toISOString();
  }

  function generateId(prefix) {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  }

  const DEFAULT_CATEGORIES = [
    {
      id: 'cat-01',
      name: '一、产业专项特征维度',
      order: 1,
      description: '识别企业所处细分赛道或关键技术方向，反映产业专项资质与核心能力。',
      scope: '适用于有明确产业方向或核心技术方向的企业；不同赛道可按主营业务并存，但同一企业不应重复归入同一子类。',
      owner: '产业研究组',
      createdAt: '2026-08-03T00:00:00Z',
      updatedAt: '2026-08-03T00:00:00Z',
      usageNote: '常与经营成长、创新能力等维度组合，用于识别高潜力赛道企业。',
      logs: [],
      tags: [
        { id: 'tag-01-01', name: '低空无人机及航线证明', prob: 0.55, count: 0 },
        { id: 'tag-01-02', name: 'AI拥有算力或大模型备案', prob: 0.25, count: 0 },
        { id: 'tag-01-03', name: '载人飞行器整机研发', prob: 0.12, count: 0 },
        { id: 'tag-01-04', name: '自动驾驶与低空协同', prob: 0.08, count: 0 }
      ]
    },
    {
      id: 'cat-02',
      name: '二、经营与成长能力',
      order: 2,
      description: '衡量企业营收、人员及成长性指标，反映经营质量与发展速度。',
      scope: '覆盖企业近 1-3 年营收增速、人员增长及营收规模；不同成长指标可同时命中。',
      owner: '经济运行组',
      createdAt: '2026-08-03T00:00:00Z',
      updatedAt: '2026-08-03T00:00:00Z',
      usageNote: '多指标同时命中表示企业处于高速增长通道。',
      logs: [],
      tags: [
        { id: 'tag-02-01', name: '营收同比增长率 >= 30%', prob: 0.58, count: 0 },
        { id: 'tag-02-02', name: '上年营收规模 >= 500万', prob: 0.125, count: 0 },
        { id: 'tag-02-03', name: '近三年营收复合增长率 >= 20%', prob: 0.079, count: 0 },
        { id: 'tag-02-04', name: '社保缴纳人数增速 >= 15%', prob: 0.041, count: 0 }
      ]
    },
    {
      id: 'cat-03',
      name: '三、创新与知识产权',
      order: 3,
      description: '评估企业创新能力与知识产权储备。',
      scope: '包括专利、软著、资质认定及标准制定；可多项同时命中。',
      owner: '科技创新组',
      createdAt: '2026-08-03T00:00:00Z',
      updatedAt: '2026-08-03T00:00:00Z',
      usageNote: '用于识别技术驱动型企业。',
      logs: [],
      tags: [
        { id: 'tag-03-01', name: '发明专利持有量 >= 10件', prob: 0.55, count: 0 },
        { id: 'tag-03-02', name: '专精特新 / 小巨人资质', prob: 0.25, count: 0 },
        { id: 'tag-03-03', name: '软件著作权 >= 20项', prob: 0.12, count: 0 },
        { id: 'tag-03-04', name: '参与国家标准制定', prob: 0.08, count: 0 }
      ]
    },
    {
      id: 'cat-04',
      name: '四、融资能力与估值',
      order: 4,
      description: '反映企业资本市场认可度与融资活跃度。',
      scope: '覆盖风投资金、融资轮次、国资背景投资及估值水平。',
      owner: '金融资本组',
      createdAt: '2026-08-03T00:00:00Z',
      updatedAt: '2026-08-03T00:00:00Z',
      usageNote: '用于识别受资本市场关注的优质标的。',
      logs: [],
      tags: [
        { id: 'tag-04-01', name: '近2年获风投资金 >= 5000万', prob: 0.45, count: 0 },
        { id: 'tag-04-02', name: '近1年完成B轮及以上融资', prob: 0.25, count: 0 },
        { id: 'tag-04-03', name: '国资背景基金投资', prob: 0.15, count: 0 },
        { id: 'tag-04-04', name: '估值 >= 10亿元', prob: 0.10, count: 0 }
      ]
    },
    {
      id: 'cat-05',
      name: '五、经营风险（排除项）',
      order: 5,
      description: '识别企业合规与经营风险，作为负面排除或正向合规认定。',
      scope: '覆盖失信诉讼、行政处罚、税务异常、股权冻结等风险维度。',
      owner: '风控合规组',
      createdAt: '2026-08-03T00:00:00Z',
      updatedAt: '2026-08-03T00:00:00Z',
      usageNote: '通常作为筛选排除项使用。',
      logs: [],
      tags: [
        { id: 'tag-05-01', name: '排查失信与诉讼异常', prob: 0.40, count: 0 },
        { id: 'tag-05-02', name: '近1年无行政处罚', prob: 0.30, count: 0 },
        { id: 'tag-05-03', name: '无重大税务异常', prob: 0.20, count: 0 },
        { id: 'tag-05-04', name: '无股权冻结/质押', prob: 0.10, count: 0 }
      ]
    },
    {
      id: 'cat-06',
      name: '六、基本属性',
      order: 6,
      description: '描述企业注册地、资质认定及规模属性。',
      scope: '覆盖前海注册、总部/研发中心、高新技术企业、规上企业等属性。',
      owner: '企业服务组',
      createdAt: '2026-08-03T00:00:00Z',
      updatedAt: '2026-08-03T00:00:00Z',
      usageNote: '用于空间布局与基本资质识别。',
      logs: [],
      tags: [
        { id: 'tag-06-01', name: '注册地在前海', prob: 0.50, count: 0 },
        { id: 'tag-06-02', name: '总部/研发中心在前海', prob: 0.25, count: 0 },
        { id: 'tag-06-03', name: '高新技术企业', prob: 0.15, count: 0 },
        { id: 'tag-06-04', name: '规模以上企业', prob: 0.10, count: 0 }
      ]
    },
    {
      id: 'cat-07',
      name: '七、人才与团队',
      order: 7,
      description: '评估企业研发团队实力与高层次人才情况。',
      scope: '覆盖博士研发人员、核心团队背景及人才引进。',
      owner: '人才服务组',
      createdAt: '2026-08-03T00:00:00Z',
      updatedAt: '2026-08-03T00:00:00Z',
      usageNote: '用于识别研发驱动型企业。',
      logs: [],
      tags: [
        { id: 'tag-07-01', name: '博士及以上研发人员 >= 5人', prob: 0.55, count: 0 },
        { id: 'tag-07-02', name: '核心技术团队来自头部企业', prob: 0.30, count: 0 },
        { id: 'tag-07-03', name: '近1年高层次人才引进', prob: 0.15, count: 0 }
      ]
    },
    {
      id: 'cat-08',
      name: '八、市场与出海',
      order: 8,
      description: '衡量企业市场拓展能力及国际化程度。',
      scope: '覆盖海外营收占比、境外机构布局及国际交流。',
      owner: '开放合作组',
      createdAt: '2026-08-03T00:00:00Z',
      updatedAt: '2026-08-03T00:00:00Z',
      usageNote: '用于识别外向型及国际化企业。',
      logs: [],
      tags: [
        { id: 'tag-08-01', name: '海外市场营收占比 >= 20%', prob: 0.50, count: 0 },
        { id: 'tag-08-02', name: '拥有境外子公司或办事处', prob: 0.30, count: 0 },
        { id: 'tag-08-03', name: '参与国际展会或行业协会', prob: 0.20, count: 0 }
      ]
    },
    {
      id: 'cat-09',
      name: '九、产业链位置',
      order: 9,
      description: '明确企业在产业链中的位置与角色。',
      scope: '覆盖链主/龙头、零部件供应商、系统集成商、终端应用企业。',
      owner: '产业链研究组',
      createdAt: '2026-08-03T00:00:00Z',
      updatedAt: '2026-08-03T00:00:00Z',
      usageNote: '用于补链招商与上下游配套分析。',
      logs: [],
      tags: [
        { id: 'tag-09-01', name: '链主 / 龙头', prob: 0.45, count: 0 },
        { id: 'tag-09-02', name: '关键零部件供应商', prob: 0.25, count: 0 },
        { id: 'tag-09-03', name: '系统集成商', prob: 0.15, count: 0 },
        { id: 'tag-09-04', name: '终端应用企业', prob: 0.10, count: 0 }
      ]
    },
    {
      id: 'cat-10',
      name: '十、绿色低碳与ESG',
      order: 10,
      description: '评估企业绿色发展与ESG表现。',
      scope: '覆盖环境认证、碳排放强度及ESG评级。',
      owner: '绿色发展组',
      createdAt: '2026-08-03T00:00:00Z',
      updatedAt: '2026-08-03T00:00:00Z',
      usageNote: '用于绿色招商与ESG导向筛选。',
      logs: [],
      tags: [
        { id: 'tag-10-01', name: '通过ISO14001环境认证', prob: 0.50, count: 0 },
        { id: 'tag-10-02', name: '碳排放强度同比下降', prob: 0.30, count: 0 },
        { id: 'tag-10-03', name: 'ESG评级 >= B级', prob: 0.20, count: 0 }
      ]
    },
    {
      id: 'cat-11',
      name: '十一、数字化水平',
      order: 11,
      description: '衡量企业数字化转型与智能制造水平。',
      scope: '覆盖智能制造评估、系统上云率及数据/AI应用。',
      owner: '数字经济组',
      createdAt: '2026-08-03T00:00:00Z',
      updatedAt: '2026-08-03T00:00:00Z',
      usageNote: '用于识别数字化标杆企业。',
      logs: [],
      tags: [
        { id: 'tag-11-01', name: '通过国家智能制造评估', prob: 0.50, count: 0 },
        { id: 'tag-11-02', name: '核心系统上云率 >= 80%', prob: 0.30, count: 0 },
        { id: 'tag-11-03', name: '数据中台或AI应用落地', prob: 0.20, count: 0 }
      ]
    },
    {
      id: 'cat-12',
      name: '十二、政策匹配度',
      order: 12,
      description: '评估企业与前海产业政策的匹配程度。',
      scope: '覆盖重点产业目录、历史奖补及招商白名单。',
      owner: '政策研究组',
      createdAt: '2026-08-03T00:00:00Z',
      updatedAt: '2026-08-03T00:00:00Z',
      usageNote: '用于政策精准推送与招商目标锁定。',
      logs: [],
      tags: [
        { id: 'tag-12-01', name: '符合前海重点产业目录', prob: 0.55, count: 0 },
        { id: 'tag-12-02', name: '近2年获过市级以上奖补', prob: 0.25, count: 0 },
        { id: 'tag-12-03', name: '属于招商白名单企业', prob: 0.20, count: 0 }
      ]
    }
  ];

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  class TagCategoryManager {
    constructor() {
      this.categories = this.load();
      this.selectedId = this.categories[0] ? this.categories[0].id : null;
      this.auth = (typeof window !== 'undefined' && window.TagLibraryAuth) ? new window.TagLibraryAuth() : { can: () => false, getRole: () => 'viewer', getRoles: () => [] };
    }

    load() {
      if (typeof localStorage === 'undefined') return deepClone(DEFAULT_CATEGORIES);
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return deepClone(DEFAULT_CATEGORIES);
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        return deepClone(DEFAULT_CATEGORIES);
      } catch (e) {
        console.error('TagCategoryManager load failed', e);
        return deepClone(DEFAULT_CATEGORIES);
      }
    }

    save() {
      if (typeof localStorage === 'undefined') return;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.categories));
      } catch (e) {
        console.error('TagCategoryManager save failed', e);
      }
    }

    resetToDefault() {
      this.categories = deepClone(DEFAULT_CATEGORIES);
      this.selectedId = this.categories[0] ? this.categories[0].id : null;
      this.save();
      this.addLog(this.selectedId, 'reset', '标签库已重置为默认 12 大类');
    }

    getAll() {
      return this.categories;
    }

    getById(id) {
      return this.categories.find(c => c.id === id) || null;
    }

    getByName(name) {
      return this.categories.find(c => c.name === name) || null;
    }

    getDefaultCategories() {
      return deepClone(DEFAULT_CATEGORIES);
    }

    addLog(catId, action, detail) {
      const cat = catId ? this.getById(catId) : null;
      if (!cat) return;
      cat.logs.unshift({
        time: nowISO(),
        operator: this.auth ? this.auth.getRole() : 'unknown',
        action,
        detail: detail || ''
      });
      cat.updatedAt = nowISO();
    }

    _validateCategory(category, excludeId) {
      if (!category.name || !category.name.trim()) return '大类名称不能为空';
      if (this.categories.some(c => c.name === category.name.trim() && c.id !== excludeId)) {
        return '大类名称已存在';
      }
      if (category.order === undefined || category.order === null || isNaN(category.order)) {
        return '排序不能为空';
      }
      if (this.categories.some(c => c.order === Number(category.order) && c.id !== excludeId)) {
        return '排序已存在';
      }
      return null;
    }

    _validateTag(catId, tag, excludeTagId) {
      const cat = this.getById(catId);
      if (!cat) return '大类不存在';
      if (!tag.name || !tag.name.trim()) return '子标签名称不能为空';
      if (cat.tags.some(t => t.name === tag.name.trim() && t.id !== excludeTagId)) {
        return '该子标签名称在当前大类下已存在';
      }
      const prob = Number(tag.prob);
      if (isNaN(prob) || prob < 0 || prob > 1) return '命中概率需在 0-1 之间';
      return null;
    }

    createCategory(data) {
      const err = this._validateCategory(data);
      if (err) throw new Error(err);

      const category = {
        id: generateId('cat'),
        name: data.name.trim(),
        order: Number(data.order),
        description: (data.description || '').trim(),
        scope: (data.scope || '').trim(),
        owner: (data.owner || '').trim() || '未指定',
        createdAt: nowISO(),
        updatedAt: nowISO(),
        usageNote: (data.usageNote || '').trim(),
        logs: [],
        tags: []
      };
      this.categories.push(category);
      this.categories.sort((a, b) => a.order - b.order);
      this.addLog(category.id, 'create', `创建大类：${category.name}`);
      this.save();
      return category;
    }

    updateCategory(id, data) {
      const cat = this.getById(id);
      if (!cat) throw new Error('大类不存在');
      const err = this._validateCategory(data, id);
      if (err) throw new Error(err);

      const oldName = cat.name;
      cat.name = data.name.trim();
      cat.order = Number(data.order);
      cat.description = (data.description || '').trim();
      cat.scope = (data.scope || '').trim();
      cat.owner = (data.owner || '').trim() || '未指定';
      cat.usageNote = (data.usageNote || '').trim();
      cat.updatedAt = nowISO();
      this.categories.sort((a, b) => a.order - b.order);
      this.addLog(cat.id, 'update', `更新大类：${oldName} → ${cat.name}`);
      this.save();
      return cat;
    }

    removeCategory(id) {
      const idx = this.categories.findIndex(c => c.id === id);
      if (idx === -1) throw new Error('大类不存在');
      const cat = this.categories[idx];
      if (cat.tags && cat.tags.length > 0 && !window.confirm(`大类“${cat.name}”下还有 ${cat.tags.length} 个子标签，确定删除吗？`)) {
        return false;
      }
      this.categories.splice(idx, 1);
      if (this.selectedId === id) {
        this.selectedId = this.categories[0] ? this.categories[0].id : null;
      }
      this.save();
      if (typeof window !== 'undefined' && typeof window.syncActiveFiltersAfterCategoryRemove === 'function') {
        window.syncActiveFiltersAfterCategoryRemove(cat.name);
      }
      return true;
    }

    addTag(catId, data) {
      const err = this._validateTag(catId, data);
      if (err) throw new Error(err);
      const cat = this.getById(catId);
      const tag = {
        id: generateId('tag'),
        name: data.name.trim(),
        prob: Number(data.prob),
        count: 0
      };
      cat.tags.push(tag);
      cat.updatedAt = nowISO();
      this.addLog(cat.id, 'addTag', `新增子标签：${tag.name}（概率 ${tag.prob}）`);
      this.save();
      return tag;
    }

    updateTag(catId, tagId, data) {
      const cat = this.getById(catId);
      if (!cat) throw new Error('大类不存在');
      const tag = cat.tags.find(t => t.id === tagId);
      if (!tag) throw new Error('子标签不存在');
      const err = this._validateTag(catId, data, tagId);
      if (err) throw new Error(err);

      const oldName = tag.name;
      tag.name = data.name.trim();
      tag.prob = Number(data.prob);
      cat.updatedAt = nowISO();
      this.addLog(cat.id, 'updateTag', `更新子标签：${oldName} → ${tag.name}`);
      this.save();
      return tag;
    }

    removeTag(catId, tagId) {
      const cat = this.getById(catId);
      if (!cat) throw new Error('大类不存在');
      const idx = cat.tags.findIndex(t => t.id === tagId);
      if (idx === -1) throw new Error('子标签不存在');
      const tag = cat.tags[idx];
      cat.tags.splice(idx, 1);
      cat.updatedAt = nowISO();
      this.addLog(cat.id, 'removeTag', `删除子标签：${tag.name}`);
      this.save();
      if (typeof window !== 'undefined' && typeof window.syncActiveFiltersAfterTagRemove === 'function') {
        window.syncActiveFiltersAfterTagRemove(cat.name, tag.name);
      }
      return true;
    }

    exportJSON() {
      return JSON.stringify(this.categories, null, 2);
    }

    importJSON(json) {
      let parsed;
      try {
        parsed = JSON.parse(json);
      } catch (e) {
        throw new Error('JSON 格式错误');
      }
      if (!Array.isArray(parsed)) throw new Error('导入数据应为数组');
      // 基础校验
      parsed.forEach((c, i) => {
        if (!c.id || !c.name || !Array.isArray(c.tags)) {
          throw new Error(`第 ${i + 1} 个大类数据不完整`);
        }
      });
      this.categories = parsed;
      this.selectedId = this.categories[0] ? this.categories[0].id : null;
      this.save();
    }

    /* ===================== UI 层 ===================== */

    openManager() {
      this.renderDrawer();
    }

    renderDrawer() {
      if (typeof openDrawer !== 'function') {
        console.error('openDrawer not found');
        return;
      }
      const content = `
        <div class="tag-manager">
          <aside class="tm-sidebar">
            <div class="tm-toolbar">
              <div class="tm-role">
                <label>当前角色</label>
                <select id="tmRoleSelect" onchange="tagManager.onRoleChange(this.value)">
                  ${this.auth.getRoles().map(r => `<option value="${r}" ${r === this.auth.getRole() ? 'selected' : ''}>${this._roleLabel(r)}</option>`).join('')}
                </select>
              </div>
              <div class="tm-actions">
                <button class="btn btn-primary btn-sm ${this.auth.can('createCategory') ? '' : 'disabled'}" onclick="tagManager.openCreateCategory()">新增大类</button>
                <button class="btn btn-sm ${this.auth.can('importLibrary') ? '' : 'disabled'}" onclick="tagManager.openImport()">导入 JSON</button>
                <button class="btn btn-sm btn-danger ${this.auth.can('resetLibrary') ? '' : 'disabled'}" onclick="tagManager.confirmReset()">重置默认</button>
              </div>
            </div>
            <div class="tm-search">
              <input type="text" id="tmSearchInput" placeholder="查询大类或子标签..." oninput="tagManager.filterCategoryList(this.value)">
            </div>
            <div class="tm-category-list" id="tmCategoryList"></div>
          </aside>
          <main class="tm-main" id="tmMain"></main>
        </div>
      `;
      openDrawer('12 大类标签库管理', content, '');
      this.renderCategoryList();
      this.renderCategoryDetail(this.selectedId);
    }

    _roleLabel(role) {
      return { admin: '管理员', editor: '编辑', viewer: '只读' }[role] || role;
    }

    onRoleChange(role) {
      this.auth.setRole(role);
      showToast(`已切换为 ${this._roleLabel(role)}`, 'info');
      this.renderDrawer();
    }

    filterCategoryList(kw) {
      this.renderCategoryList(kw);
    }

    renderCategoryList(kw) {
      const container = document.getElementById('tmCategoryList');
      if (!container) return;
      const lower = (kw || '').toLowerCase();
      const items = this.categories
        .filter(c => {
          if (!lower) return true;
          return c.name.toLowerCase().includes(lower) ||
            c.tags.some(t => t.name.toLowerCase().includes(lower));
        })
        .sort((a, b) => a.order - b.order);

      container.innerHTML = items.map(c => `
        <div class="tm-category-item ${c.id === this.selectedId ? 'active' : ''}" onclick="tagManager.selectCategory('${c.id}')">
          <div class="tm-cat-name">${escapeHtml(c.name)}</div>
          <div class="tm-cat-meta">${c.tags.length} 个子标签 · ${escapeHtml(c.owner)}</div>
        </div>
      `).join('');
      if (!items.length) container.innerHTML = '<div class="tm-empty">未找到匹配大类</div>';
    }

    selectCategory(id) {
      this.selectedId = id;
      this.renderCategoryList(document.getElementById('tmSearchInput') ? document.getElementById('tmSearchInput').value : '');
      this.renderCategoryDetail(id);
    }

    renderCategoryDetail(id) {
      const main = document.getElementById('tmMain');
      if (!main) return;
      const cat = this.getById(id);
      if (!cat) {
        main.innerHTML = '<div class="tm-empty">请选择一个大类</div>';
        return;
      }

      main.innerHTML = `
        <div class="tm-detail">
          <div class="tm-detail-header">
            <h3>${escapeHtml(cat.name)}</h3>
            <div class="tm-detail-actions">
              <button class="btn btn-sm ${this.auth.can('editCategory') ? '' : 'disabled'}" onclick="tagManager.openEditCategory('${cat.id}')">编辑大类</button>
              <button class="btn btn-sm btn-danger ${this.auth.can('deleteCategory') ? '' : 'disabled'}" onclick="tagManager.confirmRemoveCategory('${cat.id}')">删除大类</button>
            </div>
          </div>
          <div class="tm-meta-grid">
            <div class="tm-meta-item"><span>排序</span><strong>${cat.order}</strong></div>
            <div class="tm-meta-item"><span>负责人</span><strong>${escapeHtml(cat.owner)}</strong></div>
            <div class="tm-meta-item"><span>创建时间</span><strong>${this._fmtTime(cat.createdAt)}</strong></div>
            <div class="tm-meta-item"><span>更新时间</span><strong>${this._fmtTime(cat.updatedAt)}</strong></div>
          </div>
          <div class="tm-section">
            <div class="tm-section-title">分类标准</div>
            <div class="tm-section-body">${escapeHtml(cat.description) || '-'}</div>
          </div>
          <div class="tm-section">
            <div class="tm-section-title">边界范围</div>
            <div class="tm-section-body">${escapeHtml(cat.scope) || '-'}</div>
          </div>
          <div class="tm-section">
            <div class="tm-section-title">使用说明</div>
            <div class="tm-section-body">${escapeHtml(cat.usageNote) || '-'}</div>
          </div>
          <div class="tm-section">
            <div class="tm-section-title">子标签列表
              <button class="btn btn-primary btn-sm ${this.auth.can('createTag') ? '' : 'disabled'}" onclick="tagManager.openCreateTag('${cat.id}')">新增子标签</button>
            </div>
            <table class="tm-tag-table">
              <thead><tr><th>名称</th><th>命中概率</th><th>模拟数量</th><th>操作</th></tr></thead>
              <tbody>
                ${cat.tags.map(t => `
                  <tr>
                    <td>${escapeHtml(t.name)}</td>
                    <td>${(t.prob * 100).toFixed(1)}%</td>
                    <td>${Number(t.count || 0).toLocaleString('zh-CN')}</td>
                    <td>
                      <button class="btn btn-sm ${this.auth.can('editTag') ? '' : 'disabled'}" onclick="tagManager.openEditTag('${cat.id}', '${t.id}')">编辑</button>
                      <button class="btn btn-sm btn-danger ${this.auth.can('deleteTag') ? '' : 'disabled'}" onclick="tagManager.confirmRemoveTag('${cat.id}', '${t.id}')">删除</button>
                    </td>
                  </tr>
                `).join('')}
                ${cat.tags.length === 0 ? '<tr><td colspan="4" class="tm-empty-cell">暂无子标签</td></tr>' : ''}
              </tbody>
            </table>
          </div>
          <div class="tm-section">
            <div class="tm-section-title">维护日志</div>
            <div class="tm-log-list">
              ${cat.logs.length ? cat.logs.slice(0, 20).map(l => `
                <div class="tm-log-item">
                  <span class="tm-log-time">${this._fmtTime(l.time)}</span>
                  <span class="tm-log-action">${escapeHtml(l.action)}</span>
                  <span class="tm-log-detail">${escapeHtml(l.detail)}</span>
                  <span class="tm-log-operator">${escapeHtml(l.operator)}</span>
                </div>
              `).join('') : '<div class="tm-empty-cell">暂无日志</div>'}
            </div>
          </div>
        </div>
      `;
    }

    _fmtTime(iso) {
      if (!iso) return '-';
      const d = new Date(iso);
      return isNaN(d) ? iso : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    }

    openCreateCategory() {
      if (!this.auth.can('createCategory')) return;
      const nextOrder = this.categories.length ? Math.max(...this.categories.map(c => c.order)) + 1 : 1;
      const content = `
        <form onsubmit="event.preventDefault(); tagManager.submitCreateCategory(this);">
          <div class="tm-form-row"><label>大类名称 *</label><input name="name" required maxlength="50"></div>
          <div class="tm-form-row"><label>排序 *</label><input name="order" type="number" required value="${nextOrder}"></div>
          <div class="tm-form-row"><label>负责人</label><input name="owner" value="产业研究组"></div>
          <div class="tm-form-row"><label>分类标准</label><textarea name="description" rows="3"></textarea></div>
          <div class="tm-form-row"><label>边界范围</label><textarea name="scope" rows="3"></textarea></div>
          <div class="tm-form-row"><label>使用说明</label><textarea name="usageNote" rows="3"></textarea></div>
          <div class="tm-form-actions">
            <button type="submit" class="btn btn-primary">保存</button>
            <button type="button" class="btn" onclick="closeModal()">取消</button>
          </div>
        </form>
      `;
      openModal('新增大类', content, '');
    }

    submitCreateCategory(form) {
      try {
        const data = {
          name: form.name.value,
          order: form.order.value,
          owner: form.owner.value,
          description: form.description.value,
          scope: form.scope.value,
          usageNote: form.usageNote.value
        };
        const cat = this.createCategory(data);
        closeModal();
        this.selectedId = cat.id;
        this.renderDrawer();
        this._notifyDataChanged();
      } catch (e) {
        showToast(e.message, 'error');
      }
    }

    openEditCategory(id) {
      if (!this.auth.can('editCategory')) return;
      const cat = this.getById(id);
      if (!cat) return;
      const content = `
        <form onsubmit="event.preventDefault(); tagManager.submitEditCategory('${id}', this);">
          <div class="tm-form-row"><label>大类名称 *</label><input name="name" required maxlength="50" value="${escapeHtml(cat.name)}"></div>
          <div class="tm-form-row"><label>排序 *</label><input name="order" type="number" required value="${cat.order}"></div>
          <div class="tm-form-row"><label>负责人</label><input name="owner" value="${escapeHtml(cat.owner)}"></div>
          <div class="tm-form-row"><label>分类标准</label><textarea name="description" rows="3">${escapeHtml(cat.description)}</textarea></div>
          <div class="tm-form-row"><label>边界范围</label><textarea name="scope" rows="3">${escapeHtml(cat.scope)}</textarea></div>
          <div class="tm-form-row"><label>使用说明</label><textarea name="usageNote" rows="3">${escapeHtml(cat.usageNote)}</textarea></div>
          <div class="tm-form-actions">
            <button type="submit" class="btn btn-primary">保存</button>
            <button type="button" class="btn" onclick="closeModal()">取消</button>
          </div>
        </form>
      `;
      openModal('编辑大类', content, '');
    }

    submitEditCategory(id, form) {
      try {
        const oldName = this.getById(id).name;
        const data = {
          name: form.name.value,
          order: form.order.value,
          owner: form.owner.value,
          description: form.description.value,
          scope: form.scope.value,
          usageNote: form.usageNote.value
        };
        const cat = this.updateCategory(id, data);
        closeModal();
        if (oldName !== cat.name && typeof window.syncActiveFiltersAfterCategoryRename === 'function') {
          window.syncActiveFiltersAfterCategoryRename(oldName, cat.name);
        }
        this.renderDrawer();
      } catch (e) {
        showToast(e.message, 'error');
      }
    }

    confirmRemoveCategory(id) {
      if (!this.auth.can('deleteCategory')) return;
      const cat = this.getById(id);
      if (!cat) return;
      openModal('确认删除', `确定删除大类“${escapeHtml(cat.name)}”吗？此操作不可恢复。`, `
        <button class="btn btn-danger" onclick="tagManager.submitRemoveCategory('${id}')">删除</button>
        <button class="btn" onclick="closeModal()">取消</button>
      `);
    }

    submitRemoveCategory(id) {
      try {
        this.removeCategory(id);
        closeModal();
        this.renderDrawer();
        this._notifyDataChanged();
      } catch (e) {
        showToast(e.message, 'error');
      }
    }

    openCreateTag(catId) {
      if (!this.auth.can('createTag')) return;
      const content = `
        <form onsubmit="event.preventDefault(); tagManager.submitCreateTag('${catId}', this);">
          <div class="tm-form-row"><label>子标签名称 *</label><input name="name" required maxlength="60"></div>
          <div class="tm-form-row"><label>命中概率 *</label><input name="prob" type="number" step="0.001" min="0" max="1" required value="0.1"></div>
          <div class="tm-form-actions">
            <button type="submit" class="btn btn-primary">保存</button>
            <button type="button" class="btn" onclick="closeModal()">取消</button>
          </div>
        </form>
      `;
      openModal('新增子标签', content, '');
    }

    submitCreateTag(catId, form) {
      try {
        this.addTag(catId, { name: form.name.value, prob: form.prob.value });
        closeModal();
        this.renderCategoryList(document.getElementById('tmSearchInput') ? document.getElementById('tmSearchInput').value : '');
        this.renderCategoryDetail(catId);
        this._notifyDataChanged();
      } catch (e) {
        showToast(e.message, 'error');
      }
    }

    openEditTag(catId, tagId) {
      if (!this.auth.can('editTag')) return;
      const cat = this.getById(catId);
      const tag = cat.tags.find(t => t.id === tagId);
      if (!tag) return;
      const content = `
        <form onsubmit="event.preventDefault(); tagManager.submitEditTag('${catId}', '${tagId}', this);">
          <div class="tm-form-row"><label>子标签名称 *</label><input name="name" required maxlength="60" value="${escapeHtml(tag.name)}"></div>
          <div class="tm-form-row"><label>命中概率 *</label><input name="prob" type="number" step="0.001" min="0" max="1" required value="${tag.prob}"></div>
          <div class="tm-form-actions">
            <button type="submit" class="btn btn-primary">保存</button>
            <button type="button" class="btn" onclick="closeModal()">取消</button>
          </div>
        </form>
      `;
      openModal('编辑子标签', content, '');
    }

    submitEditTag(catId, tagId, form) {
      try {
        const oldTag = this.getById(catId).tags.find(t => t.id === tagId);
        this.updateTag(catId, tagId, { name: form.name.value, prob: form.prob.value });
        closeModal();
        if (oldTag && oldTag.name !== form.name.value && typeof window.syncActiveFiltersAfterTagRename === 'function') {
          window.syncActiveFiltersAfterTagRename(this.getById(catId).name, oldTag.name, form.name.value);
        }
        this.renderCategoryList(document.getElementById('tmSearchInput') ? document.getElementById('tmSearchInput').value : '');
        this.renderCategoryDetail(catId);
        this._notifyDataChanged();
      } catch (e) {
        showToast(e.message, 'error');
      }
    }

    confirmRemoveTag(catId, tagId) {
      if (!this.auth.can('deleteTag')) return;
      const cat = this.getById(catId);
      const tag = cat.tags.find(t => t.id === tagId);
      if (!tag) return;
      openModal('确认删除', `确定删除子标签“${escapeHtml(tag.name)}”吗？`, `
        <button class="btn btn-danger" onclick="tagManager.submitRemoveTag('${catId}', '${tagId}')">删除</button>
        <button class="btn" onclick="closeModal()">取消</button>
      `);
    }

    submitRemoveTag(catId, tagId) {
      try {
        this.removeTag(catId, tagId);
        closeModal();
        this.renderCategoryList(document.getElementById('tmSearchInput') ? document.getElementById('tmSearchInput').value : '');
        this.renderCategoryDetail(catId);
        this._notifyDataChanged();
      } catch (e) {
        showToast(e.message, 'error');
      }
    }

    openImport() {
      if (!this.auth.can('importLibrary')) return;
      const content = `
        <form onsubmit="event.preventDefault(); tagManager.submitImport(this);">
          <div class="tm-form-row"><label>JSON 数据</label><textarea name="json" rows="10" placeholder="粘贴导出过的标签库 JSON"></textarea></div>
          <div class="tm-form-actions">
            <button type="submit" class="btn btn-primary">导入</button>
            <button type="button" class="btn" onclick="tagManager.exportAndDownload()">导出当前 JSON</button>
            <button type="button" class="btn" onclick="closeModal()">取消</button>
          </div>
        </form>
      `;
      openModal('导入 / 导出标签库', content, '');
    }

    submitImport(form) {
      try {
        this.importJSON(form.json.value);
        closeModal();
        this.renderDrawer();
        this._notifyDataChanged();
        showToast('导入成功', 'success');
      } catch (e) {
        showToast(e.message, 'error');
      }
    }

    exportAndDownload() {
      const blob = new Blob(['\uFEFF' + this.exportJSON()], { type: 'application/json;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `tag-library-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(link.href);
    }

    confirmReset() {
      if (!this.auth.can('resetLibrary')) return;
      openModal('确认重置', '确定重置为默认 12 大类吗？所有自定义修改将丢失。', `
        <button class="btn btn-danger" onclick="tagManager.submitReset()">重置</button>
        <button class="btn" onclick="closeModal()">取消</button>
      `);
    }

    submitReset() {
      this.resetToDefault();
      closeModal();
      this.renderDrawer();
      this._notifyDataChanged();
      showToast('已重置为默认标签库', 'success');
    }

    _notifyDataChanged() {
      if (typeof window !== 'undefined' && typeof window.onTagLibraryChanged === 'function') {
        window.onTagLibraryChanged(this.categories);
      }
    }
  }

  window.TagCategoryManager = TagCategoryManager;
})();
