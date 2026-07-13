/**
 * 企业关系网络 - V1 逻辑
 */

let networkChart = null;
let enterprises = [];
let relations = [];
let currentLayout = 'force';
let currentZoom = 1;
let selectedRelationTypes = 'all';
let selectedStrength = 'all';
let searchKeyword = '';
let pathSource = '';
let pathTarget = '';

const ROLE_COLORS = {
  parts_supplier: '#1890FF',
  manufacturer: '#52C41A',
  integrator: '#722ED1',
  terminal: '#FA8C16',
  service: '#13C2C2',
  enabling: '#EB2F96'
};

const ROLE_LABELS = {
  parts_supplier: '零部件',
  manufacturer: '制造商',
  integrator: '集成商',
  terminal: '终端',
  service: '服务商',
  enabling: '使能技术'
};

const RELATION_COLORS = {
  equity: '#722ED1',
  transaction: '#1890FF',
  cooperation: '#52C41A',
  supply_demand: '#FA8C16'
};

const RELATION_LABELS = {
  equity: '股权',
  transaction: '交易',
  cooperation: '合作',
  supply_demand: '供需'
};

const RISK_BORDERS = {
  normal: 'transparent',
  warning: '#FAAD14',
  danger: '#F5222D'
};

async function init() {
  if (document.getElementById('globalSearchContainer')) {
    document.getElementById('globalSearchContainer').innerHTML = renderGlobalSearch();
  }
  if (document.getElementById('breadcrumbContainer')) {
    document.getElementById('breadcrumbContainer').innerHTML = renderBreadcrumb('enterprise-network.html');
  }
  await loadData();
  initChart();
  renderPathSelects();
  window.addEventListener('resize', debounce(() => networkChart && networkChart.resize(), 200));
}

async function loadData() {
  enterprises = await MockAPI.getAllEnterprises();
  relations = MOCK_ENTERPRISE_RELATIONS;
}

function initChart() {
  const chartDom = document.getElementById('networkChart');
  networkChart = echarts.init(chartDom);
  renderNetwork();

  networkChart.on('click', params => {
    if (params.dataType === 'node') {
      openEnterpriseDrawer(params.data.id);
    }
  });

  networkChart.on('dblclick', params => {
    if (params.dataType === 'node') {
      window.location.href = `enterprise-profile.html?enterpriseId=${params.data.id}`;
    }
  });
}

function getFilteredRelations() {
  return relations.filter(r => {
    if (selectedRelationTypes !== 'all' && r.relation_type !== selectedRelationTypes) return false;
    if (selectedStrength === 'high' && r.relation_strength < 0.8) return false;
    if (selectedStrength === 'medium' && (r.relation_strength < 0.5 || r.relation_strength >= 0.8)) return false;
    if (selectedStrength === 'low' && r.relation_strength >= 0.5) return false;
    return true;
  });
}

function getFilteredNodes() {
  const activeIds = new Set();
  getFilteredRelations().forEach(r => {
    activeIds.add(r.from_enterprise_id);
    activeIds.add(r.to_enterprise_id);
  });

  return enterprises.filter(e => {
    if (searchKeyword) {
      const match = e.name.includes(searchKeyword) || (e.credit_code && e.credit_code.includes(searchKeyword));
      if (!match) return false;
    }
    return activeIds.has(e.id);
  });
}

function renderNetwork() {
  const filteredRelations = getFilteredRelations();
  const filteredNodes = getFilteredNodes();
  const nodeMap = new Map(filteredNodes.map(n => [n.id, n]));

  const nodes = filteredNodes.map(e => {
    const size = Math.max(24, Math.min(60, 20 + Math.log(e.annual_revenue + 1) * 8));
    return {
      id: e.id,
      name: e.name,
      value: e.annual_revenue,
      symbolSize: size,
      x: null,
      y: null,
      itemStyle: {
        color: ROLE_COLORS[e.industry_role] || '#8C8C8C',
        borderColor: RISK_BORDERS[e.risk_level] || 'transparent',
        borderWidth: e.risk_level !== 'normal' ? 3 : 1
      },
      label: {
        show: size >= 30,
        position: 'bottom',
        formatter: '{b}',
        fontSize: 12,
        color: '#262626'
      },
      emphasis: {
        focus: 'adjacency',
        label: { show: true }
      }
    };
  });

  const edges = filteredRelations
    .filter(r => nodeMap.has(r.from_enterprise_id) && nodeMap.has(r.to_enterprise_id))
    .map(r => ({
      source: r.from_enterprise_id,
      target: r.to_enterprise_id,
      value: r.relation_strength,
      lineStyle: {
        width: Math.max(1, r.relation_strength * 6),
        color: RELATION_COLORS[r.relation_type] || '#999',
        type: r.relation_type === 'cooperation' ? 'dashed' : r.relation_type === 'supply_demand' ? 'dotted' : 'solid',
        curveness: 0.1
      },
      relation: r
    }));

  const option = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderColor: '#E8E8E8',
      textStyle: { color: '#262626', fontSize: 13 },
      formatter: params => {
        if (params.dataType === 'node') {
          const e = nodeMap.get(params.data.id);
          return `
            <div style="font-weight:600;margin-bottom:4px">${e.name}</div>
            <div>角色：${ROLE_LABELS[e.industry_role] || e.industry_role}</div>
            <div>年营收：${e.annual_revenue} 亿</div>
            <div>员工：${formatNumber(e.employee_count)} 人</div>
            <div>风险等级：${e.risk_level === 'normal' ? '正常' : e.risk_level === 'warning' ? '关注' : '危险'}</div>
            <div style="color:#8C8C8C;font-size:12px;margin-top:4px">双击查看企业画像</div>
          `;
        } else {
          const r = params.data.relation;
          return `
            <div style="font-weight:600;margin-bottom:4px">${RELATION_LABELS[r.relation_type]}关系</div>
            <div>强度：${(r.relation_strength * 100).toFixed(0)}%</div>
            ${r.transaction_amount ? `<div>年交易额：${formatNumber(r.transaction_amount)} 万</div>` : ''}
            ${r.transaction_frequency ? `<div>交易频次：${r.transaction_frequency} 次/年</div>` : ''}
            <div>最近交互：${r.last_transaction_date}</div>
          `;
        }
      }
    },
    animationDuration: 1500,
    animationEasingUpdate: 'quinticInOut',
    series: [{
      type: 'graph',
      layout: currentLayout === 'force' ? 'force' : 'none',
      data: nodes,
      links: edges,
      roam: true,
      draggable: true,
      scaleLimit: { min: 0.5, max: 3 },
      zoom: currentZoom,
      label: { show: true },
      force: {
        repulsion: 800,
        gravity: 0.1,
        edgeLength: [80, 200],
        layoutAnimation: true
      },
      lineStyle: { opacity: 0.8 }
    }]
  };

  if (currentLayout === 'hierarchy') {
    applyHierarchyLayout(nodes, edges);
  } else if (currentLayout === 'circular') {
    applyCircularLayout(nodes, edges);
  }

  networkChart.setOption(option, true);
  networkChart.on('finished', () => {
    const opt = networkChart.getOption();
    if (opt.series && opt.series[0]) {
      currentZoom = opt.series[0].zoom || 1;
      document.getElementById('zoomValue').textContent = currentZoom.toFixed(1) + 'x';
    }
  });
}

function applyHierarchyLayout(nodes, edges) {
  const layers = { terminal: 0, integrator: 1, manufacturer: 2, parts_supplier: 3, service: 1, enabling: 1 };
  const layerGroups = {};
  nodes.forEach(n => {
    const e = enterprises.find(ent => ent.id === n.id);
    const layer = layers[e.industry_role] !== undefined ? layers[e.industry_role] : 2;
    if (!layerGroups[layer]) layerGroups[layer] = [];
    layerGroups[layer].push(n);
  });

  const width = networkChart.getWidth() || 1000;
  const height = networkChart.getHeight() || 600;
  const layerKeys = Object.keys(layerGroups).map(Number).sort((a, b) => a - b);
  layerKeys.forEach((layer, i) => {
    const count = layerGroups[layer].length;
    const y = height * 0.2 + (height * 0.6) * i / Math.max(layerKeys.length - 1, 1);
    layerGroups[layer].forEach((n, j) => {
      n.x = width * 0.1 + (width * 0.8) * j / Math.max(count - 1, 1);
      n.y = y;
      n.fixed = true;
    });
  });
}

function applyCircularLayout(nodes, edges) {
  const width = networkChart.getWidth() || 1000;
  const height = networkChart.getHeight() || 600;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.35;
  const count = nodes.length;
  nodes.forEach((n, i) => {
    const angle = (2 * Math.PI * i) / count - Math.PI / 2;
    n.x = centerX + radius * Math.cos(angle);
    n.y = centerY + radius * Math.sin(angle);
    n.fixed = true;
  });
}

function applyFilters() {
  selectedRelationTypes = document.getElementById('relationTypeFilter').value;
  selectedStrength = document.getElementById('strengthFilter').value;
  renderNetwork();
}

function debounceSearch() {
  const input = document.getElementById('searchInput');
  searchKeyword = input.value.trim();
  debounce(renderNetwork, 300)();
}

function switchLayout() {
  currentLayout = document.getElementById('layoutSelect').value;
  renderNetwork();
}

function resetNetworkFilters() {
  document.getElementById('relationTypeFilter').value = 'all';
  document.getElementById('strengthFilter').value = 'all';
  document.getElementById('searchInput').value = '';
  document.getElementById('layoutSelect').value = 'force';
  selectedRelationTypes = 'all';
  selectedStrength = 'all';
  searchKeyword = '';
  currentLayout = 'force';
  renderNetwork();
}

function zoomIn() {
  networkChart.dispatchAction({ type: 'graphZoom', zoom: currentZoom * 1.2 });
}

function zoomOut() {
  networkChart.dispatchAction({ type: 'graphZoom', zoom: currentZoom / 1.2 });
}

function zoomReset() {
  networkChart.dispatchAction({ type: 'graphRestore' });
  currentZoom = 1;
  document.getElementById('zoomValue').textContent = '1.0x';
}

function renderPathSelects() {
  const sourceSelect = document.getElementById('pathSource');
  const targetSelect = document.getElementById('pathTarget');
  const options = enterprises.map(e => `<option value="${e.id}">${e.name}</option>`).join('');
  sourceSelect.innerHTML = '<option value="">请选择源企业</option>' + options;
  targetSelect.innerHTML = '<option value="">请选择目标企业</option>' + options;
}

function onPathSelectChange() {
  pathSource = document.getElementById('pathSource').value;
  pathTarget = document.getElementById('pathTarget').value;
  document.getElementById('btnAnalyzePath').disabled = !(pathSource && pathTarget && pathSource !== pathTarget);
}

function analyzePath() {
  if (!pathSource || !pathTarget || pathSource === pathTarget) return;
  const graph = buildGraph();
  const result = findShortestPath(graph, pathSource, pathTarget);
  renderPathResult(result);
  highlightPath(result.path);
}

function buildGraph() {
  const graph = {};
  enterprises.forEach(e => graph[e.id] = []);
  relations.forEach(r => {
    graph[r.from_enterprise_id].push({ to: r.to_enterprise_id, weight: 1 - r.relation_strength, strength: r.relation_strength, relation: r });
    if (r.relation_type !== 'transaction' && r.relation_type !== 'supply_demand') {
      graph[r.to_enterprise_id].push({ to: r.from_enterprise_id, weight: 1 - r.relation_strength, strength: r.relation_strength, relation: r });
    }
  });
  return graph;
}

function findShortestPath(graph, start, end) {
  const dist = {};
  const prev = {};
  const visited = new Set();
  Object.keys(graph).forEach(k => dist[k] = Infinity);
  dist[start] = 0;

  while (true) {
    let minNode = null;
    let minDist = Infinity;
    Object.keys(dist).forEach(k => {
      if (!visited.has(k) && dist[k] < minDist) {
        minDist = dist[k];
        minNode = k;
      }
    });
    if (minNode === null) break;
    visited.add(minNode);
    if (minNode === end) break;

    graph[minNode].forEach(edge => {
      const alt = dist[minNode] + edge.weight;
      if (alt < dist[edge.to]) {
        dist[edge.to] = alt;
        prev[edge.to] = { node: minNode, edge };
      }
    });
  }

  const path = [];
  let curr = end;
  while (curr && curr !== start) {
    if (!prev[curr]) return { path: [], length: 0, strength: 0 };
    path.unshift({ node: curr, edge: prev[curr].edge });
    curr = prev[curr].node;
  }
  path.unshift({ node: start });

  const strength = path.length > 1
    ? path.slice(1).reduce((s, p) => s + p.edge.strength, 0) / (path.length - 1)
    : 0;

  return { path, length: path.length - 1, strength };
}

function renderPathResult(result) {
  const container = document.getElementById('pathResult');
  if (!result.path.length) {
    container.innerHTML = '<div class="path-result-title">未找到连接路径</div>';
    container.style.display = 'block';
    return;
  }

  const nodeEls = result.path.map((p, i) => {
    const e = enterprises.find(ent => ent.id === p.node);
    const isLast = i === result.path.length - 1;
    return `
      <div class="path-node ${e.is_local ? 'local' : 'external'}">
        <span>${e.name}</span>
      </div>
      ${!isLast ? '<span style="color:#8C8C8C">→</span>' : ''}
    `;
  }).join('');

  container.innerHTML = `
    <div class="path-result-title">最短路径分析结果</div>
    <div class="path-nodes">${nodeEls}</div>
    <div class="path-stats">
      <span>路径长度：<strong>${result.length} 跳</strong></span>
      <span>平均关系强度：<strong>${(result.strength * 100).toFixed(1)}%</strong></span>
      <span>经过企业数：<strong>${result.path.length} 家</strong></span>
    </div>
  `;
  container.style.display = 'block';
}

function highlightPath(pathNodes) {
  const ids = pathNodes.map(p => p.node);
  networkChart.dispatchAction({
    type: 'downplay',
    seriesIndex: 0
  });
  networkChart.dispatchAction({
    type: 'highlight',
    seriesIndex: 0,
    dataIndex: ids.map(id => {
      const opt = networkChart.getOption();
      return opt.series[0].data.findIndex(n => n.id === id);
    }).filter(i => i >= 0)
  });
}

function clearPath() {
  document.getElementById('pathSource').value = '';
  document.getElementById('pathTarget').value = '';
  document.getElementById('pathResult').style.display = 'none';
  document.getElementById('btnAnalyzePath').disabled = true;
  networkChart.dispatchAction({ type: 'downplay', seriesIndex: 0 });
}

async function openEnterpriseDrawer(enterpriseId) {
  const detail = await MockAPI.getEnterpriseDetail(enterpriseId);
  if (!detail) return;

  const products = await MockAPI.getEnterpriseProducts(enterpriseId);
  const demands = await MockAPI.getEnterpriseDemands(enterpriseId);
  const rels = await MockAPI.getEnterpriseRelations(enterpriseId);

  const roleLabel = ROLE_LABELS[detail.industry_role] || detail.industry_role;
  const scaleMap = { large: '大型', medium: '中型', small: '小型', micro: '微型' };
  const statusMap = { active: '存续', revoked: '注销', moved_out: '迁出' };

  document.getElementById('drawerTitle').textContent = '企业画像卡片';
  document.getElementById('drawerBody').innerHTML = `
    <div class="enterprise-card">
      <div class="enterprise-header">
        <div class="enterprise-logo">${detail.name.charAt(0)}</div>
        <div class="enterprise-title">
          <div class="enterprise-name">${detail.name}</div>
          <div class="enterprise-code">${detail.credit_code}</div>
          <div class="enterprise-tags">
            <span class="tag tag-primary">${roleLabel}</span>
            <span class="tag ${detail.is_local ? 'tag-success' : 'tag-default'}">${detail.is_local ? '本区企业' : '外地企业'}</span>
            ${detail.tags.map(t => `<span class="tag tag-default">${t}</span>`).join('')}
          </div>
        </div>
      </div>
      <div class="enterprise-metrics">
        <div class="metric-item"><div class="metric-item-label">年营收</div><div class="metric-item-value">${detail.annual_revenue} 亿</div></div>
        <div class="metric-item"><div class="metric-item-label">员工人数</div><div class="metric-item-value">${formatNumber(detail.employee_count)}</div></div>
        <div class="metric-item"><div class="metric-item-label">企业规模</div><div class="metric-item-value">${scaleMap[detail.enterprise_scale] || detail.enterprise_scale}</div></div>
        <div class="metric-item"><div class="metric-item-label">经营状态</div><div class="metric-item-value">${statusMap[detail.status] || detail.status}</div></div>
      </div>
      <div class="enterprise-info">
        <div class="info-row"><span class="info-label">注册地址</span><span class="info-value">${detail.register_address}</span></div>
        <div class="info-row"><span class="info-label">法定代表人</span><span class="info-value">${detail.legal_person}</span></div>
        <div class="info-row"><span class="info-label">成立日期</span><span class="info-value">${detail.establishment_date}</span></div>
        <div class="info-row"><span class="info-label">注册资本</span><span class="info-value">${formatNumber(detail.registered_capital)} 万</span></div>
      </div>
    </div>
    <div class="enterprise-card">
      <div class="card-title" style="--title-bar-color:#1890FF;font-size:14px">产业链定位</div>
      <div class="info-row"><span class="info-label">所属产业链</span><span class="info-value">${detail.chain_position.chain_name}</span></div>
      <div class="info-row"><span class="info-label">所属环节</span><span class="info-value">${detail.chain_position.node_name}</span></div>
      <div class="info-row"><span class="info-label">产业角色</span><span class="info-value">${detail.chain_position.role === 'core' ? '⭐ 核心企业' : detail.chain_position.role === 'supporting' ? '○ 配套企业' : '□ 服务机构'}</span></div>
    </div>
    <div class="enterprise-card">
      <div class="card-title" style="--title-bar-color:#52C41A;font-size:14px">主营产品/服务（${products.length}）</div>
      ${products.length ? `
        <div class="mini-list">
          ${products.map(p => `
            <div class="mini-item">
              <span class="mini-name">${p.product_name}</span>
              <span class="tag ${p.confidence >= 0.6 ? 'tag-success' : 'tag-warning'}">${p.confidence >= 0.6 ? '已核实' : '待核实'}</span>
            </div>
          `).join('')}
        </div>
      ` : '<div class="empty-text">暂无产品/服务数据</div>'}
    </div>
    <div class="enterprise-card">
      <div class="card-title" style="--title-bar-color:#FA8C16;font-size:14px">关联关系（${rels.length}）</div>
      <div class="relation-list">
        ${rels.slice(0, 5).map(r => {
          const isFrom = r.from_enterprise_id === enterpriseId;
          const peerId = isFrom ? r.to_enterprise_id : r.from_enterprise_id;
          const peer = enterprises.find(e => e.id === peerId);
          return `
            <div class="relation-item">
              <span class="tag tag-default">${RELATION_LABELS[r.relation_type]}</span>
              <div class="relation-peer">
                <div class="relation-peer-name">${peer ? peer.name : peerId}</div>
                <div class="relation-peer-type">${isFrom ? ' outgoing' : ' incoming'}</div>
              </div>
              <span class="relation-strength">${(r.relation_strength * 100).toFixed(0)}%</span>
              ${r.transaction_amount ? `<span class="relation-amount">${formatNumber(r.transaction_amount)}万</span>` : ''}
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
  document.getElementById('drawerFooter').innerHTML = `
    <button class="btn btn-primary" onclick="window.location.href='enterprise-profile.html?enterpriseId=${enterpriseId}'">查看完整画像</button>
    <button class="btn btn-default" onclick="closeNetworkDrawer()">关闭</button>
  `;
  document.getElementById('drawerOverlay').classList.add('open');
  document.getElementById('networkDrawer').classList.add('open');
}

function closeNetworkDrawer() {
  document.getElementById('drawerOverlay').classList.remove('open');
  document.getElementById('networkDrawer').classList.remove('open');
}

function exportNetworkReport() {
  const rows = [['源企业', '目标企业', '关系类型', '关系强度', '交易金额（万）', '交易频次', '最近交互日期']];
  getFilteredRelations().forEach(r => {
    const from = enterprises.find(e => e.id === r.from_enterprise_id);
    const to = enterprises.find(e => e.id === r.to_enterprise_id);
    rows.push([
      from ? from.name : r.from_enterprise_id,
      to ? to.name : r.to_enterprise_id,
      RELATION_LABELS[r.relation_type],
      r.relation_strength,
      r.transaction_amount,
      r.transaction_frequency,
      r.last_transaction_date
    ]);
  });
  exportCSV('企业关系网络报告.csv', rows);
  showToast('网络报告已导出', 'success');
}

init();
