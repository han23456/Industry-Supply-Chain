/**
 * 产业全景看板 - V2 页面逻辑（优化版）
 */

let currentFilters = parseFilters();
let heatmapChart = null;
let currentPanoramaView = 'matrix';

function init() {
  if (document.getElementById('globalSearchContainer')) {
    document.getElementById('globalSearchContainer').innerHTML = renderGlobalSearch();
  }
  if (document.getElementById('breadcrumbContainer')) {
    document.getElementById('breadcrumbContainer').innerHTML = renderBreadcrumb('index.html');
  }
  renderFilters();
  loadData();
  initHeatmap();
  if (window.location.hash === '#support') switchPanoramaView('support');
  if (window.location.hash === '#lifecycle') switchPanoramaView('lifecycle');
  window.addEventListener('resize', debounce(() => {
    if (heatmapChart) heatmapChart.resize();
  }, 200));
}

function switchPanoramaView(view) {
  currentPanoramaView = view;
  document.querySelectorAll('#panoramaTabs .tab').forEach(t => t.classList.toggle('active', t.dataset.view === view));
  document.querySelectorAll('.view-panel').forEach(p => p.classList.toggle('active', p.id === view + 'View'));
  if (view === 'support' && typeof initSupportView === 'function') initSupportView();
  if (view === 'lifecycle' && typeof initLifecycleView === 'function') initLifecycleView();
  window.location.hash = view;
}

function renderFilters() {
  renderFilterGroup('filterStrategic', CONFIG.strategic, currentFilters.strategic, 'strategic');
  renderFilterGroup('filterLifecycle', CONFIG.lifecycle, currentFilters.lifecycle, 'lifecycle');
  renderFilterGroup('filterEnabling', CONFIG.enabling, currentFilters.enabling, 'enabling');
}

function renderFilterGroup(containerId, options, selectedValues, filterKey) {
  const container = document.getElementById(containerId);
  const allSelected = selectedValues.includes('all');
  let html = '';

  Object.entries(options).forEach(([key, cfg]) => {
    if (key === 'all') return;
    const isSelected = allSelected || selectedValues.includes(key);
    const count = getOptionCount(filterKey, key);
    html += `
      <label class="filter-option ${isSelected ? 'active' : ''}" onclick="toggleFilter('${filterKey}', '${key}')">
        <span class="dot"></span>
        <span>${cfg.label}</span>
        <span class="count">(${count})</span>
      </label>
    `;
  });

  const allActive = selectedValues.length === 1 && selectedValues[0] === 'all';
  html = `
    <label class="filter-option ${allActive ? 'active' : ''}" onclick="selectAllFilter('${filterKey}')">
      <span class="dot"></span>
      <span>全部</span>
    </label>
  ` + html;

  container.innerHTML = html;
}

function getOptionCount(filterKey, optionKey) {
  const testFilters = { ...currentFilters };
  testFilters[filterKey] = [optionKey];
  return MOCK_INDUSTRY_CHAINS.filter(item => {
    const matchStrategic = testFilters.strategic.includes('all') || testFilters.strategic.includes(item.strategic_orientation);
    const matchLifecycle = testFilters.lifecycle.includes('all') || testFilters.lifecycle.includes(item.life_cycle);
    const matchEnabling = testFilters.enabling.includes('all') || item.enabling_tags.some(t => testFilters.enabling.includes(t));
    return matchStrategic && matchLifecycle && matchEnabling;
  }).length;
}

function toggleFilter(filterKey, optionKey) {
  let values = currentFilters[filterKey];
  if (values.includes('all')) {
    values = [optionKey];
  } else if (values.includes(optionKey)) {
    values = values.filter(v => v !== optionKey);
    if (values.length === 0) values = ['all'];
  } else {
    values = [...values, optionKey];
  }
  currentFilters[filterKey] = values;
  updateUrlAndReload();
}

function selectAllFilter(filterKey) {
  currentFilters[filterKey] = ['all'];
  updateUrlAndReload();
}

function resetFilters() {
  currentFilters = { strategic: ['all'], lifecycle: ['all'], enabling: ['all'] };
  updateUrlAndReload();
}

function updateUrlAndReload() {
  setUrlParams(buildFilterUrl(currentFilters));
  renderFilters();
  loadData();
}

function loadData() {
  MockAPI.filterIndustries(currentFilters).then(industries => {
    renderMetrics(currentFilters);
    renderCards(industries);
    document.getElementById('resultCount').textContent = industries.length;
  });

  MockAPI.getSupplyDemandGaps(currentFilters).then(gaps => renderGapTable(gaps));
  MockAPI.getRisks(currentFilters).then(risks => renderRiskTable(risks));
  MockAPI.getHeatmap(currentFilters).then(data => updateHeatmap(data));
}

async function renderMetrics(filters) {
  const metrics = await MockAPI.getMetrics(filters);

  document.getElementById('metricTotalValue').textContent = metrics.total;
  const urgentEl = document.getElementById('metricUrgentValue');
  urgentEl.textContent = metrics.urgent;
  const urgentCard = document.getElementById('metricUrgent');
  if (metrics.urgent >= 1) {
    urgentCard.classList.add('pulse-danger');
  } else {
    urgentCard.classList.remove('pulse-danger');
  }

  const compValue = metrics.avgCompleteness;
  document.getElementById('metricCompletenessValue').textContent = compValue + '%';
  document.getElementById('metricCompletenessValue').style.color = compValue >= 80 ? '#36CFC9' : compValue >= 60 ? '#165DFF' : '#F5222D';
  document.getElementById('metricCompletenessTrend').innerHTML = renderTrend(metrics.avgCompletenessTrend);
  document.getElementById('metricCompletenessRing').innerHTML = renderProgressRing(compValue, 56, 6);

  document.getElementById('metricPenetrationValue').textContent = metrics.penetration + '%';
  document.getElementById('metricPenetrationTrend').innerHTML = renderTrend(metrics.penetrationTrend);
}

function renderCards(industries) {
  const grid = document.getElementById('cardsGrid');
  const empty = document.getElementById('emptyState');

  if (!industries.length) {
    grid.innerHTML = '';
    empty.style.display = 'flex';
    return;
  }
  empty.style.display = 'none';

  grid.innerHTML = industries.map((item, index) => {
    const isUrgent = item.key_gaps.some(g => g.count === 0);
    const categoryLabel = CONFIG.category[item.category] || item.category;

    let bgColor = '#FFFFFF', borderColor = '#EBEEF5';
    if (item.strategic_orientation === 'chain_master' && item.life_cycle === 'advantage_traditional') {
      bgColor = '#EEF4FF'; borderColor = '#165DFF';
    } else if (item.strategic_orientation === 'chain_master' && item.life_cycle === 'emerging') {
      bgColor = '#EEF4FF'; borderColor = '#165DFF';
    } else if (item.strategic_orientation === 'core_pillar' && item.life_cycle === 'advantage_traditional') {
      bgColor = '#E6FFFB'; borderColor = '#36CFC9';
    } else if (item.strategic_orientation === 'cultivating' && item.life_cycle === 'emerging') {
      bgColor = '#FFFBE6'; borderColor = '#FAAD14';
    } else if (item.strategic_orientation === 'cultivating' && item.life_cycle === 'future') {
      bgColor = '#F9F0FF'; borderColor = '#722ED1';
    }

    return `
      <div class="industry-card fade-in ${isUrgent ? 'urgent' : ''}"
           style="background:${bgColor};border-color:${borderColor};animation-delay:${index * 0.05}s"
           onclick="goToChainGraph('${item.id}')">
        <div class="card-top">
          <div class="card-name">${item.name}</div>
          <span class="tag tag-default card-category">${categoryLabel}</span>
        </div>
        <div class="card-tags-row">
          ${renderStrategicTag(item.strategic_orientation)}
          ${renderLifecycleTag(item.life_cycle)}
        </div>
        <div class="card-enabling">
          <span>使能技术：</span>
          <div style="display:flex;gap:4px">${renderEnablingTags(item.enabling_tags)}</div>
        </div>
        <div class="card-core">
          <div class="card-completeness">
            ${renderProgressRing(item.completeness_score, 48, 5)}
            <div class="card-completeness-info">
              <span class="card-completeness-label">完整度</span>
              <span class="card-completeness-value" style="color:${item.completeness_score >= 80 ? '#36CFC9' : item.completeness_score >= 60 ? '#165DFF' : '#F5222D'}">${item.completeness_score}%</span>
            </div>
          </div>
          <div class="card-enterprise">
            <div>关联企业</div>
            <strong>${formatNumber(item.enterprise_count)}</strong> 家
          </div>
        </div>
        <div class="card-metrics">
          <div class="card-metric-block">
            <div class="card-metric-title">📊 存量指标</div>
            <div class="card-metric-item"><span class="label">税收</span><span class="value">${item.tax_contribution}亿</span></div>
            <div class="card-metric-item"><span class="label">就业</span><span class="value">${(item.employment_count / 10000).toFixed(1)}万人</span></div>
            <div class="card-metric-item"><span class="label">营收</span><span class="value">${item.revenue_total}亿</span></div>
          </div>
          <div class="card-metric-block">
            <div class="card-metric-title">🚀 增量指标</div>
            <div class="card-metric-item"><span class="label">在建</span><span class="value">${item.projects_under_construction}项</span></div>
            <div class="card-metric-item"><span class="label">招商</span><span class="value">${item.investment_completed}家</span></div>
            <div class="card-metric-item"><span class="label">增速</span><span class="value growth">+${item.growth_rate}%</span></div>
          </div>
        </div>
        <div class="card-gaps">
          <div class="card-gaps-title">🔴 关键缺口（${item.gap_count}个）</div>
          <div class="gap-tags">
            ${item.key_gaps.slice(0, 2).map(g => `<span class="gap-tag">${g.name}（${g.count}家）</span>`).join('')}
          </div>
        </div>
        <div class="card-actions" onclick="event.stopPropagation()">
          <button class="btn btn-primary btn-sm" onclick="goToChainGraph('${item.id}')">查看产业链图谱</button>
          <button class="btn btn-default btn-sm" onclick="showIndustryDetail('${item.id}')">查看详情 →</button>
        </div>
      </div>
    `;
  }).join('');
}

function goToChainGraph(chainId) {
  const params = new URLSearchParams(window.location.search);
  window.location.href = `chain-graph.html?chainId=${chainId}&${params.toString()}`;
}

function showIndustryDetail(chainId) {
  const chain = MOCK_INDUSTRY_CHAINS.find(c => c.id === chainId);
  if (!chain) return;
  const content = `
    <div class="mb-12">
      <h3 style="margin-bottom:8px">${chain.name}</h3>
      <div style="display:flex;gap:8px;margin-bottom:12px">
        ${renderStrategicTag(chain.strategic_orientation)}
        ${renderLifecycleTag(chain.life_cycle)}
        <span class="tag tag-default">${CONFIG.category[chain.category] || chain.category}</span>
      </div>
      <p style="color:#595959;font-size:13px;line-height:1.8">
        该产业链是区域重点发展的${CONFIG.strategic[chain.strategic_orientation].label}，
        当前处于${CONFIG.lifecycle[chain.life_cycle].label}阶段，
        完整度评分${chain.completeness_score}%，关联企业${chain.enterprise_count}家。
      </p>
    </div>
    <div class="mb-12">
      <div class="card-metric-title" style="font-size:14px;margin-bottom:8px">核心经济指标</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <div class="card-metric-block"><div class="card-metric-item"><span class="label">税收贡献</span><span class="value">${chain.tax_contribution}亿</span></div></div>
        <div class="card-metric-block"><div class="card-metric-item"><span class="label">就业人数</span><span class="value">${formatNumber(chain.employment_count)}人</span></div></div>
        <div class="card-metric-block"><div class="card-metric-item"><span class="label">总营收</span><span class="value">${chain.revenue_total}亿</span></div></div>
        <div class="card-metric-block"><div class="card-metric-item"><span class="label">增速</span><span class="value growth">+${chain.growth_rate}%</span></div></div>
      </div>
    </div>
    <div>
      <div class="card-metric-title" style="font-size:14px;margin-bottom:8px">关键缺口环节</div>
      <div class="gap-tags">
        ${chain.key_gaps.map(g => `<span class="gap-tag">${g.name}（${g.count}家）</span>`).join('')}
      </div>
    </div>
  `;
  openDrawer(chain.name + ' - 产业详情', content,
    `<button class="btn btn-primary" onclick="goToChainGraph('${chain.id}')">查看产业链图谱</button><button class="btn btn-default" onclick="closeDrawer()">关闭</button>`
  );
}

function handleUrgentClick() {
  currentFilters = { strategic: ['all'], lifecycle: ['all'], enabling: currentFilters.enabling };
  updateUrlAndReload();
  showToast('已按完整度升序排列，缺失产业置顶', 'info');
}

function showCompletenessModal() {
  const data = MOCK_INDUSTRY_CHAINS.slice(0, 6).map(c => ({
    name: c.name,
    score: c.completeness_score,
    weight: Math.round(c.revenue_total / 10)
  }));
  const totalWeight = data.reduce((s, i) => s + i.weight, 0);

  const content = `
    <div style="margin-bottom:16px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <span>平均完整度</span>
        <span style="font-size:20px;font-weight:700;color:#1890FF">${(data.reduce((s, i) => s + i.score * i.weight, 0) / totalWeight).toFixed(1)}%</span>
      </div>
      <div style="height:8px;background:#f0f0f0;border-radius:4px;overflow:hidden">
        <div style="width:${(data.reduce((s, i) => s + i.score * i.weight, 0) / totalWeight)}%;height:100%;background:#1890FF;border-radius:4px"></div>
      </div>
    </div>
    ${data.map(item => `
      <div class="score-detail-item">
        <div class="score-detail-name">${item.name}</div>
        <div class="score-detail-bar"><div class="score-detail-fill" style="width:${item.score}%;background:${item.score >= 80 ? '#36CFC9' : item.score >= 60 ? '#165DFF' : '#F5222D'}"></div></div>
        <div class="score-detail-value" style="color:${item.score >= 80 ? '#36CFC9' : item.score >= 60 ? '#165DFF' : '#F5222D'}">${item.score}%</div>
      </div>
    `).join('')}
  `;
  openModal('完整度趋势分析', content);
}

function renderGapTable(gaps) {
  const tbody = document.querySelector('#gapTable tbody');
  tbody.innerHTML = gaps.map(item => `
    <tr>
      <td><span class="rank ${item.rank <= 3 ? 'gold' : 'gray'}">${item.rank}</span></td>
      <td class="clickable"><a href="supply-demand.html?category=${encodeURIComponent(item.product_category)}">${item.product_category}</a></td>
      <td>${item.enterprise_count}家</td>
      <td><span class="gap-type ${item.gap_type === '供应缺口' ? 'supply' : 'demand'}">${item.gap_type}</span></td>
      <td>${item.estimated_amount}亿</td>
    </tr>
  `).join('');
}

function renderRiskTable(risks) {
  const tbody = document.querySelector('#riskTable tbody');
  tbody.innerHTML = risks.map(item => `
    <tr>
      <td><span class="risk-level ${item.risk_level === '紧急' ? 'urgent' : item.risk_level === '重要' ? 'important' : 'normal'}">${item.risk_level}</span></td>
      <td class="clickable"><a href="risk-warning.html?enterprise=${encodeURIComponent(item.enterprise_name)}">${item.enterprise_name}</a></td>
      <td>${item.risk_type}</td>
      <td>${item.affected_count}家</td>
      <td>${item.occurred_at}</td>
    </tr>
  `).join('');
}

function initHeatmap() {
  const chartDom = document.getElementById('heatmapChart');
  heatmapChart = echarts.init(chartDom);
}

function updateHeatmap(data) {
  if (!heatmapChart) return;
  const option = {
    tooltip: {
      position: 'top',
      formatter: params => `${data.services[params.value[1]]} × ${data.industries[params.value[0]]}<br/>交互频次：<b>${params.value[2]}</b>次`
    },
    grid: { top: 8, bottom: 24, left: 80, right: 8 },
    xAxis: {
      type: 'category',
      data: data.industries,
      splitArea: { show: true },
      axisLabel: { fontSize: 11, color: '#595959', rotate: 20 }
    },
    yAxis: {
      type: 'category',
      data: data.services,
      splitArea: { show: true },
      axisLabel: { fontSize: 11, color: '#595959' }
    },
    visualMap: {
      min: 0, max: 100, calculable: false, orient: 'horizontal', left: 'center', bottom: -4, show: false,
      inRange: { color: ['#FFFFFF', '#EEF4FF', '#B3CFFF', '#165DFF', '#0D2664'] }
    },
    series: [{
      type: 'heatmap',
      data: data.data.flatMap((row, i) => row.map((val, j) => [j, i, val])),
      label: { show: true, fontSize: 11, color: '#262626' },
      itemStyle: { borderColor: '#fff', borderWidth: 1 },
      emphasis: { itemStyle: { shadowBlur: 8, shadowColor: 'rgba(0,0,0,0.25)' } }
    }]
  };
  heatmapChart.setOption(option);
}

document.addEventListener('DOMContentLoaded', init);
