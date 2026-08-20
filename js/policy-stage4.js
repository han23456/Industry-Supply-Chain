(function () {
  'use strict';

  /* ============================================================
     政策分析第四阶段：政策成效分析（对比与绩效评估）
     原生 JS 业务逻辑
     ============================================================ */

  // ---- 工具函数 ----
  function escapeHtml(text) {
    if (text == null) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatNumber(num) {
    return num.toLocaleString('zh-CN');
  }

  // ---- Mock 数据：200 家企业 ----
  const ABNORMAL_REASONS = ['已破产清算', '涉嫌跑路拦截', '违规已追回资金', '经营异常移出', '跨区迁移注销'];
  const TOTAL_COMPANIES = 200;
  const companies = [];

  for (let i = 1; i <= TOTAL_COMPANIES; i++) {
    const isAbnormal = i > 180; // 后 20 家为异常企业
    const abnormalIndex = i - 181;
    companies.push({
      id: i,
      name: isAbnormal
        ? `某某异常违规企业 ${abnormalIndex + 1} 号`
        : `深圳市精工科技股份有限公司 ${i} 号`,
      amount: isAbnormal ? 50 : 50 + (i % 5) * 10, // 补贴额度（万元）
      status: isAbnormal ? 'abnormal' : 'normal',
      reason: isAbnormal ? ABNORMAL_REASONS[abnormalIndex % ABNORMAL_REASONS.length] : '发放成功',
      checked: !isAbnormal, // 默认正常企业勾选，异常企业不勾选
      productionContribution: Math.floor(Math.random() * 500) + 200,
      patentCount: isAbnormal ? 0 : Math.floor(Math.random() * 5) + 1
    });
  }

  // ---- 核心指标默认值 ----
  const BASE_STATS = {
    spec: 12,
    highTech: 28,
    patent: 342,
    funding: 7,
    employmentGrowth: 8.4
  };

  // ---- 图表基础数据 ----
  const LABELS_12_MONTHS = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'M12'];
  const baseDataBefore = [3200, 3100, 3300, 3400, 3350, 3500, 3600, 3550, 3700, 3800, 3750, 3900];
  const baseDataAfter = [3950, 4200, 4500, 4700, 4850, 5100, 4900, 5000, 5300, 5600, 5800, 6100];
  const baseEmployment = [0.5, 1.2, 2.1, 3.0, 4.2, 5.5, 6.1, 6.8, 7.2, 7.8, 8.1, 8.4];

  let dualChart = null;
  let empChart = null;

  // ---- DOM 元素 ----
  const els = {};

  function cacheElements() {
    els.companyList = document.getElementById('ps4CompanyList');
    els.selectedCount = document.getElementById('ps4SelectedCount');
    els.totalCount = document.getElementById('ps4TotalCount');
    els.abnormalCountTag = document.getElementById('ps4AbnormalCountTag');
    els.searchInput = document.getElementById('ps4SearchInput');
    els.statusFilter = document.getElementById('ps4StatusFilter');
    els.btnReanalyze = document.getElementById('ps4BtnReanalyze');
    els.refreshIcon = document.getElementById('ps4RefreshIcon');
    els.btnExport = document.getElementById('ps4BtnExport');
    els.statSpec = document.getElementById('ps4StatSpec');
    els.statHighTech = document.getElementById('ps4StatHighTech');
    els.statPatent = document.getElementById('ps4StatPatent');
    els.statFunding = document.getElementById('ps4StatFunding');
    els.employmentGrowth = document.getElementById('ps4EmploymentGrowth');
    els.growthRateText = document.getElementById('ps4GrowthRateText');
    els.timestampInput = document.getElementById('ps4TimestampInput');
  }

  // ---- 企业列表渲染 ----
  function renderCompanyList(filterText, filterStatus) {
    filterText = (filterText || '').toLowerCase().trim();
    filterStatus = filterStatus || 'all';

    if (!els.companyList) return;

    els.companyList.innerHTML = '';

    const filtered = companies.filter(function (c) {
      const matchName = c.name.toLowerCase().includes(filterText);
      const matchStatus = filterStatus === 'all' ||
        (filterStatus === 'normal' && c.status === 'normal') ||
        (filterStatus === 'abnormal' && c.status === 'abnormal');
      return matchName && matchStatus;
    });

    filtered.forEach(function (c) {
      const item = document.createElement('div');
      const isAbnormal = c.status === 'abnormal';
      item.className = 'ps4-company-item' + (isAbnormal ? ' ps4-company-item--abnormal' : '');

      item.innerHTML =
        '<div class="ps4-company-main">' +
          '<input type="checkbox" data-id="' + c.id + '"' + (c.checked ? ' checked' : '') + ' class="company-checkbox">' +
          '<div class="ps4-company-info">' +
            '<p class="ps4-company-name" title="' + escapeHtml(c.name) + '">' + escapeHtml(c.name) + '</p>' +
            '<div class="ps4-company-tags">' +
              '<span class="ps4-company-tag">奖补: ' + c.amount + '万</span>' +
              (isAbnormal ? '<span class="ps4-company-tag ps4-company-tag--danger">' + escapeHtml(c.reason) + '</span>' : '') +
            '</div>' +
          '</div>' +
        '</div>' +
        '<span class="ps4-company-id">#' + c.id + '</span>';

      els.companyList.appendChild(item);
    });

    updateCounters();
    bindCheckboxEvents();
  }

  function updateCounters() {
    const totalChecked = companies.filter(function (c) { return c.checked; }).length;
    if (els.selectedCount) els.selectedCount.textContent = totalChecked;
    if (els.totalCount) els.totalCount.textContent = companies.length;
    if (els.abnormalCountTag) els.abnormalCountTag.textContent = companies.length - totalChecked;
  }

  function bindCheckboxEvents() {
    document.querySelectorAll('.company-checkbox').forEach(function (cb) {
      cb.addEventListener('change', function (e) {
        const id = parseInt(e.target.getAttribute('data-id'), 10);
        const targetCompany = companies.find(function (item) { return item.id === id; });
        if (targetCompany) {
          targetCompany.checked = e.target.checked;
        }
        updateCounters();
      });
    });
  }

  // ---- 图表初始化 ----
  function initCharts() {
    initDualChart();
    initEmploymentChart();
  }

  function initDualChart() {
    const ctx = document.getElementById('ps4DualTrendChart');
    if (!ctx || typeof Chart === 'undefined') return;

    dualChart = new Chart(ctx.getContext('2d'), {
      type: 'line',
      data: {
        labels: LABELS_12_MONTHS,
        datasets: [
          {
            label: '奖补后12个月 (实际总产值)',
            data: baseDataAfter.slice(),
            borderColor: '#4f46e5',
            backgroundColor: 'rgba(79, 70, 229, 0.05)',
            borderWidth: 3,
            tension: 0.3,
            fill: true,
            pointBackgroundColor: '#4f46e5',
            pointRadius: 4
          },
          {
            label: '奖补前12个月 (历史总产值)',
            data: baseDataBefore.slice(),
            borderColor: '#94a3b8',
            borderDash: [5, 5],
            borderWidth: 2,
            tension: 0.3,
            fill: false,
            pointBackgroundColor: '#94a3b8',
            pointRadius: 3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              boxWidth: 12,
              usePointStyle: true,
              font: { size: 11 }
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: function (context) {
                return context.dataset.label + ': ' + formatNumber(context.parsed.y) + ' 万元';
              }
            }
          }
        },
        scales: {
          y: {
            grid: { color: '#f1f5f9' },
            ticks: {
              font: { size: 10 },
              callback: function (value) { return formatNumber(value); }
            }
          },
          x: {
            grid: { display: false },
            ticks: { font: { size: 10 } }
          }
        }
      }
    });
  }

  function initEmploymentChart() {
    const ctx = document.getElementById('ps4EmploymentChart');
    if (!ctx || typeof Chart === 'undefined') return;

    empChart = new Chart(ctx.getContext('2d'), {
      type: 'line',
      data: {
        labels: LABELS_12_MONTHS,
        datasets: [{
          label: '就业带动比率增长 (%)',
          data: baseEmployment.slice(),
          borderColor: '#059669',
          backgroundColor: 'rgba(5, 150, 105, 0.1)',
          borderWidth: 2.5,
          tension: 0.2,
          fill: true,
          pointBackgroundColor: '#059669',
          pointRadius: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (ctx) {
                return '带动比增幅: +' + ctx.parsed.y + '%';
              }
            }
          }
        },
        scales: {
          y: {
            ticks: {
              callback: function (value) { return '+' + value + '%'; },
              font: { size: 10 }
            },
            grid: { color: '#f1f5f9' }
          },
          x: {
            grid: { display: false },
            ticks: { font: { size: 10 } }
          }
        }
      }
    });
  }

  // ---- 重算逻辑 ----
  function handleReanalyze() {
    if (!els.btnReanalyze || !els.refreshIcon) return;

    els.refreshIcon.classList.add('ps4-spin');
    els.btnReanalyze.disabled = true;

    setTimeout(function () {
      els.refreshIcon.classList.remove('ps4-spin');
      els.btnReanalyze.disabled = false;

      const checkedCompanies = companies.filter(function (c) { return c.checked; });
      const ratio = checkedCompanies.length / companies.length;

      // 更新核心指标
      if (els.statSpec) els.statSpec.textContent = formatNumber(Math.round(BASE_STATS.spec * (ratio / 0.9)));
      if (els.statHighTech) els.statHighTech.textContent = formatNumber(Math.round(BASE_STATS.highTech * (ratio / 0.9)));
      if (els.statPatent) els.statPatent.textContent = formatNumber(Math.round(BASE_STATS.patent * (ratio / 0.9)));
      if (els.statFunding) els.statFunding.textContent = formatNumber(Math.round(BASE_STATS.funding * (ratio / 0.9)));

      // 更新图表数据
      if (dualChart) {
        const updatedAfter = baseDataAfter.map(function (val) { return Math.round(val * (ratio + 0.1)); });
        const updatedBefore = baseDataBefore.map(function (val) { return Math.round(val * (ratio + 0.1)); });
        dualChart.data.datasets[0].data = updatedAfter;
        dualChart.data.datasets[1].data = updatedBefore;
        dualChart.update();
      }

      // 更新就业数据
      const newEmpGrowth = BASE_STATS.employmentGrowth * ratio;
      const updatedEmp = baseEmployment.map(function (val, idx) {
        return idx === baseEmployment.length - 1 ? parseFloat(newEmpGrowth.toFixed(1)) : val;
      });
      if (empChart) {
        empChart.data.datasets[0].data = updatedEmp;
        empChart.update();
      }
      if (els.employmentGrowth) els.employmentGrowth.textContent = '+' + newEmpGrowth.toFixed(1) + '%';

      // 更新增长率文案
      if (els.growthRateText) {
        const newGrowthRate = (14.2 * ratio).toFixed(1);
        els.growthRateText.textContent = newGrowthRate + '%';
      }

      alert('重算完成！已基于剩余的 ' + checkedCompanies.length + ' 家有效样本企业更新成效分析数据。');
    }, 600);
  }

  // ---- 事件绑定 ----
  function bindEvents() {
    if (els.searchInput) {
      els.searchInput.addEventListener('input', function () {
        renderCompanyList(els.searchInput.value, els.statusFilter ? els.statusFilter.value : 'all');
      });
    }

    if (els.statusFilter) {
      els.statusFilter.addEventListener('change', function () {
        renderCompanyList(els.searchInput ? els.searchInput.value : '', els.statusFilter.value);
      });
    }

    if (els.btnReanalyze) {
      els.btnReanalyze.addEventListener('click', handleReanalyze);
    }

    if (els.btnExport) {
      els.btnExport.addEventListener('click', function () {
        alert('正在导出《第四阶段：政策成效评估报告 (PDF)》，请稍候...');
      });
    }

    if (els.timestampInput) {
      els.timestampInput.addEventListener('change', function () {
        // 基准时间变更提示，不刷新数据
        console.log('基准时间已变更为：' + els.timestampInput.value);
      });
    }
  }

  // ---- 初始化入口 ----
  function init() {
    cacheElements();
    renderCompanyList('', 'all');
    initCharts();
    bindEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
