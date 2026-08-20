/**
 * 政策分析第三阶段：事中事后监管期
 * 原生 JavaScript（IIFE），保留参考页全部数据与交互逻辑
 */
(function () {
  'use strict';

  // ============================================================
  // 1. 数据定义
  // ============================================================
  const RISK_INDICATORS = [
    { id: 1, code: 'IND_01', name: '经营状态是否异常', source: '工商登记', level: '高', desc: '已注销/吊销/迁出' },
    { id: 2, code: 'IND_02', name: '涉嫌违规（国家黑名单）', source: '国家信用', level: '高', desc: '全国失信被执行人' },
    { id: 3, code: 'IND_03', name: '涉嫌违规（深圳黑名单）', source: '深圳市信用', level: '高', desc: '深圳市失信' },
    { id: 4, code: 'IND_04', name: '工商严重违法失信企业', source: '工商登记', level: '紧急', desc: '严重违法失信名单' },
    { id: 5, code: 'IND_05', name: '注册地址是否迁出深圳', source: '工商登记', level: '中', desc: '享受深圳补贴却迁出深圳' },
    { id: 6, code: 'IND_06', name: '破产案件信息', source: '司法/破产', level: '紧急', desc: '进入破产程序或预重整' },
    { id: 7, code: 'IND_07', name: '经营异常记录', source: '工商登记', level: '中', desc: '被列入经营异常名录' },
    { id: 8, code: 'IND_08', name: '社保数据异常', source: '社保局', level: '中', desc: '社保断缴或参保人数骤降' },
    { id: 9, code: 'IND_09', name: '行政处罚记录', source: '信用中国', level: '中', desc: '近12个月内存在重大行政处罚' },
    { id: 10, code: 'IND_10', name: '案件信息记录（除破产）', source: '司法', level: '中', desc: '涉诉金额较大或被强制执行' },
    { id: 11, code: 'IND_11', name: '欠税记录', source: '税务', level: '高', desc: '存在重大欠税公告' },
    { id: 12, code: 'IND_12', name: '企业参保信息完整度', source: '社保局', level: '低', desc: '信息缺失或不完整' }
  ];

  let enterprises = [
    {
      id: 'ENT_001',
      creditCode: '91440300MA5DEF1234',
      name: '深圳市创科智造科技有限公司',
      listName: '2025年第一批高新技术产业扶持资金名单',
      grantDate: '2025-01-15',
      expectedAmount: 1200.0,
      actualAmount: 1200.0,
      grantStatus: '已发放',
      interceptStatus: '已预警',
      interceptAmount: 1200.0,
      alertLevel: '紧急',
      lastAlertAt: '2025-02-10 09:30:00',
      hitIndicators: [4, 6],
      maintainedBy: '张审核',
      maintainedAt: '2025-02-10 11:20',
      remark: '司法卷宗显示已进入预重整程序，建议全额追回',
      alertsHistory: [
        { id: 'ALT_101', indicatorId: 4, level: '紧急', source: '科创风控API', triggeredAt: '2025-02-10 09:30', status: '待复核', dataSnapshot: { court: '深圳市中级人民法院', caseNo: '(2025)粤03破12号', detail: '被申请破产重整' } },
        { id: 'ALT_102', indicatorId: 6, level: '紧急', source: '司法大数据库', triggeredAt: '2025-02-09 14:15', status: '已确认', dataSnapshot: { status: '预重整受理', updateTime: '2025-02-09' } }
      ]
    },
    {
      id: 'ENT_002',
      creditCode: '91440300311789456X',
      name: '深圳未来芯片研发有限公司',
      listName: '2025年第一批高新技术产业扶持资金名单',
      grantDate: '2025-01-15',
      expectedAmount: 1000.0,
      actualAmount: 800.0,
      grantStatus: '已发放',
      interceptStatus: '已预警',
      interceptAmount: 800.0,
      alertLevel: '高',
      lastAlertAt: '2025-02-11 16:45:00',
      hitIndicators: [1, 5, 11],
      maintainedBy: '李审核',
      maintainedAt: '2025-02-12 09:00',
      remark: '企业办公地已空置，税务系统显示重大欠税',
      alertsHistory: [
        { id: 'ALT_103', indicatorId: 5, level: '中', source: '工商登记', triggeredAt: '2025-02-11 16:45', status: '待复核', dataSnapshot: { oldAddr: '深圳市南山区科技园', newAddr: '东莞市松山湖' } },
        { id: 'ALT_104', indicatorId: 11, level: '高', source: '税务接口', triggeredAt: '2025-02-11 10:20', status: '待复核', dataSnapshot: { taxOwed: '240.5万元', taxType: '增值税及附加' } }
      ]
    },
    {
      id: 'ENT_003',
      creditCode: '91440300MA5G896521',
      name: '深蓝智慧物联（深圳）有限公司',
      listName: '2025年战略性新兴产业特别补助',
      grantDate: '2025-01-20',
      expectedAmount: 2700.0,
      actualAmount: 2700.0,
      grantStatus: '已发放',
      interceptStatus: '已拦截',
      interceptAmount: 2700.0,
      alertLevel: '紧急',
      lastAlertAt: '2025-02-01 08:00:00',
      hitIndicators: [2, 8],
      maintainedBy: '王主管',
      maintainedAt: '2025-02-02 15:30',
      remark: '资金已完成银行冻结及追回流程',
      alertsHistory: [
        { id: 'ALT_105', indicatorId: 2, level: '高', source: '信用中国', triggeredAt: '2025-02-01 08:00', status: '已处置', dataSnapshot: { reason: '失信被执行人', amount: '4500万元' } },
        { id: 'ALT_106', indicatorId: 8, level: '中', source: '社保局', triggeredAt: '2025-01-28 11:00', status: '已处置', dataSnapshot: { dropRate: '85%', curInsured: 3 } }
      ]
    },
    {
      id: 'ENT_004',
      creditCode: '91440300758412369A',
      name: '深圳市华云新能源动力有限公司',
      listName: '2025年第一批高新技术产业扶持资金名单',
      grantDate: '2025-01-15',
      expectedAmount: 500.0,
      actualAmount: 350.0,
      grantStatus: '待发放',
      interceptStatus: '已预警',
      interceptAmount: 350.0,
      alertLevel: '中',
      lastAlertAt: '2025-02-12 11:10:00',
      hitIndicators: [8, 9],
      maintainedBy: '张审核',
      maintainedAt: '2025-02-12 11:15',
      remark: '待发放阶段拦截，直接暂缓拨付',
      alertsHistory: [
        { id: 'ALT_107', indicatorId: 9, level: '中', source: '信用中国', triggeredAt: '2025-02-12 11:10', status: '待复核', dataSnapshot: { penaltyNo: '深环罚〔2025〕012号', fine: '15万元' } }
      ]
    },
    {
      id: 'ENT_005',
      creditCode: '91440300589632145B',
      name: '深圳光子微电子装备有限公司',
      listName: '2025年重大科技专项研发补贴',
      grantDate: '2025-02-01',
      expectedAmount: 1500.0,
      actualAmount: 1500.0,
      grantStatus: '已发放',
      interceptStatus: '正常',
      interceptAmount: 0,
      alertLevel: '无',
      lastAlertAt: '-',
      hitIndicators: [],
      maintainedBy: '系统',
      maintainedAt: '2025-02-01 10:00',
      remark: '各维度风控扫描正常',
      alertsHistory: []
    },
    {
      id: 'ENT_006',
      creditCode: '91440300MA5F112233',
      name: '深圳市极光生物医药研发有限公司',
      listName: '2025年重大科技专项研发补贴',
      grantDate: '2025-02-01',
      expectedAmount: 800.0,
      actualAmount: 800.0,
      grantStatus: '已剔除',
      interceptStatus: '正常',
      interceptAmount: 0,
      alertLevel: '无',
      lastAlertAt: '-',
      hitIndicators: [],
      maintainedBy: '赵审核',
      maintainedAt: '2025-02-05 14:20',
      remark: '企业因主体变更主动申请放弃本批次扶持',
      alertsHistory: []
    }
  ];

  let auditLogs = [
    { id: 'LOG_001', action: '调整金额', enterpriseName: '深圳未来芯片研发有限公司', before: '1000.0万元', after: '800.0万元', reason: '依据中期考核扣减30%资助', operator: '李审核', time: '2025-02-12 09:00', ip: '10.12.33.45' },
    { id: 'LOG_002', action: '拦截决策', enterpriseName: '深蓝智慧物联（深圳）有限公司', before: '正常', after: '追回已发(2700万元)', reason: '触发失信被执行人及社保断缴，启动全额追回', operator: '王主管', time: '2025-02-02 15:30', ip: '10.12.33.12' },
    { id: 'LOG_003', action: '手动勾除', enterpriseName: '深圳市极光生物医药研发有限公司', before: '已发放', after: '已剔除', reason: '企业主动申请放弃补贴', operator: '赵审核', time: '2025-02-05 14:20', ip: '10.12.33.88' }
  ];

  let activeEnterprise = null;
  let maintActionType = 'AMOUNT_CHANGE';

  // ============================================================
  // 2. 工具函数
  // ============================================================
  function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    const str = String(text);
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatMoney(num) {
    return Number(num).toLocaleString('zh-CN', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  }

  function showToast(msg) {
    const toast = document.getElementById('ps3-toast');
    const toastMsg = document.getElementById('ps3-toast-message');
    toastMsg.textContent = msg;
    toast.classList.remove('is-hidden');
    setTimeout(function () {
      toast.classList.add('is-hidden');
    }, 3000);
  }

  // ============================================================
  // 3. 初始化
  // ============================================================
  function init() {
    initFilterDropdowns();
    renderStats();
    renderTable();
  }

  function initFilterDropdowns() {
    const selectInd = document.getElementById('ps3-filter-indicator');
    RISK_INDICATORS.forEach(function (ind) {
      const opt = document.createElement('option');
      opt.value = ind.id;
      opt.textContent = '[' + ind.code + '] ' + ind.name + ' (' + ind.level + ')';
      selectInd.appendChild(opt);
    });
  }

  // ============================================================
  // 4. 统计看板
  // ============================================================
  function renderStats() {
    const totalLists = 3;
    const interceptAmount = enterprises.reduce(function (sum, item) {
      return sum + (item.interceptAmount || 0);
    }, 0);
    const interceptCount = enterprises.filter(function (e) {
      return e.interceptAmount > 0 || e.interceptStatus === '已预警';
    }).length;
    const urgentAlerts = enterprises.filter(function (e) {
      return e.alertLevel === '紧急' && e.interceptStatus !== '已拦截';
    }).length;

    document.getElementById('ps3-stat-total-lists').textContent = totalLists;
    document.getElementById('ps3-stat-intercept-amount').textContent = formatMoney(interceptAmount);
    document.getElementById('ps3-stat-intercept-count').textContent = interceptCount;
    document.getElementById('ps3-stat-urgent-alerts').textContent = urgentAlerts;
  }

  // ============================================================
  // 5. 列表过滤与渲染
  // ============================================================
  function getFilteredEnterprises() {
    const listVal = document.getElementById('ps3-filter-list').value;
    const levelVal = document.getElementById('ps3-filter-alert-level').value;
    const statusVal = document.getElementById('ps3-filter-status').value;
    const indVal = document.getElementById('ps3-filter-indicator').value;
    const q = document.getElementById('ps3-search-input').value.trim().toLowerCase();

    return enterprises.filter(function (item) {
      if (listVal !== 'ALL' && item.listName !== listVal) return false;
      if (levelVal !== 'ALL' && item.alertLevel !== levelVal) return false;
      if (statusVal !== 'ALL' && item.interceptStatus !== statusVal) return false;
      if (indVal !== 'ALL' && item.hitIndicators.indexOf(parseInt(indVal, 10)) === -1) return false;
      if (q && item.name.toLowerCase().indexOf(q) === -1 && item.creditCode.toLowerCase().indexOf(q) === -1) return false;
      return true;
    });
  }

  function handleSearchInput() {
    renderTable();
  }

  function resetFilters() {
    document.getElementById('ps3-filter-list').value = 'ALL';
    document.getElementById('ps3-filter-alert-level').value = 'ALL';
    document.getElementById('ps3-filter-status').value = 'ALL';
    document.getElementById('ps3-filter-indicator').value = 'ALL';
    document.getElementById('ps3-search-input').value = '';
    renderTable();
  }

  function renderAlertBadge(level) {
    switch (level) {
      case '紧急':
        return '<span class="ps3-badge ps3-badge--urgent"><i class="fa-solid fa-triangle-exclamation"></i> 紧急预警</span>';
      case '高':
        return '<span class="ps3-badge ps3-badge--high"><i class="fa-solid fa-shield-halved"></i> 高风险</span>';
      case '中':
        return '<span class="ps3-badge ps3-badge--medium"><i class="fa-solid fa-circle-exclamation"></i> 中风险</span>';
      case '低':
        return '<span class="ps3-badge ps3-badge--low"><i class="fa-solid fa-circle-info"></i> 提示</span>';
      default:
        return '<span class="ps3-badge ps3-badge--normal"><i class="fa-solid fa-circle-check"></i> 正常</span>';
    }
  }

  function renderInterceptBadge(status) {
    switch (status) {
      case '已预警':
        return '<span class="ps3-badge ps3-badge--warn"><i class="fa-solid fa-clock"></i> 预警待拦截</span>';
      case '已拦截':
      case '已追回':
        return '<span class="ps3-badge ps3-badge--blocked"><i class="fa-solid fa-ban"></i> ' + escapeHtml(status) + '</span>';
      default:
        return '<span class="ps3-badge ps3-badge--normal">正常监管</span>';
    }
  }

  function renderTable() {
    const list = getFilteredEnterprises();
    document.getElementById('ps3-filtered-count').textContent = list.length;
    const tbody = document.getElementById('ps3-enterprise-table-body');
    tbody.innerHTML = '';

    if (list.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="8" class="ps3-empty-state">' +
        '<i class="fa-solid fa-circle-exclamation"></i>' +
        '<div>暂无符合条件的企业监管记录</div>' +
        '</td></tr>';
      return;
    }

    list.forEach(function (item) {
      const isUrgent = item.alertLevel === '紧急';
      const tr = document.createElement('tr');
      if (isUrgent) tr.classList.add('ps3-row--urgent');

      let indicatorsHtml = '<span class="ps3-text-muted" style="font-size:11px;">无</span>';
      if (item.hitIndicators.length > 0) {
        const chips = item.hitIndicators.map(function (codeId) {
          const ind = RISK_INDICATORS.find(function (r) { return r.id === codeId; });
          const title = ind ? escapeHtml(ind.name + ': ' + ind.desc) : '';
          const label = ind ? escapeHtml('#' + codeId + ' ' + ind.name.substring(0, 4)) : '#' + codeId;
          return '<span class="ps3-indicator-chip" title="' + title + '">' + label + '</span>';
        }).join('');
        indicatorsHtml = '<div class="ps3-indicators-wrap">' + chips + '</div>';
      }

      const amountClass = item.actualAmount < item.expectedAmount ? 'ps3-amount-paid--reduced' : '';
      const reducedTag = item.actualAmount < item.expectedAmount
        ? '<span class="ps3-chip ps3-chip--reduced">已调减</span>'
        : '';

      const interceptAmountHtml = item.interceptAmount > 0
        ? '<div class="ps3-intercept-amount">需/已拦截: ' + formatMoney(item.interceptAmount) + '万</div>'
        : '';

      tr.innerHTML =
        '<td>' +
          '<div class="ps3-ent-name" onclick="openDrawer(\'' + item.id + '\')">' +
            escapeHtml(item.name) +
            '<i class="fa-solid fa-arrow-up-right-from-square"></i>' +
          '</div>' +
          '<div class="ps3-ent-code">' + escapeHtml(item.creditCode) + '</div>' +
        '</td>' +
        '<td>' +
          '<div class="ps3-ent-batch" title="' + escapeHtml(item.listName) + '">' + escapeHtml(item.listName) + '</div>' +
          '<div class="ps3-ent-date"><i class="fa-solid fa-calendar-days"></i> 发放时点: ' + escapeHtml(item.grantDate) + '</div>' +
        '</td>' +
        '<td class="ps3-text-right">' +
          '<div class="ps3-amount-origin">应收: ' + formatMoney(item.expectedAmount) + '万</div>' +
          '<div class="ps3-amount-paid ' + amountClass + '">' +
            '实发: ' + formatMoney(item.actualAmount) + '万元' + reducedTag +
          '</div>' +
        '</td>' +
        '<td class="ps3-text-center">' + indicatorsHtml + '</td>' +
        '<td class="ps3-text-center">' + renderAlertBadge(item.alertLevel) + '</td>' +
        '<td class="ps3-text-center">' +
          '<div>' + renderInterceptBadge(item.interceptStatus) + '</div>' +
          interceptAmountHtml +
        '</td>' +
        '<td class="ps3-text-center">' +
          '<div class="ps3-maintainer">' + escapeHtml(item.maintainedBy) + '</div>' +
          '<div class="ps3-maintain-time">' + escapeHtml(item.maintainedAt) + '</div>' +
        '</td>' +
        '<td>' +
          '<div class="ps3-actions">' +
            '<button class="ps3-action-btn ps3-action-btn--view" onclick="openDrawer(\'' + item.id + '\')" title="查看12项风控与证据链">' +
              '<i class="fa-solid fa-eye"></i>' +
            '</button>' +
            '<button class="ps3-action-btn ps3-action-btn--intercept" onclick="openInterceptModal(\'' + item.id + '\')" title="资金拦截与追回决策">' +
              '<i class="fa-solid fa-ban"></i>' +
            '</button>' +
            '<button class="ps3-action-btn ps3-action-btn--maint" onclick="openMaintModal(\'' + item.id + '\')" title="名单运维(勾除/调金额)">' +
              '<i class="fa-solid fa-pen-to-square"></i>' +
            '</button>' +
          '</div>' +
        '</td>';

      tbody.appendChild(tr);
    });
  }

  // ============================================================
  // 6. 企业风控详情抽屉
  // ============================================================
  function openDrawer(entId) {
    activeEnterprise = enterprises.find(function (e) { return e.id === entId; });
    if (!activeEnterprise) return;

    document.getElementById('ps3-drawer-ent-name').textContent = activeEnterprise.name;
    document.getElementById('ps3-drawer-ent-code').textContent = '统一信用代码：' + activeEnterprise.creditCode;
    document.getElementById('ps3-drawer-alert-badge').innerHTML = renderAlertBadge(activeEnterprise.alertLevel);

    document.getElementById('ps3-drawer-expected-amount').textContent = formatMoney(activeEnterprise.expectedAmount) + ' 万元';
    document.getElementById('ps3-drawer-actual-amount').textContent = formatMoney(activeEnterprise.actualAmount) + ' 万元';
    document.getElementById('ps3-drawer-grant-date').textContent = activeEnterprise.grantDate;

    // 12 项风控指标网格
    const riskGrid = document.getElementById('ps3-drawer-risk-grid');
    riskGrid.innerHTML = '';
    RISK_INDICATORS.forEach(function (ind) {
      const isHit = activeEnterprise.hitIndicators.indexOf(ind.id) !== -1;
      const card = document.createElement('div');
      card.className = 'ps3-risk-card' + (isHit ? ' ps3-risk-card--hit' : '');
      card.innerHTML =
        '<div class="ps3-risk-card__top">' +
          '<span class="ps3-risk-card__num">#' + ind.id + '</span>' +
          (isHit
            ? '<span class="ps3-risk-card__status ps3-risk-card__status--hit">命中异常</span>'
            : '<span class="ps3-risk-card__status ps3-risk-card__status--ok"><i class="fa-solid fa-circle-check"></i> 未见异常</span>') +
        '</div>' +
        '<div class="ps3-risk-card__name">' + escapeHtml(ind.name) + '</div>' +
        '<div class="ps3-risk-card__source">数据源: ' + escapeHtml(ind.source) + '</div>';
      riskGrid.appendChild(card);
    });

    // 预警证据链
    const evidenceList = document.getElementById('ps3-drawer-evidence-list');
    evidenceList.innerHTML = '';
    if (!activeEnterprise.alertsHistory || activeEnterprise.alertsHistory.length === 0) {
      evidenceList.innerHTML =
        '<div class="ps3-evidence-empty">当前企业暂无异常预警触发记录</div>';
    } else {
      const wrap = document.createElement('div');
      wrap.className = 'ps3-evidence-list';
      activeEnterprise.alertsHistory.forEach(function (alt) {
        const ind = RISK_INDICATORS.find(function (r) { return r.id === alt.indicatorId; });
        const item = document.createElement('div');
        item.className = 'ps3-evidence-item';
        item.innerHTML =
          '<div class="ps3-evidence-item__header">' +
            '<span class="ps3-evidence-item__title">[' + escapeHtml(ind ? ind.code : '') + '] ' + escapeHtml(ind ? ind.name : '') + '</span>' +
            '<span class="ps3-evidence-item__time">' + escapeHtml(alt.triggeredAt) + '</span>' +
          '</div>' +
          '<div class="ps3-evidence-item__meta">' +
            '数据源：' + escapeHtml(alt.source) + ' | 状态：<span class="ps3-text-danger">' + escapeHtml(alt.status) + '</span>' +
          '</div>' +
          '<div class="ps3-evidence-item__snapshot">' +
            '<div class="ps3-evidence-item__snapshot-label">// 证据抓取快照 (Snapshot JSON):</div>' +
            '<pre>' + escapeHtml(JSON.stringify(alt.dataSnapshot, null, 2)) + '</pre>' +
          '</div>';
        wrap.appendChild(item);
      });
      evidenceList.appendChild(wrap);
    }

    // 绑定底部按钮
    document.getElementById('ps3-drawer-btn-maint').onclick = function () {
      closeDrawer();
      openMaintModal(activeEnterprise.id);
    };
    document.getElementById('ps3-drawer-btn-intercept').onclick = function () {
      closeDrawer();
      openInterceptModal(activeEnterprise.id);
    };

    document.getElementById('ps3-detail-drawer').classList.remove('is-hidden');
  }

  function closeDrawer() {
    document.getElementById('ps3-detail-drawer').classList.add('is-hidden');
  }

  // ============================================================
  // 7. 名单运维调整弹窗
  // ============================================================
  function openMaintModal(entId) {
    activeEnterprise = enterprises.find(function (e) { return e.id === entId; });
    if (!activeEnterprise) return;

    document.getElementById('ps3-maint-ent-name').textContent = activeEnterprise.name;
    document.getElementById('ps3-maint-ent-info').textContent =
      '当前实发金额：' + formatMoney(activeEnterprise.actualAmount) + ' 万元 | 状态：' + activeEnterprise.grantStatus;
    document.getElementById('ps3-maint-input-amount').value = activeEnterprise.actualAmount;
    document.getElementById('ps3-maint-textarea-reason').value = '';

    // 确保动作类型按钮携带颜色修饰类
    document.getElementById('ps3-btn-action-remove').classList.add('ps3-action-type-btn--remove');
    document.getElementById('ps3-btn-action-status').classList.add('ps3-action-type-btn--status');

    setMaintActionType('AMOUNT_CHANGE');
    document.getElementById('ps3-maint-modal').classList.remove('is-hidden');
  }

  function closeMaintModal() {
    document.getElementById('ps3-maint-modal').classList.add('is-hidden');
  }

  function setMaintActionType(type) {
    maintActionType = type;
    const btnAmount = document.getElementById('ps3-btn-action-amount');
    const btnRemove = document.getElementById('ps3-btn-action-remove');
    const btnStatus = document.getElementById('ps3-btn-action-status');

    const fieldAmount = document.getElementById('ps3-maint-field-amount');
    const fieldRemove = document.getElementById('ps3-maint-field-remove');
    const fieldStatus = document.getElementById('ps3-maint-field-status');

    [btnAmount, btnRemove, btnStatus].forEach(function (btn) {
      btn.classList.remove('ps3-action-type-btn--active');
    });
    fieldAmount.classList.add('is-hidden');
    fieldRemove.classList.add('is-hidden');
    fieldStatus.classList.add('is-hidden');

    if (type === 'AMOUNT_CHANGE') {
      btnAmount.classList.add('ps3-action-type-btn--active');
      fieldAmount.classList.remove('is-hidden');
    } else if (type === 'REMOVE') {
      btnRemove.classList.add('ps3-action-type-btn--active');
      fieldRemove.classList.remove('is-hidden');
    } else if (type === 'STATUS_CHANGE') {
      btnStatus.classList.add('ps3-action-type-btn--active');
      fieldStatus.classList.remove('is-hidden');
    }
  }

  function handleMaintSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();

    const reason = document.getElementById('ps3-maint-textarea-reason').value.trim();
    if (!reason) {
      window.alert('请填写维护原因（留痕审计必填）');
      return;
    }

    let logBefore = '';
    let logAfter = '';
    let actionName = '';

    if (maintActionType === 'AMOUNT_CHANGE') {
      const newAmt = parseFloat(document.getElementById('ps3-maint-input-amount').value);
      if (isNaN(newAmt) || newAmt < 0) {
        window.alert('请输入有效的调整后金额');
        return;
      }
      actionName = '调整实发金额';
      logBefore = formatMoney(activeEnterprise.actualAmount) + '万元';
      logAfter = formatMoney(newAmt) + '万元';
      activeEnterprise.actualAmount = newAmt;
    } else if (maintActionType === 'REMOVE') {
      actionName = '手动勾除企业';
      logBefore = activeEnterprise.grantStatus;
      logAfter = '已剔除';
      activeEnterprise.grantStatus = '已剔除';
      activeEnterprise.interceptStatus = '正常';
      activeEnterprise.interceptAmount = 0;
    } else if (maintActionType === 'STATUS_CHANGE') {
      const newStatus = document.getElementById('ps3-maint-select-status').value;
      actionName = '状态变更';
      logBefore = activeEnterprise.grantStatus;
      logAfter = newStatus;
      activeEnterprise.grantStatus = newStatus;
    }

    activeEnterprise.maintainedBy = '当前审核员';
    activeEnterprise.maintainedAt = new Date().toLocaleString();

    auditLogs.unshift({
      id: 'LOG_' + Date.now(),
      action: actionName,
      enterpriseName: activeEnterprise.name,
      before: logBefore,
      after: logAfter,
      reason: reason,
      operator: '当前系统用户',
      time: new Date().toLocaleString(),
      ip: '10.12.33.102'
    });

    closeMaintModal();
    renderStats();
    renderTable();
    showToast('【' + activeEnterprise.name + '】维护变更成功，已写入审计日志');
  }

  // ============================================================
  // 8. 资金拦截与追回决策弹窗
  // ============================================================
  function openInterceptModal(entId) {
    activeEnterprise = enterprises.find(function (e) { return e.id === entId; });
    if (!activeEnterprise) return;

    document.getElementById('ps3-intercept-ent-name').textContent = activeEnterprise.name;
    document.getElementById('ps3-intercept-ent-info').textContent =
      '已命中最高预警：[' + activeEnterprise.alertLevel + '] | 实发金额：' + formatMoney(activeEnterprise.actualAmount) + ' 万元';
    document.getElementById('ps3-intercept-amount').value = activeEnterprise.actualAmount;
    document.getElementById('ps3-intercept-remark').value = '';

    document.getElementById('ps3-intercept-modal').classList.remove('is-hidden');
  }

  function closeInterceptModal() {
    document.getElementById('ps3-intercept-modal').classList.add('is-hidden');
  }

  function handleInterceptSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();

    const type = document.getElementById('ps3-intercept-type').value;
    const amount = parseFloat(document.getElementById('ps3-intercept-amount').value) || activeEnterprise.actualAmount;
    const remark = document.getElementById('ps3-intercept-remark').value.trim();

    if (!remark) {
      window.alert('请填写拦截决策意见（含双人复核依据）');
      return;
    }

    activeEnterprise.interceptStatus = type === '直接拦截' ? '已拦截' : '已追回';
    activeEnterprise.interceptAmount = amount;
    activeEnterprise.remark = '[' + type + '] ' + remark;

    auditLogs.unshift({
      id: 'LOG_' + Date.now(),
      action: '资金拦截决策',
      enterpriseName: activeEnterprise.name,
      before: '正常/预警中',
      after: type + ' (' + formatMoney(amount) + '万元)',
      reason: '决策意见: ' + remark + ' (复核员: 李主管)',
      operator: '当前审核员',
      time: new Date().toLocaleString(),
      ip: '10.12.33.102'
    });

    closeInterceptModal();
    renderStats();
    renderTable();
    showToast('已成功对【' + activeEnterprise.name + '】执行' + type + '，金额 ' + formatMoney(amount) + ' 万元');
  }

  // ============================================================
  // 9. 审计日志查询弹窗
  // ============================================================
  function openAuditLogsModal() {
    document.getElementById('ps3-audit-log-total').textContent = 'TOTAL: ' + auditLogs.length + ' LOGS';
    const tbody = document.getElementById('ps3-audit-log-table-body');
    tbody.innerHTML = '';

    auditLogs.forEach(function (log) {
      const tr = document.createElement('tr');
      tr.innerHTML =
        '<td>' +
          '<div style="font-family:ui-monospace,monospace;font-weight:600;">' + escapeHtml(log.time) + '</div>' +
          '<div style="font-size:10px;color:var(--ps3-text-tertiary);">' + escapeHtml(log.operator) + ' (' + escapeHtml(log.ip) + ')</div>' +
        '</td>' +
        '<td><span class="ps3-badge ps3-badge--low">' + escapeHtml(log.action) + '</span></td>' +
        '<td style="font-weight:700;">' + escapeHtml(log.enterpriseName) + '</td>' +
        '<td>' +
          '<span class="ps3-change-before">' + escapeHtml(log.before) + '</span>' +
          '<i class="fa-solid fa-arrow-up-right ps3-change-arrow"></i>' +
          '<span class="ps3-change-after">' + escapeHtml(log.after) + '</span>' +
        '</td>' +
        '<td><div class="ps3-log-reason" title="' + escapeHtml(log.reason) + '">' + escapeHtml(log.reason) + '</div></td>';
      tbody.appendChild(tr);
    });

    document.getElementById('ps3-audit-modal').classList.remove('is-hidden');
  }

  function closeAuditLogsModal() {
    document.getElementById('ps3-audit-modal').classList.add('is-hidden');
  }

  // ============================================================
  // 10. 科创风控 API 接口状态弹窗
  // ============================================================
  function openApiStatusModal() {
    document.getElementById('ps3-api-status-modal').classList.remove('is-hidden');
  }

  function closeApiStatusModal() {
    document.getElementById('ps3-api-status-modal').classList.add('is-hidden');
  }

  // ============================================================
  // 11. 挂载全局函数与启动
  // ============================================================
  window.handleSearchInput = handleSearchInput;
  window.resetFilters = resetFilters;
  window.renderTable = renderTable;
  window.openDrawer = openDrawer;
  window.closeDrawer = closeDrawer;
  window.openMaintModal = openMaintModal;
  window.closeMaintModal = closeMaintModal;
  window.setMaintActionType = setMaintActionType;
  window.handleMaintSubmit = handleMaintSubmit;
  window.openInterceptModal = openInterceptModal;
  window.closeInterceptModal = closeInterceptModal;
  window.handleInterceptSubmit = handleInterceptSubmit;
  window.openAuditLogsModal = openAuditLogsModal;
  window.closeAuditLogsModal = closeAuditLogsModal;
  window.openApiStatusModal = openApiStatusModal;
  window.closeApiStatusModal = closeApiStatusModal;

  window.addEventListener('DOMContentLoaded', init);
})();
