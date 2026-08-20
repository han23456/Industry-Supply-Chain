/**
 * 政策分析第二阶段 - 企业获补履历回测与交叉分析
 * 基于参考页面 "政策分析第二阶段V2.0.html" 复刻
 *
 * 模块职责：
 * 1. 管理当前任务、标签页、搜索、筛选、排序、选中状态
 * 2. 渲染宏观风控统计卡片、企业列表、交叉分析、资金来源分布
 * 3. 提供右侧抽屉（企业履历穿透）与三个弹窗（导入/推送/导出）
 * 4. 模拟与第一阶段的工作流衔接（导入任务、推送风险库、导出报告）
 *
 * 后续迭代建议：
 * - 将硬编码的 tasks / enterprises 数组替换为后端 API
 * - 抽屉内的柱状图与分布图可升级为 ECharts
 * - 表格分页接入真实分页接口
 * - 推送/导出/导入对接真实后端接口
 */

(function () {
  'use strict';

  // ============================================================
  // 1. Mock 数据
  // ============================================================

  /** 分析任务列表 */
  const tasks = [
    {
      id: 'TASK-2026-001',
      name: '低空经济产业 200 家 - 2026Q2 回测分析',
      sourceType: '通道 A：第一阶段带入',
      count: 200,
      window: '2021-2025 (5年)'
    },
    {
      id: 'TASK-2026-002',
      name: '人工智能链主与关联企业 80 家交叉分析',
      sourceType: '通道 B：外部 Excel 导入',
      count: 80,
      window: '2021-2025 (5年)'
    }
  ];

  /** 企业获补履历数据 */
  const enterprises = [
    {
      id: '91440300MA5EFFXX01',
      name: '深圳市前海智飞科技有限公司',
      sector: '无人机整机制造',
      regCapital: '8,000 万元',
      paidInCapital: '6,500 万元',
      employees: 420,
      revenue2025: '3.2 亿元',
      taxLevel: 'A级',
      litigations: 1,
      totalCount5y: 5,
      totalAmount5y: 2850,
      cityCount: 3,
      cityAmount: 2150,
      externalCount: 2,
      externalAmount: 700,
      latestYear: 2025,
      isHighFreq: true,
      isLargeAmount: true,
      hasExternal: true,
      subsidies: [
        { id: 'sub-1', year: 2025, name: '低空经济产业扶持资金', dept: '深圳市交通运输局', scope: '市级', region: '深圳市', amount: 800, category: '产业扶持' },
        { id: 'sub-2', year: 2024, name: '战略性新兴产业专项资金', dept: '深圳市发展和改革委员会', scope: '市级', region: '深圳市', amount: 950, category: '产业扶持' },
        { id: 'sub-3', year: 2024, name: '智能制造技改补贴', dept: '广州市工业和信息化局', scope: '外地', region: '广州市', amount: 450, category: '技改补贴' },
        { id: 'sub-4', year: 2023, name: '高新技术企业认定奖励', dept: '深圳市科技创新委员会', scope: '市级', region: '深圳市', amount: 400, category: '资质奖励' },
        { id: 'sub-5', year: 2023, name: '专精特新企业补贴', dept: '北京市经济和信息化局', scope: '外地', region: '北京市', amount: 250, category: '资质奖励' }
      ],
      trendData: [
        { year: 2021, subsidy: 0, revenue: 8000 },
        { year: 2022, subsidy: 0, revenue: 12000 },
        { year: 2023, subsidy: 650, revenue: 18000 },
        { year: 2024, subsidy: 1400, revenue: 25000 },
        { year: 2025, subsidy: 800, revenue: 32000 }
      ]
    },
    {
      id: '91440300MA5FYYY02',
      name: '深圳云翼航空科技有限公司',
      sector: '低空运营服务',
      regCapital: '3,000 万元',
      paidInCapital: '2,000 万元',
      employees: 180,
      revenue2025: '1.1 亿元',
      taxLevel: 'A级',
      litigations: 0,
      totalCount5y: 4,
      totalAmount5y: 920,
      cityCount: 2,
      cityAmount: 620,
      externalCount: 2,
      externalAmount: 300,
      latestYear: 2025,
      isHighFreq: true,
      isLargeAmount: false,
      hasExternal: true,
      subsidies: [
        { id: 'sub-6', year: 2025, name: '低空航线运营补贴', dept: '深圳市交通运输局', scope: '市级', region: '深圳市', amount: 320, category: '运营补贴' },
        { id: 'sub-7', year: 2024, name: '智慧物流示范项目补贴', dept: '深圳市发展和改革委员会', scope: '市级', region: '深圳市', amount: 300, category: '项目补贴' },
        { id: 'sub-8', year: 2023, name: '苏州市低空经济示范应用补贴', dept: '苏州市发展和改革委员会', scope: '外地', region: '苏州市', amount: 200, category: '示范应用' },
        { id: 'sub-9', year: 2023, name: '杭州市物流数字化补贴', dept: '杭州市商务局', scope: '外地', region: '杭州市', amount: 100, category: '数字化补贴' }
      ],
      trendData: [
        { year: 2021, subsidy: 0, revenue: 3000 },
        { year: 2022, subsidy: 0, revenue: 5000 },
        { year: 2023, subsidy: 300, revenue: 7000 },
        { year: 2024, subsidy: 300, revenue: 9000 },
        { year: 2025, subsidy: 320, revenue: 11000 }
      ]
    },
    {
      id: '91440300MA5GZZZ03',
      name: '深圳海芯机器人有限公司',
      sector: '具身智能本体',
      regCapital: '5,000 万元',
      paidInCapital: '4,200 万元',
      employees: 260,
      revenue2025: '2.8 亿元',
      taxLevel: 'A级',
      litigations: 0,
      totalCount5y: 3,
      totalAmount5y: 1680,
      cityCount: 2,
      cityAmount: 1680,
      externalCount: 0,
      externalAmount: 0,
      latestYear: 2025,
      isHighFreq: true,
      isLargeAmount: true,
      hasExternal: false,
      subsidies: [
        { id: 'sub-10', year: 2025, name: '机器人产业高质量发展资金', dept: '深圳市工业和信息化局', scope: '市级', region: '深圳市', amount: 980, category: '产业扶持' },
        { id: 'sub-11', year: 2024, name: '首台（套）重大技术装备奖补', dept: '深圳市工业和信息化局', scope: '市级', region: '深圳市', amount: 500, category: '首台套奖补' },
        { id: 'sub-12', year: 2023, name: '高新技术企业认定奖励', dept: '深圳市科技创新委员会', scope: '市级', region: '深圳市', amount: 200, category: '资质奖励' }
      ],
      trendData: [
        { year: 2021, subsidy: 0, revenue: 6000 },
        { year: 2022, subsidy: 200, revenue: 10000 },
        { year: 2023, subsidy: 200, revenue: 16000 },
        { year: 2024, subsidy: 500, revenue: 22000 },
        { year: 2025, subsidy: 980, revenue: 28000 }
      ]
    },
    {
      id: '91440300MA5HAAA04',
      name: '深圳链芯半导体有限公司',
      sector: '机器人核心零部件',
      regCapital: '2,000 万元',
      paidInCapital: '1,500 万元',
      employees: 95,
      revenue2025: '0.6 亿元',
      taxLevel: 'B级',
      litigations: 2,
      totalCount5y: 2,
      totalAmount5y: 320,
      cityCount: 1,
      cityAmount: 120,
      externalCount: 1,
      externalAmount: 200,
      latestYear: 2024,
      isHighFreq: false,
      isLargeAmount: false,
      hasExternal: true,
      subsidies: [
        { id: 'sub-13', year: 2024, name: '集成电路产业扶持资金', dept: '深圳市科技创新委员会', scope: '市级', region: '深圳市', amount: 120, category: '产业扶持' },
        { id: 'sub-14', year: 2023, name: '无锡市集成电路专项资金', dept: '无锡市工业和信息化局', scope: '外地', region: '无锡市', amount: 200, category: '产业扶持' }
      ],
      trendData: [
        { year: 2021, subsidy: 0, revenue: 1500 },
        { year: 2022, subsidy: 0, revenue: 2500 },
        { year: 2023, subsidy: 200, revenue: 3800 },
        { year: 2024, subsidy: 120, revenue: 5200 },
        { year: 2025, subsidy: 0, revenue: 6000 }
      ]
    },
    {
      id: '91440300MA5IBBB05',
      name: '深圳蓝海生物医药有限公司',
      sector: '创新药研发',
      regCapital: '1.2 亿元',
      paidInCapital: '8,000 万元',
      employees: 350,
      revenue2025: '0.9 亿元',
      taxLevel: 'A级',
      litigations: 0,
      totalCount5y: 6,
      totalAmount5y: 4200,
      cityCount: 4,
      cityAmount: 3600,
      externalCount: 2,
      externalAmount: 600,
      latestYear: 2025,
      isHighFreq: true,
      isLargeAmount: true,
      hasExternal: true,
      subsidies: [
        { id: 'sub-15', year: 2025, name: '生物医药产业扶持资金', dept: '深圳市发展和改革委员会', scope: '市级', region: '深圳市', amount: 1500, category: '产业扶持' },
        { id: 'sub-16', year: 2025, name: '新药临床批件奖励', dept: '深圳市科技创新委员会', scope: '市级', region: '深圳市', amount: 800, category: '资质奖励' },
        { id: 'sub-17', year: 2024, name: '上海市生物医药创新补贴', dept: '上海市经济和信息化委员会', scope: '外地', region: '上海市', amount: 400, category: '产业扶持' },
        { id: 'sub-18', year: 2024, name: '国家科技重大专项配套', dept: '深圳市科技创新委员会', scope: '市级', region: '深圳市', amount: 1000, category: '项目配套' },
        { id: 'sub-19', year: 2023, name: '广州市生物医药研发补助', dept: '广州市科学技术局', scope: '外地', region: '广州市', amount: 200, category: '研发补助' },
        { id: 'sub-20', year: 2023, name: '高新技术企业认定奖励', dept: '深圳市科技创新委员会', scope: '市级', region: '深圳市', amount: 300, category: '资质奖励' }
      ],
      trendData: [
        { year: 2021, subsidy: 300, revenue: 2000 },
        { year: 2022, subsidy: 500, revenue: 3500 },
        { year: 2023, subsidy: 500, revenue: 5000 },
        { year: 2024, subsidy: 1400, revenue: 7000 },
        { year: 2025, subsidy: 1500, revenue: 9000 }
      ]
    }
  ];

  /** 资金来源分布数据 */
  const deptDistribution = [
    { name: '深圳市科技创新委员会', count: 12, amount: 6200 },
    { name: '深圳市发展和改革委员会', count: 8, amount: 4800 },
    { name: '深圳市工业和信息化局', count: 6, amount: 2400 },
    { name: '深圳市交通运输局 / 区级', count: 4, amount: 1000 }
  ];

  /** 外地地区分布数据 */
  const regionDistribution = [
    { name: '广州市', count: 5, amount: 1250 },
    { name: '北京市', count: 3, amount: 820 },
    { name: '苏州市', count: 2, amount: 680 },
    { name: '其他城市', count: 4, amount: 1050 }
  ];

  // ============================================================
  // 2. 状态管理
  // ============================================================

  const state = {
    activeTab: 'list',
    activeTaskId: 'TASK-2026-001',
    searchQuery: '',
    filterHighFreq: false,
    filterLargeAmount: false,
    filterExternal: false,
    filterLitigation: false,
    sortBy: 'amount_desc',
    selectedIds: [],
    inspectedEnterpriseId: null,
    showImportModal: false,
    showPushModal: false,
    showExportModal: false,
    importChannel: 'A',
    pushSuccessMsg: ''
  };

  // ============================================================
  // 3. DOM 元素引用缓存
  // ============================================================

  const dom = {
    taskSelect: document.getElementById('taskSelect'),
    taskSourceType: document.getElementById('taskSourceType'),
    taskCount: document.getElementById('taskCount'),
    taskWindow: document.getElementById('taskWindow'),
    statCoverage: document.getElementById('statCoverage'),
    statCoverageBar: document.getElementById('statCoverageBar'),
    statHighFreq: document.getElementById('statHighFreq'),
    statLargeAmount: document.getElementById('statLargeAmount'),
    statExternal: document.getElementById('statExternal'),
    statExternalBar: document.getElementById('statExternalBar'),
    tabs: document.querySelectorAll('.ps2-tab'),
    tabPanels: {
      list: document.getElementById('tabPanelList'),
      cross: document.getElementById('tabPanelCross'),
      dept: document.getElementById('tabPanelDept')
    },
    searchInput: document.getElementById('searchInput'),
    filterChips: document.querySelectorAll('.ps2-filter-chip'),
    sortSelect: document.getElementById('sortSelect'),
    batchBar: document.getElementById('batchBar'),
    selectedCount: document.getElementById('selectedCount'),
    tableBody: document.getElementById('enterpriseTableBody'),
    selectAllCheckbox: document.getElementById('selectAllCheckbox'),
    drawerOverlay: document.getElementById('drawerOverlay'),
    drawerTitle: document.getElementById('drawerTitle'),
    drawerBody: document.getElementById('drawerBody'),
    importModal: document.getElementById('importModal'),
    pushModal: document.getElementById('pushModal'),
    exportModal: document.getElementById('exportModal'),
    pushSuccessMsg: document.getElementById('pushSuccessMsg'),
    pushModalBody: document.getElementById('pushModalBody'),
    exportReportCount: document.getElementById('exportReportCount')
  };

  // ============================================================
  // 4. 初始化入口
  // ============================================================

  /**
   * 页面初始化
   */
  function init() {
    renderTaskOptions();
    bindEvents();
    updateTaskMeta();
    renderStats();
    updateTabVisibility();
    renderTable();
    renderCrossAnalysis();
    renderDeptDistribution();
  }

  // ============================================================
  // 5. 事件绑定
  // ============================================================

  /**
   * 绑定所有交互事件
   */
  function bindEvents() {
    // 任务切换
    if (dom.taskSelect) {
      dom.taskSelect.addEventListener('change', function () {
        state.activeTaskId = dom.taskSelect.value;
        updateTaskMeta();
        // 切换任务时清空选中并重新渲染
        state.selectedIds = [];
        renderTable();
        renderStats();
      });
    }

    // 标签页切换
    dom.tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        setActiveTab(tab.dataset.tab);
      });
    });

    // 搜索
    if (dom.searchInput) {
      dom.searchInput.addEventListener('input', function () {
        state.searchQuery = dom.searchInput.value.trim().toLowerCase();
        renderTable();
      });
    }

    // 筛选标签
    dom.filterChips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        const filterKey = chip.dataset.filter;
        state[filterKey] = !state[filterKey];
        chip.classList.toggle('is-active', state[filterKey]);
        renderTable();
      });
    });

    // 排序
    if (dom.sortSelect) {
      dom.sortSelect.addEventListener('change', function () {
        state.sortBy = dom.sortSelect.value;
        renderTable();
      });
    }

    // 全选
    if (dom.selectAllCheckbox) {
      dom.selectAllCheckbox.addEventListener('change', function () {
        toggleSelectAll(dom.selectAllCheckbox.checked);
      });
    }
  }

  // ============================================================
  // 6. 任务与统计渲染
  // ============================================================

  /**
   * 渲染任务下拉选项
   */
  function renderTaskOptions() {
    if (!dom.taskSelect) return;

    dom.taskSelect.innerHTML = '';
    tasks.forEach(function (task) {
      const option = document.createElement('option');
      option.value = task.id;
      option.innerText = task.name;
      if (task.id === state.activeTaskId) option.selected = true;
      dom.taskSelect.appendChild(option);
    });
  }

  /**
   * 更新任务元信息展示
   */
  function updateTaskMeta() {
    const task = tasks.find(function (t) { return t.id === state.activeTaskId; }) || tasks[0];
    if (dom.taskSourceType) dom.taskSourceType.innerText = task.sourceType;
    if (dom.taskCount) dom.taskCount.innerText = task.count + ' 家';
    if (dom.taskWindow) dom.taskWindow.innerText = task.window;
  }

  /**
   * 渲染宏观风控统计卡片
   */
  function renderStats() {
    const filtered = getFilteredEnterprises();
    const total = enterprises.length;

    // 覆盖率：有补贴记录的企业占比
    const coveredCount = filtered.filter(function (e) { return e.totalCount5y > 0; }).length;
    const coverageRate = total > 0 ? Math.round((coveredCount / total) * 100) : 0;

    // 高频获补（3+）
    const highFreqCount = filtered.filter(function (e) { return e.isHighFreq; }).length;

    // 千万级大额
    const largeAmountCount = filtered.filter(function (e) { return e.isLargeAmount; }).length;

    // 跨城获补
    const externalCount = filtered.filter(function (e) { return e.hasExternal; }).length;
    const externalRate = total > 0 ? Math.round((externalCount / total) * 100) : 0;

    if (dom.statCoverage) dom.statCoverage.innerText = coverageRate + '%';
    if (dom.statCoverageBar) dom.statCoverageBar.style.width = coverageRate + '%';
    if (dom.statHighFreq) dom.statHighFreq.innerText = highFreqCount + ' 家';
    if (dom.statLargeAmount) dom.statLargeAmount.innerText = largeAmountCount + ' 家';
    if (dom.statExternal) dom.statExternal.innerText = externalCount + ' 家 (' + externalRate + '%)';
    if (dom.statExternalBar) dom.statExternalBar.style.width = externalRate + '%';
  }

  // ============================================================
  // 7. 标签页管理
  // ============================================================

  /**
   * 设置当前激活标签页
   * @param {string} tabId 标签页 ID
   */
  function setActiveTab(tabId) {
    state.activeTab = tabId;
    updateTabVisibility();
  }

  /**
   * 更新标签页按钮与面板显隐
   */
  function updateTabVisibility() {
    dom.tabs.forEach(function (tab) {
      tab.classList.toggle('is-active', tab.dataset.tab === state.activeTab);
    });

    Object.keys(dom.tabPanels).forEach(function (key) {
      const panel = dom.tabPanels[key];
      if (panel) {
        panel.classList.toggle('ps2-hidden', key !== state.activeTab);
      }
    });
  }

  // ============================================================
  // 8. 企业列表过滤、排序与渲染
  // ============================================================

  /**
   * 获取过滤并排序后的企业列表
   * @returns {Array} 企业列表
   */
  function getFilteredEnterprises() {
    let result = enterprises.filter(function (e) {
      // 搜索过滤
      if (state.searchQuery) {
        const query = state.searchQuery;
        const matchName = e.name.toLowerCase().indexOf(query) !== -1;
        const matchCode = e.id.toLowerCase().indexOf(query) !== -1;
        const matchSector = e.sector.toLowerCase().indexOf(query) !== -1;
        if (!matchName && !matchCode && !matchSector) return false;
      }

      // 筛选标签
      if (state.filterHighFreq && !e.isHighFreq) return false;
      if (state.filterLargeAmount && !e.isLargeAmount) return false;
      if (state.filterExternal && !e.hasExternal) return false;
      if (state.filterLitigation && e.litigations === 0) return false;

      return true;
    });

    // 排序
    result.sort(function (a, b) {
      switch (state.sortBy) {
        case 'amount_desc':
          return b.totalAmount5y - a.totalAmount5y;
        case 'amount_asc':
          return a.totalAmount5y - b.totalAmount5y;
        case 'count_desc':
          return b.totalCount5y - a.totalCount5y;
        case 'year_desc':
          return b.latestYear - a.latestYear;
        default:
          return 0;
      }
    });

    return result;
  }

  /**
   * 渲染企业列表表格
   */
  function renderTable() {
    if (!dom.tableBody) return;

    const filtered = getFilteredEnterprises();
    dom.tableBody.innerHTML = '';

    if (filtered.length === 0) {
      dom.tableBody.innerHTML = '<tr><td colspan="9" class="ps2-text-center" style="padding: 40px; color: var(--ps2-slate-400);">暂无符合条件的企业</td></tr>';
      updateBatchBar();
      updateSelectAllState(false);
      return;
    }

    filtered.forEach(function (e, index) {
      const tr = document.createElement('tr');
      tr.dataset.id = e.id;
      tr.classList.toggle('is-selected', state.selectedIds.indexOf(e.id) !== -1);

      tr.innerHTML =
        '<td class="ps2-text-center"><input type="checkbox" class="ps2-table__checkbox" ' +
          (state.selectedIds.indexOf(e.id) !== -1 ? 'checked' : '') + ' onclick="event.stopPropagation(); toggleSelectOne(\'' + e.id + '\')"></td>' +
        '<td>' +
          '<div class="ps2-enterprise-name">' + escapeHtml(e.name) + '</div>' +
          '<div class="ps2-enterprise-code">' + escapeHtml(e.id) + '</div>' +
        '</td>' +
        '<td><span class="ps2-badge ps2-badge--slate">' + escapeHtml(e.sector) + '</span></td>' +
        '<td class="ps2-text-right"><span class="ps2-badge ' + (e.totalCount5y >= 3 ? 'ps2-badge--purple' : 'ps2-badge--slate') + '">' + e.totalCount5y + ' 次</span></td>' +
        '<td class="ps2-text-right"><span class="ps2-badge ' + (e.totalAmount5y >= 1000 ? 'ps2-badge--emerald' : 'ps2-badge--slate') + '">' + formatAmount(e.totalAmount5y) + ' 万</span></td>' +
        '<td class="ps2-text-center">' +
          '<div class="ps2-badges-group" style="justify-content: center;">' +
            '<span class="ps2-badge ps2-badge--blue">市级 ' + e.cityCount + '</span>' +
            (e.externalCount > 0 ? '<span class="ps2-badge ps2-badge--amber">外地 ' + e.externalCount + '</span>' : '') +
          '</div>' +
        '</td>' +
        '<td>' + renderRiskBadges(e) + '</td>' +
        '<td class="ps2-text-center">' + (e.latestYear || '-') + '</td>' +
        '<td class="ps2-text-center"><button class="ps2-btn ps2-btn--ghost ps2-btn--xs" onclick="event.stopPropagation(); openDrawer(\'' + e.id + '\')">履历穿透</button></td>';

      tr.addEventListener('click', function () {
        openDrawer(e.id);
      });

      dom.tableBody.appendChild(tr);
    });

    updateBatchBar();
    updateSelectAllState(filtered.length > 0 && filtered.every(function (e) { return state.selectedIds.indexOf(e.id) !== -1; }));
  }

  /**
   * 渲染风险标志位标签组
   * @param {Object} e 企业对象
   * @returns {string} HTML 字符串
   */
  function renderRiskBadges(e) {
    const badges = [];
    if (e.isHighFreq) badges.push('<span class="ps2-badge ps2-badge--purple">高频</span>');
    if (e.isLargeAmount) badges.push('<span class="ps2-badge ps2-badge--emerald">大额</span>');
    if (e.hasExternal) badges.push('<span class="ps2-badge ps2-badge--amber">跨城</span>');
    if (e.litigations > 0) badges.push('<span class="ps2-badge ps2-badge--rose">涉诉</span>');
    return badges.length > 0 ? '<div class="ps2-badges-group">' + badges.join('') + '</div>' : '<span class="ps2-text-muted ps2-text-xs">-</span>';
  }

  // ============================================================
  // 9. 选中状态管理
  // ============================================================

  /**
   * 全选/取消全选当前过滤结果
   * @param {boolean} checked 是否选中
   */
  window.toggleSelectAll = function (checked) {
    const filtered = getFilteredEnterprises();

    if (checked) {
      filtered.forEach(function (e) {
        if (state.selectedIds.indexOf(e.id) === -1) {
          state.selectedIds.push(e.id);
        }
      });
    } else {
      filtered.forEach(function (e) {
        const idx = state.selectedIds.indexOf(e.id);
        if (idx !== -1) state.selectedIds.splice(idx, 1);
      });
    }

    renderTable();
  };

  /**
   * 单条勾选/取消勾选
   * @param {string} id 企业 ID
   */
  window.toggleSelectOne = function (id) {
    const idx = state.selectedIds.indexOf(id);
    if (idx === -1) {
      state.selectedIds.push(id);
    } else {
      state.selectedIds.splice(idx, 1);
    }
    renderTable();
  };

  /**
   * 更新批量操作栏
   */
  function updateBatchBar() {
    if (!dom.batchBar || !dom.selectedCount) return;

    if (state.selectedIds.length === 0) {
      dom.batchBar.classList.add('ps2-hidden');
      return;
    }

    dom.batchBar.classList.remove('ps2-hidden');
    dom.selectedCount.innerText = state.selectedIds.length;
  }

  /**
   * 更新全选复选框状态
   * @param {boolean} checked 是否选中
   */
  function updateSelectAllState(checked) {
    if (dom.selectAllCheckbox) {
      dom.selectAllCheckbox.checked = checked;
    }
  }

  // ============================================================
  // 10. 右侧抽屉（企业履历穿透）
  // ============================================================

  /**
   * 打开企业履历抽屉
   * @param {string} id 企业 ID
   */
  window.openDrawer = function (id) {
    const e = enterprises.find(function (item) { return item.id === id; });
    if (!e) return;

    state.inspectedEnterpriseId = id;
    if (dom.drawerTitle) dom.drawerTitle.innerText = escapeHtml(e.name);
    if (dom.drawerBody) dom.drawerBody.innerHTML = buildDrawerContent(e);
    if (dom.drawerOverlay) dom.drawerOverlay.classList.remove('is-hidden');
    document.body.style.overflow = 'hidden';
  };

  /**
   * 关闭抽屉
   */
  window.closeDrawer = function () {
    state.inspectedEnterpriseId = null;
    if (dom.drawerOverlay) dom.drawerOverlay.classList.add('is-hidden');
    document.body.style.overflow = '';
  };

  /**
   * 构建抽屉内容 HTML
   * @param {Object} e 企业对象
   * @returns {string} HTML 字符串
   */
  function buildDrawerContent(e) {
    return (
      '<div class="ps2-profile-grid">' +
        '<div class="ps2-profile-item"><div class="ps2-profile-item__label">注册资本</div><div class="ps2-profile-item__value">' + escapeHtml(e.regCapital) + '</div></div>' +
        '<div class="ps2-profile-item"><div class="ps2-profile-item__label">实缴资本</div><div class="ps2-profile-item__value">' + escapeHtml(e.paidInCapital) + '</div></div>' +
        '<div class="ps2-profile-item"><div class="ps2-profile-item__label">社保人数</div><div class="ps2-profile-item__value">' + e.employees + ' 人</div></div>' +
        '<div class="ps2-profile-item"><div class="ps2-profile-item__label">2025 营收</div><div class="ps2-profile-item__value">' + escapeHtml(e.revenue2025) + '</div></div>' +
        '<div class="ps2-profile-item"><div class="ps2-profile-item__label">纳税等级</div><div class="ps2-profile-item__value">' + escapeHtml(e.taxLevel) + '</div></div>' +
        '<div class="ps2-profile-item"><div class="ps2-profile-item__label">涉诉记录</div><div class="ps2-profile-item__value" style="color: ' + (e.litigations > 0 ? 'var(--ps2-rose-600)' : 'var(--ps2-emerald-600)') + ';">' + (e.litigations > 0 ? e.litigations + ' 条' : '无') + '</div></div>' +
      '</div>' +

      '<div class="ps2-mb-3">' +
        '<h4 class="ps2-chart-title"><i class="fa-solid fa-chart-column" style="color: var(--ps2-blue-600); margin-right: 6px;"></i>获补金额 vs 营收趋势（2021-2025）</h4>' +
        '<div class="ps2-bar-chart">' + buildBarChart(e.trendData) + '</div>' +
        '<div class="ps2-flex ps2-gap-3 ps2-text-sm" style="justify-content: center;">' +
          '<span class="ps2-flex ps2-items-center ps2-gap-1"><span style="width: 10px; height: 10px; background: var(--ps2-blue-600); border-radius: 2px; display: inline-block;"></span> 获补金额（万元）</span>' +
          '<span class="ps2-flex ps2-items-center ps2-gap-1"><span style="width: 10px; height: 10px; background: var(--ps2-emerald-500); border-radius: 2px; display: inline-block;"></span> 营收（万元）</span>' +
        '</div>' +
      '</div>' +

      '<div>' +
        '<h4 class="ps2-chart-title"><i class="fa-solid fa-clock-rotate-left" style="color: var(--ps2-blue-600); margin-right: 6px;"></i>补贴时间轴</h4>' +
        '<div class="ps2-timeline">' + buildTimeline(e.subsidies) + '</div>' +
      '</div>'
    );
  }

  /**
   * 构建柱状图 HTML
   * @param {Array} trendData 趋势数据
   * @returns {string} HTML 字符串
   */
  function buildBarChart(trendData) {
    const maxSubsidy = 2000;
    const maxRevenue = 40000;

    return trendData.map(function (item) {
      const subsidyHeight = Math.max(4, Math.round((item.subsidy / maxSubsidy) * 100));
      const revenueHeight = Math.max(4, Math.round((item.revenue / maxRevenue) * 100));

      return (
        '<div class="ps2-bar-chart__group">' +
          '<div class="ps2-bar-chart__bars">' +
            '<div class="ps2-bar-chart__bar ps2-bar-chart__bar--subsidy" style="height: ' + subsidyHeight + '%;" title="获补 ' + item.subsidy + ' 万"></div>' +
            '<div class="ps2-bar-chart__bar ps2-bar-chart__bar--revenue" style="height: ' + revenueHeight + '%;" title="营收 ' + item.revenue + ' 万"></div>' +
          '</div>' +
          '<span class="ps2-bar-chart__year">' + item.year + '</span>' +
        '</div>'
      );
    }).join('');
  }

  /**
   * 构建补贴时间轴 HTML
   * @param {Array} subsidies 补贴明细
   * @returns {string} HTML 字符串
   */
  function buildTimeline(subsidies) {
    return subsidies.slice().reverse().map(function (sub) {
      const isExternal = sub.scope === '外地';
      return (
        '<div class="ps2-timeline__item">' +
          '<div class="ps2-timeline__dot ' + (isExternal ? 'ps2-timeline__dot--external' : '') + '"></div>' +
          '<div class="ps2-timeline__content">' +
            '<div class="ps2-timeline__header">' +
              '<span class="ps2-timeline__title">' + escapeHtml(sub.name) + '</span>' +
              '<span class="ps2-timeline__amount">' + sub.amount + ' 万元</span>' +
            '</div>' +
            '<div class="ps2-timeline__meta">' +
              '<span class="ps2-badge ' + (isExternal ? 'ps2-badge--amber' : 'ps2-badge--blue') + ' ps2-badge--sm">' + escapeHtml(sub.scope) + '</span> ' +
              escapeHtml(sub.dept) + ' · ' + sub.year + '年 · ' + escapeHtml(sub.category) +
            '</div>' +
          '</div>' +
        '</div>'
      );
    }).join('');
  }

  // ============================================================
  // 11. 交叉分析 Tab 渲染
  // ============================================================

  /**
   * 渲染画像一致性交叉分析
   */
  function renderCrossAnalysis() {
    const panel = dom.tabPanels.cross;
    if (!panel) return;

    // 计算分析指标
    const highFreqCount = enterprises.filter(function (e) { return e.isHighFreq; }).length;
    const largeAmountCount = enterprises.filter(function (e) { return e.isLargeAmount; }).length;
    const externalCount = enterprises.filter(function (e) { return e.hasExternal; }).length;

    // 高频获补中同时大额的占比
    const highFreqAndLarge = enterprises.filter(function (e) { return e.isHighFreq && e.isLargeAmount; }).length;
    const overlapRate1 = highFreqCount > 0 ? Math.round((highFreqAndLarge / highFreqCount) * 100) : 0;

    // 大额中同时跨城的占比
    const largeAndExternal = enterprises.filter(function (e) { return e.isLargeAmount && e.hasExternal; }).length;
    const overlapRate2 = largeAmountCount > 0 ? Math.round((largeAndExternal / largeAmountCount) * 100) : 0;

    // 跨城中同时高频的占比
    const externalAndHighFreq = enterprises.filter(function (e) { return e.hasExternal && e.isHighFreq; }).length;
    const overlapRate3 = externalCount > 0 ? Math.round((externalAndHighFreq / externalCount) * 100) : 0;

    panel.innerHTML =
      '<div class="ps2-analysis-grid">' +
        '<div class="ps2-ai-conclusion">' +
          '<h3 class="ps2-ai-conclusion__title"><i class="fa-solid fa-robot"></i> AI 交叉分析结论</h3>' +
          '<div class="ps2-ai-conclusion__item"><span class="ps2-ai-conclusion__dot"></span> 高频获补企业中大额获补重叠率为 ' + overlapRate1 + '%，存在“高频率 + 高金额”双重聚焦特征。</div>' +
          '<div class="ps2-ai-conclusion__item"><span class="ps2-ai-conclusion__dot"></span> 大额获补企业中跨城获补重叠率为 ' + overlapRate2 + '%，需关注跨区域套利与重复申报风险。</div>' +
          '<div class="ps2-ai-conclusion__item"><span class="ps2-ai-conclusion__dot"></span> 跨城获补企业中高频获补重叠率为 ' + overlapRate3 + '%，建议纳入第三阶段监管风险预警重点名单。</div>' +
        '</div>' +
        '<div class="ps2-matrix">' +
          buildMatrixCard('高频获补画像', highFreqCount + ' 家', [
            { label: '同时大额', value: overlapRate1 },
            { label: '同时跨城', value: externalAndHighFreq > 0 && highFreqCount > 0 ? Math.round((externalAndHighFreq / highFreqCount) * 100) : 0 },
            { label: '涉诉风险', value: enterprises.filter(function (e) { return e.isHighFreq && e.litigations > 0; }).length > 0 && highFreqCount > 0 ? Math.round((enterprises.filter(function (e) { return e.isHighFreq && e.litigations > 0; }).length / highFreqCount) * 100) : 0 }
          ], 'var(--ps2-purple-600)') +
          buildMatrixCard('大额获补画像', largeAmountCount + ' 家', [
            { label: '同时高频', value: overlapRate1 },
            { label: '同时跨城', value: overlapRate2 },
            { label: '涉诉风险', value: enterprises.filter(function (e) { return e.isLargeAmount && e.litigations > 0; }).length > 0 && largeAmountCount > 0 ? Math.round((enterprises.filter(function (e) { return e.isLargeAmount && e.litigations > 0; }).length / largeAmountCount) * 100) : 0 }
          ], 'var(--ps2-emerald-600)') +
          buildMatrixCard('跨城获补画像', externalCount + ' 家', [
            { label: '同时高频', value: overlapRate3 },
            { label: '同时大额', value: largeAndExternal > 0 && externalCount > 0 ? Math.round((largeAndExternal / externalCount) * 100) : 0 },
            { label: '涉诉风险', value: enterprises.filter(function (e) { return e.hasExternal && e.litigations > 0; }).length > 0 && externalCount > 0 ? Math.round((enterprises.filter(function (e) { return e.hasExternal && e.litigations > 0; }).length / externalCount) * 100) : 0 }
          ], 'var(--ps2-amber-600)') +
        '</div>' +
      '</div>';
  }

  /**
   * 构建交叉分析矩阵卡片
   * @param {string} title 卡片标题
   * @param {string} value 主指标值
   * @param {Array} bars 进度条数据
   * @param {string} color 主色
   * @returns {string} HTML 字符串
   */
  function buildMatrixCard(title, value, bars, color) {
    return (
      '<div class="ps2-matrix-card">' +
        '<h4 class="ps2-matrix-card__title"><i class="fa-solid fa-crosshairs" style="color: ' + color + ';"></i>' + escapeHtml(title) + '</h4>' +
        '<div class="ps2-matrix-card__metric"><span class="ps2-matrix-card__value">' + value + '</span></div>' +
        '<div class="ps2-matrix-card__bars">' +
          bars.map(function (bar) {
            return (
              '<div class="ps2-mini-bar">' +
                '<span class="ps2-mini-bar__label">' + escapeHtml(bar.label) + '</span>' +
                '<div class="ps2-mini-bar__track"><div class="ps2-mini-bar__fill" style="width: ' + bar.value + '%; background: ' + color + ';"></div></div>' +
                '<span class="ps2-mini-bar__value">' + bar.value + '%</span>' +
              '</div>'
            );
          }).join('') +
        '</div>' +
      '</div>'
    );
  }

  // ============================================================
  // 12. 资金来源与跨城分布 Tab 渲染
  // ============================================================

  /**
   * 渲染资金来源与跨城分布
   */
  function renderDeptDistribution() {
    const panel = dom.tabPanels.dept;
    if (!panel) return;

    const totalCityAmount = deptDistribution.reduce(function (sum, d) { return sum + d.amount; }, 0);
    const totalExternalAmount = regionDistribution.reduce(function (sum, d) { return sum + d.amount; }, 0);

    panel.innerHTML =
      '<div class="ps2-dept-grid">' +
        '<div class="ps2-card">' +
          '<div class="ps2-card__header"><h3 class="ps2-card__title"><i class="fa-solid fa-building-columns" style="color: var(--ps2-blue-600); margin-right: 6px;"></i>市级部门资金分布</h3><span class="ps2-text-sm ps2-text-muted">合计 ' + formatAmount(totalCityAmount) + ' 万元</span></div>' +
          '<div class="ps2-card__body">' +
            '<div class="ps2-dept-list">' + deptDistribution.map(function (d, i) { return buildDeptItem(d, i, 'blue'); }).join('') + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="ps2-card">' +
          '<div class="ps2-card__header"><h3 class="ps2-card__title"><i class="fa-solid fa-map-location-dot" style="color: var(--ps2-amber-600); margin-right: 6px;"></i>外地地区资金分布</h3><span class="ps2-text-sm ps2-text-muted">合计 ' + formatAmount(totalExternalAmount) + ' 万元</span></div>' +
          '<div class="ps2-card__body">' +
            '<div class="ps2-dept-list">' + regionDistribution.map(function (d, i) { return buildDeptItem(d, i, 'amber'); }).join('') + '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  /**
   * 构建部门/地区分布项
   * @param {Object} d 数据项
   * @param {number} index 序号
   * @param {string} theme 主题色 blue/amber
   * @returns {string} HTML 字符串
   */
  function buildDeptItem(d, index, theme) {
    return (
      '<div class="ps2-dept-item">' +
        '<div class="ps2-dept-item__rank ' + (theme === 'amber' ? 'ps2-dept-item__rank--amber' : '') + '">' + (index + 1) + '</div>' +
        '<div class="ps2-dept-item__info">' +
          '<div class="ps2-dept-item__name">' + escapeHtml(d.name) + '</div>' +
          '<div class="ps2-dept-item__count">涉及 ' + d.count + ' 笔补贴</div>' +
        '</div>' +
        '<div class="ps2-dept-item__amount">' + formatAmount(d.amount) + ' 万</div>' +
      '</div>'
    );
  }

  // ============================================================
  // 13. Modal 弹窗管理
  // ============================================================

  /**
   * 打开导入/新建任务弹窗
   */
  window.openImportModal = function () {
    state.showImportModal = true;
    state.importChannel = 'A';
    if (dom.importModal) dom.importModal.classList.remove('is-hidden');
    document.body.style.overflow = 'hidden';
  };

  /**
   * 关闭导入弹窗
   */
  window.closeImportModal = function () {
    state.showImportModal = false;
    if (dom.importModal) dom.importModal.classList.add('is-hidden');
    document.body.style.overflow = '';
  };

  /**
   * 切换导入通道
   * @param {string} channel 通道 A/B
   */
  window.setImportChannel = function (channel) {
    state.importChannel = channel;
    document.querySelectorAll('.ps2-radio-card[data-channel]').forEach(function (card) {
      card.classList.toggle('is-active', card.dataset.channel === channel);
    });
  };

  /**
   * 确认导入/新建任务
   */
  window.confirmImport = function () {
    closeImportModal();
    alert('新建分析任务成功！已' + (state.importChannel === 'A' ? '从第一阶段结果链路导入 200 家企业。' : '上传外部 Excel 并完成解析。'));
  };

  /**
   * 打开风控推送弹窗
   */
  window.openPushModal = function () {
    if (state.selectedIds.length === 0) {
      alert('请先勾选需要推送的企业');
      return;
    }
    state.showPushModal = true;
    state.pushSuccessMsg = '';
    if (dom.pushSuccessMsg) dom.pushSuccessMsg.classList.add('ps2-hidden');
    if (dom.pushModal) dom.pushModal.classList.remove('is-hidden');
    if (dom.pushModalBody) {
      dom.pushModalBody.innerHTML =
        '<div class="ps2-mb-3">' +
          '<p class="ps2-text-sm" style="color: var(--ps2-slate-600); margin-bottom: 8px;">即将推送 <strong style="color: var(--ps2-blue-700);">' + state.selectedIds.length + '</strong> 家企业至第三阶段 <strong>监管风险预警库</strong>。</p>' +
          '<div class="ps2-badges-group ps2-mb-2">' +
            '<span class="ps2-badge ps2-badge--purple">高频获补</span>' +
            '<span class="ps2-badge ps2-badge--emerald">千万级大额</span>' +
            '<span class="ps2-badge ps2-badge--amber">跨城获补</span>' +
            '<span class="ps2-badge ps2-badge--rose">涉诉风险</span>' +
          '</div>' +
          '<p class="ps2-text-xs ps2-text-muted">推送后将触发第三阶段的多维风险画像与持续监测。</p>' +
        '</div>' +
        '<div class="ps2-form-group">' +
          '<label class="ps2-form-group__label">推送备注（可选）</label>' +
          '<textarea class="ps2-textarea" placeholder="输入备注信息..."></textarea>' +
        '</div>';
    }
    document.body.style.overflow = 'hidden';
  };

  /**
   * 关闭推送弹窗
   */
  window.closePushModal = function () {
    state.showPushModal = false;
    if (dom.pushModal) dom.pushModal.classList.add('is-hidden');
    document.body.style.overflow = '';
  };

  /**
   * 确认推送
   */
  window.confirmPush = function () {
    state.pushSuccessMsg = '已成功推送 ' + state.selectedIds.length + ' 家企业至第三阶段监管风险预警库';
    if (dom.pushSuccessMsg) {
      dom.pushSuccessMsg.innerText = state.pushSuccessMsg;
      dom.pushSuccessMsg.classList.remove('ps2-hidden');
    }

    setTimeout(function () {
      closePushModal();
      state.selectedIds = [];
      renderTable();
    }, 1500);
  };

  /**
   * 打开导出报告弹窗
   */
  window.openExportModal = function () {
    state.showExportModal = true;
    if (dom.exportModal) dom.exportModal.classList.remove('is-hidden');
    if (dom.exportReportCount) dom.exportReportCount.innerText = getFilteredEnterprises().length;
    document.body.style.overflow = 'hidden';
  };

  /**
   * 关闭导出弹窗
   */
  window.closeExportModal = function () {
    state.showExportModal = false;
    if (dom.exportModal) dom.exportModal.classList.add('is-hidden');
    document.body.style.overflow = '';
  };

  /**
   * 确认导出报告
   */
  window.confirmExport = function () {
    closeExportModal();
    alert('回测校验报告已生成并开始下载。');
  };

  // ============================================================
  // 14. 工具函数
  // ============================================================

  /**
   * 格式化金额（添加千分位）
   * @param {number} amount 金额
   * @returns {string} 格式化后的字符串
   */
  function formatAmount(amount) {
    return amount.toLocaleString('zh-CN');
  }

  /**
   * HTML 转义，防止 XSS
   * @param {string} text 原始文本
   * @returns {string} 转义后文本
   */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
  }

  // ============================================================
  // 15. 启动
  // ============================================================

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
