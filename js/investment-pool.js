/**
 * 招商引资模拟推演 - 招商库页面逻辑
 */

let allEnterprises = [];
let selectedIds = new Set();
let filteredEnterprises = [];
let currentPage = 1;
let pageSize = 5;
let searchKeyword = '';
let provinceFilter = '';
let categoryFilter = '';

const PROVINCE_CLASS_MAP = {
  gd: 'ip-province-gd',
  zj: 'ip-province-zj',
  sh: 'ip-province-sh',
  bj: 'ip-province-bj',
  js: 'ip-province-js',
  sd: 'ip-province-sd'
};

function init() {
  if (document.getElementById('breadcrumbContainer')) {
    document.getElementById('breadcrumbContainer').innerHTML = renderBreadcrumb('investment-pool.html');
  }

  // 加载数据
  const data = MOCK_INVESTMENT_POOL;
  allEnterprises = data.enterprises.map(e => ({ ...e }));

  // 默认选中
  data.defaultSelectedIds.forEach(id => selectedIds.add(id));

  // 初始化筛选选项
  initFilters();

  // 绑定事件
  bindEvents();

  // 初始渲染
  applyFilters();
  renderAll();
}

function initFilters() {
  const provinces = [...new Set(allEnterprises.map(e => e.province))].sort();
  const categories = [...new Set(allEnterprises.map(e => e.productCategory))].sort();

  const provinceSelect = document.getElementById('provinceFilter');
  provinceSelect.innerHTML = '<option value="">全部省份</option>' +
    provinces.map(p => `<option value="${p}">${p}</option>`).join('');

  const categorySelect = document.getElementById('categoryFilter');
  categorySelect.innerHTML = '<option value="">全部品类</option>' +
    categories.map(c => `<option value="${c}">${c}</option>`).join('');
}

function bindEvents() {
  // 搜索
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', debounce(() => {
    searchKeyword = searchInput.value.trim().toLowerCase();
    currentPage = 1;
    applyFilters();
    renderAll();
  }, 300));

  // 筛选
  document.getElementById('provinceFilter').addEventListener('change', (e) => {
    provinceFilter = e.target.value;
    currentPage = 1;
    applyFilters();
    renderAll();
  });

  document.getElementById('categoryFilter').addEventListener('change', (e) => {
    categoryFilter = e.target.value;
    currentPage = 1;
    applyFilters();
    renderAll();
  });

  // 全选
  document.getElementById('selectAllCheckbox').addEventListener('change', (e) => {
    const checked = e.target.checked;
    filteredEnterprises.forEach(ent => {
      if (checked) selectedIds.add(ent.id);
      else selectedIds.delete(ent.id);
    });
    renderTable();
    renderStats();
    renderForecast();
  });

  // 分页大小
  document.getElementById('pageSizeSelect').addEventListener('change', (e) => {
    pageSize = parseInt(e.target.value, 10);
    currentPage = 1;
    renderAll();
  });
}

function applyFilters() {
  filteredEnterprises = allEnterprises.filter(e => {
    const matchKeyword = !searchKeyword ||
      e.name.toLowerCase().includes(searchKeyword) ||
      e.relationSystem.toLowerCase().includes(searchKeyword) ||
      e.productCategory.toLowerCase().includes(searchKeyword);
    const matchProvince = !provinceFilter || e.province === provinceFilter;
    const matchCategory = !categoryFilter || e.productCategory === categoryFilter;
    return matchKeyword && matchProvince && matchCategory;
  });
}

function renderAll() {
  renderTable();
  renderStats();
  renderPagination();
  renderForecast();
}

function renderTable() {
  const tbody = document.getElementById('enterpriseTableBody');
  const start = (currentPage - 1) * pageSize;
  const end = Math.min(start + pageSize, filteredEnterprises.length);
  const pageData = filteredEnterprises.slice(start, end);

  if (pageData.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="ip-empty-state">
          <div class="ip-empty-state-icon">🔍</div>
          <div class="empty-state-title">暂无符合条件的企业</div>
          <p>请尝试调整搜索关键词或筛选条件</p>
        </td>
      </tr>
    `;
    updateSelectAllState(false, false);
    return;
  }

  tbody.innerHTML = pageData.map(e => {
    const checked = selectedIds.has(e.id) ? 'checked' : '';
    const provinceClass = PROVINCE_CLASS_MAP[e.provinceCode] || 'ip-province-default';
    return `
      <tr data-id="${e.id}">
        <td class="text-center">
          <input type="checkbox" class="row-checkbox" data-id="${e.id}" ${checked} aria-label="选择 ${e.name}">
        </td>
        <td><span class="ip-enterprise-name">${e.name}</span></td>
        <td><span class="ip-relation-system">↳ ${e.relationSystem}</span></td>
        <td><span class="ip-province-tag ${provinceClass}">${e.province}</span></td>
        <td><span class="ip-category-tag">${e.productCategory}</span></td>
        <td class="text-right"><span class="ip-output-value">${e.estimatedOutput.toFixed(1)} 亿元</span></td>
        <td class="text-right"><span class="ip-improvement">${e.completenessImprovement.toFixed(1)}%</span></td>
        <td class="text-center">
          <button class="ip-action-btn" onclick="removeEnterprise('${e.id}')" aria-label="移除 ${e.name}">移除</button>
        </td>
      </tr>
    `;
  }).join('');

  // 绑定行内复选框事件
  tbody.querySelectorAll('.row-checkbox').forEach(cb => {
    cb.addEventListener('change', (e) => {
      const id = e.target.dataset.id;
      if (e.target.checked) selectedIds.add(id);
      else selectedIds.delete(id);
      updateSelectAllState();
      renderStats();
      renderForecast();
    });
  });

  updateSelectAllState();
}

function updateSelectAllState(checked, indeterminate) {
  const selectAll = document.getElementById('selectAllCheckbox');
  if (typeof checked === 'boolean') {
    selectAll.checked = checked;
    selectAll.indeterminate = indeterminate;
    return;
  }

  if (filteredEnterprises.length === 0) {
    selectAll.checked = false;
    selectAll.indeterminate = false;
    return;
  }

  const selectedFilteredCount = filteredEnterprises.filter(e => selectedIds.has(e.id)).length;
  selectAll.checked = selectedFilteredCount === filteredEnterprises.length;
  selectAll.indeterminate = selectedFilteredCount > 0 && selectedFilteredCount < filteredEnterprises.length;
}

function renderStats() {
  document.getElementById('totalCount').textContent = allEnterprises.length;
  document.getElementById('selectedCount').textContent = selectedIds.size;
  document.getElementById('filteredCount').textContent = filteredEnterprises.length;

  const start = filteredEnterprises.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, filteredEnterprises.length);
  document.getElementById('pageStart').textContent = start;
  document.getElementById('pageEnd').textContent = end;
}

function renderPagination() {
  const container = document.getElementById('paginationButtons');
  const totalPages = Math.ceil(filteredEnterprises.length / pageSize) || 1;

  let html = `<button class="ip-page-btn" onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>上一页</button>`;

  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="ip-page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
  }

  html += `<button class="ip-page-btn" onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>下一页</button>`;

  container.innerHTML = html;
}

function goToPage(page) {
  const totalPages = Math.ceil(filteredEnterprises.length / pageSize) || 1;
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  renderTable();
  renderStats();
  renderPagination();
}

function renderForecast() {
  const data = MOCK_INVESTMENT_POOL;
  const baseline = data.baseline;
  const params = data.prediction;

  const selectedEnterprises = allEnterprises.filter(e => selectedIds.has(e.id));
  const totalOutputAdded = selectedEnterprises.reduce((sum, e) => sum + e.estimatedOutput, 0);
  const totalCompletenessAdded = selectedEnterprises.reduce((sum, e) => sum + e.completenessImprovement, 0);
  const totalLocalRateAdded = selectedEnterprises.reduce((sum, e) => sum + (e.localRateImprovement || 0), 0);

  // 预测指标
  const forecastLeaderOutput = baseline.leaderOutput + totalOutputAdded;
  const forecastCompleteness = Math.min(100, baseline.completeness + totalCompletenessAdded);
  const forecastLocalRate = Math.min(100, baseline.localSupportingRate + totalLocalRateAdded);

  // 新增纳税与就业
  const newTax = totalOutputAdded * params.taxPerOutput;
  const newJobs = Math.round(totalOutputAdded * params.jobsPerOutput);

  // 基线指标
  document.getElementById('baselineMetrics').innerHTML = `
    <div class="ip-metric-row">
      <span class="ip-metric-label">产业链完备度</span>
      <span class="ip-metric-value">${baseline.completeness.toFixed(1)}%</span>
    </div>
    <div class="ip-metric-row">
      <span class="ip-metric-label">龙头/链主合计产值</span>
      <span class="ip-metric-value">${formatNumber(baseline.leaderOutput)} 亿元</span>
    </div>
    <div class="ip-metric-row">
      <span class="ip-metric-label">产业链本地配套率</span>
      <span class="ip-metric-value">${baseline.localSupportingRate.toFixed(1)}%</span>
    </div>
  `;

  // 预测指标
  document.getElementById('forecastMetrics').innerHTML = `
    <div class="ip-metric-row">
      <span class="ip-metric-label">产业链完备度</span>
      <span class="ip-metric-value forecast">
        ${forecastCompleteness.toFixed(1)}%
        <span class="ip-metric-delta">${totalCompletenessAdded.toFixed(1)}%</span>
      </span>
    </div>
    <div class="ip-metric-row">
      <span class="ip-metric-label">龙头/链主合计产值</span>
      <span class="ip-metric-value forecast">
        ${formatNumber(forecastLeaderOutput)} 亿元
        <span class="ip-metric-delta">${totalOutputAdded.toFixed(1)}亿</span>
      </span>
    </div>
    <div class="ip-metric-row">
      <span class="ip-metric-label">产业链本地配套率</span>
      <span class="ip-metric-value forecast">
        ${forecastLocalRate.toFixed(1)}%
        <span class="ip-metric-delta">${(forecastLocalRate - baseline.localSupportingRate).toFixed(1)}%</span>
      </span>
    </div>
  `;

  // 额外指标
  document.getElementById('extraMetrics').innerHTML = `
    <div class="ip-extra-item">
      <span class="ip-extra-icon">💰</span>
      <span>预估引入新增年度纳税总额：</span>
      <span class="ip-extra-value primary">${newTax.toFixed(1)} 亿元</span>
    </div>
    <div class="ip-extra-item">
      <span class="ip-extra-icon">👥</span>
      <span>预估带动新增就业岗位：</span>
      <span class="ip-extra-value success">+ ${formatNumber(newJobs)} 人</span>
    </div>
  `;

  document.getElementById('resultSelectedCount').textContent = selectedIds.size;
}

function removeEnterprise(id) {
  selectedIds.delete(id);
  renderTable();
  renderStats();
  renderForecast();
  showToast('已移除该企业', 'info');
}

function resetSelection() {
  selectedIds.clear();
  MOCK_INVESTMENT_POOL.defaultSelectedIds.forEach(id => selectedIds.add(id));
  searchKeyword = '';
  provinceFilter = '';
  categoryFilter = '';
  currentPage = 1;

  document.getElementById('searchInput').value = '';
  document.getElementById('provinceFilter').value = '';
  document.getElementById('categoryFilter').value = '';

  applyFilters();
  renderAll();
  showToast('选择已重置', 'info');
}

function closeAndReset() {
  resetSelection();
  window.location.href = 'chain-gap.html';
}

function exportInvestmentReport() {
  const selected = allEnterprises.filter(e => selectedIds.has(e.id));
  const rows = [
    ['企业名称', '关联系统（链上企业）', '所在省份', '产品品类', '预估新增产值（亿元）', '预估完整度提升（%）']
  ];
  selected.forEach(e => {
    rows.push([e.name, e.relationSystem, e.province, e.productCategory, e.estimatedOutput.toFixed(1), e.completenessImprovement.toFixed(1)]);
  });
  exportCSV('招商引资模拟推演报告.csv', rows);

  openModal(
    '此页面显示',
    `<div style="font-size:14px;color:var(--text-secondary);line-height:1.8">
      招商引资模拟推演评估报告导出成功！
     </div>`,
    '<button class="btn btn-primary" onclick="closeModal()">确定</button>'
  );
}

function confirmInvestmentPlan() {
  const selected = allEnterprises.filter(e => selectedIds.has(e.id));
  if (selected.length === 0) {
    showToast('请至少选择一家企业', 'warning');
    return;
  }

  const names = selected.map(e => `【${e.name}】`).join('、');
  openModal(
    '此页面显示',
    `<div style="font-size:14px;color:var(--text-secondary);line-height:1.8">
      招商方案确认成功！已选定 ${names} 作为意向引进目标，测算报告已同步至招商系统。
     </div>`,
    '<button class="btn btn-primary" onclick="closeModal();showToast(\'招商方案已确认\', \'success\')">确定</button>'
  );
}

// 启动
init();
