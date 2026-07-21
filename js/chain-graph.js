/**
 * 产业链结构图谱 - V2 四视图逻辑
 */

let chainId = null;
let chainData = null;
let categoryTree = null;
let enterpriseNetwork = null;
let gapData = null;
let scenarioData = null;
let myChart = null;
let currentView = 'structure';
let currentLayout = 'hierarchy';
let currentZoom = 1;
let selectedNodeId = null;
let hiddenNodeTypes = new Set();
let currentMainTab = 'overview';
let regionChart = null;

function navigateToEnterpriseProfile(enterpriseId, enterpriseName, el) {
  if (!enterpriseId || enterpriseId === 'undefined' || enterpriseId === 'null') {
    showToast('该企业暂无画像信息', 'warning');
    return;
  }
  // 同步校验企业是否在企业池中
  if (typeof ALL_ENTERPRISES !== 'undefined' && !ALL_ENTERPRISES.some(e => e.id === enterpriseId)) {
    showToast(`未找到企业“${enterpriseName || enterpriseId}”的画像信息`, 'warning');
    return;
  }
  window.location.href = `enterprise-profile.html?enterpriseId=${encodeURIComponent(enterpriseId)}`;
}

function init() {
  if (document.getElementById('globalSearchContainer')) {
    document.getElementById('globalSearchContainer').innerHTML = renderGlobalSearch();
  }

  const params = getUrlParams();
  chainId = params.chainId;

  if (!chainId) {
    showChainSelection();
    return;
  }

  const storedView = localStorage.getItem('chainView_' + chainId);
  const hashView = window.location.hash.replace('#', '');
  currentView = hashView || storedView || 'structure';

  loadData();
  setupKeyboard();
  window.addEventListener('resize', debounce(() => {
    if (myChart && myChart.resize) myChart.resize();
  }, 200));
}

function showChainSelection() {
  const container = document.querySelector('.page-content');
  container.innerHTML = `
    <div class="chain-selection-page">
      <div class="selection-header">
        <h2>选择产业链</h2>
        <p>请选择要查看的产业链结构图谱</p>
      </div>
      <div class="chain-grid">
        ${MOCK_INDUSTRY_CHAINS.map(chain => `
          <div class="chain-card" onclick="window.location.href='chain-graph.html?chainId=${chain.id}'">
            <div class="chain-card-icon">${getChainIcon(chain.strategic_orientation)}</div>
            <div class="chain-card-name">${chain.name}</div>
            <div class="chain-card-desc">${getChainDescription(chain)}</div>
            <div class="chain-card-meta">
              <span class="chain-tag">${getChainCategoryLabel(chain.category)}</span>
              <span class="chain-completeness">完整度 ${chain.completeness_score}%</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function getChainIcon(orientation) {
  const icons = {
    'chain_master': '🏛️',
    'core_pillar': '🚀',
    'emerging': '💡',
    'traditional': '🏭',
    'other': '📊'
  };
  return icons[orientation] || '📊';
}

function getChainDescription(chain) {
  const descriptions = {
    'chain-007': '信息技术服务产业链，涵盖云计算、大数据、人工智能等领域',
    'chain-008': '现代金融服务产业链，包括银行、证券、保险等业态',
    'chain-009': '国际贸易与物流产业链，连接国内外市场',
    'chain-010': '专业服务产业链，提供法律、会计、咨询等专业服务',
    'chain-011': '科技服务产业链，涵盖研发、检测、孵化等服务',
    'chain-012': '文体旅商产业链，融合文化、体育、旅游、商业',
    'chain-robot': '人工智能与具身智能机器人产业链，核心战略性新兴产业',
    'chain-002': '海洋产业链，发展海洋经济与海洋科技',
    'chain-003': '细胞与基因产业链，生物医药前沿领域',
    'chain-004': '智能终端产业链，涵盖智能手机、智能穿戴等',
    'chain-005': '低空经济产业链，发展通用航空与低空飞行',
    'chain-006': '数据产业，数据采集、存储、分析与应用'
  };
  return descriptions[chain.id] || `${chain.name}产业链`;
}

function getChainCategoryLabel(category) {
  const labels = {
    'information': '信息服务',
    'finance': '金融服务',
    'trade': '贸易物流',
    'professional': '专业服务',
    'tech': '科技服务',
    'culture': '文体旅商',
    'robot': '机器人',
    'ocean': '海洋',
    'biotech': '生物医药',
    'terminal': '智能终端',
    'low_altitude': '低空经济',
    'data': '数据产业'
  };
  return labels[category] || category;
}

async function loadData() {
  showLoading(true);
  [chainData, categoryTree, enterpriseNetwork, gapData, scenarioData] = await Promise.all([
    MockAPI.getChainDetail(chainId),
    MockAPI.getCategoryTree(chainId),
    MockAPI.getEnterpriseNetwork(chainId),
    MockAPI.getGapData(chainId),
    MockAPI.getScenarioData(chainId)
  ]);
  showLoading(false);

  if (!chainData) {
    showToast('未找到产业链数据', 'error');
    return;
  }

  renderTopInfo();
  renderChainColumns();
  if (currentMainTab === 'overview') {
    renderOverviewTab();
  }
}

function showLoading(show) {}

function renderTopInfo() {
  document.title = chainData.name + '产业链图谱 - 产业链/供应链图谱系统';

  const chainName = document.getElementById('chainName');
  if (chainName) chainName.textContent = chainData.name + '产业链图谱';

  const c = chainData.completeness_score;
  const completenessValue = document.getElementById('completenessValue');
  if (completenessValue) {
    completenessValue.textContent = c + '%';
    completenessValue.style.color = c >= 80 ? '#52C41A' : c >= 60 ? '#1890FF' : '#F5222D';
  }
  const completenessRing = document.getElementById('completenessRing');
  if (completenessRing) completenessRing.innerHTML = renderProgressRing(c, 48, 5);

  const chainTags = document.getElementById('chainTags');
  if (chainTags) {
    chainTags.innerHTML = `
      ${renderStrategicTag(chainData.strategic_orientation)}
      ${renderLifecycleTag(chainData.life_cycle)}
      <span class="tag tag-default">${CONFIG.category[chainData.category] || chainData.category}</span>
    `;
  }
}

// ==================== 左侧分类树 ====================
function renderTree() {
  const body = document.getElementById('treeBody');
  if (!body) return;
  const localOnly = document.getElementById('filterLocalOnly')?.checked;
  const missingOnly = document.getElementById('filterMissingOnly')?.checked;

  body.innerHTML = categoryTree.tree.map(node => renderTreeNode(node, 0, localOnly, missingOnly)).join('');
}

function renderTreeNode(node, depth, localOnly, missingOnly) {
  if (!node) return '';

  const hasChildren = node.children && node.children.length;

  // 先递归渲染子节点
  let childrenHtml = '';
  let hasVisibleChildren = false;
  if (hasChildren) {
    const filteredChildren = node.children.map(c => renderTreeNode(c, depth + 1, localOnly, missingOnly)).filter(Boolean);
    if (filteredChildren.length) {
      hasVisibleChildren = true;
      childrenHtml = `<div class="tree-children" id="tree-children-${node.id}">${filteredChildren.join('')}</div>`;
    }
  }

  // 当前节点自身是否匹配筛选
  let selfVisible = true;
  if (localOnly && node.isLeaf && node.localCount === 0) selfVisible = false;
  if (missingOnly && node.isLeaf && node.status !== 'missing') selfVisible = false;

  // 自身不匹配且没有可见子节点，则整体不显示
  if (!selfVisible && !hasVisibleChildren) return '';

  const statusCfg = CONFIG.nodeStatus[node.status] || CONFIG.nodeStatus.normal;
  const isSelected = selectedNodeId === node.id;

  const displayCount = node.isLeaf
    ? `本区${node.localCount} / 全国${node.nationalCount}`
    : '';

  return `
    <div class="tree-node">
      <div class="tree-row ${node.status === 'missing' ? 'missing' : ''} ${isSelected ? 'active' : ''}"
           data-id="${node.id}"
           onclick="onTreeRowClick('${node.id}', ${hasChildren})"
           ondblclick="onTreeRowDblClick('${node.id}', ${node.isLeaf})"
           onmouseenter="showNodeInfoTooltip(event, '${node.id}')"
           onmousemove="moveNodeInfoTooltip(event)"
           onmouseleave="hideNodeInfoTooltip()">
        <span class="tree-toggle ${hasChildren ? '' : 'leaf'} ${childrenHtml ? '' : 'collapsed'}"
              onclick="event.stopPropagation();toggleTreeNode('${node.id}', ${hasChildren})">▼</span>
        <span class="tree-status-icon ${node.status}">${statusCfg.icon}</span>
        <span class="tree-name">${node.name}</span>
        <span class="tree-count">${displayCount}</span>
      </div>
      ${childrenHtml}
    </div>
  `;
}

function toggleTreeNode(nodeId, hasChildren) {
  if (!hasChildren) return;
  const el = document.getElementById('tree-children-' + nodeId);
  const toggle = document.querySelector(`.tree-row[data-id="${nodeId}"] .tree-toggle`);
  if (!el) return;
  el.classList.toggle('collapsed');
  toggle.classList.toggle('collapsed');
}

function onTreeRowClick(nodeId, hasChildren) {
  if (hasChildren) {
    toggleTreeNode(nodeId, hasChildren);
  }
  selectTreeNode(nodeId);
}

function onTreeRowDblClick(nodeId, isLeaf) {
  if (isLeaf) {
    openNodeDrawer(nodeId);
  }
}

function selectTreeNode(nodeId) {
  selectedNodeId = nodeId;
  document.querySelectorAll('.tree-row').forEach(r => r.classList.toggle('active', r.dataset.id === nodeId));

  if (currentView === 'structure') {
    highlightStructureNode(nodeId);
  } else if (currentView === 'relation') {
    highlightRelationNode(nodeId);
  }
}

function applyTreeFilter() {
  renderTree();
}

// ==================== 节点信息浮层（叶子节点完整展示） ====================
function showNodeInfoTooltip(event, nodeId) {
  if (!categoryTree) return;
  const node = findNodeInTree(categoryTree.tree, nodeId);
  if (!node) return;

  const tooltip = document.getElementById('nodeInfoTooltip');
  const isLeaf = node.isLeaf;
  const coverageRate = node.nationalCount ? (node.localCount / node.nationalCount * 100).toFixed(1) : 0;
  const typeLabel = node.type
    ? (CONFIG.enterpriseType[node.type]?.label || node.type)
    : (isLeaf ? '叶子节点' : '目录节点');

  let extraRows = '';
  if (isLeaf) {
    extraRows = `
      <div class="node-info-tooltip-row">
        <span class="node-info-tooltip-label">本区企业数</span>
        <span class="node-info-tooltip-value">${formatNumber(node.localCount ?? 0)} 家</span>
      </div>
      <div class="node-info-tooltip-row">
        <span class="node-info-tooltip-label">全国企业数</span>
        <span class="node-info-tooltip-value">${formatNumber(node.nationalCount ?? 0)} 家</span>
      </div>
      <div class="node-info-tooltip-row">
        <span class="node-info-tooltip-label">本区覆盖率</span>
        <span class="node-info-tooltip-value highlight">${coverageRate}%</span>
      </div>
    `;
  }

  tooltip.innerHTML = `
    <div class="node-info-tooltip-header">
      <span class="node-info-tooltip-name">${node.name}</span>
      ${renderTreeStatusTag(node.status)}
    </div>
    <div class="node-info-tooltip-row">
      <span class="node-info-tooltip-label">节点ID</span>
      <span class="node-info-tooltip-value">${node.id}</span>
    </div>
    <div class="node-info-tooltip-row">
      <span class="node-info-tooltip-label">节点类型</span>
      <span class="node-info-tooltip-value">${typeLabel}</span>
    </div>
    <div class="node-info-tooltip-row">
      <span class="node-info-tooltip-label">层级</span>
      <span class="node-info-tooltip-value">L${node.level}</span>
    </div>
    ${extraRows}
  `;

  tooltip.style.display = 'block';
  positionNodeInfoTooltip(event.clientX, event.clientY);
}

function moveNodeInfoTooltip(event) {
  positionNodeInfoTooltip(event.clientX, event.clientY);
}

function hideNodeInfoTooltip() {
  const tooltip = document.getElementById('nodeInfoTooltip');
  if (tooltip) tooltip.style.display = 'none';
}

function positionNodeInfoTooltip(x, y) {
  const tooltip = document.getElementById('nodeInfoTooltip');
  if (!tooltip) return;

  const rect = tooltip.getBoundingClientRect();
  const gap = 12;
  let left = x + gap;
  let top = y + gap;

  if (left + rect.width > window.innerWidth) {
    left = x - rect.width - gap;
  }
  if (top + rect.height > window.innerHeight) {
    top = y - rect.height - gap;
  }
  if (left < 0) left = gap;
  if (top < 0) top = gap;

  tooltip.style.left = left + 'px';
  tooltip.style.top = top + 'px';
}

// ==================== 视图切换 ====================
function switchView(view, save = true) {
  currentView = view;
  if (save) {
    localStorage.setItem('chainView_' + chainId, view);
    window.location.hash = view;
  }

  document.querySelectorAll('.view-tabs .tab').forEach(t => t.classList.toggle('active', t.dataset.view === view));

  const chartDom = document.getElementById('mainChart');
  if (!chartDom) return;

  const gapPanel = document.getElementById('gapPanel');
  const scenarioPanel = document.getElementById('scenarioPanel');

  chartDom.style.display = 'none';
  if (gapPanel) gapPanel.style.display = 'none';
  if (scenarioPanel) scenarioPanel.style.display = 'none';

  if (myChart) {
    myChart.dispose();
    myChart = null;
  }

  if (view === 'structure') {
    chartDom.style.display = 'block';
    renderStructureView();
  } else if (view === 'relation') {
    chartDom.style.display = 'block';
    renderRelationView();
  } else if (view === 'gap') {
    if (gapPanel) gapPanel.style.display = 'block';
    renderGapView();
  } else if (view === 'scenario') {
    if (scenarioPanel) scenarioPanel.style.display = 'block';
    renderScenarioView();
  }

  updateBottomBar();
}

function updateBottomBar() {
  const legendGroup = document.getElementById('legendGroup');
  const edgeLegendGroup = document.getElementById('edgeLegendGroup');
  const layoutControls = document.querySelector('.layout-controls');

  if (currentView === 'relation') {
    legendGroup.style.display = 'flex';
    edgeLegendGroup.style.display = 'flex';
    layoutControls.style.display = 'flex';
  } else {
    legendGroup.style.display = 'none';
    edgeLegendGroup.style.display = 'none';
    layoutControls.style.display = 'none';
  }
}

function switchMainTab(tab) {
  currentMainTab = tab;

  document.querySelectorAll('.main-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.toggle('active', p.id === 'tab-' + tab));

  if (tab === 'overview') {
    setTimeout(renderOverviewTab, 50);
  } else if (tab === 'news') {
    renderNewsTab();
  } else if (tab === 'gap-filling') {
    setTimeout(renderGapFillingTab, 50);
  } else if (tab === 'structure') {
    renderChainColumns();
  } else if (tab === 'risk-monitor') {
    setTimeout(renderRiskMonitorTab, 50);
  } else if (tab === 'key-enterprise') {
    setTimeout(renderKeyEnterpriseTab, 50);
  }
}

function renderKeyEnterpriseTab() {
  const chainData = CHAIN_INDUSTRY_DATA[chainId] || CHAIN_INDUSTRY_DATA['chain-robot'];
  renderKeyEnterpriseTrendChart(chainData);
  renderKeyEnterpriseNewChart(chainData);
  renderKeyEnterpriseCapitalChart(chainData);
  renderKeyEnterpriseAgeChart(chainData);
  renderKeyEnterpriseDomainChart(chainData);
  renderKeyEnterpriseLinkChart(chainData);
  renderKeyEnterpriseTable(chainData);
}

function renderKeyEnterpriseTrendChart(chainData) {
  const chartDom = document.getElementById('keyEnterpriseTrendChart');
  if (!chartDom) return;
  const chart = echarts.init(chartDom);
  const years = ['2022', '2023', '2024', '2025', '2026'];
  const countData = chainData.trendData || [420, 380, 350, 360, 420];
  const growthData = chainData.growthData || [0.8, 0.6, 0.3, 0.25, 0.2];
  chart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['企业总数（家）', '企业增速（%）'], bottom: 0, textStyle: { fontSize: 11, color: '#646A73' } },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '5%', containLabel: true },
    xAxis: { type: 'category', data: years, axisLabel: { fontSize: 12, color: '#8F959E' }, axisLine: { lineStyle: { color: '#EBEEF5' } } },
    yAxis: [{ type: 'value', name: '企业总数（家）', nameTextStyle: { color: '#8F959E', fontSize: 11 }, axisLabel: { color: '#8F959E' }, splitLine: { lineStyle: { color: '#F2F3F5' } } }, { type: 'value', name: '增速（%）', nameTextStyle: { color: '#8F959E', fontSize: 11 }, axisLabel: { color: '#8F959E' }, splitLine: { show: false } }],
    series: [
      { type: 'bar', name: '企业总数（家）', data: countData, itemStyle: { color: '#3B82F6', borderRadius: [4, 4, 0, 0] }, barWidth: '50%' },
      { type: 'line', name: '企业增速（%）', data: growthData, yAxisIndex: 1, itemStyle: { color: '#EF4444' }, lineStyle: { width: 2 }, symbol: 'circle', symbolSize: 6 }
    ]
  });
  window.addEventListener('resize', () => chart && chart.resize());
}

function renderKeyEnterpriseNewChart(chainData) {
  const chartDom = document.getElementById('keyEnterpriseNewChart');
  if (!chartDom) return;
  const chart = echarts.init(chartDom);
  const years = ['2021', '2022', '2023', '2024', '2025', '2026'];
  const newCountData = chainData.newData || [3, 5, 2, 1, 1, 0];
  const growthData = chainData.newGrowthData || [0.6, 0.5, 0.3, 0.4, 0.8, 0];
  chart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['新增企业数量（家）', '增速（%）'], bottom: 0, textStyle: { fontSize: 11, color: '#646A73' } },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '5%', containLabel: true },
    xAxis: { type: 'category', data: years, axisLabel: { fontSize: 12, color: '#8F959E' }, axisLine: { lineStyle: { color: '#EBEEF5' } } },
    yAxis: [{ type: 'value', name: '新增企业数（家）', nameTextStyle: { color: '#8F959E', fontSize: 11 }, axisLabel: { color: '#8F959E' }, splitLine: { lineStyle: { color: '#F2F3F5' } } }, { type: 'value', name: '增速（%）', nameTextStyle: { color: '#8F959E', fontSize: 11 }, axisLabel: { color: '#8F959E' }, splitLine: { show: false } }],
    series: [
      { type: 'bar', name: '新增企业数量（家）', data: newCountData, itemStyle: { color: '#10B981', borderRadius: [4, 4, 0, 0] }, barWidth: '50%' },
      { type: 'line', name: '增速（%）', data: growthData, yAxisIndex: 1, itemStyle: { color: '#F59E0B' }, lineStyle: { width: 2 }, symbol: 'circle', symbolSize: 6 }
    ]
  });
  window.addEventListener('resize', () => chart && chart.resize());
}

function renderKeyEnterpriseCapitalChart(chainData) {
  const chartDom = document.getElementById('keyEnterpriseCapitalChart');
  if (!chartDom) return;
  const chart = echarts.init(chartDom);
  const capitalData = chainData.capitalData || [24, 154, 113, 47, 32, 53];
  chart.setOption({
    tooltip: { trigger: 'item' },
    legend: { right: 0, top: 10, orient: 'vertical', textStyle: { fontSize: 11, color: '#646A73' } },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['40%', '50%'],
      itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      data: [
        { value: capitalData[0], name: '0-100万', itemStyle: { color: '#3B82F6' } },
        { value: capitalData[1], name: '100-1000万', itemStyle: { color: '#10B981' } },
        { value: capitalData[2], name: '1000-5000万', itemStyle: { color: '#F59E0B' } },
        { value: capitalData[3], name: '5000万-1亿', itemStyle: { color: '#F97316' } },
        { value: capitalData[4], name: '1亿-10亿', itemStyle: { color: '#EF4444' } },
        { value: capitalData[5], name: '10亿以上', itemStyle: { color: '#8B5CF6' } }
      ]
    }]
  });
  window.addEventListener('resize', () => chart && chart.resize());
}

function renderKeyEnterpriseAgeChart(chainData) {
  const chartDom = document.getElementById('keyEnterpriseAgeChart');
  if (!chartDom) return;
  const chart = echarts.init(chartDom);
  const ageData = chainData.ageData || [0, 3, 11, 80, 152, 152, 2];
  chart.setOption({
    tooltip: { trigger: 'item' },
    legend: { right: 0, top: 10, orient: 'vertical', textStyle: { fontSize: 11, color: '#646A73' } },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['40%', '50%'],
      itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      data: [
        { value: ageData[0], name: '0-1年', itemStyle: { color: '#3B82F6' } },
        { value: ageData[1], name: '1-3年', itemStyle: { color: '#60A5FA' } },
        { value: ageData[2], name: '3-5年', itemStyle: { color: '#10B981' } },
        { value: ageData[3], name: '5-10年', itemStyle: { color: '#F59E0B' } },
        { value: ageData[4], name: '10-20年', itemStyle: { color: '#F97316' } },
        { value: ageData[5], name: '20年以上', itemStyle: { color: '#EF4444' } },
        { value: ageData[6], name: '其他', itemStyle: { color: '#9CA3AF' } }
      ]
    }]
  });
  window.addEventListener('resize', () => chart && chart.resize());
}

function renderKeyEnterpriseDomainChart(chainData) {
  const chartDom = document.getElementById('keyEnterpriseDomainChart');
  if (!chartDom) return;
  const chart = echarts.init(chartDom);
  const domains = chainData.domains || [
    { value: 105, name: '涉海设备制造', color: '#3B82F6' },
    { value: 15, name: '涉海材料制造', color: '#10B981' },
    { value: 24, name: '海洋产业', color: '#F59E0B' },
    { value: 3, name: '海洋科研教育', color: '#8B5CF6' },
    { value: 3, name: '海洋科研教育', color: '#EC4899' },
    { value: 19, name: '海洋公共管理服务', color: '#06B6D4' },
    { value: 28, name: '涉海产品再加工', color: '#F97316' },
    { value: 28, name: '海洋产品批发与零售', color: '#EF4444' }
  ];
  chart.setOption({
    tooltip: { trigger: 'item' },
    legend: { right: 0, top: 10, orient: 'vertical', textStyle: { fontSize: 11, color: '#646A73' } },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['40%', '50%'],
      itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      data: domains.map(d => ({ value: d.value, name: d.name, itemStyle: { color: d.color } }))
    }]
  });
  window.addEventListener('resize', () => chart && chart.resize());
}

function renderKeyEnterpriseLinkChart(chainData) {
  const chartDom = document.getElementById('keyEnterpriseLinkChart');
  if (!chartDom) return;
  const chart = echarts.init(chartDom);
  const links = chainData.links || ['海水淡化与综合利用装备制造', '海洋交通运输设备制造', '海洋矿产资源勘探开发', '海盐设备制造', '海洋工程通用设备制造'];
  const data = chainData.linkData || [70, 41, 30, 30, 30];
  chart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '10%', top: '5%', containLabel: true },
    xAxis: { type: 'category', data: links, axisLabel: { fontSize: 10, color: '#8F959E', rotate: 45 }, axisLine: { lineStyle: { color: '#EBEEF5' } } },
    yAxis: { type: 'value', name: '企业数量（家）', nameTextStyle: { color: '#8F959E', fontSize: 11 }, axisLabel: { color: '#8F959E' }, splitLine: { lineStyle: { color: '#F2F3F5' } } },
    series: [{ type: 'bar', data: data, itemStyle: { color: '#3B82F6', borderRadius: [4, 4, 0, 0] }, barWidth: '50%' }]
  });
  window.addEventListener('resize', () => chart && chart.resize());
}

function renderKeyEnterpriseTable(chainData) {
  const tbody = document.getElementById('keyEnterpriseTableBody');
  if (!tbody) return;
  const enterprises = chainData.enterprises || [];
  tbody.innerHTML = enterprises.map((item, index) => {
    const tagsHtml = item.tags.map(tag => `<span class="enterprise-tag-sm">${tag}</span>`).join('');
    return `
      <tr class="${index % 2 === 0 ? '' : 'table-row-alt'}">
        <td><input type="checkbox" class="enterprise-checkbox"></td>
        <td>
          <div class="enterprise-name-wrap">
            <span class="enterprise-name-text">${item.name}</span>
            <span class="enterprise-status-tag">存续</span>
          </div>
          <div class="enterprise-tags-wrap">${tagsHtml}</div>
        </td>
        <td>${item.legalRep}</td>
        <td>${item.region}</td>
        <td>${item.founded}</td>
        <td>${item.capital}</td>
        <td>
          <button class="btn btn-sm btn-default" onclick="showToast('收藏企业功能开发中', 'info')">⭐</button>
          <button class="btn btn-sm btn-default" onclick="showToast('招商触达功能开发中', 'info')">📮</button>
        </td>
      </tr>
    `;
  }).join('');
}

function toggleSelectAll(checkbox) {
  document.querySelectorAll('.enterprise-checkbox').forEach(cb => cb.checked = checkbox.checked);
}

function toggleEnterpriseTableView(view) {
  showToast(view === 'list' ? '列表视图' : '网格视图', 'info');
}

function renderRiskMonitorTab() {
  if (!chainData) return;

  const industryData = CHAIN_INDUSTRY_DATA[chainId] || CHAIN_INDUSTRY_DATA['chain-robot'];
  const totalEnterprises = chainData.enterprise_count || 856;
  const highCount = industryData.riskHigh || 47;
  const mediumCount = industryData.riskMedium || 168;
  const lowCount = industryData.riskLow || (totalEnterprises - highCount - mediumCount);

  document.getElementById('riskTotalEnterprises').textContent = totalEnterprises;
  document.getElementById('riskHighCount').textContent = highCount;
  document.getElementById('riskMediumCount').textContent = mediumCount;
  document.getElementById('riskLowCount').textContent = lowCount;

  renderRiskBusinessChart();
  renderRiskInspectionChart();
  renderRiskTaxChart();
  renderRiskTaxDebtChart();
  renderRiskCreditChart();
  renderRiskCaseChart();
  renderRiskAdminChart();
  renderRiskEnvChart();
}

function renderRiskBusinessChart() {
  const chartDom = document.getElementById('riskBusinessChart');
  if (!chartDom) return;
  const chart = echarts.init(chartDom);
  const quarters = ['2022-Q4', '2023-Q1', '2023-Q2', '2023-Q3', '2023-Q4', '2024-Q1', '2024-Q2', '2024-Q3', '2024-Q4', '2025-Q1', '2025-Q2', '2025-Q3', '2025-Q4', '2026-Q1', '2026-Q2', '2026-Q3'];
  const enterpriseData = [180, 220, 120, 80, 150, 100, 50, 180, 320, 280, 100, 80, 120, 60, 30, 0];
  const eventData = [190, 210, 130, 75, 140, 95, 55, 170, 310, 270, 95, 85, 115, 65, 35, 0];
  chart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { data: ['企业数（家）', '事件数（次）'], bottom: 0, textStyle: { fontSize: 11, color: '#646A73' } },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '5%', containLabel: true },
    xAxis: { type: 'category', data: quarters, axisLabel: { fontSize: 10, color: '#8F959E', rotate: 45 }, axisLine: { lineStyle: { color: '#EBEEF5' } } },
    yAxis: { type: 'value', axisLabel: { color: '#8F959E' }, splitLine: { lineStyle: { color: '#F2F3F5' } } },
    series: [
      { type: 'bar', name: '企业数（家）', data: enterpriseData, itemStyle: { color: '#3B82F6', borderRadius: [4, 4, 0, 0] }, barWidth: '35%' },
      { type: 'bar', name: '事件数（次）', data: eventData, itemStyle: { color: '#10B981', borderRadius: [4, 4, 0, 0] }, barWidth: '35%' }
    ]
  });
  window.addEventListener('resize', () => chart && chart.resize());
}

function renderRiskInspectionChart() {
  const chartDom = document.getElementById('riskInspectionChart');
  if (!chartDom) return;
  const chart = echarts.init(chartDom);
  const quarters = ['2022-Q4', '2023-Q1', '2023-Q2', '2023-Q3', '2023-Q4', '2024-Q1', '2024-Q2', '2024-Q3', '2024-Q4', '2025-Q1', '2025-Q2', '2025-Q3', '2025-Q4', '2026-Q1', '2026-Q2', '2026-Q3'];
  const enterpriseData = [5, 7, 8, 11, 2, 1, 0, 0, 0, 0, 2, 3, 0, 0, 0, 0];
  const eventData = [5, 7, 8, 11, 2, 1, 0, 0, 0, 0, 2, 3, 0, 0, 0, 0];
  chart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { data: ['企业数（家）', '事件数（次）'], bottom: 0, textStyle: { fontSize: 11, color: '#646A73' } },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '5%', containLabel: true },
    xAxis: { type: 'category', data: quarters, axisLabel: { fontSize: 10, color: '#8F959E', rotate: 45 }, axisLine: { lineStyle: { color: '#EBEEF5' } } },
    yAxis: { type: 'value', axisLabel: { color: '#8F959E' }, splitLine: { lineStyle: { color: '#F2F3F5' } } },
    series: [
      { type: 'bar', name: '企业数（家）', data: enterpriseData, itemStyle: { color: '#3B82F6', borderRadius: [4, 4, 0, 0] }, barWidth: '35%' },
      { type: 'bar', name: '事件数（次）', data: eventData, itemStyle: { color: '#10B981', borderRadius: [4, 4, 0, 0] }, barWidth: '35%' }
    ]
  });
  window.addEventListener('resize', () => chart && chart.resize());
}

function renderRiskTaxChart() {
  const chartDom = document.getElementById('riskTaxChart');
  if (!chartDom) return;
  const chart = echarts.init(chartDom);
  const quarters = ['2024-Q1', '2024-Q2', '2024-Q3', '2024-Q4', '2025-Q1', '2025-Q2', '2025-Q3', '2025-Q4', '2026-Q1', '2026-Q2', '2026-Q3'];
  const data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  chart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { data: ['企业数（家）'], bottom: 0, textStyle: { fontSize: 11, color: '#646A73' } },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '5%', containLabel: true },
    xAxis: { type: 'category', data: quarters, axisLabel: { fontSize: 10, color: '#8F959E', rotate: 45 }, axisLine: { lineStyle: { color: '#EBEEF5' } } },
    yAxis: { type: 'value', max: 1, axisLabel: { color: '#8F959E' }, splitLine: { lineStyle: { color: '#F2F3F5' } } },
    series: [{ type: 'bar', name: '企业数（家）', data: data, itemStyle: { color: '#3B82F6', borderRadius: [4, 4, 0, 0] }, barWidth: '50%' }]
  });
  window.addEventListener('resize', () => chart && chart.resize());
}

function renderRiskTaxDebtChart() {
  const chartDom = document.getElementById('riskTaxDebtChart');
  if (!chartDom) return;
  const chart = echarts.init(chartDom);
  const quarters = ['2024-Q1', '2024-Q2', '2024-Q3', '2024-Q4', '2025-Q1', '2025-Q2', '2025-Q3', '2025-Q4', '2026-Q1', '2026-Q2', '2026-Q3'];
  const enterpriseData = [30, 35, 40, 45, 50, 60, 80, 90, 100, 120, 50];
  const eventData = [60, 65, 70, 75, 85, 100, 130, 150, 170, 210, 80];
  const amountData = [1200, 1300, 1400, 1500, 1600, 1800, 2200, 2600, 3000, 3500, 1500];
  chart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { data: ['企业数（家）', '事件数（次）', '金额（万元）'], bottom: 0, textStyle: { fontSize: 11, color: '#646A73' } },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '5%', containLabel: true },
    xAxis: { type: 'category', data: quarters, axisLabel: { fontSize: 10, color: '#8F959E', rotate: 45 }, axisLine: { lineStyle: { color: '#EBEEF5' } } },
    yAxis: [{ type: 'value', axisLabel: { color: '#8F959E' }, splitLine: { lineStyle: { color: '#F2F3F5' } } }],
    series: [
      { type: 'bar', name: '企业数（家）', data: enterpriseData, itemStyle: { color: '#3B82F6', borderRadius: [4, 4, 0, 0] }, barWidth: '25%' },
      { type: 'bar', name: '事件数（次）', data: eventData, itemStyle: { color: '#10B981', borderRadius: [4, 4, 0, 0] }, barWidth: '25%' },
      { type: 'line', name: '金额（万元）', data: amountData, itemStyle: { color: '#F59E0B' }, lineStyle: { width: 2 }, symbol: 'circle', symbolSize: 6 }
    ]
  });
  window.addEventListener('resize', () => chart && chart.resize());
}

function renderRiskCreditChart() {
  const chartDom = document.getElementById('riskCreditChart');
  if (!chartDom) return;
  const chart = echarts.init(chartDom);
  const quarters = ['2024-Q1', '2024-Q2', '2024-Q3', '2024-Q4', '2025-Q1', '2025-Q2', '2025-Q3', '2025-Q4', '2026-Q1', '2026-Q2', '2026-Q3'];
  const enterpriseData = [8, 10, 12, 15, 18, 22, 28, 35, 40, 45, 25];
  const eventData = [12, 15, 18, 22, 28, 35, 45, 58, 70, 85, 40];
  chart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { data: ['企业数（家）', '事件数（次）'], bottom: 0, textStyle: { fontSize: 11, color: '#646A73' } },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '5%', containLabel: true },
    xAxis: { type: 'category', data: quarters, axisLabel: { fontSize: 10, color: '#8F959E', rotate: 45 }, axisLine: { lineStyle: { color: '#EBEEF5' } } },
    yAxis: { type: 'value', axisLabel: { color: '#8F959E' }, splitLine: { lineStyle: { color: '#F2F3F5' } } },
    series: [
      { type: 'bar', name: '企业数（家）', data: enterpriseData, itemStyle: { color: '#F97316', borderRadius: [4, 4, 0, 0] }, barWidth: '35%' },
      { type: 'bar', name: '事件数（次）', data: eventData, itemStyle: { color: '#10B981', borderRadius: [4, 4, 0, 0] }, barWidth: '35%' }
    ]
  });
  window.addEventListener('resize', () => chart && chart.resize());
}

function renderRiskCaseChart() {
  const chartDom = document.getElementById('riskCaseChart');
  if (!chartDom) return;
  const chart = echarts.init(chartDom);
  const quarters = ['2024-Q1', '2024-Q2', '2024-Q3', '2024-Q4', '2025-Q1', '2025-Q2', '2025-Q3', '2025-Q4', '2026-Q1', '2026-Q2', '2026-Q3'];
  const enterpriseData = [15, 18, 22, 25, 28, 35, 45, 55, 65, 75, 40];
  const eventData = [25, 30, 38, 45, 55, 70, 95, 120, 145, 170, 85];
  chart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { data: ['企业数（家）', '事件数（次）'], bottom: 0, textStyle: { fontSize: 11, color: '#646A73' } },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '5%', containLabel: true },
    xAxis: { type: 'category', data: quarters, axisLabel: { fontSize: 10, color: '#8F959E', rotate: 45 }, axisLine: { lineStyle: { color: '#EBEEF5' } } },
    yAxis: { type: 'value', axisLabel: { color: '#8F959E' }, splitLine: { lineStyle: { color: '#F2F3F5' } } },
    series: [
      { type: 'bar', name: '企业数（家）', data: enterpriseData, itemStyle: { color: '#F97316', borderRadius: [4, 4, 0, 0] }, barWidth: '35%' },
      { type: 'bar', name: '事件数（次）', data: eventData, itemStyle: { color: '#10B981', borderRadius: [4, 4, 0, 0] }, barWidth: '35%' }
    ]
  });
  window.addEventListener('resize', () => chart && chart.resize());
}

function renderRiskAdminChart() {
  const chartDom = document.getElementById('riskAdminChart');
  if (!chartDom) return;
  const chart = echarts.init(chartDom);
  const quarters = ['2024-Q1', '2024-Q2', '2024-Q3', '2024-Q4', '2025-Q1', '2025-Q2', '2025-Q3', '2025-Q4', '2026-Q1', '2026-Q2', '2026-Q3'];
  const enterpriseData = [55, 58, 65, 72, 35, 30, 25, 20, 18, 15, 8];
  const eventData = [60, 62, 70, 75, 38, 32, 28, 22, 20, 16, 9];
  chart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { data: ['企业数（家）', '事件数（次）'], bottom: 0, textStyle: { fontSize: 11, color: '#646A73' } },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '5%', containLabel: true },
    xAxis: { type: 'category', data: quarters, axisLabel: { fontSize: 10, color: '#8F959E', rotate: 45 }, axisLine: { lineStyle: { color: '#EBEEF5' } } },
    yAxis: { type: 'value', axisLabel: { color: '#8F959E' }, splitLine: { lineStyle: { color: '#F2F3F5' } } },
    series: [
      { type: 'bar', name: '企业数（家）', data: enterpriseData, itemStyle: { color: '#EF4444', borderRadius: [4, 4, 0, 0] }, barWidth: '35%' },
      { type: 'bar', name: '事件数（次）', data: eventData, itemStyle: { color: '#10B981', borderRadius: [4, 4, 0, 0] }, barWidth: '35%' }
    ]
  });
  window.addEventListener('resize', () => chart && chart.resize());
}

function renderRiskEnvChart() {
  const chartDom = document.getElementById('riskEnvChart');
  if (!chartDom) return;
  const chart = echarts.init(chartDom);
  const quarters = ['2024-Q1', '2024-Q2', '2024-Q3', '2024-Q4', '2025-Q1', '2025-Q2', '2025-Q3', '2025-Q4', '2026-Q1', '2026-Q2', '2026-Q3'];
  const enterpriseData = [8, 10, 12, 10, 6, 5, 3, 2, 2, 1, 0];
  const eventData = [9, 12, 14, 12, 7, 6, 4, 3, 3, 2, 0];
  chart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { data: ['企业数（家）', '事件数（次）'], bottom: 0, textStyle: { fontSize: 11, color: '#646A73' } },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '5%', containLabel: true },
    xAxis: { type: 'category', data: quarters, axisLabel: { fontSize: 10, color: '#8F959E', rotate: 45 }, axisLine: { lineStyle: { color: '#EBEEF5' } } },
    yAxis: { type: 'value', axisLabel: { color: '#8F959E' }, splitLine: { lineStyle: { color: '#F2F3F5' } } },
    series: [
      { type: 'bar', name: '企业数（家）', data: enterpriseData, itemStyle: { color: '#EF4444', borderRadius: [4, 4, 0, 0] }, barWidth: '35%' },
      { type: 'bar', name: '事件数（次）', data: eventData, itemStyle: { color: '#10B981', borderRadius: [4, 4, 0, 0] }, barWidth: '35%' }
    ]
  });
  window.addEventListener('resize', () => chart && chart.resize());
}

function renderOverviewTab() {
  if (!chainData) return;

  document.getElementById('overviewTitle').textContent = chainData.name + '产业链';
  document.getElementById('overviewDesc').textContent = chainData.description || '该产业链涵盖多个核心环节，是区域经济发展的重要支柱产业。';

  const statScale = document.getElementById('statScale');
  if (statScale) statScale.textContent = chainData.revenue_total || '0';
  const statEnterprises = document.getElementById('statEnterprises');
  if (statEnterprises) statEnterprises.textContent = chainData.enterprise_count || '0';
  const statCompleteness = document.getElementById('statCompleteness');
  if (statCompleteness) statCompleteness.textContent = chainData.completeness_score + '%';
  const statRevenue = document.getElementById('statRevenue');
  if (statRevenue) statRevenue.textContent = chainData.revenue_total || '0';

  document.getElementById('metricScale').textContent = chainData.revenue_total || '0';
  document.getElementById('metricCount').textContent = chainData.enterprise_count || '0';
  document.getElementById('metricTax').textContent = chainData.tax_contribution || '0';
  document.getElementById('metricEmployees').textContent = formatNumber(6180);

  renderEnterpriseLayerDashboard();
  renderNewEnterpriseGrowthChart();
  renderProsperityIndexChart();
  renderMonthlyTrendCharts();
  renderEmployeeScaleChart();
}

function renderInnovationRAndDChart() {
  const chartDom = document.getElementById('innovationRAndDChart');
  if (!chartDom) return;
  const chart = echarts.init(chartDom);
  const years = ['2021', '2022', '2023', '2024', '2025'];
  const localData = [2.4, 3.2, 5.0, 4.5, 5.6];
  const nationalData = [1.8, 2.2, 2.6, 2.7, 2.8];
  chart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'line' } },
    legend: { data: ['产业内 (%)', '全国 (%)'], bottom: 0, textStyle: { fontSize: 11, color: '#646A73' } },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '5%', containLabel: true },
    xAxis: { type: 'category', data: years, axisLabel: { fontSize: 12, color: '#8F959E' }, axisLine: { lineStyle: { color: '#EBEEF5' } } },
    yAxis: { type: 'value', name: '占比 (%)', nameTextStyle: { color: '#8F959E', fontSize: 11 }, axisLabel: { color: '#8F959E' }, splitLine: { lineStyle: { color: '#F2F3F5' } } },
    series: [
      { type: 'line', name: '产业内 (%)', data: localData, itemStyle: { color: '#2563EB' }, lineStyle: { width: 2 }, areaStyle: { color: 'rgba(37, 99, 235, 0.1)' }, symbol: 'circle', symbolSize: 6 },
      { type: 'line', name: '全国 (%)', data: nationalData, itemStyle: { color: '#10B981' }, lineStyle: { width: 2 }, areaStyle: { color: 'rgba(16, 185, 129, 0.1)' }, symbol: 'circle', symbolSize: 6 }
    ]
  });
  window.addEventListener('resize', () => chart && chart.resize());
}

function renderInnovationStaffChart() {
  const chartDom = document.getElementById('innovationStaffChart');
  if (!chartDom) return;
  const chart = echarts.init(chartDom);
  const years = ['2021', '2022', '2023', '2024', '2025'];
  const localData = [0.05, 0.06, 0, 0.05, 0];
  const nationalData = [1.8, 0.7, 0.55, 0.65, 0.45];
  chart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'line' } },
    legend: { data: ['产业内 (%)', '全国 (%)'], bottom: 0, textStyle: { fontSize: 11, color: '#646A73' } },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '5%', containLabel: true },
    xAxis: { type: 'category', data: years, axisLabel: { fontSize: 12, color: '#8F959E' }, axisLine: { lineStyle: { color: '#EBEEF5' } } },
    yAxis: { type: 'value', name: '占比 (%)', nameTextStyle: { color: '#8F959E', fontSize: 11 }, axisLabel: { color: '#8F959E' }, splitLine: { lineStyle: { color: '#F2F3F5' } } },
    series: [
      { type: 'line', name: '产业内 (%)', data: localData, itemStyle: { color: '#2563EB' }, lineStyle: { width: 2 }, areaStyle: { color: 'rgba(37, 99, 235, 0.1)' }, symbol: 'circle', symbolSize: 6 },
      { type: 'line', name: '全国 (%)', data: nationalData, itemStyle: { color: '#10B981' }, lineStyle: { width: 2 }, areaStyle: { color: 'rgba(16, 185, 129, 0.1)' }, symbol: 'circle', symbolSize: 6 }
    ]
  });
  window.addEventListener('resize', () => chart && chart.resize());
}

function renderInnovationPatentTypeChart() {
  const chartDom = document.getElementById('innovationPatentTypeChart');
  if (!chartDom) return;
  const chart = echarts.init(chartDom);
  chart.setOption({
    tooltip: { trigger: 'item' },
    legend: { right: 0, top: 10, orient: 'vertical', textStyle: { fontSize: 11, color: '#646A73' } },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['40%', '50%'],
      itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      data: [
        { value: 78791, name: '发明专利公布（件）', itemStyle: { color: '#2563EB' } },
        { value: 53901, name: '发明专利授权（件）', itemStyle: { color: '#3B82F6' } },
        { value: 40343, name: '实用新型（件）', itemStyle: { color: '#F59E0B' } },
        { value: 6843, name: '外观设计（件）', itemStyle: { color: '#F97316' } }
      ]
    }]
  });
  window.addEventListener('resize', () => chart && chart.resize());
}

function renderInnovationPatentTrendChart() {
  const chartDom = document.getElementById('innovationPatentTrendChart');
  if (!chartDom) return;
  const chart = echarts.init(chartDom);
  const years = ['2022', '2023', '2024', '2025', '2026'];
  const inventionData = [11000, 12000, 13000, 15000, 2000];
  const utilityModelData = [3000, 4000, 5000, 5000, 0];
  const designData = [1600, 1900, 2200, 2300, 0];
  chart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { data: ['发明专利（件）', '实用新型（件）', '外观设计（件）'], bottom: 0, textStyle: { fontSize: 11, color: '#646A73' } },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '5%', containLabel: true },
    xAxis: { type: 'category', data: years, axisLabel: { fontSize: 12, color: '#8F959E' }, axisLine: { lineStyle: { color: '#EBEEF5' } } },
    yAxis: { type: 'value', name: '数量（件）', nameTextStyle: { color: '#8F959E', fontSize: 11 }, axisLabel: { color: '#8F959E' }, splitLine: { lineStyle: { color: '#F2F3F5' } } },
    series: [
      { type: 'bar', name: '发明专利（件）', data: inventionData, itemStyle: { color: '#2563EB', borderRadius: [4, 4, 0, 0] }, barWidth: '25%' },
      { type: 'bar', name: '实用新型（件）', data: utilityModelData, itemStyle: { color: '#F59E0B', borderRadius: [4, 4, 0, 0] }, barWidth: '25%' },
      { type: 'bar', name: '外观设计（件）', data: designData, itemStyle: { color: '#10B981', borderRadius: [4, 4, 0, 0] }, barWidth: '25%' }
    ]
  });
  window.addEventListener('resize', () => chart && chart.resize());
}

function renderRegionChart() {
  const chartDom = document.getElementById('regionChart');
  if (!chartDom) return;

  if (regionChart) {
    regionChart.dispose();
  }

  regionChart = echarts.init(chartDom);

  const regions = ['高新区', '经开区', '工业园区', '科技城', '自贸片区', '综合保税区'];
  const data = regions.map(() => Math.floor(Math.random() * 80) + 20);

  regionChart.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: regions,
      axisLabel: {
        fontSize: 12,
        color: '#646A73'
      },
      axisLine: { lineStyle: { color: '#EBEEF5' } }
    },
    yAxis: {
      type: 'value',
      name: '企业数量(家)',
      nameTextStyle: { color: '#8F959E', fontSize: 12 },
      axisLabel: { color: '#8F959E' },
      splitLine: { lineStyle: { color: '#F2F3F5' } }
    },
    series: [{
      type: 'bar',
      data: data,
      itemStyle: {
        color: '#2563EB',
        borderRadius: [4, 4, 0, 0]
      },
      emphasis: {
        itemStyle: { color: '#1D4ED8' }
      },
      barWidth: '50%'
    }]
  });

  window.addEventListener('resize', () => regionChart && regionChart.resize());
}

const newsData = [
  { id: 1, type: 'policy', title: '关于印发《科技服务产业发展三年行动计划》的通知', source: '区发改局', time: '2026-07-15', desc: '明确科技服务产业发展目标和重点任务' },
  { id: 2, type: 'industry', title: '科技服务业态创新论坛成功举办', source: '科技局', time: '2026-07-14', desc: '业界专家共商产业发展新路径' },
  { id: 3, type: 'enterprise', title: 'XX科技服务集团获评国家级高新技术企业', source: '企业动态', time: '2026-07-13', desc: '技术创新能力获权威认可' },
  { id: 4, type: 'report', title: '2026年科技服务产业发展白皮书发布', source: '行业协会', time: '2026-07-12', desc: '全面分析产业发展趋势' },
  { id: 5, type: 'policy', title: '科技服务企业扶持政策实施细则出台', source: '财政局', time: '2026-07-11', desc: '加大对科技服务企业的财政支持' },
  { id: 6, type: 'industry', title: '区域科技服务产业联盟正式成立', source: '经信局', time: '2026-07-10', desc: '推动产业链上下游协同发展' },
  { id: 7, type: 'enterprise', title: 'XX软件公司获得新一轮融资', source: '企业动态', time: '2026-07-09', desc: '估值突破50亿' },
  { id: 8, type: 'report', title: '科技服务细分领域市场分析报告', source: '研究机构', time: '2026-07-08', desc: '涵盖云计算、大数据、人工智能等领域' }
];

function renderNewsTab() {
  filterNews('all');
}

function filterNews(type) {
  document.querySelectorAll('.news-tab').forEach(t => t.classList.toggle('active', t.dataset.newsType === type));

  const filtered = type === 'all' ? newsData : newsData.filter(n => n.type === type);

  const newsList = document.getElementById('newsList');
  if (!newsList) return;

  newsList.innerHTML = filtered.map(news => `
    <div class="news-item" onclick="showNewsDetail(${news.id})">
      <span class="news-tag ${news.type}">${getNewsTypeLabel(news.type)}</span>
      <div class="news-content">
        <div class="news-title">${news.title}</div>
        <div class="news-meta">
          <span>${news.source}</span>
          <span class="news-time">${news.time}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function getNewsTypeLabel(type) {
  const labels = { policy: '政策新闻', industry: '产业动态', enterprise: '企业资讯', report: '行业报告' };
  return labels[type] || '其他';
}

function showNewsDetail(id) {
  const news = newsData.find(n => n.id === id);
  if (news) {
    const content = `
      <h4 style="margin-bottom:12px">${news.title}</h4>
      <div style="color:#8F959E;font-size:13px;margin-bottom:16px">来源：${news.source} | 发布时间：${news.time}</div>
      <div style="line-height:1.8;color:#1D2129">${news.desc}</div>
      <div style="margin-top:16px;padding-top:16px;border-top:1px solid #EBEEF5">
        <p style="color:#646A73;font-size:13px">更多详情请登录政务信息公开平台查看。</p>
      </div>
    `;
    openModal('新闻详情', content);
  }
}

let currentSelectedGapNodeId = null;

function renderGapFillingTab() {
  const selectedChainId = document.getElementById('gapChainSelect')?.value || chainId;
  const searchText = document.getElementById('gapSearchInput')?.value || '';
  const riskLevel = document.getElementById('gapRiskLevelSelect')?.value || 'all';
  const priority = document.getElementById('gapPrioritySelect')?.value || 'all';

  if (selectedChainId !== chainId) {
    chainId = selectedChainId;
    loadData();
    return;
  }

  if (!gapData) return;

  let gaps = gapData.gaps || [];

  if (searchText) {
    gaps = gaps.filter(g => g.name.includes(searchText));
  }

  if (riskLevel !== 'all') {
    gaps = gaps.filter(g => g.gapType === riskLevel);
  }

  gaps = gaps.map(g => {
    const priorityScore = g.localCount === 0 ? 0.9 : 0.6;
    const pLevel = g.localCount === 0 ? 'P1' : 'P2';
    const gapRatio = g.nationalCount > 0 ? ((g.nationalCount - g.localCount) / g.nationalCount * 100).toFixed(0) : '100';
    return { ...g, priorityScore, pLevel, gapRatio };
  });

  if (priority !== 'all') {
    gaps = gaps.filter(g => g.pLevel === priority);
  }

  gaps.sort((a, b) => {
    if (a.pLevel !== b.pLevel) {
      return a.pLevel === 'P1' ? -1 : 1;
    }
    return b.priorityScore - a.priorityScore;
  });

  const p1Count = gaps.filter(g => g.pLevel === 'P1').length;
  const p2Count = gaps.filter(g => g.pLevel === 'P2').length;

  document.getElementById('gapP1Count').textContent = 'P1 ' + p1Count;
  document.getElementById('gapP2Count').textContent = 'P2 ' + p2Count;

  const priorityList = document.getElementById('priorityList');
  if (!priorityList) return;

  if (gaps.length === 0) {
    priorityList.innerHTML = `<div class="empty-detail"><div class="empty-icon">✅</div><div class="empty-text">暂无匹配的缺失环节</div></div>`;
    return;
  }

  priorityList.innerHTML = gaps.map((gap, index) => `
    <div class="priority-item ${gap.pLevel === 'P1' ? 'severe' : ''}"
         onclick="window.location.href='chain-gap.html?chainId=${chainId}&nodeId=${gap.nodeId}'" data-node-id="${gap.nodeId}">
      <div class="priority-prefix ${gap.pLevel.toLowerCase()}">${gap.pLevel}</div>
      <div class="priority-info">
        <div class="priority-name">${gap.name}</div>
        <div class="priority-meta">
          <div class="priority-meta-item">缺口比例 <span class="value ${gap.pLevel === 'P1' ? 'danger' : 'warning'}">${gap.gapRatio}%</span></div>
          <div class="priority-meta-item">受影响企业 <span class="value">${gap.affectedDownstream?.length || 0}家</span></div>
          <div class="priority-meta-item">推荐招商 <span class="value">${gap.recommended?.length || 0}家</span></div>
          <div class="priority-meta-item">优先级分值 <span class="value">${(gap.priorityScore * 100).toFixed(0)}分</span></div>
        </div>
      </div>
      <div class="priority-actions">
        <button class="btn btn-sm btn-primary" onclick="event.stopPropagation();window.location.href='chain-gap.html?chainId=${chainId}&nodeId=${gap.nodeId}'">查看补链方案</button>
        <button class="btn btn-sm btn-default" onclick="event.stopPropagation();locateInGraph('${gap.nodeId}')">定位图谱</button>
      </div>
    </div>
  `).join('');

}

function selectGapItem(nodeId) {
  window.location.href = `chain-gap.html?chainId=${chainId}&nodeId=${nodeId}`;
}

function resetGapFilters() {
  document.getElementById('gapSearchInput').value = '';
  document.getElementById('gapRiskLevelSelect').value = 'all';
  document.getElementById('gapPrioritySelect').value = 'all';
  currentSelectedGapNodeId = null;
  renderGapFillingTab();
}



function locateInGraph(nodeId) {
  switchMainTab('structure');
  setTimeout(() => {
    const node = findNodeInTree(categoryTree.tree, nodeId);
    if (!node) return;
    if (node.isLeaf) {
      openSegmentModal(nodeId);
    } else {
      showToast('已定位到产业链环节：' + node.name, 'success');
    }
  }, 200);
}

// ==================== 结构视图 ====================
function renderStructureView() {
  const chartDom = document.getElementById('mainChart');
  myChart = echarts.init(chartDom);

  const treeData = buildEChartsTree(categoryTree.tree[0]);

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: params => {
        const data = params.data;
        return `<div style="font-weight:600">${data.name}</div>
                ${data.localCount !== undefined ? `<div>本区：${data.localCount}家 / 全国：${data.nationalCount}家</div>` : ''}`;
      }
    },
    series: [{
      type: 'tree',
      data: [treeData],
      top: '5%', left: '10%', bottom: '5%', right: '20%',
      symbolSize: 12,
      orient: 'LR',
      label: {
        position: 'left',
        verticalAlign: 'middle',
        align: 'right',
        fontSize: 13,
        formatter: params => params.data.name
      },
      leaves: {
        label: { position: 'right', verticalAlign: 'middle', align: 'left' }
      },
      emphasis: { focus: 'descendant' },
      expandAndCollapse: true,
      animationDuration: 550,
      animationDurationUpdate: 750
    }]
  };

  myChart.setOption(option);
  myChart.on('click', params => {
    selectTreeNode(params.data.id);
  });
  myChart.on('dblclick', params => {
    if (!params.data || !params.data.id) return;
    const node = findNodeInTree(categoryTree.tree, params.data.id);
    if (node && node.isLeaf) {
      openNodeDrawer(node.id);
    }
  });
}

function buildEChartsTree(node) {
  const result = {
    id: node.id,
    name: node.name,
    value: node.localCount,
    localCount: node.localCount,
    nationalCount: node.nationalCount,
    itemStyle: { color: getTreeColor(node.status) },
    label: { color: node.status === 'missing' ? '#F5222D' : '#262626' }
  };
  if (node.children && node.children.length) {
    result.children = node.children.map(buildEChartsTree);
  }
  return result;
}

function getTreeColor(status) {
  return status === 'advantage' ? '#52C41A' : status === 'missing' ? '#F5222D' : '#1890FF';
}

function highlightStructureNode(nodeId) {
  if (!myChart) return;
  myChart.dispatchAction({ type: 'downplay' });
  // ECharts tree 不支持直接按id highlight，这里通过tooltip展示
  const data = findNodeInTree(categoryTree.tree, nodeId);
  if (data) {
    showToast('已定位：' + data.name, 'info');
  }
}

function findNodeInTree(nodes, nodeId) {
  for (const node of nodes) {
    if (node.id === nodeId) return node;
    if (node.children) {
      const found = findNodeInTree(node.children, nodeId);
      if (found) return found;
    }
  }
  return null;
}

// ==================== 关系视图 ====================
let relationNodes = [];
let relationEdges = [];
let relationPositions = {};
let relationTransform = { x: 0, y: 0, scale: 1 };
let relationDragging = null;
let relationCanvas = null;
let isCanvasDragging = false;
let canvasDragStart = { x: 0, y: 0 };

function renderRelationView() {
  const chartDom = document.getElementById('mainChart');
  chartDom.innerHTML = '';
  relationTransform = { x: 0, y: 0, scale: currentZoom };

  relationNodes = enterpriseNetwork.nodes.filter(n => {
    const filterType = n.local ? n.type : 'external';
    return !hiddenNodeTypes.has(filterType);
  });
  const nodeIds = new Set(relationNodes.map(n => n.id));
  relationEdges = enterpriseNetwork.edges.filter(e => nodeIds.has(e.source) && nodeIds.has(e.target));

  // 初始化画布结构
  relationCanvas = document.createElement('div');
  relationCanvas.className = 'relation-canvas';
  relationCanvas.style.transform = `translate(${relationTransform.x}px, ${relationTransform.y}px) scale(${relationTransform.scale})`;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('relation-svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  defineRelationMarkers(svg);
  relationCanvas.appendChild(svg);

  const nodesContainer = document.createElement('div');
  nodesContainer.className = 'relation-nodes';
  relationCanvas.appendChild(nodesContainer);

  const tooltip = document.createElement('div');
  tooltip.className = 'relation-tooltip';
  chartDom.appendChild(tooltip);

  const hint = document.createElement('div');
  hint.className = 'relation-reset-hint';
  hint.textContent = '滚轮缩放 · 拖拽画布 · 双击空白重置';
  chartDom.appendChild(hint);
  chartDom.appendChild(relationCanvas);

  // 计算布局位置
  calculateRelationPositions();

  // 渲染节点
  relationNodes.forEach(node => {
    const pos = relationPositions[node.id];
    const el = createRelationNode(node, pos);
    nodesContainer.appendChild(el);
  });

  // 渲染连线
  renderRelationEdges();

  // 绑定画布事件
  bindRelationEvents(chartDom, tooltip);

  // myChart 占位，用于保持接口一致
  myChart = { resize: () => {}, dispose: () => {} };
  updateNodeCount();
}

function defineRelationMarkers(svg) {
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  ['#1890FF', '#8C8C8C', '#722ED1', '#13C2C2', '#D9D9D9'].forEach(color => {
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    marker.setAttribute('id', 'arrow-' + color.replace('#', ''));
    marker.setAttribute('markerWidth', '10');
    marker.setAttribute('markerHeight', '10');
    marker.setAttribute('refX', '9');
    marker.setAttribute('refY', '3');
    marker.setAttribute('orient', 'auto');
    marker.setAttribute('markerUnits', 'strokeWidth');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M0,0 L0,6 L9,3 z');
    path.setAttribute('fill', color);
    marker.appendChild(path);
    defs.appendChild(marker);
  });
  svg.appendChild(defs);
}

function calculateRelationPositions() {
  const chartDom = document.getElementById('mainChart');
  const width = chartDom.clientWidth || 1000;
  const height = chartDom.clientHeight || 600;

  const groups = { parts: [], body: [], integration: [], terminal: [], external: [] };
  relationNodes.forEach(node => {
    const key = node.local ? node.type : 'external';
    if (groups[key]) groups[key].push(node);
  });

  const columns = {
    parts: width * 0.15 - 90,
    body: width * 0.4 - 90,
    integration: width * 0.65 - 90,
    terminal: width * 0.85 - 90,
    external: width * 0.5 - 90
  };

  Object.entries(groups).forEach(([type, nodes]) => {
    if (!nodes.length) return;
    const isExternal = type === 'external';
    const x = columns[type];
    const availableHeight = isExternal ? height * 0.25 : height * 0.85;
    const startY = isExternal ? height * 0.72 : height * 0.08;
    const gap = nodes.length === 1 ? 0 : availableHeight / (nodes.length - 1);
    nodes.forEach((node, i) => {
      relationPositions[node.id] = {
        x: x,
        y: startY + gap * i
      };
    });
  });
}

function createRelationNode(node, pos) {
  const el = document.createElement('div');
  el.className = `relation-node node-type-${node.local ? node.type : 'external'}`;
  el.dataset.id = node.id;
  el.style.left = pos.x + 'px';
  el.style.top = pos.y + 'px';

  const typeCfg = CONFIG.enterpriseType[node.type];
  const tagsHtml = node.enabling.length
    ? `<div class="relation-node-tags">${node.enabling.map(t => `<span class="relation-node-tag">${CONFIG.enabling[t].label}</span>`).join('')}</div>`
    : '';

  el.innerHTML = `
    <div class="relation-node-name">${node.name}</div>
    <div class="relation-node-line"></div>
    <div class="relation-node-info">年营收：${node.revenue}亿</div>
    <div class="relation-node-info">员工：${formatNumber(node.employees)}人</div>
    ${tagsHtml}
  `;

  // 节点事件
  el.addEventListener('click', e => {
    e.stopPropagation();
    selectTreeNode(node.id);
    openNodeDrawer(node.id, 'enterprise');
  });
  el.addEventListener('mouseenter', e => showRelationNodeTooltip(e, node));
  el.addEventListener('mouseleave', hideRelationTooltip);
  el.addEventListener('dblclick', e => {
    e.stopPropagation();
    window.open('enterprise-profile.html?enterpriseId=' + encodeURIComponent(node.id), '_blank');
  });

  // 节点拖拽
  el.addEventListener('mousedown', e => {
    e.stopPropagation();
    relationDragging = {
      node,
      el,
      startX: e.clientX,
      startY: e.clientY,
      startLeft: pos.x,
      startTop: pos.y
    };
    el.classList.add('dragging');
  });

  return el;
}

function renderRelationEdges() {
  const svg = relationCanvas.querySelector('.relation-svg');
  svg.innerHTML = '';
  defineRelationMarkers(svg);

  relationEdges.forEach(edge => {
    const sourcePos = relationPositions[edge.source];
    const targetPos = relationPositions[edge.target];
    if (!sourcePos || !targetPos) return;

    const cfg = CONFIG.relationType[edge.type];
    const color = edge.type === 'transaction' ? (edge.local ? '#1890FF' : '#8C8C8C') : cfg.color;
    const width = edge.type === 'transaction' ? Math.max(2, Math.log(edge.amount + 1) * 1.5) : 2;
    const dash = cfg.dash === 'dashed' ? '8,4' : cfg.dash === 'dotted' ? '2,4' : '';

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const d = getRelationEdgePath(sourcePos, targetPos);
    path.setAttribute('d', d);
    path.setAttribute('stroke', color);
    path.setAttribute('stroke-width', width);
    path.setAttribute('marker-end', `url(#arrow-${color.replace('#', '')})`);
    if (dash) path.setAttribute('stroke-dasharray', dash);
    path.dataset.source = edge.source;
    path.dataset.target = edge.target;
    path.dataset.type = edge.type;

    path.addEventListener('mouseenter', e => showRelationEdgeTooltip(e, edge));
    path.addEventListener('mouseleave', hideRelationTooltip);
    path.style.pointerEvents = 'stroke';

    svg.appendChild(path);
  });
}

function getRelationEdgePath(source, target) {
  const sx = source.x + 180;
  const sy = source.y + 40;
  const tx = target.x;
  const ty = target.y + 40;
  const cp1x = sx + (tx - sx) * 0.5;
  const cp1y = sy;
  const cp2x = sx + (tx - sx) * 0.5;
  const cp2y = ty;
  return `M ${sx} ${sy} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${tx} ${ty}`;
}

function bindRelationEvents(chartDom, tooltip) {
  // 滚轮缩放
  chartDom.addEventListener('wheel', e => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.max(0.5, Math.min(3, relationTransform.scale + delta));
    relationTransform.scale = newScale;
    applyRelationTransform();
    updateNodeCount();
  }, { passive: false });

  // 画布拖拽
  chartDom.addEventListener('mousedown', e => {
    if (e.target === chartDom || e.target === relationCanvas || e.target.classList.contains('relation-nodes')) {
      isCanvasDragging = true;
      canvasDragStart = { x: e.clientX - relationTransform.x, y: e.clientY - relationTransform.y };
      relationCanvas.classList.add('dragging');
    }
  });

  document.addEventListener('mousemove', e => {
    if (relationDragging) {
      const dx = (e.clientX - relationDragging.startX) / relationTransform.scale;
      const dy = (e.clientY - relationDragging.startY) / relationTransform.scale;
      relationPositions[relationDragging.node.id].x = relationDragging.startLeft + dx;
      relationPositions[relationDragging.node.id].y = relationDragging.startTop + dy;
      relationDragging.el.style.left = relationPositions[relationDragging.node.id].x + 'px';
      relationDragging.el.style.top = relationPositions[relationDragging.node.id].y + 'px';
      renderRelationEdges();
    } else if (isCanvasDragging) {
      relationTransform.x = e.clientX - canvasDragStart.x;
      relationTransform.y = e.clientY - canvasDragStart.y;
      applyRelationTransform();
    }
  });

  document.addEventListener('mouseup', () => {
    if (relationDragging) {
      relationDragging.el.classList.remove('dragging');
      relationDragging = null;
    }
    isCanvasDragging = false;
    if (relationCanvas) relationCanvas.classList.remove('dragging');
  });

  // 双击空白重置
  chartDom.addEventListener('dblclick', e => {
    if (e.target === chartDom || e.target === relationCanvas || e.target.classList.contains('relation-nodes')) {
      relationTransform = { x: 0, y: 0, scale: 1 };
      calculateRelationPositions();
      relationNodes.forEach(node => {
        const el = document.querySelector(`.relation-node[data-id="${node.id}"]`);
        if (el) {
          el.style.left = relationPositions[node.id].x + 'px';
          el.style.top = relationPositions[node.id].y + 'px';
        }
      });
      renderRelationEdges();
      applyRelationTransform();
      updateNodeCount();
    }
  });
}

function applyRelationTransform() {
  if (!relationCanvas) return;
  relationCanvas.style.transform = `translate(${relationTransform.x}px, ${relationTransform.y}px) scale(${relationTransform.scale})`;
}

function showRelationNodeTooltip(e, node) {
  const tooltip = document.querySelector('.relation-tooltip');
  if (!tooltip) return;
  const typeCfg = CONFIG.enterpriseType[node.type];
  tooltip.innerHTML = `
    <div style="font-weight:600">${node.name}</div>
    <div>类型：${typeCfg.label}</div>
    <div>年营收：${node.revenue}亿</div>
    <div>员工：${node.employees}人</div>
    <div>区域：${node.local ? '本区' : '外地'}</div>
  `;
  tooltip.style.display = 'block';
  positionRelationTooltip(e, tooltip);
}

function showRelationEdgeTooltip(e, edge) {
  const tooltip = document.querySelector('.relation-tooltip');
  if (!tooltip) return;
  const cfg = CONFIG.relationType[edge.type];
  tooltip.innerHTML = `
    <div>${edge.source} → ${edge.target}</div>
    <div>关系：${cfg.label}</div>
    ${edge.amount ? `<div>金额：${edge.amount}万</div>` : ''}
    ${edge.product ? `<div>商品：${edge.product}</div>` : ''}
  `;
  tooltip.style.display = 'block';
  positionRelationTooltip(e, tooltip);
}

function hideRelationTooltip() {
  const tooltip = document.querySelector('.relation-tooltip');
  if (tooltip) tooltip.style.display = 'none';
}

function positionRelationTooltip(e, tooltip) {
  const chartDom = document.getElementById('mainChart');
  const rect = chartDom.getBoundingClientRect();
  const x = e.clientX - rect.left + 12;
  const y = e.clientY - rect.top + 12;
  tooltip.style.left = x + 'px';
  tooltip.style.top = y + 'px';
}

function highlightRelationNode(nodeId) {
  if (currentView !== 'relation') return;
  document.querySelectorAll('.relation-node').forEach(el => {
    el.classList.toggle('highlighted', el.dataset.id === nodeId);
    el.classList.toggle('dimmed', el.dataset.id !== nodeId);
  });
  document.querySelectorAll('.relation-svg path').forEach(path => {
    const isRelated = path.dataset.source === nodeId || path.dataset.target === nodeId;
    path.classList.toggle('highlighted', isRelated);
    path.classList.toggle('dimmed', !isRelated);
  });
}

// ==================== 缺口视图 ====================
function renderGapView() {
  const panel = document.getElementById('gapPanel');
  if (!gapData.gaps || !gapData.gaps.length) {
    panel.innerHTML = `
      <div class="empty-state" style="height:300px">
        <div class="empty-state-icon">✅</div>
        <div class="empty-state-title">未发现明显缺口</div>
        <p>当前产业链各环节均有本区企业覆盖</p>
      </div>
    `;
    return;
  }

  panel.innerHTML = `
    <div style="margin-bottom:16px">
      <h3 style="font-size:16px">${chainData.name}产业 — 缺口分析</h3>
      <p style="color:#595959;font-size:13px">共 ${gapData.gaps.length} 个缺失/薄弱环节</p>
    </div>
    ${gapData.gaps.map(gap => `
      <div class="gap-card" onclick="openNodeDrawer('${gap.nodeId}', 'node')">
        <div class="gap-card-title">
          <span>🔴</span>
          <span>${gap.name}</span>
          <span class="tag tag-danger">${gap.gapType}</span>
        </div>
        <div class="gap-card-row">
          <strong>本区企业：</strong>${gap.localCount}家 &nbsp;|&nbsp;
          <strong>全国企业：</strong>${gap.nationalCount}家
        </div>
        <div class="gap-card-row">
          <strong>影响下游：</strong>${gap.affectedDownstream.join('、')}（${gap.affectedDownstream.length}家）
        </div>
        <div class="gap-card-row">
          <strong>年外流金额估算：</strong><span style="color:#F5222D;font-weight:600">${gap.affectedAmount}亿</span>
        </div>
        <div class="gap-card-tags">
          <span style="font-size:12px;color:#595959">建议引进：</span>
          ${gap.recommended.map(r => `<span class="tag tag-primary">${r}</span>`).join('')}
        </div>
        <div class="gap-card-policy">
          <strong>政策建议：</strong>${gap.policy}
        </div>
        <div class="gap-card-actions">
          <button class="btn btn-primary btn-sm" onclick="event.stopPropagation();openNodeDrawer('${gap.nodeId}', 'node')">查看详情</button>
          <button class="btn btn-default btn-sm" onclick="event.stopPropagation();showToast('已加入补链清单', 'success')">加入补链清单</button>
          <button class="btn btn-text btn-sm" onclick="event.stopPropagation();window.location.href='chain-gap.html?chainId=${chainId}&nodeId=${gap.nodeId}'">查看全国目标企业 →</button>
        </div>
      </div>
    `).join('')}
  `;
}

// ==================== 场景视图 ====================
let selectedScenarioId = null;

function renderScenarioView() {
  const panel = document.getElementById('scenarioPanel');
  if (!scenarioData.scenarios || !scenarioData.scenarios.length) {
    panel.innerHTML = `<div class="empty-state" style="height:300px"><div class="empty-state-icon">🎯</div><div class="empty-state-title">暂无场景数据</div></div>`;
    return;
  }

  const firstScenario = scenarioData.scenarios[0];
  selectedScenarioId = selectedScenarioId || firstScenario.id;
  const activeScenario = scenarioData.scenarios.find(s => s.id === selectedScenarioId) || firstScenario;

  panel.innerHTML = `
    <div style="display:grid;grid-template-columns:280px 1fr;gap:16px;height:100%">
      <div class="scenario-list">
        <div style="font-size:14px;font-weight:600;margin-bottom:10px">应用场景</div>
        ${scenarioData.scenarios.map(sc => `
          <div class="scenario-card ${sc.id === activeScenario.id ? 'active' : ''}" onclick="selectScenario('${sc.id}')">
            <div class="scenario-card-title">${sc.name}</div>
            <div class="scenario-card-count">全国 ${sc.nationalCount}家 / 本区 ${sc.localCount}家</div>
          </div>
        `).join('')}
      </div>
      <div class="scenario-detail">
        <div class="scenario-detail-title">${activeScenario.name} — 零部件需求拆解</div>
        ${activeScenario.components.map(comp => `
          <div class="component-item" onclick="window.location.href='chain-gap.html?chainId=${chainId}'">
            <div class="component-status ${comp.status}"></div>
            <div class="component-info">
              <div class="component-name">${comp.name}</div>
              <div class="component-count">本区 ${comp.localCount}家 / 全国 ${comp.nationalCount}家</div>
              <div class="component-impact">${comp.impact}</div>
            </div>
            <div>
              ${comp.status === 'missing' ? '<span class="tag tag-danger">本区缺失</span>' : ''}
              ${comp.status === 'weak' ? '<span class="tag tag-warning">本区薄弱</span>' : ''}
              ${comp.status === 'local' ? '<span class="tag tag-success">本区有</span>' : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function selectScenario(id) {
  selectedScenarioId = id;
  renderScenarioView();
}

// ==================== 右侧抽屉 ====================
async function openNodeDrawer(id, type = 'node') {
  let title, content, footer;

  if (type === 'enterprise') {
    const enterprise = enterpriseNetwork.nodes.find(n => n.id === id);
    if (!enterprise) return;
    title = enterprise.name;
    content = renderEnterpriseDrawerContent(enterprise);
    footer = `
      <button class="btn btn-primary" onclick="window.location.href='enterprise-network.html'">查看关系网络</button>
      <button class="btn btn-default" onclick="window.location.href='enterprise-profile.html?enterpriseId=${encodeURIComponent(enterprise.id)}'">查看企业画像</button>
    `;
  } else {
    const node = findNodeInTree(categoryTree.tree, id);
    if (!node) return;
    title = node.name;
    const result = await renderNodeDrawerContent(node);
    content = result.html;
    
    const isMissing = node.status === 'missing' || node.gapType === '严重缺失' || node.gapType === '轻度缺失';
    if (isMissing) {
      footer = `
        <button class="btn btn-primary" onclick="window.location.href='chain-gap.html?chainId=${chainId}&nodeId=${node.id}'">跳转到强链补链</button>
        <button class="btn btn-default" onclick="window.location.href='enterprise-network.html'">查看企业关系网络</button>
      `;
    } else {
      footer = `
        <button class="btn btn-primary" onclick="window.location.href='enterprise-network.html'">查看企业关系网络</button>
        <button class="btn btn-default" onclick="window.location.href='chain-gap.html?chainId=${chainId}&nodeId=${node.id}'">加入补链分析</button>
      `;
    }
    setTimeout(() => renderEnablingPie(result.techData), 50);
  }

  document.getElementById('drawerTitle').textContent = title;
  document.getElementById('drawerBody').innerHTML = content;
  document.getElementById('drawerFooter').innerHTML = footer;
  document.getElementById('drawerOverlay').classList.add('open');
  document.getElementById('nodeDrawer').classList.add('open');
}

function closeNodeDrawer() {
  document.getElementById('drawerOverlay').classList.remove('open');
  document.getElementById('nodeDrawer').classList.remove('open');
}

function renderEnterpriseDrawerContent(enterprise) {
  const typeCfg = CONFIG.enterpriseType[enterprise.type];
  return `
    <div class="drawer-section">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <div>
          <h3 style="margin-bottom:4px">${enterprise.name}</h3>
          <span class="tag" style="background:${typeCfg.color}20;color:${typeCfg.color}">${typeCfg.label}</span>
          <span class="tag ${enterprise.local ? 'tag-success' : 'tag-default'}">${enterprise.local ? '本区企业' : '外地企业'}</span>
        </div>
      </div>
      <div class="drawer-stats">
        <div class="drawer-stat"><div class="drawer-stat-value">${enterprise.revenue}</div><div class="drawer-stat-label">年营收（亿）</div></div>
        <div class="drawer-stat"><div class="drawer-stat-value">${formatNumber(enterprise.employees)}</div><div class="drawer-stat-label">员工人数</div></div>
      </div>
    </div>
    <div class="drawer-section">
      <div class="drawer-section-title">🔗 上下游关系</div>
      <table class="data-table">
        <thead><tr><th>方向</th><th>企业</th><th>关系</th><th>金额/说明</th></tr></thead>
        <tbody>
          ${enterpriseNetwork.edges.filter(e => e.source === enterprise.id || e.target === enterprise.id).map(e => {
            const isSource = e.source === enterprise.id;
            const other = isSource ? e.target : e.source;
            const cfg = CONFIG.relationType[e.type];
            return `<tr><td>${isSource ? '供应给' : '采购自'}</td><td class="clickable">${other}</td><td>${cfg.label}</td><td>${e.amount ? e.amount + '万' : e.product}</td></tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
    <div class="drawer-section">
      <div class="drawer-section-title">💡 使能技术</div>
      <div style="display:flex;gap:6px">${renderEnablingTags(enterprise.enabling) || '<span class="text-muted">无</span>'}</div>
    </div>
  `;
}

async function renderNodeDrawerContent(node) {
  const enterprises = await MockAPI.getNodeEnterprises(node.id);
  const techData = await MockAPI.getNodeEnablingTech(node.id);
  const coverageRate = node.nationalCount ? (node.localCount / node.nationalCount * 100).toFixed(1) : 0;

  return {
    html: `
      <div class="drawer-section">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <div>
            <h3 style="margin-bottom:4px">${node.name}</h3>
            ${renderTreeStatusTag(node.status)}
          </div>
        </div>
        <div class="drawer-stats">
          <div class="drawer-stat"><div class="drawer-stat-value" style="color:${node.status === 'missing' ? '#F5222D' : '#1890FF'}">${node.localCount}</div><div class="drawer-stat-label">本区企业数</div></div>
          <div class="drawer-stat"><div class="drawer-stat-value">${coverageRate}%</div><div class="drawer-stat-label">本区覆盖率</div></div>
        </div>
      </div>
      <div class="drawer-section">
        <div class="drawer-section-title">📊 使能技术分布</div>
        <div class="pie-chart-wrap" id="enablingPieChart"></div>
      </div>
      <div class="drawer-section">
        <div class="drawer-section-title">🏢 环节企业列表</div>
        <div class="enterprise-tab-bar">
          <div class="enterprise-tab active" data-tab="list" onclick="switchEnterpriseTab('list')">企业列表</div>
          <div class="enterprise-tab" data-tab="feature" onclick="switchEnterpriseTab('feature')">特征产业</div>
          <div class="enterprise-tab" data-tab="listed" onclick="switchEnterpriseTab('listed')">上市企业</div>
        </div>
        <div class="enterprise-filter">
          <div class="filter-row">
            <select class="filter-select">
              <option>全国</option>
              <option>本区</option>
              <option>外地</option>
            </select>
            <select class="filter-select">
              <option>所在行业</option>
              <option>核心材料</option>
              <option>智能制造</option>
              <option>科技创新</option>
            </select>
            <select class="filter-select">
              <option>企业背景</option>
              <option>民营</option>
              <option>国有</option>
              <option>外资</option>
            </select>
            <select class="filter-select">
              <option>参保人数</option>
              <option>100人以下</option>
              <option>100-500人</option>
              <option>500人以上</option>
            </select>
            <select class="filter-select">
              <option>注册资本</option>
              <option>100万以下</option>
              <option>100-500万</option>
              <option>500万以上</option>
            </select>
            <select class="filter-select">
              <option>实缴资本</option>
              <option>100万以下</option>
              <option>100-500万</option>
              <option>500万以上</option>
            </select>
            <select class="filter-select">
              <option>成立时间</option>
              <option>近3年</option>
              <option>3-10年</option>
              <option>10年以上</option>
            </select>
          </div>
          <div class="filter-row">
            <div class="filter-tags">
              <button class="filter-tag" onclick="toggleFilterTag(this)">技术领先</button>
              <button class="filter-tag" onclick="toggleFilterTag(this)">资金拓展</button>
              <button class="filter-tag" onclick="toggleFilterTag(this)">业务拓展</button>
              <button class="filter-tag" onclick="toggleFilterTag(this)">人员拓展</button>
              <button class="filter-tag" onclick="toggleFilterTag(this)">地域拓展</button>
              <button class="filter-tag" onclick="toggleFilterTag(this)">经济拓展</button>
              <button class="filter-tag" onclick="toggleFilterTag(this)">供应商企业</button>
            </div>
            <div class="filter-actions">
              <input type="text" class="filter-input" placeholder="搜索企业名称..." onkeyup="handleSearch(this)">
              <button class="btn btn-primary btn-sm" onclick="doSearch()">查询</button>
              <button class="btn btn-default btn-sm" onclick="resetFilters()">重置</button>
              <select class="sort-select">
                <option>相关性排序</option>
                <option>注册资本降序</option>
                <option>注册资本升序</option>
                <option>成立时间降序</option>
                <option>成立时间升序</option>
              </select>
            </div>
          </div>
        </div>
        <div class="enterprise-list" id="enterpriseList">
          ${enterprises.map(e => `
            <div class="enterprise-item" ${e.placeholder ? '' : `onclick="navigateToEnterpriseProfile('${e.id}', '${e.name.replace(/'/g, '\\\'')}', this)" style="cursor:pointer"`}>
              <div class="enterprise-main">
                <div class="enterprise-header">
                  <span class="enterprise-name ${e.placeholder ? 'text-muted' : 'text-primary'}">${e.name}</span>
                  <div class="enterprise-tags">
                    ${e.tags && e.tags.includes('小微企业') ? '<span class="enterprise-tag tag-small">小微企业</span>' : ''}
                    ${e.tags && e.tags.includes('高新企业') ? '<span class="enterprise-tag tag-high-tech">高新企业</span>' : ''}
                    ${e.tags && e.tags.includes('国企') ? '<span class="enterprise-tag tag-state">国企</span>' : ''}
                    ${e.tags && e.tags.includes('民营') ? '<span class="enterprise-tag tag-private">民营</span>' : ''}
                  </div>
                </div>
                <div class="enterprise-meta">
                  <span class="meta-item">📍 ${e.address || '暂无地址'}</span>
                  <span class="meta-item">💰 注册资本 ${e.registered_capital || '-'}</span>
                  <span class="meta-item">📅 成立时间 ${e.founded_date || '-'}</span>
                </div>
                <div class="enterprise-links">
                  <span class="link-item">📦 上游供应商 ${e.upstream_count || 0}</span>
                  <span class="link-item">🛒 下游客户 ${e.downstream_count || 0}</span>
                  <span class="link-item">⭐ 加分指数 ${e.score || 0}</span>
                </div>
              </div>
              <div class="enterprise-scores">
                <div class="score-item">
                  <span class="score-icon">📊</span>
                  <span class="score-label">投资能力</span>
                  <span class="score-value">${e.invest_score || '-'}</span>
                </div>
                <div class="score-item">
                  <span class="score-icon">🔬</span>
                  <span class="score-label">科创评分</span>
                  <span class="score-value">${e.tech_score || '-'}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `,
    techData
  };
}

function switchEnterpriseTab(tab) {
  document.querySelectorAll('.enterprise-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  const enterpriseList = document.getElementById('enterpriseList');
  if (tab === 'list') {
    enterpriseList.style.display = 'flex';
  } else {
    enterpriseList.style.display = 'none';
    showToast(tab === 'feature' ? '特征产业数据加载中...' : '上市企业数据加载中...', 'info');
  }
}

function toggleFilterTag(tag) {
  tag.classList.toggle('active');
}

function handleSearch(input) {
  if (input.value.length > 0) {
    input.style.borderColor = '#2563EB';
  } else {
    input.style.borderColor = '#E8E8E8';
  }
}

function doSearch() {
  showToast('搜索功能开发中', 'info');
}

function resetFilters() {
  document.querySelectorAll('.filter-select').forEach(s => s.selectedIndex = 0);
  document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
  document.querySelector('.filter-input').value = '';
  document.querySelector('.sort-select').selectedIndex = 0;
}

function renderEnablingPie(data) {
  const chartDom = document.getElementById('enablingPieChart');
  if (!chartDom) return;
  const chart = echarts.init(chartDom);
  chart.setOption({
    tooltip: { trigger: 'item' },
    color: ['#2F54EB', '#52C41A', '#13C2C2', '#EB2F96'],
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
      label: { show: true, formatter: '{b}: {c}' },
      data: data
    }]
  });
}

// ==================== 底部状态栏 ====================
function setupLegendFilter() {
  document.querySelectorAll('.legend-item[data-type]').forEach(item => {
    item.addEventListener('click', () => {
      const type = item.dataset.type;
      if (hiddenNodeTypes.has(type)) {
        hiddenNodeTypes.delete(type);
        item.classList.remove('hidden');
      } else {
        hiddenNodeTypes.add(type);
        item.classList.add('hidden');
      }
      if (currentView === 'relation') renderRelationView();
    });
  });
}

function switchLayout(layout) {
  currentLayout = layout;
  localStorage.setItem('chainLayout_' + chainId, layout);
  document.getElementById('btnLayoutHierarchy').className = 'btn btn-sm ' + (layout === 'hierarchy' ? 'btn-primary' : 'btn-default');
  document.getElementById('btnLayoutForce').className = 'btn btn-sm ' + (layout === 'force' ? 'btn-primary' : 'btn-default');
  if (currentView === 'relation') renderRelationView();
}

function zoomIn() {
  currentZoom = Math.min(currentZoom + 0.2, 3);
  applyZoom();
}
function zoomOut() {
  currentZoom = Math.max(currentZoom - 0.2, 0.5);
  applyZoom();
}
function zoomReset() {
  currentZoom = 1;
  relationTransform = { x: 0, y: 0, scale: 1 };
  applyZoom();
  if (currentView === 'relation') {
    calculateRelationPositions();
    relationNodes.forEach(node => {
      const el = document.querySelector(`.relation-node[data-id="${node.id}"]`);
      if (el) {
        el.style.left = relationPositions[node.id].x + 'px';
        el.style.top = relationPositions[node.id].y + 'px';
      }
    });
    renderRelationEdges();
    applyRelationTransform();
  }
}
function applyZoom() {
  if (currentView !== 'relation') return;
  relationTransform.scale = currentZoom;
  applyRelationTransform();
  localStorage.setItem('chainZoom_' + chainId, currentZoom);
  document.getElementById('zoomValue').textContent = currentZoom.toFixed(1) + 'x';
}

function updateNodeCount() {
  let visible = 0, total = 0;
  if (currentView === 'relation' && enterpriseNetwork) {
    total = enterpriseNetwork.nodes.length;
    visible = enterpriseNetwork.nodes.filter(n => {
      const filterType = n.local ? n.type : 'external';
      return !hiddenNodeTypes.has(filterType);
    }).length;
  } else if (currentView === 'structure' && categoryTree) {
    total = countTreeNodes(categoryTree.tree);
    visible = total;
  } else if (currentView === 'gap' && gapData) {
    total = gapData.gaps.length;
    visible = total;
  }
  document.getElementById('nodeCount').textContent = `节点 ${visible} / ${total}`;
  document.getElementById('zoomValue').textContent = currentZoom.toFixed(1) + 'x';
}

function countTreeNodes(nodes) {
  return nodes.reduce((sum, node) => sum + 1 + (node.children ? countTreeNodes(node.children) : 0), 0);
}

function goBackToPanorama() {
  const params = new URLSearchParams(window.location.search);
  params.delete('chainId');
  window.location.href = 'index.html?' + params.toString();
}

function toggleFullscreen() {
  document.body.classList.toggle('fullscreen');
  setTimeout(() => {
    if (myChart) myChart.resize();
    if (currentView === 'relation') {
      calculateRelationPositions();
      relationNodes.forEach(node => {
        const el = document.querySelector(`.relation-node[data-id="${node.id}"]`);
        if (el) {
          el.style.left = relationPositions[node.id].x + 'px';
          el.style.top = relationPositions[node.id].y + 'px';
        }
      });
      renderRelationEdges();
    }
  }, 300);
}

function exportReport() {
  const rows = [
    ['产业链名称', chainData.name],
    ['完整度评分', chainData.completeness_score + '%'],
    ['关联企业数', chainData.enterprise_count],
    ['税收贡献', chainData.tax_contribution + '亿'],
    ['总营收', chainData.revenue_total + '亿']
  ];
  exportCSV(`${chainData.name}_产业链分析报告.csv`, rows);
  showToast('报告已开始下载', 'success');
}

function showScoreDetail() {
  if (!categoryTree) return;
  const leafNodes = [];
  function collect(nodes) {
    nodes.forEach(n => {
      if (n.isLeaf) leafNodes.push(n);
      if (n.children) collect(n.children);
    });
  }
  collect(categoryTree.tree);

  const avgCoverage = leafNodes.length
    ? (leafNodes.reduce((s, n) => s + (n.nationalCount ? n.localCount / n.nationalCount * 100 : 0), 0) / leafNodes.length).toFixed(1)
    : 0;

  const content = `
    <div style="margin-bottom:16px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <span>平均覆盖率</span>
        <span style="font-size:20px;font-weight:700;color:#1890FF">${avgCoverage}%</span>
      </div>
      <div style="height:8px;background:#f0f0f0;border-radius:4px;overflow:hidden">
        <div style="width:${avgCoverage}%;height:100%;background:#1890FF;border-radius:4px"></div>
      </div>
    </div>
    <div class="score-detail-list">
      ${leafNodes.slice(0, 10).map(item => {
        const coverage = item.nationalCount ? Math.min(100, item.localCount / item.nationalCount * 100) : 0;
        return `
          <div class="score-detail-row">
            <div class="name">${item.name}</div>
            <div class="bar-wrap"><div class="bar" style="width:${coverage}%;background:${coverage >= 80 ? '#52C41A' : coverage >= 30 ? '#1890FF' : '#F5222D'}"></div></div>
            <div class="value" style="color:${coverage >= 80 ? '#52C41A' : coverage >= 30 ? '#1890FF' : '#F5222D'}">${coverage.toFixed(0)}%</div>
          </div>
        `;
      }).join('')}
    </div>
  `;
  openModal('完整度评分明细', content);
}

function setupKeyboard() {
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeModal();
      if (document.body.classList.contains('fullscreen')) {
        document.body.classList.remove('fullscreen');
      }
    }
  });
}

// ==================== 新上下游三栏卡片结构 ====================

function getChainSegments() {
  if (!categoryTree || !categoryTree.tree || !categoryTree.tree.length) {
    return { upstream: [], midstream: [], downstream: [] };
  }
  const root = categoryTree.tree[0];
  const segments = { upstream: [], midstream: [], downstream: [] };
  if (!root.children) return segments;

  // 机器人产业按核心零部件/本体/集成系统+应用终端映射
  if (chainId === 'chain-robot') {
    root.children.forEach(child => {
      if (child.name.includes('核心零部件')) segments.upstream.push(child);
      else if (child.name.includes('机器人本体')) segments.midstream.push(child);
      else if (child.name.includes('集成系统') || child.name.includes('应用终端')) segments.downstream.push(child);
    });
    return segments;
  }

  // 其他产业链按名称关键字自动映射
  root.children.forEach(child => {
    if (child.name.includes('上游')) segments.upstream.push(child);
    else if (child.name.includes('中游')) segments.midstream.push(child);
    else if (child.name.includes('下游')) segments.downstream.push(child);
    else segments.midstream.push(child);
  });
  return segments;
}

function sumLocal(node) {
  if (!node) return 0;
  if (node.isLeaf || !node.children || !node.children.length) {
    return node.localCount || 0;
  }
  return node.children.reduce((sum, child) => sum + sumLocal(child), 0);
}

function sumNational(node) {
  if (!node) return 0;
  if (node.isLeaf || !node.children || !node.children.length) {
    return node.nationalCount || 0;
  }
  return node.children.reduce((sum, child) => sum + sumNational(child), 0);
}

function classifyNode(node) {
  if (!node) return { key: 'broken', label: '断', color: '#9CA3AF' };
  const local = node.localCount || 0;
  const national = node.nationalCount || 0;
  if (local === 0 || node.status === 'missing') {
    return { key: 'broken', label: '断', color: '#9CA3AF' };
  }
  if (node.status === 'advantage') {
    return { key: 'advantage', label: '优', color: '#FA8C16' };
  }
  const ratio = national > 0 ? local / national : 1;
  if (ratio >= 0.005 || local >= 30) {
    return { key: 'core', label: '核', color: '#165DFF' };
  }
  return { key: 'weak', label: '弱', color: '#52C41A' };
}

function renderChainTag(node) {
  const cfg = classifyNode(node);
  return `<span class="chain-row-tag" style="background:${cfg.color}">${cfg.label}</span>`;
}

function renderChainColumns() {
  const segments = getChainSegments();
  const upCount = segments.upstream.reduce((s, n) => s + sumLocal(n), 0);
  const midCount = segments.midstream.reduce((s, n) => s + sumLocal(n), 0);
  const downCount = segments.downstream.reduce((s, n) => s + sumLocal(n), 0);

  const upEl = document.getElementById('upCount');
  const midEl = document.getElementById('midCount');
  const downEl = document.getElementById('downCount');
  if (upEl) upEl.textContent = upCount;
  if (midEl) midEl.textContent = midCount;
  if (downEl) downEl.textContent = downCount;

  const upColumn = document.getElementById('upColumn');
  const midColumn = document.getElementById('midColumn');
  const downColumn = document.getElementById('downColumn');
  if (upColumn) upColumn.innerHTML = segments.upstream.map(renderChainPanel).join('');
  if (midColumn) midColumn.innerHTML = segments.midstream.map(renderChainPanel).join('');
  if (downColumn) downColumn.innerHTML = segments.downstream.map(renderChainPanel).join('');
}

function renderChainPanel(node) {
  const localTotal = sumLocal(node);
  const nationalTotal = sumNational(node);
  const hasChildren = node.children && node.children.length;
  const cfg = classifyNode(node);
  const tag = `<span class="chain-status-tag ${cfg.key}">${cfg.label}</span>`;
   const body = hasChildren
    ? `<div class="chain-panel-body">${node.children.map(child => renderChainSubRow(child, 0)).join('')}</div>`
    : '';
  return `
    <div class="chain-panel ${hasChildren ? '' : 'no-children'}" data-id="${node.id}">
      <div class="chain-panel-header" onclick="onChainPanelHeaderClick('${node.id}', ${hasChildren})">
        <span class="chain-panel-arrow">▼</span>
        <span class="chain-panel-title">${node.name}</span>
        ${tag}
        <span class="chain-panel-count">(本地企业数: ${localTotal}, 全国企业数: ${nationalTotal})</span>
      </div>
      ${body}
    </div>
  `;
}

function renderChainSubRow(node, level = 0) {
  const hasChildren = node.children && node.children.length;
  const cfg = classifyNode(node);
  const localCount = hasChildren ? sumLocal(node) : (node.localCount || 0);
  const nationalCount = hasChildren ? sumNational(node) : (node.nationalCount || 0);
  const countText = `(本地企业数: ${localCount}, 全国企业数: ${nationalCount})`;
  const indent = level * 20;

  if (hasChildren) {
    return `
      <div class="chain-sub-group" data-id="${node.id}">
        <div class="chain-sub-row" onclick="toggleChainSubGroup('${node.id}', event)" style="margin-left:${indent}px">
          <span class="chain-panel-arrow">▼</span>
          <span class="chain-sub-name">${node.name}</span>
          <span class="chain-status-tag ${cfg.key}">${cfg.label}</span>
          <span class="chain-sub-count">${countText}</span>
        </div>
        <div class="chain-sub-children" id="chain-sub-children-${node.id}">
          ${node.children.map(c => renderChainSubRow(c, level + 1)).join('')}
        </div>
      </div>
    `;
  }
  return `
    <div class="chain-sub-row" onclick="openSegmentModal('${node.id}')" style="margin-left:${indent}px">
      <span class="chain-panel-arrow" style="visibility:hidden">▼</span>
      <span class="chain-sub-name">${node.name}</span>
      <span class="chain-status-tag ${cfg.key}">${cfg.label}</span>
      <span class="chain-sub-count">${countText}</span>
    </div>
  `;
}

function onChainPanelHeaderClick(nodeId, hasChildren) {
  if (hasChildren) {
    toggleChainPanel(nodeId);
  } else {
    openSegmentModal(nodeId);
  }
}

function toggleChainPanel(nodeId) {
  const panel = document.querySelector(`.chain-panel[data-id="${nodeId}"]`);
  if (!panel) return;
  panel.classList.toggle('collapsed');
}

function toggleChainSubGroup(nodeId, event) {
  if (event) event.stopPropagation();
  const group = document.querySelector(`.chain-sub-group[data-id="${nodeId}"]`);
  if (!group) return;
  group.classList.toggle('collapsed');
}

function openSegmentModal(nodeId) {
  const node = findNodeInTree(categoryTree.tree, nodeId);
  if (!node) return;
  const stats = buildSegmentStats(node);
  const cfg = classifyNode(node);
  const content = `
    <div class="segment-modal">
      <div class="segment-modal-head">
        <span class="segment-modal-name">${node.name}</span>
        <span class="segment-modal-tag" style="background:${cfg.color}">${cfg.label}</span>
      </div>
      <div class="segment-modal-grid">
        <div class="segment-module">
          <div class="segment-module-title">① 产业产值</div>
          <div class="segment-module-body">
            <div class="segment-metric"><span class="segment-metric-label">本地总产值</span><span class="segment-metric-value">${stats.localOutput} 亿</span></div>
            <div class="segment-metric"><span class="segment-metric-label">全国总产值</span><span class="segment-metric-value">${stats.nationalOutput} 亿</span></div>
            <div class="segment-metric"><span class="segment-metric-label">本地占全国比重</span><span class="segment-metric-value">${stats.outputShare}%</span></div>
          </div>
        </div>
        <div class="segment-module">
          <div class="segment-module-title">② 专利科创</div>
          <div class="segment-module-body">
            <div class="segment-metric"><span class="segment-metric-label">发明专利</span><span class="segment-metric-value">${stats.inventionPatents} 件</span></div>
            <div class="segment-metric"><span class="segment-metric-label">实用新型</span><span class="segment-metric-value">${stats.utilityModels} 件</span></div>
            <div class="segment-metric"><span class="segment-metric-label">软著</span><span class="segment-metric-value">${stats.softwareCopyrights} 项</span></div>
            <div class="segment-metric"><span class="segment-metric-label">高价值专利</span><span class="segment-metric-value">${stats.highValuePatents} 件</span></div>
          </div>
        </div>
        <div class="segment-module">
          <div class="segment-module-title">③ 市场竞争力</div>
          <div class="segment-module-body">
            <div class="segment-metric"><span class="segment-metric-label">本地市占率</span><span class="segment-metric-value">${stats.marketShare}%</span></div>
            <div class="segment-metric"><span class="segment-metric-label">产业链完备度</span><span class="segment-metric-value">${stats.completeness}%</span></div>
            <div class="segment-metric"><span class="segment-metric-label">供需缺口指数</span><span class="segment-metric-value">${stats.gapIndex}</span></div>
          </div>
        </div>
        <div class="segment-module">
          <div class="segment-module-title">④ 龙头企业统计</div>
          <div class="segment-module-body">
            <div class="segment-metric"><span class="segment-metric-label">规上龙头</span><span class="segment-metric-value">${stats.leadingEnterprises} 家</span></div>
            <div class="segment-metric"><span class="segment-metric-label">专精特新</span><span class="segment-metric-value">${stats.specializedEnterprises} 家</span></div>
            <div class="segment-metric"><span class="segment-metric-label">单项冠军</span><span class="segment-metric-value">${stats.singleChampions} 家</span></div>
          </div>
        </div>
        <div class="segment-module">
          <div class="segment-module-title">⑤ 全国Top100分布</div>
          <div class="segment-module-body">
            <div class="segment-metric"><span class="segment-metric-label">本地落地数量</span><span class="segment-metric-value">${stats.top100Local} 家</span></div>
            <div class="segment-metric"><span class="segment-metric-label">全国Top100总部</span><span class="segment-metric-value">${stats.top100National} 家</span></div>
          </div>
        </div>
        <div class="segment-module segment-module-wide">
          <div class="segment-module-title">⑥ 本地产业特色</div>
          <div class="segment-module-body segment-module-text">
            <div class="segment-feature"><span>园区载体：</span>${stats.parks}</div>
            <div class="segment-feature"><span>专项政策：</span>${stats.policies}</div>
            <div class="segment-feature"><span>深港协同：</span>${stats.shenzhenHongKong}</div>
          </div>
        </div>
        <div class="segment-module">
          <div class="segment-module-title">⑦ 科创能力</div>
          <div class="segment-module-body">
            <div class="segment-metric"><span class="segment-metric-label">研发投入占比</span><span class="segment-metric-value">${stats.rdRatio}%</span></div>
            <div class="segment-metric"><span class="segment-metric-label">科研平台数量</span><span class="segment-metric-value">${stats.researchPlatforms} 个</span></div>
            <div class="segment-metric"><span class="segment-metric-label">产学研合作项目</span><span class="segment-metric-value">${stats.industryProjects} 项</span></div>
          </div>
        </div>
        <div class="segment-module">
          <div class="segment-module-title">⑧ 行业影响力</div>
          <div class="segment-module-body">
            <div class="segment-metric"><span class="segment-metric-label">全国赛道排名</span><span class="segment-metric-value">第 ${stats.nationalRank} 名</span></div>
            <div class="segment-metric"><span class="segment-metric-label">区域辐射范围</span><span class="segment-metric-value">${stats.radiation}</span></div>
            <div class="segment-metric"><span class="segment-metric-label">产业链话语权</span><span class="segment-metric-value">${stats.discourseRating}</span></div>
          </div>
        </div>
      </div>
    </div>
  `;
  openModal(node.name, content);
}

function buildSegmentStats(node) {
  const local = node.localCount || 0;
  const national = node.nationalCount || 0;
  const seed = hashCode(node.id || node.name);
  const rand = seededRandom(seed);

  const localAvgRevenue = 0.5 + rand() * 2.5; // 亿/家
  const nationalAvgRevenue = 0.3 + rand() * 2.0;
  const localOutput = (local * localAvgRevenue).toFixed(1);
  const nationalOutput = (national * nationalAvgRevenue).toFixed(1);
  const outputShare = national > 0 ? ((local / national) * 100).toFixed(1) : '0.0';

  const marketShare = national > 0 ? ((local / national) * 100).toFixed(2) : '0.00';
  const completeness = Math.min(100, Math.round(45 + rand() * 50));
  const gapIndex = Math.min(100, Math.round(rand() * 100));

  const leadingEnterprises = Math.round(local * (0.05 + rand() * 0.15));
  const specializedEnterprises = Math.round(local * (0.08 + rand() * 0.20));
  const singleChampions = Math.round(local * (0.01 + rand() * 0.06));

  const top100Local = Math.min(20, Math.round(local * (0.005 + rand() * 0.03)));
  const top100National = Math.min(100, Math.round(national * (0.02 + rand() * 0.08)));

  const parks = ['前海智能制造产业园', '机器人产业园A区', '深港创新科技工业园'][seed % 3];
  const policies = ['机器人产业高质量发展专项', '智能制造技改补贴', '深港科技合作计划'][seed % 3];
  const shenzhenHongKong = '毗邻香港高校及研发机构，具备深港联合实验室与成果转化通道';

  const rdRatio = (2.5 + rand() * 6.5).toFixed(2);
  const researchPlatforms = Math.round(1 + rand() * 8);
  const industryProjects = Math.round(rand() * 15);

  const nationalRank = Math.max(1, Math.round(1 + rand() * 49));
  const radiation = ['珠三角核心区', '粤港澳大湾区', '华南及东南亚'][seed % 3];
  const discourseRating = ['A+ 强话语权', 'A 较强话语权', 'B 中等话语权', 'B+ 中强话语权'][seed % 4];

  return {
    localOutput, nationalOutput, outputShare,
    inventionPatents: Math.round(local * (0.2 + rand() * 1.5)),
    utilityModels: Math.round(local * (0.1 + rand() * 1.0)),
    softwareCopyrights: Math.round(local * (0.05 + rand() * 0.8)),
    highValuePatents: Math.round(local * (0.05 + rand() * 0.4)),
    marketShare, completeness, gapIndex,
    leadingEnterprises, specializedEnterprises, singleChampions,
    top100Local, top100National,
    parks, policies, shenzhenHongKong,
    rdRatio, researchPlatforms, industryProjects,
    nationalRank, radiation, discourseRating
  };
}

function hashCode(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function seededRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function updateBottomBar() {}
function updateNodeCount() {}
function closeNodeDrawer() { closeModal(); }

// 确保 findNodeInTree 可用
function findNodeInTree(nodes, nodeId) {
  for (const node of nodes) {
    if (node.id === nodeId) return node;
    if (node.children) {
      const found = findNodeInTree(node.children, nodeId);
      if (found) return found;
    }
  }
  return null;
}

// ==================== 产业概览驾驶舱图表 ====================
function renderOverviewTab() {
  if (!chainData) return;

  renderProsperityIndexChart();
  renderNewEnterpriseGrowthChart();
  renderEmployeeScaleChart();
  renderEnterpriseTotalTrendChart();
  renderEmployeeTotalTrendChart();
  renderPatentApplyTrendChart();
}

function renderProsperityIndexChart() {
  const chartDom = document.getElementById('prosperityIndexChart');
  if (!chartDom) return;
  const chart = echarts.init(chartDom);
  const quarters = [];
  const immediate = [];
  const cumulative = [];
  let y = 2019, q = 2;
  let imm = 94.0, cum = 99.5;
  for (let i = 0; i < 29; i++) {
    quarters.push(`${y}Q${q}`);
    const change = Math.sin(i / 3) * 1.5 + (Math.random() - 0.5) * 1.2;
    imm += change;
    cum += change * 0.35;
    immediate.push(+imm.toFixed(2));
    cumulative.push(+cum.toFixed(2));
    q++; if (q > 4) { q = 1; y++; }
  }
  immediate[immediate.length - 1] = 98.40;
  cumulative[cumulative.length - 1] = 101.73;

  chart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['即时指数', '累积指数'], bottom: 0, textStyle: { color: '#646A73', fontSize: 12 } },
    grid: { left: '3%', right: '4%', bottom: '12%', top: '12%', containLabel: true },
    xAxis: { type: 'category', data: quarters, axisLabel: { color: '#8F959E', rotate: 45 }, axisLine: { lineStyle: { color: '#EBEEF5' } } },
    yAxis: { type: 'value', min: 90, max: 105, name: '景气指数', nameTextStyle: { color: '#646A73', fontSize: 11 }, axisLabel: { color: '#8F959E' }, splitLine: { lineStyle: { color: '#F2F3F5' } } },
    series: [
      {
        name: '即时指数',
        type: 'line',
        data: immediate,
        itemStyle: { color: '#4080FF' },
        lineStyle: { width: 2 },
        symbol: 'circle',
        symbolSize: 4,
        areaStyle: { color: 'rgba(64, 128, 255, 0.08)' }
      },
      {
        name: '累积指数',
        type: 'line',
        data: cumulative,
        itemStyle: { color: '#72C960' },
        lineStyle: { width: 2 },
        symbol: 'circle',
        symbolSize: 4,
        areaStyle: { color: 'rgba(114, 201, 96, 0.2)' }
      },
      {
        type: 'line',
        markLine: {
          data: [{ yAxis: 100, lineStyle: { color: '#9CA3AF', type: 'dashed' }, label: { formatter: '景气阈值100', position: 'end', color: '#646A73' } }],
          silent: true
        },
        symbol: 'none'
      }
    ]
  });
  window.addEventListener('resize', () => chart && chart.resize());
}

function renderNewEnterpriseGrowthChart() {
  const chartDom = document.getElementById('newEnterpriseGrowthChart');
  if (!chartDom) return;
  const chart = echarts.init(chartDom);
  const years = ['2021', '2022', '2023', '2024', '2025', '2026'];
  const newCount = [312, 356, 428, 389, 342, 286];
  const szGrowth = [12.5, 14.1, 20.2, -9.1, -12.1, -16.4];
  const gdGrowth = [10.1, 11.6, 15.3, -6.8, -8.5, -10.2];

  chart.setOption({
    tooltip: { trigger: 'axis' },
    legend: {
      data: ['增速小于0', '新增企业数量', '广东深圳增速', '广东省增速'],
      bottom: 0,
      textStyle: { color: '#646A73', fontSize: 11 }
    },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '12%', containLabel: true },
    xAxis: { type: 'category', data: years, axisLabel: { color: '#8F959E' }, axisLine: { lineStyle: { color: '#EBEEF5' } } },
    yAxis: [
      { type: 'value', name: '新增企业（家）', position: 'left', nameTextStyle: { color: '#646A73', fontSize: 11 }, axisLabel: { color: '#8F959E' }, splitLine: { lineStyle: { color: '#F2F3F5' } } },
      { type: 'value', name: '增速（%）', position: 'right', nameTextStyle: { color: '#646A73', fontSize: 11 }, axisLabel: { color: '#8F959E', formatter: '{value}%' }, splitLine: { show: false } }
    ],
    series: [
      {
        name: '新增企业数量',
        type: 'bar',
        data: newCount,
        itemStyle: { color: '#165DFF', borderRadius: [4, 4, 0, 0] },
        barWidth: '35%'
      },
      {
        name: '广东深圳增速',
        type: 'line',
        yAxisIndex: 1,
        data: szGrowth,
        itemStyle: { color: '#FA8C16' },
        lineStyle: { width: 2 },
        symbol: 'circle',
        symbolSize: 6
      },
      {
        name: '广东省增速',
        type: 'line',
        yAxisIndex: 1,
        data: gdGrowth,
        itemStyle: { color: '#00B42A' },
        lineStyle: { width: 2 },
        symbol: 'circle',
        symbolSize: 6
      },
      {
        name: '增速小于0',
        type: 'scatter',
        yAxisIndex: 1,
        data: szGrowth.map((v, i) => v < 0 ? [years[i], v] : null).filter(Boolean),
        itemStyle: { color: '#F53F3F' },
        symbolSize: 10,
        silent: true
      }
    ]
  });
  window.addEventListener('resize', () => chart && chart.resize());
}

function renderEmployeeScaleChart() {
  const chartDom = document.getElementById('employeeScaleChart');
  if (!chartDom) return;
  const chart = echarts.init(chartDom);
  const categories = ['1000人以上', '500-999人', '300-499人', '100-299人', '50-99人', '50人以下'];
  const values = [16, 25, 45, 95, 85, 120];
  chart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '10%', bottom: '3%', top: '3%', containLabel: true },
    xAxis: { type: 'value', name: '企业数（家）', nameTextStyle: { color: '#646A73', fontSize: 11 }, axisLabel: { color: '#8F959E' }, splitLine: { lineStyle: { color: '#F2F3F5' } } },
    yAxis: { type: 'category', data: categories, inverse: true, axisLabel: { color: '#1D2129' }, axisLine: { lineStyle: { color: '#EBEEF5' } }, splitLine: { show: false } },
    series: [{ type: 'bar', data: values, itemStyle: { color: '#165DFF', borderRadius: [0, 4, 4, 0] }, barWidth: '50%', label: { show: true, position: 'right', color: '#165DFF', fontWeight: 600 } }]
  });
  window.addEventListener('resize', () => chart && chart.resize());
}

function renderEnterpriseTotalTrendChart() {
  const chartDom = document.getElementById('enterpriseTotalTrendChart');
  if (!chartDom) return;
  const chart = echarts.init(chartDom);
  const months = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  const totalData = [265400, 265600, 265780, 265920, 266100, 266250, 266380, 266520, 266680, 266820, 266980, 267120];
  const newData = [180, 220, 210, 160, 230, 190, 170, 210, 220, 180, 210, 195];

  chart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['企业总数', '新增'], bottom: 0, textStyle: { color: '#646A73', fontSize: 11 } },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '12%', containLabel: true },
    xAxis: { type: 'category', data: months, axisLabel: { color: '#8F959E', fontSize: 10 }, axisLine: { lineStyle: { color: '#EBEEF5' } } },
    yAxis: [
      { type: 'value', name: '企业总数', position: 'left', nameTextStyle: { color: '#646A73', fontSize: 10 }, axisLabel: { color: '#8F959E', fontSize: 10 }, splitLine: { lineStyle: { color: '#F2F3F5' } } },
      { type: 'value', name: '新增', position: 'right', nameTextStyle: { color: '#646A73', fontSize: 10 }, axisLabel: { color: '#8F959E', fontSize: 10 }, splitLine: { show: false } }
    ],
    series: [
      { name: '企业总数', type: 'line', data: totalData, itemStyle: { color: '#165DFF' }, lineStyle: { width: 2 }, symbol: 'circle', symbolSize: 4, areaStyle: { color: 'rgba(22, 93, 255, 0.08)' } },
      { name: '新增', type: 'bar', yAxisIndex: 1, data: newData, itemStyle: { color: '#165DFF', borderRadius: [4, 4, 0, 0] }, barWidth: '35%' }
    ]
  });
  window.addEventListener('resize', () => chart && chart.resize());
}

function renderEmployeeTotalTrendChart() {
  const chartDom = document.getElementById('employeeTotalTrendChart');
  if (!chartDom) return;
  const chart = echarts.init(chartDom);
  const months = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  const totalData = [11844, 11862, 11878, 11895, 11908, 11920, 11932, 11948, 11960, 11974, 11984, 11996];
  const newData = [18, 22, 19, 21, 16, 15, 17, 20, 14, 18, 12, 16];

  chart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['用工总数', '新增用工'], bottom: 0, textStyle: { color: '#646A73', fontSize: 11 } },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '12%', containLabel: true },
    xAxis: { type: 'category', data: months, axisLabel: { color: '#8F959E', fontSize: 10 }, axisLine: { lineStyle: { color: '#EBEEF5' } } },
    yAxis: [
      { type: 'value', name: '用工总数', position: 'left', nameTextStyle: { color: '#646A73', fontSize: 10 }, axisLabel: { color: '#8F959E', fontSize: 10 }, splitLine: { lineStyle: { color: '#F2F3F5' } } },
      { type: 'value', name: '新增用工', position: 'right', nameTextStyle: { color: '#646A73', fontSize: 10 }, axisLabel: { color: '#8F959E', fontSize: 10 }, splitLine: { show: false } }
    ],
    series: [
      { name: '用工总数', type: 'line', data: totalData, itemStyle: { color: '#FA8C16' }, lineStyle: { width: 2 }, symbol: 'circle', symbolSize: 4 },
      { name: '新增用工', type: 'bar', yAxisIndex: 1, data: newData, itemStyle: { color: '#FA8C16', borderRadius: [4, 4, 0, 0] }, barWidth: '35%' }
    ]
  });
  window.addEventListener('resize', () => chart && chart.resize());
}

function renderPatentApplyTrendChart() {
  const chartDom = document.getElementById('patentApplyTrendChart');
  if (!chartDom) return;
  const chart = echarts.init(chartDom);
  const months = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  const totalData = [68.2, 68.9, 69.5, 70.2, 70.8, 71.4, 72.0, 72.6, 73.2, 73.8, 74.3, 74.8];
  const newData = [0.62, 0.68, 0.64, 0.70, 0.66, 0.60, 0.64, 0.58, 0.62, 0.55, 0.50, 0.52];

  chart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['专利申请累计', '新增申请'], bottom: 0, textStyle: { color: '#646A73', fontSize: 11 } },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '12%', containLabel: true },
    xAxis: { type: 'category', data: months, axisLabel: { color: '#8F959E', fontSize: 10 }, axisLine: { lineStyle: { color: '#EBEEF5' } } },
    yAxis: [
      { type: 'value', name: '累计（万件）', position: 'left', nameTextStyle: { color: '#646A73', fontSize: 10 }, axisLabel: { color: '#8F959E', fontSize: 10 }, splitLine: { lineStyle: { color: '#F2F3F5' } } },
      { type: 'value', name: '新增（万件）', position: 'right', nameTextStyle: { color: '#646A73', fontSize: 10 }, axisLabel: { color: '#8F959E', fontSize: 10 }, splitLine: { show: false } }
    ],
    series: [
      { name: '专利申请累计', type: 'line', data: totalData, itemStyle: { color: '#8653D9' }, lineStyle: { width: 2 }, symbol: 'circle', symbolSize: 4 },
      { name: '新增申请', type: 'bar', yAxisIndex: 1, data: newData, itemStyle: { color: '#8653D9', borderRadius: [4, 4, 0, 0] }, barWidth: '35%' }
    ]
  });
  window.addEventListener('resize', () => chart && chart.resize());
}

document.addEventListener('DOMContentLoaded', init);

