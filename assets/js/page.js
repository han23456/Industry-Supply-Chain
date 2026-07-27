/**
 * ============================================================
 * page.js - 页面业务交互逻辑
 * 包含：URL 参数解析、链主企业发票穿透详情、下拉切换、按钮事件、
 *       弹窗内容生成、招商推演逻辑、全产业综合分析模块折叠状态持久化
 * ============================================================
 */

(function () {
  'use strict';

  var $ = CommonUtil.$;
  var $$ = CommonUtil.$$;
  var el = CommonUtil.createElement;
  var toast = CommonUtil.toast;
  var openModal = CommonUtil.openModal;
  var fmtNum = CommonUtil.formatNumber;
  var fmtYi = CommonUtil.formatWanToYi;
  var levelClass = CommonUtil.getLevelTagClass;

  /* ===== 当前选中的样本级别 ===== */
  var currentLevel = MockData.sampleConfig.defaultLevel;

  /* ===== 从 URL 获取的链主企业 ID 列表 ===== */
  var selectedEnterpriseIds = [];

  /* ===== 链主企业详情折叠状态 ===== */
  var enterpriseCollapsedState = {};

  /* ===== 全产业综合分析模块折叠状态 ===== */
  var COMPREHENSIVE_STORAGE_KEY = 'chain_gap1_comprehensive_collapsed';
  var comprehensiveCollapsed = false;

  /* ===== 页面初始化 ===== */
  function init() {
    parseUrlParams();
    loadComprehensiveCollapsedState();

    renderHeader();
    renderMetricCards();

    // 渲染链主企业详情（带加载状态）
    if (selectedEnterpriseIds.length > 0) {
      renderEnterpriseDetails(selectedEnterpriseIds);
    } else {
      renderEnterpriseEmptyState();
    }

    renderSections();
    bindEvents();
    bindComprehensiveSectionToggle();
    applyComprehensiveCollapsedState();

    // 渲染图表（等 ECharts 加载完成）
    if (typeof echarts !== 'undefined') {
      ChartRenderer.renderAll(MockData);
    } else {
      setTimeout(function () {
        ChartRenderer.renderAll(MockData);
      }, 500);
    }
  }

  /* ===== URL 参数解析 ===== */
  function parseUrlParams() {
    var params = new URLSearchParams(window.location.search);
    var raw = params.get('enterprises');
    if (raw) {
      selectedEnterpriseIds = raw.split(',').map(function (s) {
        return s.trim();
      }).filter(function (s) {
        return s;
      });
    }
  }

  /* ===== 确定性随机数（基于企业 ID 生成稳定数据） ===== */
  function stringHash(str) {
    var hash = 0;
    if (!str) return hash;
    for (var i = 0; i < str.length; i++) {
      var chr = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0;
    }
    return Math.abs(hash);
  }

  function createSeededRandom(seed) {
    var s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return function () {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
  }

  /* ===== 链主企业详情区域渲染 ===== */
  function renderEnterpriseDetails(enterpriseIds) {
    var container = document.getElementById('enterpriseDetailsContent');
    var loading = document.getElementById('enterpriseDetailsLoading');
    if (!container) return;

    showEnterpriseLoading(true);

    // 模拟异步加载，提升感知性能
    setTimeout(function () {
      var enterprises = [];
      enterpriseIds.forEach(function (id) {
        var ent = findEnterpriseById(id);
        if (ent) {
          enterprises.push(ent);
        }
      });

      if (enterprises.length === 0) {
        container.innerHTML = buildNoEnterpriseHTML();
        showEnterpriseLoading(false);
        bindEnterpriseDetailEvents();
        return;
      }

      var html = '<div class="enterprise-details__list">' +
        enterprises.map(function (ent, index) {
          return buildEnterpriseDetailHTML(ent, index);
        }).join('') +
        '</div>';

      container.innerHTML = html;
      showEnterpriseLoading(false);
      bindEnterpriseDetailEvents();

      // 默认展开前两家，其余折叠
      enterprises.forEach(function (ent, index) {
        if (index > 1) {
          collapseEnterpriseDetail(index, false);
        }
      });
    }, 350);
  }

  function renderEnterpriseEmptyState() {
    var container = document.getElementById('enterpriseDetailsContent');
    var loading = document.getElementById('enterpriseDetailsLoading');
    if (!container) return;
    if (loading) loading.style.display = 'none';
    container.innerHTML = buildNoEnterpriseHTML();
  }

  function showEnterpriseLoading(show) {
    var loading = document.getElementById('enterpriseDetailsLoading');
    var content = document.getElementById('enterpriseDetailsContent');
    if (loading) loading.style.display = show ? 'flex' : 'none';
    if (content) content.style.opacity = show ? '0.5' : '1';
  }

  function findEnterpriseById(id) {
    if (typeof ALL_ENTERPRISES !== 'undefined' && ALL_ENTERPRISES.length > 0) {
      var found = ALL_ENTERPRISES.find(function (e) {
        return e.id === id;
      });
      if (found) return found;
    }

    // 从产业链环节企业映射中查找（chain-node-detail 页面勾选的企业来源）
    if (typeof MOCK_ENTERPRISES !== 'undefined') {
      for (var nodeId in MOCK_ENTERPRISES) {
        if (!MOCK_ENTERPRISES.hasOwnProperty(nodeId)) continue;
        var list = MOCK_ENTERPRISES[nodeId];
        if (!Array.isArray(list)) continue;
        var matched = list.find(function (e) {
          return e && e.id === id;
        });
        if (matched) {
          return createEnterpriseFromMock(matched);
        }
      }
    }

    // 兜底：使用 mock 数据中的供应商 id 反查名称
    var supplier = MockData.upstream.suppliers.find(function (s) {
      return s.id === id;
    });
    if (supplier) {
      return {
        id: supplier.id,
        name: supplier.name,
        annual_revenue: supplier.amount ? supplier.amount / 10000 : 1,
        registered_capital: 5000,
        establishment_date: '2015-06-18',
        credit_code: '91440300' + String(Math.floor(Math.random() * 1e12)).padStart(12, '0'),
        register_address: supplier.province,
        industry_role_label: '上游供应商',
        is_local: false
      };
    }
    return null;
  }

  function createEnterpriseFromMock(ent) {
    if (!ent || !ent.id) return null;
    var seed = stringHash(ent.id);
    var rand = createSeededRandom(seed);
    var rnd = function (min, max) {
      return min + rand() * (max - min);
    };
    var rndInt = function (min, max) {
      return min + Math.floor(rand() * (max - min + 1));
    };
    return {
      id: ent.id,
      name: ent.name || ent.enterprise_name || '未知企业',
      annual_revenue: ent.annual_revenue || rnd(0.5, 50.5),
      registered_capital: ent.registered_capital || rndInt(500, 50500),
      establishment_date: ent.establishment_date || ent.founded_date || (2000 + rndInt(0, 23)) + '-' + String(rndInt(1, 12)).padStart(2, '0') + '-' + String(rndInt(1, 28)).padStart(2, '0'),
      credit_code: ent.credit_code || '91440300' + Math.floor(rand() * 1e12).toString().padStart(12, '0'),
      register_address: ent.register_address || ent.address || '深圳市南山区高新技术产业区',
      industry_role: ent.industry_role || 'parts_supplier',
      industry_role_label: ent.industry_role_label || '零部件供应商',
      is_local: ent.is_local !== false
    };
  }

  function buildNoEnterpriseHTML() {
    return '<div class="enterprise-details__empty">' +
      '<div class="enterprise-details__empty-icon">🏭</div>' +
      '<div class="enterprise-details__empty-title">未选择链主企业</div>' +
      '<div class="enterprise-details__empty-desc">请从产业链环节详情页勾选企业后进入本页，查看发票数据穿透分析。</div>' +
      '</div>';
  }

  function buildEnterpriseDetailHTML(enterprise, index) {
    var orderLabel = getOrderLabel(index);
    var invoiceData = buildEnterpriseInvoiceData(enterprise);
    var isCollapsed = enterpriseCollapsedState[index] === true;

    return '<div class="enterprise-detail-card" data-enterprise-index="' + index + '" data-enterprise-id="' + escapeHtml(enterprise.id) + '">' +
      '<div class="enterprise-detail-card__header" role="button" tabindex="0" aria-expanded="' + (!isCollapsed) + '" aria-controls="enterprise-detail-body-' + index + '">' +
      '<div class="enterprise-detail-card__title-group">' +
      '<span class="enterprise-detail-card__order">' + orderLabel + '</span>' +
      '<div class="enterprise-detail-card__info">' +
      '<div class="enterprise-detail-card__name">' + escapeHtml(enterprise.name) + '</div>' +
      '<div class="enterprise-detail-card__meta">' +
      '<span>注册资本 ' + fmtNum(enterprise.registered_capital || 0) + ' 万人民币</span>' +
      '<span class="meta-sep">·</span>' +
      '<span>年营收 ' + fmtNum(enterprise.annual_revenue || 0) + ' 亿元</span>' +
      '<span class="meta-sep">·</span>' +
      '<span>成立 ' + escapeHtml(enterprise.establishment_date || '-') + '</span>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '<div class="enterprise-detail-card__toggle">' +
      '<svg class="enterprise-detail-card__toggle-icon ' + (isCollapsed ? 'is-collapsed' : '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>' +
      '<span class="enterprise-detail-card__toggle-text">' + (isCollapsed ? '展开' : '收起') + '</span>' +
      '</div>' +
      '</div>' +
      '<div class="enterprise-detail-card__body" id="enterprise-detail-body-' + index + '" style="' + (isCollapsed ? 'display:none;' : '') + '">' +
      // 发票核心指标
      '<div class="enterprise-invoice-metrics">' +
      '<div class="enterprise-invoice-metric">' +
      '<div class="enterprise-invoice-metric__label">年度进项发票总额</div>' +
      '<div class="enterprise-invoice-metric__value">' + fmtNum(invoiceData.inputAmount) + ' <span>万元</span></div>' +
      '</div>' +
      '<div class="enterprise-invoice-metric">' +
      '<div class="enterprise-invoice-metric__label">年度销项发票总额</div>' +
      '<div class="enterprise-invoice-metric__value">' + fmtNum(invoiceData.outputAmount) + ' <span>万元</span></div>' +
      '</div>' +
      '<div class="enterprise-invoice-metric">' +
      '<div class="enterprise-invoice-metric__label">上游供应商数量</div>' +
      '<div class="enterprise-invoice-metric__value">' + invoiceData.suppliers.length + ' <span>家</span></div>' +
      '</div>' +
      '<div class="enterprise-invoice-metric">' +
      '<div class="enterprise-invoice-metric__label">下游客户数量</div>' +
      '<div class="enterprise-invoice-metric__value">' + invoiceData.customers.length + ' <span>家</span></div>' +
      '</div>' +
      '</div>' +
      // 供应商清单
      '<div class="enterprise-detail-block">' +
      '<div class="enterprise-detail-block__header">' +
      '<span class="enterprise-detail-block__title">上游供应商清单（TOP5）</span>' +
      '<button class="btn btn--outline btn--sm" data-action="view-enterprise-suppliers" data-enterprise-index="' + index + '">查看全部供应商</button>' +
      '</div>' +
      '<div class="enterprise-table-wrap">' + buildSupplierRowsHTML(invoiceData.suppliers.slice(0, 5), index, true) + '</div>' +
      '</div>' +
      // 客户清单
      '<div class="enterprise-detail-block">' +
      '<div class="enterprise-detail-block__header">' +
      '<span class="enterprise-detail-block__title">下游客户清单（TOP5）</span>' +
      '<button class="btn btn--outline btn--sm" data-action="view-enterprise-customers" data-enterprise-index="' + index + '">查看全部客户</button>' +
      '</div>' +
      '<div class="enterprise-table-wrap">' + buildCustomerRowsHTML(invoiceData.customers.slice(0, 5), index, true) + '</div>' +
      '</div>' +
      // AI 解读
      '<div class="enterprise-detail-insight">' +
      '<div class="enterprise-detail-insight__label">🤖 AI 发票穿透解读</div>' +
      '<div class="enterprise-detail-insight__text">' + escapeHtml(invoiceData.insight) + '</div>' +
      '</div>' +
      '</div>' +
      '</div>';
  }

  function getOrderLabel(index) {
    var labels = ['第一家', '第二家', '第三家', '第四家', '第五家', '第六家', '第七家', '第八家', '第九家', '第十家'];
    return labels[index] || ('第' + (index + 1) + '家');
  }

  function escapeHtml(text) {
    if (text == null) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /* ===== 基于企业 ID 生成稳定的发票穿透数据 ===== */
  function buildEnterpriseInvoiceData(enterprise) {
    var seed = stringHash(enterprise.id);
    var rand = createSeededRandom(seed);
    var rnd = function (min, max) {
      return min + rand() * (max - min);
    };
    var rndInt = function (min, max) {
      return min + Math.floor(rand() * (max - min + 1));
    };

    var baseRevenue = enterprise.annual_revenue || 1;
    var inputAmount = Math.round(baseRevenue * 10000 * rnd(0.45, 0.85));
    var outputAmount = Math.round(baseRevenue * 10000 * rnd(0.55, 0.95));

    // 供应商：基于全局供应商数据，按企业种子扰动顺序与金额
    var suppliers = generateEnterpriseSuppliers(seed, rnd, rndInt, inputAmount);
    // 客户：基于全局客户数据，按企业种子扰动顺序与金额
    var customers = generateEnterpriseCustomers(seed, rnd, rndInt, outputAmount);

    var localSupplierCount = suppliers.filter(function (s) {
      return s.province && s.province.indexOf('广东') > -1;
    }).length;
    var localCustomerCount = customers.filter(function (c) {
      return c.province && c.province.indexOf('广东') > -1;
    }).length;

    var insight = enterprise.name + ' 年度进项发票 ' + fmtNum(inputAmount) + ' 万元，销项发票 ' + fmtNum(outputAmount) + ' 万元。' +
      '上游供应商中本地（广东省）占比 ' + Math.round(localSupplierCount / Math.max(suppliers.length, 1) * 100) + '%，' +
      '下游客户中本地占比 ' + Math.round(localCustomerCount / Math.max(customers.length, 1) * 100) + '%。' +
      '建议优先围绕 ' + (suppliers[0] ? suppliers[0].category : '核心原材料') + ' 环节开展补链招商，降低外地采购依赖。';

    return {
      inputAmount: inputAmount,
      outputAmount: outputAmount,
      suppliers: suppliers,
      customers: customers,
      insight: insight
    };
  }

  function generateEnterpriseSuppliers(seed, rnd, rndInt, totalAmount) {
    var all = MockData.upstream.suppliers.slice();
    // Fisher-Yates 洗牌（基于种子）
    for (var i = all.length - 1; i > 0; i--) {
      var j = Math.floor(rnd(0, i + 1));
      var temp = all[i];
      all[i] = all[j];
      all[j] = temp;
    }

    var count = Math.min(all.length, rndInt(6, 12));
    var selected = all.slice(0, count);
    var weights = selected.map(function () {
      return rnd(0.5, 1.5);
    });
    var weightSum = weights.reduce(function (sum, w) {
      return sum + w;
    }, 0);

    return selected.map(function (s, i) {
      var amount = Math.round(totalAmount * (weights[i] / weightSum) * rnd(0.85, 1.15));
      return {
        id: s.id || ('sup-' + i),
        name: s.name,
        province: s.province,
        category: s.category,
        amount: amount
      };
    }).sort(function (a, b) {
      return b.amount - a.amount;
    });
  }

  function generateEnterpriseCustomers(seed, rnd, rndInt, totalAmount) {
    var all = MockData.downstream.customers.slice();
    for (var i = all.length - 1; i > 0; i--) {
      var j = Math.floor(rnd(0, i + 1));
      var temp = all[i];
      all[i] = all[j];
      all[j] = temp;
    }

    var count = Math.min(all.length, rndInt(5, 10));
    var selected = all.slice(0, count);
    var weights = selected.map(function () {
      return rnd(0.5, 1.5);
    });
    var weightSum = weights.reduce(function (sum, w) {
      return sum + w;
    }, 0);

    return selected.map(function (c, i) {
      var amount = Math.round(totalAmount * (weights[i] / weightSum) * rnd(0.85, 1.15));
      return {
        name: c.name,
        province: c.province,
        category: c.category,
        amount: amount
      };
    }).sort(function (a, b) {
      return b.amount - a.amount;
    });
  }

  function buildSupplierRowsHTML(suppliers, enterpriseIndex, showAddButton) {
    if (!suppliers || suppliers.length === 0) {
      return '<div class="enterprise-empty-tip">暂无供应商数据</div>';
    }
    var rows = suppliers.map(function (s, i) {
      return '<tr>' +
        '<td>' + escapeHtml(s.name) + '</td>' +
        '<td>' + escapeHtml(s.province) + '</td>' +
        '<td>' + escapeHtml(s.category) + '</td>' +
        '<td class="font-num text-primary">' + fmtNum(s.amount) + ' 万元</td>' +
        (showAddButton ? '<td><button class="btn btn--primary btn--sm btn-add-leads" data-type="supplier" data-enterprise-index="' + enterpriseIndex + '" data-item-index="' + i + '">加入招商库</button></td>' : '') +
        '</tr>';
    }).join('');

    return '<table class="data-table">' +
      '<thead><tr>' +
      '<th>供应商名称</th>' +
      '<th>所在省份</th>' +
      '<th>采购品类</th>' +
      '<th>年采购额</th>' +
      (showAddButton ? '<th style="width:110px">操作</th>' : '') +
      '</tr></thead>' +
      '<tbody>' + rows + '</tbody>' +
      '</table>';
  }

  function buildCustomerRowsHTML(customers, enterpriseIndex, showAddButton) {
    if (!customers || customers.length === 0) {
      return '<div class="enterprise-empty-tip">暂无客户数据</div>';
    }
    var rows = customers.map(function (c, i) {
      return '<tr>' +
        '<td>' + escapeHtml(c.name) + '</td>' +
        '<td>' + escapeHtml(c.province) + '</td>' +
        '<td>' + escapeHtml(c.category) + '</td>' +
        '<td class="font-num text-primary">' + fmtNum(c.amount) + ' 万元</td>' +
        (showAddButton ? '<td><button class="btn btn--primary btn--sm btn-add-leads" data-type="customer" data-enterprise-index="' + enterpriseIndex + '" data-item-index="' + i + '">加入招商库</button></td>' : '') +
        '</tr>';
    }).join('');

    return '<table class="data-table">' +
      '<thead><tr>' +
      '<th>客户名称</th>' +
      '<th>所在省份</th>' +
      '<th>销售品类</th>' +
      '<th>年销售额</th>' +
      (showAddButton ? '<th style="width:110px">操作</th>' : '') +
      '</tr></thead>' +
      '<tbody>' + rows + '</tbody>' +
      '</table>';
  }

  /* ===== 链主企业详情交互事件 ===== */
  function bindEnterpriseDetailEvents() {
    // 展开/折叠
    $$('.enterprise-detail-card__header').forEach(function (header) {
      header.addEventListener('click', function () {
        var card = header.closest('.enterprise-detail-card');
        var index = parseInt(card.dataset.enterpriseIndex, 10);
        toggleEnterpriseDetail(index);
      });
      header.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          var card = header.closest('.enterprise-detail-card');
          var index = parseInt(card.dataset.enterpriseIndex, 10);
          toggleEnterpriseDetail(index);
        }
      });
    });

    // 加入招商库
    $$('.btn-add-leads').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        addToLeads(btn);
      });
    });

    // 查看全部供应商 / 客户
    $$('[data-action="view-enterprise-suppliers"]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var index = parseInt(btn.dataset.enterpriseIndex, 10);
        showEnterpriseSupplierModal(index);
      });
    });

    $$('[data-action="view-enterprise-customers"]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var index = parseInt(btn.dataset.enterpriseIndex, 10);
        showEnterpriseCustomerModal(index);
      });
    });
  }

  function toggleEnterpriseDetail(index) {
    var card = $('.enterprise-detail-card[data-enterprise-index="' + index + '"]');
    if (!card) return;
    var body = card.querySelector('.enterprise-detail-card__body');
    var icon = card.querySelector('.enterprise-detail-card__toggle-icon');
    var text = card.querySelector('.enterprise-detail-card__toggle-text');
    var header = card.querySelector('.enterprise-detail-card__header');
    var isVisible = body.style.display !== 'none';

    if (isVisible) {
      body.style.display = 'none';
      if (icon) icon.classList.add('is-collapsed');
      if (text) text.textContent = '展开';
      enterpriseCollapsedState[index] = true;
      if (header) header.setAttribute('aria-expanded', 'false');
    } else {
      body.style.display = 'block';
      if (icon) icon.classList.remove('is-collapsed');
      if (text) text.textContent = '收起';
      enterpriseCollapsedState[index] = false;
      if (header) header.setAttribute('aria-expanded', 'true');
    }
  }

  function collapseEnterpriseDetail(index, animate) {
    var card = $('.enterprise-detail-card[data-enterprise-index="' + index + '"]');
    if (!card) return;
    var body = card.querySelector('.enterprise-detail-card__body');
    var icon = card.querySelector('.enterprise-detail-card__toggle-icon');
    var text = card.querySelector('.enterprise-detail-card__toggle-text');
    var header = card.querySelector('.enterprise-detail-card__header');
    if (body) body.style.display = 'none';
    if (icon) icon.classList.add('is-collapsed');
    if (text) text.textContent = '展开';
    enterpriseCollapsedState[index] = true;
    if (header) header.setAttribute('aria-expanded', 'false');
  }

  function addToLeads(btn) {
    var type = btn.dataset.type;
    var enterpriseIndex = btn.dataset.enterpriseIndex;
    var itemIndex = parseInt(btn.dataset.itemIndex, 10);
    var card = $('.enterprise-detail-card[data-enterprise-index="' + enterpriseIndex + '"]');
    if (!card) return;

    var enterpriseName = card.querySelector('.enterprise-detail-card__name').textContent;
    var row = btn.closest('tr');
    var cells = row.querySelectorAll('td');
    var targetName = cells[0] ? cells[0].textContent : '';

    // 模拟异步加入招商库
    btn.disabled = true;
    btn.textContent = '加入中…';

    setTimeout(function () {
      btn.disabled = false;
      btn.textContent = '已加入';
      btn.classList.remove('btn--primary');
      btn.classList.add('btn--ghost');
      toast('已将 “' + targetName + '” 加入招商库', 'success');
    }, 400);
  }

  function showEnterpriseSupplierModal(index) {
    var card = $('.enterprise-detail-card[data-enterprise-index="' + index + '"]');
    if (!card) return;
    var enterpriseId = card.dataset.enterpriseId;
    var enterpriseName = card.querySelector('.enterprise-detail-card__name').textContent;
    var enterprise = findEnterpriseById(enterpriseId);
    if (!enterprise) return;
    var invoiceData = buildEnterpriseInvoiceData(enterprise);

    openModal({
      title: enterpriseName + ' - 全部上游供应商清单',
      subtitle: '共 ' + invoiceData.suppliers.length + ' 家供应商 | 可一键加入招商库',
      size: 'large',
      bodyHTML: '<div class="enterprise-modal-toolbar">' +
        '<span class="enterprise-modal-count">供应商数量：<strong>' + invoiceData.suppliers.length + '</strong> 家</span>' +
        '</div>' +
        '<div class="modal-table-wrap">' + buildSupplierRowsHTML(invoiceData.suppliers, index, true) + '</div>',
      footerHTML: '<button class="btn btn--ghost" onclick="CommonUtil.closeModal()">关闭</button>',
      onMount: function (body) {
        bindAddLeadsButtons(body, index);
      }
    });
  }

  function showEnterpriseCustomerModal(index) {
    var card = $('.enterprise-detail-card[data-enterprise-index="' + index + '"]');
    if (!card) return;
    var enterpriseId = card.dataset.enterpriseId;
    var enterpriseName = card.querySelector('.enterprise-detail-card__name').textContent;
    var enterprise = findEnterpriseById(enterpriseId);
    if (!enterprise) return;
    var invoiceData = buildEnterpriseInvoiceData(enterprise);

    openModal({
      title: enterpriseName + ' - 全部下游客户清单',
      subtitle: '共 ' + invoiceData.customers.length + ' 家客户 | 可一键加入招商库',
      size: 'large',
      bodyHTML: '<div class="enterprise-modal-toolbar">' +
        '<span class="enterprise-modal-count">客户数量：<strong>' + invoiceData.customers.length + '</strong> 家</span>' +
        '</div>' +
        '<div class="modal-table-wrap">' + buildCustomerRowsHTML(invoiceData.customers, index, true) + '</div>',
      footerHTML: '<button class="btn btn--ghost" onclick="CommonUtil.closeModal()">关闭</button>',
      onMount: function (body) {
        bindAddLeadsButtons(body, index);
      }
    });
  }

  function bindAddLeadsButtons(container, enterpriseIndex) {
    $$('.btn-add-leads', container).forEach(function (btn) {
      btn.addEventListener('click', function () {
        addToLeads(btn);
      });
    });
  }

  /* ===== 全产业综合分析模块折叠状态 ===== */
  function bindComprehensiveSectionToggle() {
    var header = document.getElementById('comprehensiveSectionHeader');
    if (!header) return;
    header.addEventListener('click', toggleComprehensiveSection);
    header.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleComprehensiveSection();
      }
    });
  }

  function toggleComprehensiveSection() {
    comprehensiveCollapsed = !comprehensiveCollapsed;
    saveComprehensiveCollapsedState();
    applyComprehensiveCollapsedState();
  }

  function applyComprehensiveCollapsedState() {
    var body = document.getElementById('comprehensiveSectionBody');
    var header = document.getElementById('comprehensiveSectionHeader');
    var toggle = document.getElementById('comprehensiveSectionToggle');
    var icon = toggle ? toggle.querySelector('.toggle-icon') : null;
    var text = toggle ? toggle.querySelector('.toggle-text') : null;

    if (!body) return;
    if (comprehensiveCollapsed) {
      body.style.display = 'none';
      if (icon) icon.classList.add('is-collapsed');
      if (text) text.textContent = '展开';
      if (header) header.setAttribute('aria-expanded', 'false');
    } else {
      body.style.display = 'block';
      if (icon) icon.classList.remove('is-collapsed');
      if (text) text.textContent = '收起';
      if (header) header.setAttribute('aria-expanded', 'true');
      // 重新触发图表 resize，防止折叠后尺寸异常
      setTimeout(function () {
        if (typeof ChartRenderer !== 'undefined' && typeof ChartRenderer.resize === 'function') {
          ChartRenderer.resize();
        }
      }, 50);
    }
  }

  function saveComprehensiveCollapsedState() {
    try {
      localStorage.setItem(COMPREHENSIVE_STORAGE_KEY, comprehensiveCollapsed ? '1' : '0');
    } catch (e) {
      // 忽略隐私模式下的 localStorage 异常
    }
  }

  function loadComprehensiveCollapsedState() {
    try {
      var stored = localStorage.getItem(COMPREHENSIVE_STORAGE_KEY);
      comprehensiveCollapsed = stored === '1';
    } catch (e) {
      comprehensiveCollapsed = false;
    }
  }

  /* ===== 渲染头部 ===== */
  function renderHeader() {
    var chain = MockData.industryChain;
    var headerLeft = $('.dashboard__header-left');
    headerLeft.innerHTML = '';

    headerLeft.appendChild(el('div', {
      class: 'dashboard__title',
      text: chain.mainName
    }));
    headerLeft.appendChild(el('div', {
      class: 'dashboard__subtitle',
      text: '细分产业：' + chain.subName
    }));
    headerLeft.appendChild(el('div', {
      class: 'dashboard__disclaimer',
      text: chain.disclaimer
    }));
  }

  /* ===== 渲染指标卡片 ===== */
  function renderMetricCards() {
    var container = $('.metric-cards');
    container.innerHTML = '';

    var levelData = MockData.sampleConfig.levelData[currentLevel];
    var m = MockData.metrics;

    // 合并基础数据与当前级别数据
    var cards = [
      {
        label: m.totalOutput.label,
        value: levelData.totalOutput.value,
        unit: '亿元',
        trend: levelData.totalOutput.trend,
        trendType: 'up',
        cardClass: 'metric-card--info'
      },
      {
        label: m.externalDependency.label,
        value: levelData.externalDependency.value,
        unit: '%',
        trend: levelData.externalDependency.trend,
        trendType: 'down',
        cardClass: 'metric-card--warning'
      },
      {
        label: m.collaborationIndex.label,
        value: levelData.collaborationIndex.value,
        unit: '%',
        trend: levelData.collaborationIndex.trend,
        trendType: 'up',
        cardClass: 'metric-card--success'
      },
      {
        label: m.avgGrossMargin.label,
        value: levelData.avgGrossMargin.value,
        unit: '%',
        trend: levelData.avgGrossMargin.trend,
        trendType: 'up',
        cardClass: ''
      }
    ];

    cards.forEach(function (card) {
      var trendIcon = card.trendType === 'up' ? '\u25B2' : '\u25BC';

      var cardEl = el('div', { class: 'metric-card ' + card.cardClass });
      cardEl.appendChild(el('div', { class: 'metric-card__label', text: card.label }));

      var valueWrap = el('div', { class: 'metric-card__value-wrap' });
      valueWrap.appendChild(el('span', { class: 'metric-card__value', text: card.value }));
      valueWrap.appendChild(el('span', { class: 'metric-card__unit', text: card.unit }));
      cardEl.appendChild(valueWrap);

      cardEl.appendChild(el('div', {
        class: 'metric-card__trend metric-card__trend--' + card.trendType,
        html: '<span class="metric-card__trend-icon">' + trendIcon + '</span>' + card.trend
      }));

      container.appendChild(cardEl);
    });
  }

  /* ===== 渲染四大板块 ===== */
  function renderSections() {
    renderUpstreamSection();
    renderDownstreamSection();
    renderCollaborationSection();
    renderProductSection();
  }

  /* ----- 板块一：上游供应链 ----- */
  function renderUpstreamSection() {
    var data = MockData.upstream;

    // 核心指标
    var metricRow = $('#section-upstream .metric-row');
    metricRow.innerHTML = '';
    metricRow.appendChild(el('div', { class: 'metric-row__item' }, [
      el('span', { class: 'metric-row__label', text: '外地采购依赖度' }),
      el('span', { class: 'metric-row__value metric-row__value--warning', text: data.externalDependency }),
      el('span', { class: 'metric-row__unit', text: '%' })
    ]));

    // 风险提示框
    var riskBox = $('#section-upstream .risk-box');
    riskBox.innerHTML = '';
    riskBox.appendChild(el('span', {
      class: 'risk-box__icon',
      html: '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2L1 21h22L12 2zm0 3.83L19.53 19H4.47L12 5.83zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z"/></svg>'
    }));
    riskBox.appendChild(el('span', { class: 'risk-box__text', text: data.risk.text }));
  }

  /* ----- 板块二：下游市场 ----- */
  function renderDownstreamSection() {
    var data = MockData.downstream;

    var metricRow = $('#section-downstream .metric-row');
    metricRow.innerHTML = '';
    metricRow.appendChild(el('div', { class: 'metric-row__item' }, [
      el('span', { class: 'metric-row__label', text: '省内营收占比' }),
      el('span', { class: 'metric-row__value', text: data.intraProvinceRatio }),
      el('span', { class: 'metric-row__unit', text: '%' })
    ]));
    metricRow.appendChild(el('div', { class: 'metric-row__item' }, [
      el('span', { class: 'metric-row__label', text: '省外营收占比' }),
      el('span', { class: 'metric-row__value metric-row__value--primary', text: data.extraProvinceRatio }),
      el('span', { class: 'metric-row__unit', text: '%' })
    ]));

    // 解读文字
    var interp = $('#section-downstream .interpretation-text');
    if (interp) {
      interp.textContent = data.interpretation;
    }
  }

  /* ----- 板块三：本地产业链协同 ----- */
  function renderCollaborationSection() {
    var data = MockData.collaboration;

    var interp = $('#section-collaboration .interpretation-text');
    if (interp) {
      interp.textContent = data.interpretation;
    }
  }

  /* ----- 板块四：产业链产品结构 ----- */
  function renderProductSection() {
    var data = MockData.productStructure;

    var summary = $('#section-product .product-summary');
    if (summary) {
      summary.innerHTML = '';
      summary.appendChild(el('span', { class: 'metric-row__label', text: '当前核心高附加值赛道' }));
      summary.appendChild(el('span', {
        class: 'metric-row__value metric-row__value--primary',
        text: data.topTrack,
        style: { fontSize: '18px' }
      }));
    }
  }

  /* ===== 事件绑定 ===== */
  function bindEvents() {
    // 下拉选择
    var selector = $('#sample-selector');
    if (selector) {
      selector.addEventListener('change', function () {
        currentLevel = this.value;
        renderMetricCards();
        toast('已切换至 ' + currentLevel + ' 样本视图', 'info');
      });
    }

    // 按钮事件 - 使用事件委托
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-action]');
      if (!btn) return;

      var action = btn.dataset.action;

      switch (action) {
        case 'view-suppliers':
          showSupplierModal();
          break;
        case 'view-customers':
          showCustomerModal();
          break;
        case 'view-internal-transactions':
          showInternalTransactionModal();
          break;
        case 'view-product-detail':
          showProductDetailModal();
          break;
        case 'confirm-drill':
          toast('即将下钻跳转至明细子页面', 'info');
          break;
      }
    });
  }

  /* ===== 弹窗1：供应商清单 ===== */
  function showSupplierModal() {
    var suppliers = MockData.upstream.suppliers;
    var selectedSet = {};

    var tableHTML = buildSupplierTableHTML(suppliers, selectedSet);

    openModal({
      title: '上游供应商清单',
      subtitle: '共 ' + suppliers.length + ' 家供应商 | 可勾选企业加入招商线索库',
      size: 'large',
      bodyHTML:
        '<div class="supplier-modal__toolbar">' +
        '  <div class="supplier-modal__count">已选 <strong id="selected-count">0</strong> 家企业</div>' +
        '  <button class="btn btn--primary btn--sm" id="btn-add-leads">加入招商线索库</button>' +
        '</div>' +
        '<div class="modal-table-wrap">' + tableHTML + '</div>',
      footerHTML:
        '<button class="btn btn--ghost" onclick="CommonUtil.closeModal()">关闭</button>',
      onMount: function (body) {
        // 勾选事件
        var checkboxes = $$('.supplier-checkbox', body);
        checkboxes.forEach(function (cb) {
          cb.addEventListener('change', function () {
            var idx = parseInt(this.dataset.idx);
            selectedSet[idx] = this.checked;
            var count = Object.keys(selectedSet).filter(function (k) {
              return selectedSet[k];
            }).length;
            var countEl = $('#selected-count', body);
            if (countEl) countEl.textContent = count;
          });
        });

        // 查看档案 -> 跳转企业全息画像页
        $$('.btn-view-profile', body).forEach(function (btn) {
          btn.addEventListener('click', function () {
            var idx = parseInt(this.dataset.idx);
            var supplier = suppliers[idx];
            if (!supplier || !supplier.id) {
              toast('该企业暂无档案信息', 'warning');
              return;
            }
            window.location.href = 'enterprise-profile.html?enterpriseId=' + encodeURIComponent(supplier.id);
          });
        });

        // 加入线索库
        var addBtn = $('#btn-add-leads', body);
        if (addBtn) {
          addBtn.addEventListener('click', function () {
            var selected = Object.keys(selectedSet).filter(function (k) {
              return selectedSet[k];
            });
            if (selected.length === 0) {
              toast('请先勾选企业', 'warning');
              return;
            }
            toast('已将 ' + selected.length + ' 家企业加入招商线索库', 'success');
          });
        }

        // 行内“加入招商库”按钮
        bindModalAddLeads(body);
      }
    });
  }

  function buildSupplierTableHTML(suppliers) {
    var rows = suppliers.map(function (s, i) {
      return '<tr>' +
        '<td style="text-align:center"><input type="checkbox" class="custom-checkbox supplier-checkbox" data-idx="' + i + '"></td>' +
        '<td>' + s.name + '</td>' +
        '<td>' + s.province + '</td>' +
        '<td>' + s.category + '</td>' +
        '<td class="font-num text-primary">' + fmtNum(s.amount) + ' 万元</td>' +
        '<td><button class="btn btn-add-leads btn--primary btn--sm" data-type="supplier" data-modal-idx="' + i + '">加入招商库</button></td>' +
        '<td><button class="btn btn--ghost btn--sm btn-view-profile" data-idx="' + i + '">查看档案</button></td>' +
        '</tr>';
    }).join('');

    return '<table class="data-table">' +
      '<thead><tr>' +
      '<th style="width:50px;text-align:center">勾选</th>' +
      '<th>企业名称</th>' +
      '<th>所在省份</th>' +
      '<th>采购品类</th>' +
      '<th>年采购额</th>' +
      '<th style="width:110px">招商</th>' +
      '<th style="width:100px">操作</th>' +
      '</tr></thead>' +
      '<tbody>' + rows + '</tbody>' +
      '</table>';
  }

  /* ===== 弹窗3：下游客户清单 ===== */
  function showCustomerModal() {
    var customers = MockData.downstream.customers;

    var rows = customers.map(function (c, i) {
      return '<tr>' +
        '<td>' + c.name + '</td>' +
        '<td>' + c.province + '</td>' +
        '<td>' + c.category + '</td>' +
        '<td class="font-num text-primary">' + fmtNum(c.amount) + ' 万元</td>' +
        '<td><button class="btn btn-add-leads btn--primary btn--sm" data-type="customer" data-modal-idx="' + i + '">加入招商库</button></td>' +
        '</tr>';
    }).join('');

    openModal({
      title: '下游客户清单',
      subtitle: '共 ' + customers.length + ' 家客户 | 按年销售额降序排列',
      size: 'large',
      bodyHTML:
        '<div class="modal-table-wrap">' +
        '<table class="data-table">' +
        '<thead><tr>' +
        '<th>客户名称</th>' +
        '<th>所在省份</th>' +
        '<th>销售品类</th>' +
        '<th>年销售额</th>' +
        '<th style="width:110px">操作</th>' +
        '</tr></thead>' +
        '<tbody>' + rows + '</tbody>' +
        '</table>' +
        '</div>',
      footerHTML:
        '<button class="btn btn--ghost" onclick="CommonUtil.closeModal()">关闭</button>',
      onMount: function (body) {
        bindModalAddLeads(body);
      }
    });
  }

  /* ===== 弹窗4：龙头内部交易明细 ===== */
  function showInternalTransactionModal() {
    var transactions = MockData.collaboration.internalTransactions;

    var rows = transactions.map(function (t) {
      return '<tr>' +
        '<td>' + t.buyer + '</td>' +
        '<td>' + t.supplier + '</td>' +
        '<td>' + t.category + '</td>' +
        '<td class="font-num text-primary">' + fmtNum(t.amount) + ' 万元</td>' +
        '</tr>';
    }).join('');

    openModal({
      title: '龙头内部交易明细',
      subtitle: 'TOP5 龙头企业互相采购往来清单',
      size: 'large',
      bodyHTML:
        '<div class="modal-table-wrap">' +
        '<table class="data-table">' +
        '<thead><tr>' +
        '<th>采购方</th>' +
        '<th>供应方</th>' +
        '<th>交易品类</th>' +
        '<th>交易金额</th>' +
        '</tr></thead>' +
        '<tbody>' + rows + '</tbody>' +
        '</table>' +
        '</div>',
      footerHTML:
        '<button class="btn btn--ghost" onclick="CommonUtil.closeModal()">关闭</button>'
    });
  }

  /* ===== 弹窗5：产品完整明细 ===== */
  function showProductDetailModal() {
    var products = MockData.productStructure.products;

    var rows = products.map(function (p) {
      return '<tr>' +
        '<td>' + p.name + '</td>' +
        '<td class="font-num text-primary">' + p.value + '%</td>' +
        '<td class="font-num">' + p.margin + '%</td>' +
        '<td><span class="level-tag ' + levelClass(p.level) + '">' + p.level + '</span></td>' +
        '</tr>';
    }).join('');

    openModal({
      title: '产业链产品完整明细',
      subtitle: '各产品类目营收占比、毛利率及附加值等级',
      size: 'large',
      bodyHTML:
        '<div class="product-modal__summary">' +
        '<span class="product-modal__summary-label">当前核心高附加值赛道</span>' +
        '<span class="product-modal__summary-value">' + MockData.productStructure.topTrack + '</span>' +
        '</div>' +
        '<div class="modal-table-wrap">' +
        '<table class="data-table">' +
        '<thead><tr>' +
        '<th>产品类目</th>' +
        '<th>营收占比</th>' +
        '<th>测算毛利率</th>' +
        '<th>附加值等级</th>' +
        '</tr></thead>' +
        '<tbody>' + rows + '</tbody>' +
        '</table>' +
        '</div>',
      footerHTML:
        '<button class="btn btn--ghost" onclick="CommonUtil.closeModal()">关闭</button>'
    });
  }

  /* ===== 弹窗内“加入招商库”统一反馈 ===== */
  function bindModalAddLeads(container) {
    $$('.btn-add-leads', container).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var row = btn.closest('tr');
        var targetName = row ? row.querySelector('td').textContent : '';
        btn.disabled = true;
        btn.textContent = '加入中…';
        setTimeout(function () {
          btn.disabled = false;
          btn.textContent = '已加入';
          btn.classList.remove('btn--primary');
          btn.classList.add('btn--ghost');
          toast('已将 “' + targetName + '” 加入招商库', 'success');
        }, 400);
      });
    });
  }

  /* ===== DOM Ready 后初始化 ===== */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
