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
let currentMainTab = 'structure';
let regionChart = null;

function init() {
  if (document.getElementById('globalSearchContainer')) {
    document.getElementById('globalSearchContainer').innerHTML = renderGlobalSearch();
  }

  const params = getUrlParams();
  chainId = params.chainId || 'chain-robot';

  const storedView = localStorage.getItem('chainView_' + chainId);
  const hashView = window.location.hash.replace('#', '');
  currentView = hashView || storedView || 'relation';

  const storedLayout = localStorage.getItem('chainLayout_' + chainId);
  currentLayout = storedLayout || 'hierarchy';
  currentZoom = parseFloat(localStorage.getItem('chainZoom_' + chainId)) || 1;

  loadData();
  setupKeyboard();
  setupLegendFilter();
  window.addEventListener('resize', debounce(() => {
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
  }, 200));
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
  renderTree();
  renderStructureView();
  updateBottomBar();
  updateNodeCount();
}

function showLoading(show) {
  document.getElementById('graphLoading').style.display = show ? 'flex' : 'none';
}

function renderTopInfo() {
  document.getElementById('chainName').textContent = chainData.name + '产业链图谱';
  document.title = chainData.name + '产业链图谱 - 产业链/供应链图谱系统';

  const c = chainData.completeness_score;
  document.getElementById('completenessValue').textContent = c + '%';
  document.getElementById('completenessValue').style.color = c >= 80 ? '#52C41A' : c >= 60 ? '#1890FF' : '#F5222D';
  document.getElementById('completenessRing').innerHTML = renderProgressRing(c, 48, 5);

  document.getElementById('chainTags').innerHTML = `
    ${renderStrategicTag(chainData.strategic_orientation)}
    ${renderLifecycleTag(chainData.life_cycle)}
    <span class="tag tag-default">${CONFIG.category[chainData.category] || chainData.category}</span>
  `;

  document.getElementById('btnLayoutHierarchy').className = 'btn btn-sm ' + (currentLayout === 'hierarchy' ? 'btn-primary' : 'btn-default');
  document.getElementById('btnLayoutForce').className = 'btn btn-sm ' + (currentLayout === 'force' ? 'btn-primary' : 'btn-default');
}

// ==================== 左侧分类树 ====================
function renderTree() {
  const body = document.getElementById('treeBody');
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
           ondblclick="onTreeRowDblClick('${node.id}', ${node.isLeaf})">
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

// ==================== 视图切换 ====================
function switchView(view, save = true) {
  currentView = view;
  if (save) {
    localStorage.setItem('chainView_' + chainId, view);
    window.location.hash = view;
  }

  document.querySelectorAll('.view-tabs .tab').forEach(t => t.classList.toggle('active', t.dataset.view === view));

  const chartDom = document.getElementById('mainChart');
  const gapPanel = document.getElementById('gapPanel');
  const scenarioPanel = document.getElementById('scenarioPanel');

  chartDom.style.display = 'none';
  gapPanel.style.display = 'none';
  scenarioPanel.style.display = 'none';

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
    gapPanel.style.display = 'block';
    renderGapView();
  } else if (view === 'scenario') {
    scenarioPanel.style.display = 'block';
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
    renderOverviewTab();
  } else if (tab === 'news') {
    renderNewsTab();
  } else if (tab === 'gap-filling') {
    renderGapFillingTab();
  } else if (tab === 'structure') {
    renderStructureView();
    updateBottomBar();
    updateNodeCount();
  }
}

function renderOverviewTab() {
  if (!chainData) return;

  document.getElementById('overviewTitle').textContent = chainData.name + '产业链';
  document.getElementById('overviewDesc').textContent = chainData.description || '该产业链涵盖多个核心环节，是区域经济发展的重要支柱产业。';

  document.getElementById('statTotal').textContent = '1';
  document.getElementById('statEnterprises').textContent = chainData.enterprise_count;
  document.getElementById('statCompleteness').textContent = chainData.completeness_score + '%';
  document.getElementById('statRevenue').textContent = chainData.revenue_total;

  document.getElementById('metricScale').textContent = chainData.revenue_total;
  document.getElementById('metricCount').textContent = chainData.enterprise_count;
  document.getElementById('metricTax').textContent = chainData.tax_contribution;

  const totalEmployees = enterpriseNetwork ? enterpriseNetwork.nodes.reduce((sum, n) => sum + n.employees, 0) : 0;
  document.getElementById('metricEmployees').textContent = formatNumber(totalEmployees);

  renderRegionChart();
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

function renderGapFillingTab() {
  if (!gapData) return;

  renderGapWarnings();
  renderSupplyMatches();
}

function renderGapWarnings() {
  const warnings = gapData.gaps || [];
  const warningCount = warnings.length;

  document.getElementById('gapWarningCount').textContent = warningCount + ' 项预警';

  const warningList = document.getElementById('gapWarningList');
  if (!warningList) return;

  if (warnings.length === 0) {
    warningList.innerHTML = `<div class="empty-state" style="height:200px"><div class="empty-state-icon">✅</div><div class="empty-state-title">暂无预警信息</div></div>`;
    return;
  }

  warningList.innerHTML = warnings.slice(0, 4).map(gap => `
    <div class="warning-item">
      <span class="warning-icon">⚠️</span>
      <div class="warning-content">
        <div class="warning-title">${gap.name}</div>
        <div class="warning-desc">本区企业：${gap.localCount}家，全国企业：${gap.nationalCount}家</div>
      </div>
      <span class="warning-severity ${gap.localCount === 0 ? 'high' : 'medium'}">${gap.localCount === 0 ? '高风险' : '中风险'}</span>
    </div>
  `).join('');
}

function renderSupplyMatches() {
  const matches = [
    { id: 1, title: '智能传感器制造项目', desc: '拟投资5亿，预计年产能1000万只', score: '85%', type: '制造' },
    { id: 2, title: '工业互联网平台建设', desc: '与区内龙头企业需求高度匹配', score: '92%', type: '平台' },
    { id: 3, title: '精密零部件加工基地', desc: '填补产业链关键环节缺口', score: '78%', type: '制造' },
    { id: 4, title: '科技服务外包中心', desc: '提供研发、检测、认证一站式服务', score: '88%', type: '服务' }
  ];

  const matchList = document.getElementById('supplyMatchList');
  if (!matchList) return;

  matchList.innerHTML = matches.map(match => `
    <div class="match-item">
      <span class="match-icon">🎯</span>
      <div class="match-content">
        <div class="match-title">${match.title}</div>
        <div class="match-desc">${match.desc}</div>
      </div>
      <span class="match-score">匹配度 ${match.score}</span>
    </div>
  `).join('');
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
    window.open('enterprise-profile.html?enterpriseId=' + node.id, '_blank');
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
      <button class="btn btn-default" onclick="window.location.href='enterprise-profile.html?enterpriseId=${enterprise.id}'">查看企业画像</button>
    `;
  } else {
    const node = findNodeInTree(categoryTree.tree, id);
    if (!node) return;
    title = node.name;
    const result = await renderNodeDrawerContent(node);
    content = result.html;
    footer = `
      <button class="btn btn-primary" onclick="window.location.href='enterprise-network.html'">查看企业关系网络</button>
      <button class="btn btn-default" onclick="window.location.href='chain-gap.html?chainId=${chainId}&nodeId=${node.id}'">加入补链分析</button>
    `;
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
            <div class="enterprise-item" onclick="${e.placeholder ? '' : `window.location.href='enterprise-profile.html?enterpriseId=${e.id || e.name}'`}">
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
      closeNodeDrawer();
      if (document.body.classList.contains('fullscreen')) {
        document.body.classList.remove('fullscreen');
        setTimeout(() => myChart && myChart.resize(), 300);
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', init);

