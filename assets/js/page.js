/**
 * ============================================================
 * page.js - 页面业务交互逻辑
 * 包含：下拉切换、按钮事件、弹窗内容生成、招商推演逻辑
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

  /* ===== 页面初始化 ===== */
  function init() {
    renderHeader();
    renderMetricCards();
    renderSections();
    bindEvents();

    // 渲染图表（等 ECharts 加载完成）
    if (typeof echarts !== 'undefined') {
      ChartRenderer.renderAll(MockData);
    } else {
      setTimeout(function () {
        ChartRenderer.renderAll(MockData);
      }, 500);
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
        case 'invest-simulation':
          showInvestModal();
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

    var tableHTML = buildSupplierTableHTML(suppliers);

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

        // 查看档案
        $$('.btn-view-profile', body).forEach(function (btn) {
          btn.addEventListener('click', function () {
            var idx = parseInt(this.dataset.idx);
            var supplier = suppliers[idx];
            toast('查看企业档案：' + supplier.name, 'info');
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
      '<th style="width:100px">操作</th>' +
      '</tr></thead>' +
      '<tbody>' + rows + '</tbody>' +
      '</table>';
  }

  /* ===== 弹窗2：招商模拟推演 ===== */
  function showInvestModal() {
    var targets = MockData.upstream.investmentTargets;
    var baseline = MockData.upstream.baseline;
    var selectedSet = {};

    openModal({
      title: '招商模拟推演',
      subtitle: '勾选意向招商企业，查看落地后产业链指标变化预估',
      size: 'large',
      bodyHTML: buildInvestModalHTML(targets, baseline),
      footerHTML:
        '<button class="btn btn--ghost" onclick="CommonUtil.closeModal()">关闭</button>' +
        '<button class="btn btn--primary" id="btn-run-simulation">运行推演</button>',
      onMount: function (body) {
        // 勾选事件 -> 实时更新推演结果
        var checkboxes = $$('.invest-checkbox', body);
        checkboxes.forEach(function (cb) {
          cb.addEventListener('change', function () {
            var idx = parseInt(this.dataset.idx);
            selectedSet[idx] = this.checked;
            updateSimulationResult(body, targets, baseline, selectedSet);
          });
        });

        // 运行推演按钮
        var runBtn = $('#btn-run-simulation', body);
        if (runBtn) {
          runBtn.addEventListener('click', function () {
            var selected = Object.keys(selectedSet).filter(function (k) {
              return selectedSet[k];
            });
            if (selected.length === 0) {
              toast('请先勾选意向招商企业', 'warning');
              return;
            }
            toast('推演完成：预计新增产值 ' + calcNewOutput(targets, selectedSet).toFixed(1) + ' 亿元', 'success');
          });
        }
      }
    });
  }

  function buildInvestModalHTML(targets, baseline) {
    // 目标企业列表
    var targetRows = targets.map(function (t, i) {
      return '<tr>' +
        '<td style="text-align:center"><input type="checkbox" class="custom-checkbox invest-checkbox" data-idx="' + i + '"></td>' +
        '<td>' + t.name + '</td>' +
        '<td>' + t.province + '</td>' +
        '<td>' + t.category + '</td>' +
        '<td class="font-num text-primary-color">' + t.estOutput + ' 亿元</td>' +
        '<td class="font-num text-primary-color">+' + t.estCompleteness + '%</td>' +
        '</tr>';
    }).join('');

    return '<div class="invest-modal__section">' +
      '<div class="invest-modal__section-title">意向招商企业清单（勾选进行模拟）</div>' +
      '<div class="modal-table-wrap">' +
      '<table class="data-table">' +
      '<thead><tr>' +
      '<th style="width:50px;text-align:center">勾选</th>' +
      '<th>企业名称</th>' +
      '<th>所在省份</th>' +
      '<th>产品品类</th>' +
      '<th>预估新增产值</th>' +
      '<th>预估完备度提升</th>' +
      '</tr></thead>' +
      '<tbody>' + targetRows + '</tbody>' +
      '</table>' +
      '</div>' +
      '</div>' +
      '<div class="invest-modal__section">' +
      '<div class="invest-modal__section-title">推演结果对比</div>' +
      '<div class="invest-modal__compare">' +
      '  <div class="compare-card compare-card--before">' +
      '    <div class="compare-card__label">当前基线（实测数据）</div>' +
      '    <div class="compare-card__items">' +
      '      <div class="compare-card__item"><span class="compare-card__item-label">产业链完备度</span><span class="compare-card__item-value" id="before-completeness">' + baseline.completeness + '%</span></div>' +
      '      <div class="compare-card__item"><span class="compare-card__item-label">龙头合计产值</span><span class="compare-card__item-value" id="before-output">' + baseline.totalOutput + ' 亿元</span></div>' +
      '      <div class="compare-card__item"><span class="compare-card__item-label">外地采购依赖度</span><span class="compare-card__item-value" id="before-dependency">' + baseline.externalDependency + '%</span></div>' +
      '    </div>' +
      '  </div>' +
      '  <div class="compare-card compare-card--after">' +
      '    <div class="compare-card__label">推演预测（招商落地后）</div>' +
      '    <div class="compare-card__items">' +
      '      <div class="compare-card__item"><span class="compare-card__item-label">产业链完备度</span><span class="compare-card__item-value" id="after-completeness">' + baseline.completeness + '%<span class="compare-card__item-delta" id="delta-completeness"></span></span></div>' +
      '      <div class="compare-card__item"><span class="compare-card__item-label">龙头合计产值</span><span class="compare-card__item-value" id="after-output">' + baseline.totalOutput + ' 亿元<span class="compare-card__item-delta" id="delta-output"></span></span></div>' +
      '      <div class="compare-card__item"><span class="compare-card__item-label">外地采购依赖度</span><span class="compare-card__item-value" id="after-dependency">' + baseline.externalDependency + '%<span class="compare-card__item-delta" id="delta-dependency"></span></span></div>' +
      '    </div>' +
      '  </div>' +
      '</div>' +
      '<div style="font-size:12px;color:#86909C;padding:8px 0;">* 推演预测数据为理想化模型测算结果，仅供决策参考</div>' +
      '</div>';
  }

  function calcNewOutput(targets, selectedSet) {
    var total = 0;
    for (var k in selectedSet) {
      if (selectedSet[k]) {
        total += targets[parseInt(k)].estOutput;
      }
    }
    return total;
  }

  function calcCompletenessGain(targets, selectedSet) {
    var total = 0;
    for (var k in selectedSet) {
      if (selectedSet[k]) {
        total += targets[parseInt(k)].estCompleteness;
      }
    }
    return total;
  }

  function updateSimulationResult(body, targets, baseline, selectedSet) {
    var newOutput = calcNewOutput(targets, selectedSet);
    var completenessGain = calcCompletenessGain(targets, selectedSet);
    var dependencyReduction = completenessGain * 0.4; // 依赖度下降系数

    var afterCompleteness = (baseline.completeness + completenessGain).toFixed(1);
    var afterOutput = (baseline.totalOutput + newOutput).toFixed(1);
    var afterDependency = Math.max(0, baseline.externalDependency - dependencyReduction).toFixed(1);

    var elAfterC = $('#after-completeness', body);
    var elAfterO = $('#after-output', body);
    var elAfterD = $('#after-dependency', body);

    if (elAfterC) elAfterC.innerHTML = afterCompleteness + '%<span class="compare-card__item-delta">+' + completenessGain.toFixed(1) + '%</span>';
    if (elAfterO) elAfterO.innerHTML = afterOutput + ' 亿元<span class="compare-card__item-delta">+' + newOutput.toFixed(1) + '</span>';
    if (elAfterD) elAfterD.innerHTML = afterDependency + '%<span class="compare-card__item-delta">-' + dependencyReduction.toFixed(1) + '%</span>';
  }

  /* ===== 弹窗3：下游客户清单 ===== */
  function showCustomerModal() {
    var customers = MockData.downstream.customers;

    var rows = customers.map(function (c) {
      return '<tr>' +
        '<td>' + c.name + '</td>' +
        '<td>' + c.province + '</td>' +
        '<td>' + c.category + '</td>' +
        '<td class="font-num text-primary">' + fmtNum(c.amount) + ' 万元</td>' +
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
        '</tr></thead>' +
        '<tbody>' + rows + '</tbody>' +
        '</table>' +
        '</div>',
      footerHTML:
        '<button class="btn btn--ghost" onclick="CommonUtil.closeModal()">关闭</button>'
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

  /* ===== DOM Ready 后初始化 ===== */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
