/**
 * 政策分析页面交互脚本
 * 包含：多维筛选、TOP10 精选、异地补贴对标、政策建议生成、招商沙盘推演
 */

(function () {
  'use strict';

  /* ===================== 标签库集成 ===================== */

  // 从 TagCategoryManager 动态加载 12 大类标签库，支持层级子分类扩展、
  // 元数据管理与权限控制。默认数据由 tag-category-manager.js 提供。
  let tagManager = null;
  let TAG_CATEGORIES = [];

  function initTagLibrary() {
    tagManager = new window.TagCategoryManager();
    TAG_CATEGORIES = normalizeCategories(tagManager.getAll());
    window.tagManager = tagManager;
  }

  function normalizeCategories(categories) {
    return categories.map(c => ({
      name: c.name,
      tags: c.tags.map(t => ({ name: t.name, prob: t.prob, count: 0 }))
    }));
  }

  function refreshTagLibrary() {
    TAG_CATEGORIES = normalizeCategories(tagManager.getAll());
  }

  window.openTagManager = function () {
    if (tagManager) tagManager.openManager();
  };

  const BASE_TOTAL = 210482;       // 辖区企业总基数

  // 确定性随机数生成器，保证每次刷新数据一致
  function makeSeededRandom(seed) {
    return function () {
      seed |= 0;
      seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const rnd = makeSeededRandom(20260803);

  function generateName(idx) {
    const prefixes = ['深圳', '前海', '南山', '宝安', '福田', '龙岗', '龙华', '光明'];
    const cores = ['智航', '云翼', '低空', '天启', '星河', '瀚海', '领航', '创联', '未来', '知行', '青云', '极光', '蜂巢', '灵动', '纵横', '飞凡', '芯科', '数智', '智联', '翼联'];
    const suffixes = ['科技有限公司', '智能科技有限公司', '创新科技有限公司', '信息技术有限公司', '航空科技有限公司', '机器人有限公司', '半导体有限公司', '软件有限公司'];
    const cycle = prefixes.length * cores.length * suffixes.length;
    const p = prefixes[idx % prefixes.length];
    const c = cores[Math.floor(idx / prefixes.length) % cores.length];
    const s = suffixes[Math.floor(idx / (prefixes.length * cores.length)) % suffixes.length];
    const dup = Math.floor(idx / cycle);
    return p + c + s + (dup > 0 ? `（${dup + 1}）` : '');
  }

  function generateEnterprise(id, idx) {
    const tags = [];
    for (let c = 0; c < TAG_CATEGORIES.length; c++) {
      TAG_CATEGORIES[c].tags.forEach(tag => {
        if (rnd() < tag.prob) tags.push(tag.name);
      });
    }
    // 至少保证 1 个标签，避免完全无属性
    if (tags.length === 0) {
      tags.push(TAG_CATEGORIES[0].tags[0].name);
    }

    const tagCount = tags.length;
    const score = Math.min(84.9, parseFloat((40 + tagCount * 1.5 + rnd() * 12).toFixed(1)));
    const rdGrowth = Math.round(10 + tagCount * 3 + rnd() * 30);
    const ssGrowth = Math.round(5 + tagCount * 2 + rnd() * 20);
    const financeCount = Math.min(5, Math.floor(tagCount * 0.4 + rnd() * 2));
    const patent = Math.round(tagCount * 8 + rnd() * 60);
    const revenue = Math.round((2000 + tagCount * 5000 + rnd() * 50000) / 1000) * 1000;
    const roles = ['零部件企业', '制造商', '集成商', '终端企业', '服务商', '使能技术企业'];
    const chainRole = roles[Math.floor(rnd() * roles.length)];
    const cityCount = Math.min(5, Math.floor(tagCount * 0.4 + rnd() * 2));
    const risk = rnd() > 0.85 ? '关注(少量诉讼)' : '优秀(无诉讼)';
    const corePool = ['低空物流', '大模型备案', '智能交通', '无人机整机', '自动驾驶', 'AI视觉', '核心器件', '系统集成', '数据服务', '智能制造'];
    const core = corePool[Math.floor(rnd() * corePool.length)];

    return {
      id,
      name: generateName(idx),
      tags,
      score,
      rdGrowth,
      ssGrowth,
      financeCount,
      chainRole,
      cityCount,
      risk,
      core,
      patent,
      revenue
    };
  }

  // 20 家真实示例企业作为高分样本保留
  const REAL_ENTERPRISES = [
    { id: 'e001', name: '深圳市顺丰无人机科技有限公司', tags: ['低空无人机及航线证明', '营收同比增长率 >= 30%', '发明专利持有量 >= 10件', '近2年获风投资金 >= 5000万', '注册地在前海'], score: 98.5, rdGrowth: 45, ssGrowth: 22, financeCount: 3, chainRole: '链主', cityCount: 2, risk: '优秀(无诉讼)', core: '低空物流链主', patent: 86, revenue: 124000 },
    { id: 'e002', name: '前海大公低空智能航空（深圳）有限公司', tags: ['载人飞行器整机研发', '专精特新 / 小巨人资质', '近1年完成B轮及以上融资', '总部/研发中心在前海'], score: 95.2, rdGrowth: 38, ssGrowth: 18, financeCount: 2, chainRole: '国产替代', cityCount: 1, risk: '优秀(无诉讼)', core: '大模型备案', patent: 42, revenue: 38000 },
    { id: 'e003', name: '深城交低空交通创新实验室有限公司', tags: ['自动驾驶与低空协同', '参与国家标准制定', '国资背景基金投资', '注册地在前海'], score: 92.8, rdGrowth: 35, ssGrowth: 25, financeCount: 2, chainRole: '链主', cityCount: 1, risk: '优秀(无诉讼)', core: '国家高企', patent: 55, revenue: 62000 },
    { id: 'e004', name: '深圳市联合飞机科技技术有限公司', tags: ['低空无人机及航线证明', '近三年营收复合增长率 >= 20%', '高新技术企业', '估值 >= 10亿元'], score: 91.5, rdGrowth: 33, ssGrowth: 16, financeCount: 3, chainRole: '国产替代', cityCount: 1, risk: '优秀(无诉讼)', core: '国家小巨人', patent: 73, revenue: 95000 },
    { id: 'e005', name: '亿航智能前海技术创新中心', tags: ['载人飞行器整机研发', '近2年获风投资金 >= 5000万', '高新技术企业', '总部/研发中心在前海'], score: 89.4, rdGrowth: 41, ssGrowth: 12, financeCount: 4, chainRole: '链主', cityCount: 1, risk: '优秀(无诉讼)', core: '载人飞行器', patent: 62, revenue: 56000 },
    { id: 'e006', name: '前海智谱AI大模型实验室有限公司', tags: ['AI拥有算力或大模型备案', '软件著作权 >= 20项', '近1年完成B轮及以上融资', '注册地在前海'], score: 88.0, rdGrowth: 56, ssGrowth: 30, financeCount: 2, chainRole: '使能技术', cityCount: 1, risk: '优秀(无诉讼)', core: '大模型备案', patent: 28, revenue: 24000 },
    { id: 'e007', name: '云天励飞低空AI视觉感知有限公司', tags: ['自动驾驶与低空协同', '专精特新 / 小巨人资质', '近三年营收复合增长率 >= 20%', '高新技术企业'], score: 86.5, rdGrowth: 29, ssGrowth: 14, financeCount: 2, chainRole: '集成商', cityCount: 1, risk: '优秀(无诉讼)', core: '专精特新', patent: 91, revenue: 72000 },
    { id: 'e008', name: '丰翼科技（深圳）有限公司', tags: ['低空无人机及航线证明', '社保缴纳人数增速 >= 15%', '高新技术企业', '注册地在前海'], score: 85.0, rdGrowth: 31, ssGrowth: 20, financeCount: 1, chainRole: '制造商', cityCount: 1, risk: '优秀(无诉讼)', core: '物流末端配送', patent: 45, revenue: 48000 },
    { id: 'e009', name: '酷哇无人驾驶与低空协同科技', tags: ['自动驾驶与低空协同', '近1年完成B轮及以上融资', '软件著作权 >= 20项', '注册地在前海'], score: 83.2, rdGrowth: 36, ssGrowth: 17, financeCount: 2, chainRole: '服务商', cityCount: 1, risk: '优秀(无诉讼)', core: '自动驾驶', patent: 38, revenue: 31000 },
    { id: 'e010', name: '前海中科院低空感知技术联合实验室', tags: ['低空无人机及航线证明', '参与国家标准制定', '国资背景基金投资', '高新技术企业'], score: 81.6, rdGrowth: 27, ssGrowth: 11, financeCount: 1, chainRole: '使能技术', cityCount: 1, risk: '优秀(无诉讼)', core: '科研转化', patent: 49, revenue: 22000 },
    { id: 'e011', name: '深圳大疆创新科技有限公司', tags: ['低空无人机及航线证明', '营收同比增长率 >= 30%', '发明专利持有量 >= 10件', '估值 >= 10亿元'], score: 96.3, rdGrowth: 18, ssGrowth: 8, financeCount: 0, chainRole: '链主', cityCount: 3, risk: '优秀(无诉讼)', core: '消费级无人机龙头', patent: 210, revenue: 320000 },
    { id: 'e012', name: '深圳道通智能航空技术有限公司', tags: ['低空无人机及航线证明', '专精特新 / 小巨人资质', '高新技术企业', '注册地在前海'], score: 84.5, rdGrowth: 24, ssGrowth: 13, financeCount: 1, chainRole: '制造商', cityCount: 2, risk: '关注(1起专利诉讼)', core: '行业级无人机', patent: 67, revenue: 41000 },
    { id: 'e013', name: '深圳华大基因科技有限公司', tags: ['近2年获风投资金 >= 5000万', '高新技术企业', '规模以上企业', '注册地在前海'], score: 79.2, rdGrowth: 12, ssGrowth: 6, financeCount: 2, chainRole: '终端企业', cityCount: 2, risk: '优秀(无诉讼)', core: '生命健康数据', patent: 34, revenue: 86000 },
    { id: 'e014', name: '深圳奥比中光科技有限公司', tags: ['AI拥有算力或大模型备案', '专精特新 / 小巨人资质', '近1年完成B轮及以上融资', '高新技术企业'], score: 87.1, rdGrowth: 32, ssGrowth: 15, financeCount: 2, chainRole: '零部件企业', cityCount: 1, risk: '优秀(无诉讼)', core: '3D视觉传感器', patent: 58, revenue: 39000 },
    { id: 'e015', name: '深圳优必选科技股份有限公司', tags: ['AI拥有算力或大模型备案', '近三年营收复合增长率 >= 20%', '高新技术企业', '估值 >= 10亿元'], score: 90.4, rdGrowth: 28, ssGrowth: 19, financeCount: 3, chainRole: '集成商', cityCount: 2, risk: '优秀(无诉讼)', core: '人形机器人', patent: 112, revenue: 78000 },
    { id: 'e016', name: '深圳光峰科技股份有限公司', tags: ['发明专利持有量 >= 10件', '规模以上企业', '高新技术企业', '注册地在前海'], score: 82.3, rdGrowth: 14, ssGrowth: 7, financeCount: 1, chainRole: '零部件企业', cityCount: 1, risk: '优秀(无诉讼)', core: '激光显示核心器件', patent: 94, revenue: 65000 },
    { id: 'e017', name: '深圳海柔创新科技有限公司', tags: ['AI拥有算力或大模型备案', '近2年获风投资金 >= 5000万', '社保缴纳人数增速 >= 15%', '高新技术企业'], score: 85.8, rdGrowth: 37, ssGrowth: 24, financeCount: 3, chainRole: '集成商', cityCount: 1, risk: '优秀(无诉讼)', core: '仓储物流机器人', patent: 51, revenue: 47000 },
    { id: 'e018', name: '深圳速腾聚创科技有限公司', tags: ['自动驾驶与低空协同', '近1年完成B轮及以上融资', '高新技术企业', '估值 >= 10亿元'], score: 89.9, rdGrowth: 44, ssGrowth: 21, financeCount: 2, chainRole: '零部件企业', cityCount: 1, risk: '优秀(无诉讼)', core: '激光雷达', patent: 76, revenue: 54000 },
    { id: 'e019', name: '深圳竹间智能科技有限公司', tags: ['AI拥有算力或大模型备案', '软件著作权 >= 20项', '近2年获风投资金 >= 5000万', '注册地在前海'], score: 78.5, rdGrowth: 26, ssGrowth: 10, financeCount: 2, chainRole: '服务商', cityCount: 1, risk: '优秀(无诉讼)', core: 'NLP大模型', patent: 22, revenue: 18000 },
    { id: 'e020', name: '深圳元戎启行科技有限公司', tags: ['自动驾驶与低空协同', '近1年完成B轮及以上融资', '高新技术企业', '社保缴纳人数增速 >= 15%'], score: 86.2, rdGrowth: 40, ssGrowth: 23, financeCount: 3, chainRole: '集成商', cityCount: 1, risk: '优秀(无诉讼)', core: 'L4自动驾驶', patent: 48, revenue: 29000 }
  ];

  let BASE_ENTERPRISES = [];

  function generateBaseEnterprises() {
    // 生成足够样本量（8,000 家），以清晰呈现不同筛选组合下的数量漏斗
    BASE_ENTERPRISES = [...REAL_ENTERPRISES];
    for (let i = 0; i < 7980; i++) {
      const id = 'e' + String(REAL_ENTERPRISES.length + i + 1).padStart(4, '0');
      BASE_ENTERPRISES.push(generateEnterprise(id, i));
    }

    // 按样本比例缩放标签命中次数，作为标签库右侧数量展示
    const rawTagCounts = {};
    BASE_ENTERPRISES.forEach(e => {
      e.tags.forEach(t => { rawTagCounts[t] = (rawTagCounts[t] || 0) + 1; });
    });
    const tagScale = BASE_TOTAL / BASE_ENTERPRISES.length;
    TAG_CATEGORIES.forEach(cat => {
      cat.tags.forEach(tag => {
        const raw = rawTagCounts[tag.name] || 0;
        tag.count = raw ? Math.max(1, Math.round(raw * tagScale)) : 0;
      });
    });
  }

  const SUBSIDY_RECORDS = [
    { entId: 'e001', city: '浙江杭州', project: '低空物流场景试飞重大专项补贴', amount: 1500, year: 2025 },
    { entId: 'e001', city: '江苏苏州', project: '研发中心落地叠加补贴与房租全免', amount: 800, year: 2024 },
    { entId: 'e002', city: '北京亦庄', project: '人工智能大模型算法备案奖励资金', amount: 500, year: 2025 },
    { entId: 'e003', city: '江苏南京', project: '智能交通核心技术攻关奖励', amount: 350, year: 2024 },
    { entId: 'e004', city: '安徽合肥', project: '无人机产业链招商引资专项', amount: 1200, year: 2025 },
    { entId: 'e005', city: '广州黄埔', project: '空中交通示范运营配套资金', amount: 1000, year: 2024 },
    { entId: 'e006', city: '北京海淀', project: '通用人工智能算力补贴包', amount: 600, year: 2025 },
    { entId: 'e007', city: '四川成都', project: '智慧城市感知终端创新资金', amount: 400, year: 2024 },
    { entId: 'e008', city: '江西赣州', project: '无人机农业物流试点项目', amount: 300, year: 2023 },
    { entId: 'e009', city: '上海嘉定', project: '协同驾驶研发攻关补贴', amount: 700, year: 2024 },
    { entId: 'e010', city: '湖北武汉', project: '产学研成果转化专项资金', amount: 250, year: 2024 },
    { entId: 'e011', city: '浙江杭州', project: '未来产业领军型企业奖励', amount: 2000, year: 2025 },
    { entId: 'e014', city: '北京海淀', project: '硬科技天使投资基金配套', amount: 450, year: 2024 },
    { entId: 'e018', city: '江苏苏州', project: '智能网联汽车关键零部件补贴', amount: 900, year: 2025 }
  ];

  const COMPETITOR_DATA = [
    {
      city: '浙江杭州（余杭区）',
      type: '补贴落差',
      gap: 700,
      desc: '杭州针对低空物流场景试飞提供最高 1,500 万奖励，前海目前上限为 800 万，建议提升补贴吸引力。'
    },
    {
      city: '北京亦庄（经开区）',
      type: '模式落差',
      gap: null,
      desc: '北京对大模型算法备案按算力消耗的 30% 给予直接核销，建议前海引入 1:1 配套机制。'
    },
    {
      city: '江苏苏州（工业园区）',
      type: '优势落差',
      gap: null,
      desc: '苏州对总部迁入企业提供 3 年房租全免及研发联动叠加补贴。'
    },
    {
      city: '安徽合肥',
      type: '补贴落差',
      gap: 1200,
      desc: '合肥对整机链主企业落地给予最高 1,200 万专项招商奖励，并形成上下游配套基金。'
    }
  ];

  const POLICY_CLAUSES = [
    {
      id: 'c1',
      title: '条款1：异地落地项目配套扶持',
      checked: true,
      fields: [
        { key: 'ratio', label: '配套补贴比例', value: '100', unit: '%（1:1等额）', type: 'select', options: ['50', '100', '150'] },
        { key: 'cap', label: '单家封顶最高金额', value: '2000', unit: '万元', type: 'number' }
      ],
      draft: (vals) => `对近 2 年内获得过国内主要城市（北京、杭州、苏州等）省级/市级专项补贴，且将总部或核心研发中心迁移落户前海的 TOP10 高潜力企业，按照异地实际获补金额的 ${vals.ratio}% 给予前海等额配套补贴，单个企业最高支持 ${vals.cap} 万元。`
    },
    {
      id: 'c2',
      title: '条款2：无人机商业航线与空域开辟补贴',
      checked: true,
      fields: [
        { key: 'routeReward', label: '首航一次性奖励额度', value: '1500', unit: '万元', type: 'number' }
      ],
      draft: (vals) => `对在辖区内开通首条跨山/跨海无人机低空物流航线或客运试飞路线的企业，一次性给予最高 ${vals.routeReward} 万元的航线开辟与设备投入奖励。`
    },
    {
      id: 'c3',
      title: '条款3：智算算力与大模型备案核销',
      checked: true,
      fields: [
        { key: 'computeRatio', label: '算力支出补贴比例', value: '40', unit: '%', type: 'number' }
      ],
      draft: (vals) => `对已完成国家网信办大模型算法备案并租用智算算力的企业，每年按算力实际支出费用的 ${vals.computeRatio}% 给予算力补贴，连续支持 3 年。`
    }
  ];

  const PORTRAIT_DIMENSIONS = [
    '研发增幅', '社保增速', '融资频次', '产业链关键节点',
    '营收规模', '知识产权', '人才梯队', '经营稳定性',
    '合规风险', '股权集中度', '获补履历', '成长潜力'
  ];

  /* ===================== 状态 ===================== */

  let activeFilters = {}; // { categoryName: Set(tagName) }
  let lockedIds = [];
  let filteredEnterprises = [];
  let keywordFilter = '';
  let sandboxChart = null;
  let portraitChart = null;

  /* ===================== 标签库变更同步 ===================== */

  window.onTagLibraryChanged = function (categories) {
    refreshTagLibrary();
    renderTagFilter();
    renderActiveRules();
    applyFilters();
    showToast('标签库已更新，筛选器已同步', 'success');
  };

  window.syncActiveFiltersAfterCategoryRemove = function (catName) {
    if (activeFilters[catName]) {
      delete activeFilters[catName];
      renderTagFilter();
      renderActiveRules();
      applyFilters();
      showToast(`已移除大类“${catName}”相关的筛选条件`, 'info');
    }
  };

  window.syncActiveFiltersAfterTagRemove = function (catName, tagName) {
    if (activeFilters[catName] && activeFilters[catName].has(tagName)) {
      activeFilters[catName].delete(tagName);
      if (activeFilters[catName].size === 0) delete activeFilters[catName];
      renderTagFilter();
      renderActiveRules();
      applyFilters();
      showToast(`已移除标签“${tagName}”相关的筛选条件`, 'info');
    }
  };

  window.syncActiveFiltersAfterCategoryRename = function (oldName, newName) {
    if (activeFilters[oldName]) {
      activeFilters[newName] = activeFilters[oldName];
      delete activeFilters[oldName];
      renderTagFilter();
      renderActiveRules();
      applyFilters();
    }
  };

  window.syncActiveFiltersAfterTagRename = function (catName, oldTagName, newTagName) {
    if (activeFilters[catName] && activeFilters[catName].has(oldTagName)) {
      activeFilters[catName].delete(oldTagName);
      activeFilters[catName].add(newTagName);
      renderTagFilter();
      renderActiveRules();
      applyFilters();
    }
  };

  /* ===================== 工具函数 ===================== */

  function fmtNum(n) {
    return n.toLocaleString('zh-CN');
  }

  function fmtMoneyWan(n) {
    return fmtNum(n) + ' 万元';
  }

  function fmtMoneyYi(n) {
    return n.toFixed(1) + ' 亿元';
  }

  function fmtPercent(n) {
    return n.toFixed(1) + '%';
  }

  function getEnterprise(id) {
    return BASE_ENTERPRISES.find(e => e.id === id);
  }

  function escapeHtml(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }

  /* ===================== 初始化 ===================== */

  function init() {
    initTagLibrary();
    generateBaseEnterprises();

    // 默认锁定评分最高的 10 家
    const sorted = [...BASE_ENTERPRISES].sort((a, b) => b.score - a.score);
    lockedIds = sorted.slice(0, 10).map(e => e.id);

    renderTagFilter();
    applyFilters();
    renderTop10();
    renderSubsidySelect();
    renderSubsidyTable();
    renderCompetitor();
    renderPolicyClauses();
    updatePolicyDraft();
    renderSandbox();
    bindGlobalEvents();
  }

  function bindGlobalEvents() {
    document.getElementById('selectAllResults').addEventListener('change', function () {
      const checked = this.checked;
      document.querySelectorAll('#resultTableBody .pa-result-check').forEach(cb => cb.checked = checked);
    });
  }

  /* ===================== 步骤切换 ===================== */

  window.switchStep = function (step) {
    document.querySelectorAll('.pa-step').forEach(el => {
      const isActive = parseInt(el.dataset.step, 10) === step;
      el.classList.toggle('active', isActive);
      el.setAttribute('aria-selected', String(isActive));
    });
    document.querySelectorAll('.pa-pane').forEach(el => {
      el.classList.toggle('active', el.id === 'pane-' + step);
    });
    if (step === 5) {
      setTimeout(renderSandboxChart, 50);
    }
  };

  /* ===================== 模块1：多维筛选器 ===================== */

  function renderTagFilter() {
    const tree = document.getElementById('tagTree');
    tree.innerHTML = TAG_CATEGORIES.map((cat, idx) => {
      const selectedCount = (activeFilters[cat.name] || new Set()).size;
      const isOpen = idx === 0 || selectedCount > 0;
      return `
        <div class="pa-tag-category ${isOpen ? 'open' : ''}" data-cat="${escapeHtml(cat.name)}">
          <div class="pa-tag-category-head" onclick="toggleCategory(this)">
            <span class="pa-tag-category-title">${escapeHtml(cat.name)}</span>
            <div style="display:flex;align-items:center;gap:8px;">
              <span class="pa-tag-category-count">已选 ${selectedCount}/${cat.tags.length}</span>
              <span class="pa-tag-category-arrow">▼</span>
            </div>
          </div>
          <div class="pa-tag-category-body">
            ${cat.tags.map(tag => `
              <div class="pa-tag-item ${isTagActive(cat.name, tag.name) ? 'active' : ''}"
                   data-cat="${escapeHtml(cat.name)}" data-tag="${escapeHtml(tag.name)}"
                   onclick="toggleTag(this)">
                <span>${escapeHtml(tag.name)}</span>
                <span class="pa-tag-item-count">${fmtNum(tag.count)}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');
    filterTagList();
  }

  window.toggleCategory = function (head) {
    head.parentElement.classList.toggle('open');
  };

  window.expandAllTags = function () {
    document.querySelectorAll('.pa-tag-category').forEach(el => el.classList.add('open'));
  };

  window.filterTagList = function () {
    const kw = document.getElementById('tagSearchInput').value.trim().toLowerCase();
    document.querySelectorAll('.pa-tag-category').forEach(cat => {
      const tags = cat.querySelectorAll('.pa-tag-item');
      let hasVisible = false;
      tags.forEach(tag => {
        const visible = !kw || tag.dataset.tag.toLowerCase().includes(kw);
        tag.style.display = visible ? 'inline-flex' : 'none';
        if (visible) hasVisible = true;
      });
      cat.style.display = hasVisible ? 'block' : 'none';
      if (hasVisible) cat.classList.add('open');
    });
  };

  function isTagActive(cat, tag) {
    return activeFilters[cat] && activeFilters[cat].has(tag);
  }

  window.toggleTag = function (el) {
    const cat = el.dataset.cat;
    const tag = el.dataset.tag;
    if (!activeFilters[cat]) activeFilters[cat] = new Set();
    if (activeFilters[cat].has(tag)) {
      activeFilters[cat].delete(tag);
      if (activeFilters[cat].size === 0) delete activeFilters[cat];
    } else {
      activeFilters[cat].add(tag);
    }
    renderTagFilter();
    renderActiveRules();
    applyFilters();
  };

  function renderActiveRules() {
    const body = document.getElementById('activeRulesBody');
    const entries = [];
    Object.entries(activeFilters).forEach(([cat, tags]) => {
      tags.forEach(tag => entries.push({ cat, tag }));
    });
    if (entries.length === 0) {
      body.innerHTML = '<span class="pa-empty-rule">暂无筛选条件</span>';
      return;
    }
    body.innerHTML = entries.map(({ cat, tag }) => `
      <span class="pa-rule-chip">
        ${escapeHtml(tag)}
        <button onclick="removeRule('${escapeHtml(cat)}', '${escapeHtml(tag)}')">✕</button>
      </span>
    `).join('');
  }

  window.removeRule = function (cat, tag) {
    if (activeFilters[cat]) {
      activeFilters[cat].delete(tag);
      if (activeFilters[cat].size === 0) delete activeFilters[cat];
    }
    renderTagFilter();
    renderActiveRules();
    applyFilters();
  };

  window.resetFilters = function () {
    activeFilters = {};
    keywordFilter = '';
    document.getElementById('tagSearchInput').value = '';
    document.getElementById('resultKeywordInput').value = '';
    renderTagFilter();
    renderActiveRules();
    applyFilters();
  };

  function scaleToBase(mockCount) {
    return Math.round(mockCount * BASE_TOTAL / BASE_ENTERPRISES.length);
  }

  function applyFilters() {
    // 收集所有已选标签，统一按 AND 过滤：企业必须同时命中所有已选标签（含同维度多标签的交集）
    const requiredTags = new Set();
    Object.values(activeFilters).forEach(set => set.forEach(t => requiredTags.add(t)));

    filteredEnterprises = requiredTags.size === 0
      ? []
      : BASE_ENTERPRISES.filter(ent => {
          for (const tag of requiredTags) {
            if (!ent.tags.includes(tag)) return false;
          }
          return true;
        });
    updateSummary();
    filterResultTable(false);
  }

  window.filterResultTable = function (fromInput = true) {
    if (fromInput) keywordFilter = document.getElementById('resultKeywordInput').value.trim().toLowerCase();
    let data = filteredEnterprises;
    if (keywordFilter) {
      data = data.filter(e => e.name.toLowerCase().includes(keywordFilter) || e.tags.some(t => t.toLowerCase().includes(keywordFilter)));
    }
    data = [...data].sort((a, b) => b.score - a.score);
    renderResultTable(data);
  };

  function computeSummary() {
    const requiredTags = new Set();
    Object.values(activeFilters).forEach(set => set.forEach(t => requiredTags.add(t)));
    if (requiredTags.size === 0) return 0;

    let count = 0;
    for (let i = 0; i < BASE_ENTERPRISES.length; i++) {
      const ent = BASE_ENTERPRISES[i];
      let matched = true;
      for (const tag of requiredTags) {
        if (!ent.tags.includes(tag)) { matched = false; break; }
      }
      if (matched) count++;
    }
    return scaleToBase(count);
  }

  function updateSummary() {
    const filter = computeSummary();
    const filterRate = ((filter / BASE_TOTAL) * 100).toFixed(2);

    animateNumber('filterCount', filter, 250);
    document.getElementById('filterRate').textContent = filterRate + '%';
    document.getElementById('filterProgress').style.width = Math.min(100, parseFloat(filterRate)) + '%';
  }

  function animateNumber(elId, target, duration) {
    const el = document.getElementById(elId);
    if (!el) return;
    const currentText = el.childNodes[0] ? el.childNodes[0].textContent : '0';
    const current = parseInt(currentText.replace(/[^0-9]/g, ''), 10) || 0;
    if (current === target) return;
    const start = performance.now();
    function step(now) {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      const val = Math.round(current + (target - current) * ease);
      el.childNodes[0].nodeValue = fmtNum(val) + ' ';
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function renderResultTable(data) {
    const tbody = document.getElementById('resultTableBody');
    const displayData = data.slice(0, 50);
    if (displayData.length === 0) {
      const emptyTitle = Object.keys(activeFilters).length === 0
        ? '请在左侧 12 大类标签库中选择至少一个标签开始组合过滤'
        : '当前标签组合下暂无匹配企业，请尝试减少筛选条件';
      tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><div class="empty-state-icon">🔍</div><div class="empty-state-title">${emptyTitle}</div></div></td></tr>`;
      document.getElementById('resultTableFootnote').textContent = '';
      return;
    }
    tbody.innerHTML = displayData.map((e, i) => `
      <tr>
        <td class="pa-col-check"><input type="checkbox" class="pa-result-check" value="${e.id}" aria-label="选择 ${escapeHtml(e.name)}"></td>
        <td class="pa-col-rank"><span class="pa-rank ${i < 3 ? 'top' : ''}">${i + 1}</span></td>
        <td><div class="pa-ent-name">${escapeHtml(e.name)}</div></td>
        <td>
          <div class="pa-ent-tags">
            ${e.tags.slice(0, 3).map(t => `<span class="tag tag-primary">${escapeHtml(t)}</span>`).join('')}
          </div>
        </td>
        <td class="text-right"><span class="pa-score">${e.score.toFixed(1)} 分</span></td>
        <td class="text-center">
          <button class="btn btn-text btn-sm" onclick="openPortraitDrawer('${e.id}')">12维全景画像</button>
        </td>
      </tr>
    `).join('');
    const foot = data.length > displayData.length ? `已展示前 ${displayData.length} 条，共 ${fmtNum(data.length)} 条` : `共 ${fmtNum(data.length)} 条`;
    document.getElementById('resultTableFootnote').textContent = foot;
  }

  window.exportExcel = function () {
    const checked = Array.from(document.querySelectorAll('#resultTableBody .pa-result-check:checked')).map(cb => getEnterprise(cb.value)).filter(Boolean);
    const list = checked.length ? checked : filteredEnterprises.slice(0, 50);
    if (!list.length) { alert('当前没有可导出的企业'); return; }
    const rows = list.map(e => `${e.name},${e.score.toFixed(1)},${e.tags.join(';')}`);
    const csv = '企业名称,潜力打分,标签\n' + rows.join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = '政策分析初选企业名单.csv';
    a.click();
  };

  /* ===================== 模块2：TOP10 精选 ===================== */

  function renderTop10() {
    const grid = document.getElementById('top10Grid');
    const locked = lockedIds.map(id => getEnterprise(id)).filter(Boolean).sort((a, b) => b.score - a.score);
    grid.innerHTML = locked.map((e, i) => `
      <div class="pa-top10-card selected" data-id="${e.id}" onclick="openPortraitDrawer('${e.id}')">
        <div class="pa-top10-card-header">
          <span class="pa-top10-rank">TOP ${i + 1} 核心攻坚对象</span>
          <span class="pa-top10-score">${e.score.toFixed(1)} 分</span>
        </div>
        <div class="pa-top10-name">${escapeHtml(e.name)}</div>
        <div class="pa-top10-meta-grid">
          <div class="pa-top10-meta-item">
            <div class="pa-top10-meta-label">核心亮点</div>
            <div class="pa-top10-meta-value">${escapeHtml(e.core)}</div>
          </div>
          <div class="pa-top10-meta-item">
            <div class="pa-top10-meta-label">近3年获补</div>
            <div class="pa-top10-meta-value">${e.cityCount} 个城市</div>
          </div>
          <div class="pa-top10-meta-item">
            <div class="pa-top10-meta-label">合规风险排查</div>
            <div class="pa-top10-meta-value text-success">${escapeHtml(e.risk)}</div>
          </div>
        </div>
        <div class="pa-top10-footer">
          <label class="pa-top10-check" onclick="event.stopPropagation()">
            <input type="checkbox" checked onchange="toggleLock('${e.id}')">
            <span>锁定攻坚</span>
          </label>
          <button class="btn btn-text btn-sm" onclick="event.stopPropagation(); openPortraitDrawer('${e.id}')">查看12维全景画像 ↗</button>
        </div>
      </div>
    `).join('');

    // 候选池
    const candidates = [...BASE_ENTERPRISES]
      .filter(e => !lockedIds.includes(e.id))
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
    const cList = document.getElementById('candidateList');
    if (candidates.length === 0) {
      cList.innerHTML = '<span class="text-muted" style="font-size:13px;">暂无可替换候选企业</span>';
    } else {
      cList.innerHTML = candidates.map(e => `
        <div class="pa-candidate-item">
          <div class="pa-candidate-name">${escapeHtml(e.name)}</div>
          <div class="pa-candidate-score">${e.score.toFixed(1)} 分 · ${escapeHtml(e.core)}</div>
          <button class="btn btn-primary btn-sm" onclick="replaceLocked('${e.id}')">替换入池</button>
        </div>
      `).join('');
    }
  }

  window.toggleLock = function (id) {
    if (lockedIds.includes(id)) {
      if (lockedIds.length <= 1) { alert('至少需要保留 1 家攻坚目标'); renderTop10(); return; }
      lockedIds = lockedIds.filter(x => x !== id);
    } else {
      if (lockedIds.length >= 10) { alert('最多锁定 10 家重点攻坚企业'); renderTop10(); return; }
      lockedIds.push(id);
    }
    renderTop10();
    renderSubsidySelect();
    renderSubsidyTable();
  };

  window.replaceLocked = function (id) {
    if (lockedIds.length >= 10) {
      // 替换得分最低的锁定企业
      const lockedSorted = lockedIds.map(x => getEnterprise(x)).filter(Boolean).sort((a, b) => a.score - b.score);
      const lowest = lockedSorted[0];
      lockedIds = lockedIds.filter(x => x !== lowest.id);
    }
    lockedIds.push(id);
    renderTop10();
    renderSubsidySelect();
    renderSubsidyTable();
  };

  /* ===================== 模块3：异地补贴对标 ===================== */

  function renderSubsidySelect() {
    const sel = document.getElementById('subsidyEnterpriseSelect');
    const current = sel.value;
    const locked = lockedIds.map(id => getEnterprise(id)).filter(Boolean).sort((a, b) => b.score - a.score);
    sel.innerHTML = `<option value="">显示全部 ${locked.length} 家企业获补履历</option>` +
      locked.map(e => `<option value="${e.id}">${escapeHtml(e.name)}</option>`).join('');
    sel.value = current;
  }

  window.renderSubsidyTable = function () {
    const sel = document.getElementById('subsidyEnterpriseSelect');
    const entId = sel.value;
    const locked = new Set(lockedIds);
    let records = SUBSIDY_RECORDS.filter(r => locked.has(r.entId));
    if (entId) records = records.filter(r => r.entId === entId);
    const tbody = document.getElementById('subsidyTableBody');
    if (records.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><div class="empty-state-icon">📄</div><div class="empty-state-title">暂无获补履历</div></div></td></tr>`;
      return;
    }
    tbody.innerHTML = records.map(r => `
      <tr>
        <td>${escapeHtml(getEnterprise(r.entId).name)}</td>
        <td><span class="tag tag-default">${escapeHtml(r.city)}</span></td>
        <td>${escapeHtml(r.project)}</td>
        <td class="text-right" style="color:var(--danger);font-weight:600;">${fmtNum(r.amount)} 万元</td>
        <td class="text-center">${r.year}</td>
      </tr>
    `).join('');
  };

  function renderCompetitor() {
    const target = lockedIds.map(id => getEnterprise(id)).filter(Boolean).sort((a, b) => b.score - a.score)[0];
    document.getElementById('competitorTarget').innerHTML =
      `对标分析基准企业：<strong>${target ? escapeHtml(target.name) : '-'}</strong>（${target ? escapeHtml(target.core) : ''}）`;

    document.getElementById('competitorList').innerHTML = COMPETITOR_DATA.map(c => `
      <div class="pa-competitor-item">
        <div class="pa-competitor-city">
          <span>对标城市：${escapeHtml(c.city)}</span>
          ${c.gap !== null ? `<span class="pa-competitor-gap">补贴落差：${fmtNum(c.gap)} 万</span>` : `<span class="pa-competitor-gap up">${escapeHtml(c.type)}</span>`}
        </div>
        <div class="pa-competitor-desc">${escapeHtml(c.desc)}</div>
      </div>
    `).join('');

    document.getElementById('competitorConclusion').innerHTML =
      '💡 智能对标结论：建议前海推出“异地获补项目 1:1 配套 + 算力券补贴 + 首航首飞”综合政策包，重点弥补杭州、合肥在航线试飞及链主奖励方面的补贴落差。';
  }

  window.autoDraftFromGap = function () {
    switchStep(4);
  };

  /* ===================== 模块4：政策建议生成器 ===================== */

  function renderPolicyClauses() {
    const container = document.getElementById('policyClauses');
    container.innerHTML = POLICY_CLAUSES.map((c, idx) => `
      <div class="pa-policy-clause">
        <div class="pa-policy-clause-head">
          <input type="checkbox" id="clause-${c.id}" ${c.checked ? 'checked' : ''} onchange="onClauseChange('${c.id}')">
          <label class="pa-policy-clause-title" for="clause-${c.id}">${escapeHtml(c.title)}</label>
        </div>
        <div class="pa-policy-clause-body">
          ${c.fields.map(f => `
            <div class="pa-policy-field">
              <label>${escapeHtml(f.label)}</label>
              ${f.type === 'select'
                ? `<select id="field-${c.id}-${f.key}" onchange="updatePolicyDraft()">${f.options.map(o => `<option value="${o}" ${o === f.value ? 'selected' : ''}>${o}${f.unit ? '%' : ''}</option>`).join('')}</select>`
                : `<input type="number" id="field-${c.id}-${f.key}" value="${f.value}" oninput="updatePolicyDraft()">`}
              ${f.type !== 'select' && f.unit ? `<span class="unit">${escapeHtml(f.unit)}</span>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
  }

  window.onClauseChange = function (id) {
    const clause = POLICY_CLAUSES.find(c => c.id === id);
    if (clause) clause.checked = document.getElementById('clause-' + id).checked;
    updatePolicyDraft();
  };

  window.updatePolicyDraft = function () {
    const title = '《前海针对低空与AI高潜力企业的专项定向招商扶持措施草案》';
    let body = '';
    POLICY_CLAUSES.forEach((c, idx) => {
      if (!c.checked) return;
      const vals = {};
      c.fields.forEach(f => {
        const el = document.getElementById('field-' + c.id + '-' + f.key);
        vals[f.key] = el ? el.value : f.value;
      });
      body += `\n第${idx + 1}条：${c.draft(vals)}\n`;
    });

    const intro = '为抢抓低空经济、人工智能与具身智能机器人产业发展窗口期，吸引高潜力企业落户前海，结合异地补贴对标落差与企业实际缺口，制定本专项扶持措施。';
    const draftEl = document.getElementById('policyDraft');
    draftEl.innerHTML = `<h4>${escapeHtml(title)}</h4><p>${escapeHtml(intro)}</p><pre style="font-family:inherit;white-space:pre-wrap;line-height:1.9;">${escapeHtml(body).trim()}</pre>`;
  };

  window.copyPolicyDraft = function () {
    const text = document.getElementById('policyDraft').innerText;
    navigator.clipboard.writeText(text).then(() => alert('政策建议稿已复制到剪贴板')).catch(() => alert('复制失败，请手动复制'));
  };

  /* ===================== 模块5：招商沙盘推演 ===================== */

  window.onBudgetChange = function () {
    renderSandbox();
  };

  function renderSandbox() {
    const budget = parseInt(document.getElementById('budgetSlider').value, 10);
    document.getElementById('budgetValue').textContent = fmtNum(budget);
    const count = lockedIds.length || 10;
    const avg = Math.round(budget / count);
    document.getElementById('sandboxEnterpriseCount').textContent = count + ' 家';
    document.getElementById('sandboxAvgSupport').textContent = fmtNum(avg) + ' 万元';

    // 成效公式（参考截图比例）
    const budgetYi = budget / 10000;
    const gdp = budgetYi * 16.33; // 1.5亿预算对应24.5亿GDP增量
    const tax = budgetYi * 2.13;  // 1.5亿预算对应3.2亿税收
    const roi = tax / budgetYi;
    const patents = Math.round(budget * 0.0008);
    const jobs = Math.round(budget * 0.002);

    document.getElementById('sandboxKpis').innerHTML = `
      <div class="pa-sandbox-kpi">
        <div class="pa-sandbox-kpi-label">预测带动 GDP 增量</div>
        <div class="pa-sandbox-kpi-value text-primary">${fmtMoneyYi(gdp)}</div>
      </div>
      <div class="pa-sandbox-kpi">
        <div class="pa-sandbox-kpi-label">预测新增地方税收</div>
        <div class="pa-sandbox-kpi-value text-success">${fmtMoneyYi(tax)}</div>
      </div>
      <div class="pa-sandbox-kpi">
        <div class="pa-sandbox-kpi-label">投资回报率（ROI）</div>
        <div class="pa-sandbox-kpi-value text-warning">1 : ${roi.toFixed(2)}</div>
      </div>
      <div class="pa-sandbox-kpi">
        <div class="pa-sandbox-kpi-label">预测新增专利</div>
        <div class="pa-sandbox-kpi-value">${fmtNum(patents)} 件</div>
      </div>
      <div class="pa-sandbox-kpi">
        <div class="pa-sandbox-kpi-label">预测新增就业岗位</div>
        <div class="pa-sandbox-kpi-value">${fmtNum(jobs)} 人</div>
      </div>
      <div class="pa-sandbox-kpi">
        <div class="pa-sandbox-kpi-label">产业链上下游带动企业</div>
        <div class="pa-sandbox-kpi-value">${fmtNum(Math.round(count * 4.5))} 家</div>
      </div>
    `;

    setTimeout(renderSandboxChart, 0);
  }

  function renderSandboxChart() {
    const dom = document.getElementById('sandboxChart');
    if (!dom) return;
    if (!dom.offsetWidth || !dom.offsetHeight) return;
    if (sandboxChart) sandboxChart.dispose();
    sandboxChart = echarts.init(dom);

    const budget = parseInt(document.getElementById('budgetSlider').value, 10);
    const taxBase = 12;
    const rdBase = 8;
    const tax1 = budget * 0.0003;
    const rd1 = budget * 0.0005;
    const tax2 = tax1 * 2.2;
    const rd2 = rd1 * 2.6;
    const tax3 = tax1 * 4.5;
    const rd3 = rd1 * 5.4;

    sandboxChart.setOption({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { data: ['预估地方纳税贡献', '预估研发与产业投入'], bottom: 0 },
      grid: { left: '3%', right: '4%', bottom: '12%', top: '10%', containLabel: true },
      xAxis: {
        type: 'category',
        data: ['引育前（基线数据）', '引育第1年预测', '引育第2年预测', '引育第3年预测'],
        axisLabel: { color: '#64748B' },
        axisLine: { lineStyle: { color: '#E2E8F0' } },
        axisTick: { show: false }
      },
      yAxis: {
        type: 'value',
        name: '百万元',
        nameTextStyle: { color: '#64748B' },
        axisLabel: { color: '#64748B' },
        splitLine: { lineStyle: { color: '#E2E8F0' } }
      },
      series: [
        {
          name: '预估地方纳税贡献',
          type: 'bar',
          barWidth: 28,
          data: [taxBase, tax1, tax2, tax3],
          itemStyle: { borderRadius: [4, 4, 0, 0], color: '#2563EB' }
        },
        {
          name: '预估研发与产业投入',
          type: 'bar',
          barWidth: 28,
          data: [rdBase, rd1, rd2, rd3],
          itemStyle: { borderRadius: [4, 4, 0, 0], color: '#10B981' }
        }
      ]
    });
  }

  /* ===================== 12 维全景画像抽屉 ===================== */

  window.openPortraitDrawer = function (entId) {
    const e = getEnterprise(entId);
    if (!e) return;
    document.getElementById('portraitDrawerTitle').textContent = e.name + ' · 12维全景画像';

    // 生成雷达图数据（基于企业 ID 做确定性伪随机）
    const seed = entId.slice(-3);
    const values = PORTRAIT_DIMENSIONS.map((_, i) => {
      const base = 50 + ((parseInt(seed, 36) + i * 7) % 45);
      const boost = i === 0 ? e.rdGrowth : (i === 1 ? e.ssGrowth : (i === 6 ? 70 : 0));
      return Math.min(100, Math.round(base + boost * 0.3));
    });

    document.getElementById('portraitDrawerBody').innerHTML = `
      <div class="pa-portrait-section">
        <div class="pa-portrait-section-title">基础信息与核心指标</div>
        <div class="pa-portrait-info-grid">
          <div class="pa-portrait-info-item"><span class="pa-portrait-info-label">产业链角色</span><span class="pa-portrait-info-value">${escapeHtml(e.chainRole)}</span></div>
          <div class="pa-portrait-info-item"><span class="pa-portrait-info-label">核心亮点</span><span class="pa-portrait-info-value">${escapeHtml(e.core)}</span></div>
          <div class="pa-portrait-info-item"><span class="pa-portrait-info-label">营收规模</span><span class="pa-portrait-info-value">${fmtMoneyWan(e.revenue)}</span></div>
          <div class="pa-portrait-info-item"><span class="pa-portrait-info-label">专利持有</span><span class="pa-portrait-info-value">${e.patent} 件</span></div>
          <div class="pa-portrait-info-item"><span class="pa-portrait-info-label">研发增幅</span><span class="pa-portrait-info-value">${e.rdGrowth}%</span></div>
          <div class="pa-portrait-info-item"><span class="pa-portrait-info-label">社保增速</span><span class="pa-portrait-info-value">${e.ssGrowth}%</span></div>
          <div class="pa-portrait-info-item"><span class="pa-portrait-info-label">融资频次</span><span class="pa-portrait-info-value">${e.financeCount} 次</span></div>
          <div class="pa-portrait-info-item"><span class="pa-portrait-info-label">合规风险</span><span class="pa-portrait-info-value text-success">${escapeHtml(e.risk)}</span></div>
        </div>
      </div>
      <div class="pa-portrait-section">
        <div class="pa-portrait-section-title">12 维能力雷达</div>
        <div id="portraitRadar" class="pa-portrait-radar"></div>
      </div>
      <div class="pa-portrait-section">
        <div class="pa-portrait-section-title">股权结构（前五大股东示意）</div>
        <div class="pa-portrait-list">
          <div class="pa-portrait-list-item">第一大股东：创始人/核心团队（持股约 42%）</div>
          <div class="pa-portrait-list-item">第二大股东：产业战略投资基金（持股约 23%）</div>
          <div class="pa-portrait-list-item">第三大股东：地方国资平台（持股约 15%）</div>
          <div class="pa-portrait-list-item">第四大股东：员工持股平台（持股约 12%）</div>
          <div class="pa-portrait-list-item">第五大股东：市场化风投机构（持股约 8%）</div>
        </div>
      </div>
      <div class="pa-portrait-section">
        <div class="pa-portrait-section-title">人才梯队</div>
        <div class="pa-portrait-list">
          <div class="pa-portrait-list-item">研发人员占比：约 ${35 + (e.patent % 20)}%</div>
          <div class="pa-portrait-list-item">硕士及以上占比：约 ${18 + (e.financeCount * 3)}%</div>
          <div class="pa-portrait-list-item">近三年核心人才流失率：低于 8%</div>
        </div>
      </div>
      <div class="pa-portrait-section">
        <div class="pa-portrait-section-title">经营异动监测</div>
        <div class="pa-portrait-list">
          <div class="pa-portrait-list-item">近 12 个月无重大工商变更、股权冻结或质押记录</div>
          <div class="pa-portrait-list-item">社保缴纳人数连续 ${e.ssGrowth > 15 ? 8 : 5} 个月保持正增长</div>
          <div class="pa-portrait-list-item">知识产权申请量近 1 年同比增长 ${e.rdGrowth - 5}%</div>
        </div>
      </div>
    `;

    document.getElementById('portraitOverlay').classList.add('open');
    document.getElementById('portraitDrawer').classList.add('open');

    setTimeout(() => {
      const radarDom = document.getElementById('portraitRadar');
      if (!radarDom) return;
      if (portraitChart) portraitChart.dispose();
      portraitChart = echarts.init(radarDom);
      portraitChart.setOption({
        tooltip: {},
        radar: {
          indicator: PORTRAIT_DIMENSIONS.map(d => ({ name: d, max: 100 })),
          radius: '65%',
          axisName: { color: '#64748B', fontSize: 11 },
          splitArea: { areaStyle: { color: ['#F8FAFC', '#FFFFFF'] } }
        },
        series: [{
          type: 'radar',
          data: [{
            value: values,
            name: '企业能力评估',
            areaStyle: { color: 'rgba(37, 99, 235, 0.2)' },
            lineStyle: { color: '#2563EB', width: 2 },
            itemStyle: { color: '#2563EB' }
          }]
        }]
      });
    }, 60);
  };

  window.closePortraitDrawer = function () {
    document.getElementById('portraitOverlay').classList.remove('open');
    document.getElementById('portraitDrawer').classList.remove('open');
  };

  /* ===================== 导出/全局操作 ===================== */

  window.exportPolicyReport = function () {
    const locked = lockedIds.map(id => getEnterprise(id)).filter(Boolean);
    const lines = locked.map((e, i) => `${i + 1}. ${e.name}（${e.score.toFixed(1)}分）`);
    const text = '政策分析报告\n\n锁定攻坚目标（' + locked.length + '家）：\n' + lines.join('\n') + '\n\n可点击“导出名单 Excel”或“导出 PDF”获取详细材料。';
    const blob = new Blob(['\ufeff' + text], { type: 'text/plain;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = '政策分析报告.txt';
    a.click();
  };

  window.exportPdf = function () {
    alert('PDF 导出功能已触发（演示环境：实际需对接后端导出服务）');
  };

  /* ===================== 页面加载入口（模拟异步数据加载） ===================== */

  function startApp() {
    setTimeout(() => {
      init();
      const loader = document.getElementById('paPageLoading');
      if (loader) loader.classList.add('hidden');
    }, 350);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp);
  } else {
    startApp();
  }
})();
