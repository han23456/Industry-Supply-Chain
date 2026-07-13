/**
 * 企业画像 - V1 逻辑
 */

let currentEnterpriseId = null;
let enterpriseDetail = null;
let products = [];
let demands = [];
let relations = [];
let relationChart = null;

const ROLE_LABELS = {
  parts_supplier: '零部件供应商',
  manufacturer: '制造商',
  integrator: '集成商',
  terminal: '终端应用',
  service: '服务商',
  enabling: '使能技术企业'
};

const ROLE_COLORS = {
  parts_supplier: '#1890FF',
  manufacturer: '#52C41A',
  integrator: '#722ED1',
  terminal: '#FA8C16',
  service: '#13C2C2',
  enabling: '#EB2F96'
};

const RELATION_LABELS = {
  equity: '股权',
  transaction: '交易',
  cooperation: '合作',
  supply_demand: '供需'
};

const RELATION_COLORS = {
  equity: '#722ED1',
  transaction: '#1890FF',
  cooperation: '#52C41A',
  supply_demand: '#FA8C16'
};

async function init() {
  if (document.getElementById('globalSearchContainer')) {
    document.getElementById('globalSearchContainer').innerHTML = renderGlobalSearch();
  }
  if (document.getElementById('breadcrumbContainer')) {
    document.getElementById('breadcrumbContainer').innerHTML = renderBreadcrumb('enterprise-profile.html');
  }
  const params = getUrlParams();
  currentEnterpriseId = params.enterpriseId || 'e-a';
  await loadData();
  renderHeader();
  switchTab('basic');
  window.addEventListener('resize', debounce(() => relationChart && relationChart.resize(), 200));
}

async function loadData() {
  enterpriseDetail = await MockAPI.getEnterpriseDetail(currentEnterpriseId);
  products = await MockAPI.getEnterpriseProducts(currentEnterpriseId);
  demands = await MockAPI.getEnterpriseDemands(currentEnterpriseId);
  relations = await MockAPI.getEnterpriseRelations(currentEnterpriseId);
}

function renderHeader() {
  if (!enterpriseDetail) return;
  const d = enterpriseDetail;
  document.title = d.name + ' - 企业画像';
  document.getElementById('pageTitle').textContent = d.name;
  document.getElementById('profileLogo').textContent = d.name.charAt(0);
  document.getElementById('profileName').textContent = d.name;
  document.getElementById('profileRole').textContent = ROLE_LABELS[d.industry_role] || d.industry_role;
  const localTag = document.getElementById('profileLocal');
  localTag.textContent = d.is_local ? '本区企业' : '外地企业';
  localTag.className = 'tag ' + (d.is_local ? 'tag-success' : 'tag-default');
  document.getElementById('profileCode').textContent = '统一信用代码：' + d.credit_code;
  document.getElementById('profileTags').innerHTML = d.tags.map(t => `<span class="tag tag-default">${t}</span>`).join('');

  document.getElementById('profileMetrics').innerHTML = `
    <div class="profile-metric">
      <div class="profile-metric-value">${d.annual_revenue}</div>
      <div class="profile-metric-label">年营收（亿）</div>
    </div>
    <div class="profile-metric">
      <div class="profile-metric-value">${formatNumber(d.employee_count)}</div>
      <div class="profile-metric-label">员工人数</div>
    </div>
    <div class="profile-metric">
      <div class="profile-metric-value">${(d.registered_capital / 10000).toFixed(2)}</div>
      <div class="profile-metric-label">注册资本（亿）</div>
    </div>
    <div class="profile-metric">
      <div class="profile-metric-value">${relations.length}</div>
      <div class="profile-metric-label">关联企业</div>
    </div>
  `;
}

function switchTab(tab) {
  document.querySelectorAll('.profile-tabs .tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  const content = document.getElementById('tabContent');
  content.innerHTML = '';

  switch (tab) {
    case 'basic': renderBasicTab(content); break;
    case 'products': renderProductsTab(content); break;
    case 'demands': renderDemandsTab(content); break;
    case 'relations': renderRelationsTab(content); break;
    case 'chain': renderChainTab(content); break;
    case 'risks': renderRisksTab(content); break;
  }
}

function renderBasicTab(container) {
  const d = enterpriseDetail;
  const scaleMap = { large: '大型', medium: '中型', small: '小型', micro: '微型' };
  const statusMap = { active: '存续', revoked: '注销', moved_out: '迁出' };

  container.innerHTML = `
    <div class="info-section">
      <div class="info-card">
        <div class="info-card-title">工商信息</div>
        <div class="info-row"><span class="info-label">企业名称</span><span class="info-value">${d.name}</span></div>
        <div class="info-row"><span class="info-label">统一信用代码</span><span class="info-value">${d.credit_code}</span></div>
        <div class="info-row"><span class="info-label">注册地址</span><span class="info-value">${d.register_address}</span></div>
        <div class="info-row"><span class="info-label">行业代码</span><span class="info-value">${d.industry_code}</span></div>
        <div class="info-row"><span class="info-label">成立日期</span><span class="info-value">${d.establishment_date}</span></div>
      </div>
      <div class="info-card">
        <div class="info-card-title">经营信息</div>
        <div class="info-row"><span class="info-label">法定代表人</span><span class="info-value">${d.legal_person}</span></div>
        <div class="info-row"><span class="info-label">企业规模</span><span class="info-value">${scaleMap[d.enterprise_scale] || d.enterprise_scale}</span></div>
        <div class="info-row"><span class="info-label">注册资本</span><span class="info-value">${formatNumber(d.registered_capital)} 万</span></div>
        <div class="info-row"><span class="info-label">员工人数</span><span class="info-value">${formatNumber(d.employee_count)} 人</span></div>
        <div class="info-row"><span class="info-label">经营状态</span><span class="info-value">${statusMap[d.status] || d.status}</span></div>
      </div>
      <div class="info-card">
        <div class="info-card-title">资质标签</div>
        <div class="info-row"><span class="info-label">高新技术企业</span><span class="info-value">${d.high_tech_flag ? '是' : '否'}</span></div>
        <div class="info-row"><span class="info-label">企业标签</span><span class="info-value">${d.tags.join('、') || '-'}</span></div>
        <div class="info-row"><span class="info-label">数据来源</span><span class="info-value">${d.data_sources.join('、')}</span></div>
      </div>
      <div class="info-card">
        <div class="info-card-title">企业简介</div>
        <div style="font-size:13px;color:var(--text-secondary);line-height:1.8">${d.description || '暂无企业简介'}</div>
      </div>
    </div>
  `;
}

function renderProductsTab(container) {
  const rows = products.map((p, i) => `
    <tr class="${p.confidence < 0.6 ? 'missing' : ''}">
      <td><div class="product-name">${p.product_name}</div><div class="product-category">${p.product_category}</div></td>
      <td>${p.product_type === '产品' ? '产品' : '服务'}</td>
      <td>${p.source}</td>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <div class="confidence-bar"><div class="confidence-fill" style="width:${p.confidence * 100}%;background:${p.confidence >= 0.6 ? '#52C41A' : '#FAAD14'}"></div></div>
          <span>${(p.confidence * 100).toFixed(0)}%</span>
        </div>
      </td>
      <td><span class="tag ${p.confidence >= 0.6 ? 'tag-success' : 'tag-warning'}">${p.confidence >= 0.6 ? '已核实' : '待核实'}</span></td>
    </tr>
  `).join('');

  container.innerHTML = `
    <div class="card-header" style="padding-bottom:12px;border-bottom:1px solid var(--border-light);margin-bottom:12px">
      <div class="card-title" style="--title-bar-color:#52C41A">产品/服务目录（${products.length}）</div>
      <div class="search-box" style="position:relative;width:240px">
        <span style="position:absolute;left:10px;top:50%;transform:translateY(-50%);color:#8C8C8C;font-size:12px">🔍</span>
        <input type="text" placeholder="搜索产品/分类" style="width:100%;height:32px;padding-left:28px;border:1px solid var(--border);border-radius:4px;font-size:13px" oninput="filterProducts(this.value)">
      </div>
    </div>
    <table class="data-table" id="productsTable">
      <thead><tr><th>产品/服务</th><th>类型</th><th>数据来源</th><th>置信度</th><th>状态</th></tr></thead>
      <tbody>${rows || '<tr><td colspan="5" class="empty-text">暂无产品/服务数据</td></tr>'}</tbody>
    </table>
  `;
}

function filterProducts(keyword) {
  const lower = keyword.toLowerCase();
  const filtered = products.filter(p => p.product_name.toLowerCase().includes(lower) || p.product_category.toLowerCase().includes(lower));
  const rows = filtered.map(p => `
    <tr class="${p.confidence < 0.6 ? 'missing' : ''}">
      <td><div class="product-name">${p.product_name}</div><div class="product-category">${p.product_category}</div></td>
      <td>${p.product_type === '产品' ? '产品' : '服务'}</td>
      <td>${p.source}</td>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <div class="confidence-bar"><div class="confidence-fill" style="width:${p.confidence * 100}%;background:${p.confidence >= 0.6 ? '#52C41A' : '#FAAD14'}"></div></div>
          <span>${(p.confidence * 100).toFixed(0)}%</span>
        </div>
      </td>
      <td><span class="tag ${p.confidence >= 0.6 ? 'tag-success' : 'tag-warning'}">${p.confidence >= 0.6 ? '已核实' : '待核实'}</span></td>
    </tr>
  `).join('');
  document.querySelector('#productsTable tbody').innerHTML = rows || '<tr><td colspan="5" class="empty-text">无匹配结果</td></tr>';
}

function renderDemandsTab(container) {
  const rows = demands.map(d => `
    <tr class="${d.confidence < 0.6 ? 'missing' : ''}">
      <td><div class="product-name">${d.demand_name}</div><div class="product-category">${d.demand_category}</div></td>
      <td>${d.source}</td>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <div class="confidence-bar"><div class="confidence-fill" style="width:${d.confidence * 100}%;background:${d.confidence >= 0.6 ? '#52C41A' : '#FAAD14'}"></div></div>
          <span>${(d.confidence * 100).toFixed(0)}%</span>
        </div>
      </td>
      <td><span class="tag ${d.confidence >= 0.6 ? 'tag-success' : 'tag-warning'}">${d.confidence >= 0.6 ? '已核实' : '待核实'}</span></td>
    </tr>
  `).join('');

  container.innerHTML = `
    <div class="card-header" style="padding-bottom:12px;border-bottom:1px solid var(--border-light);margin-bottom:12px">
      <div class="card-title" style="--title-bar-color:#FA8C16">需求目录（${demands.length}）</div>
      <div class="search-box" style="position:relative;width:240px">
        <span style="position:absolute;left:10px;top:50%;transform:translateY(-50%);color:#8C8C8C;font-size:12px">🔍</span>
        <input type="text" placeholder="搜索需求/分类" style="width:100%;height:32px;padding-left:28px;border:1px solid var(--border);border-radius:4px;font-size:13px" oninput="filterDemands(this.value)">
      </div>
    </div>
    <table class="data-table" id="demandsTable">
      <thead><tr><th>需求名称</th><th>数据来源</th><th>置信度</th><th>状态</th></tr></thead>
      <tbody>${rows || '<tr><td colspan="4" class="empty-text">暂无需求数据</td></tr>'}</tbody>
    </table>
  `;
}

function filterDemands(keyword) {
  const lower = keyword.toLowerCase();
  const filtered = demands.filter(d => d.demand_name.toLowerCase().includes(lower) || d.demand_category.toLowerCase().includes(lower));
  const rows = filtered.map(d => `
    <tr class="${d.confidence < 0.6 ? 'missing' : ''}">
      <td><div class="product-name">${d.demand_name}</div><div class="product-category">${d.demand_category}</div></td>
      <td>${d.source}</td>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <div class="confidence-bar"><div class="confidence-fill" style="width:${d.confidence * 100}%;background:${d.confidence >= 0.6 ? '#52C41A' : '#FAAD14'}"></div></div>
          <span>${(d.confidence * 100).toFixed(0)}%</span>
        </div>
      </td>
      <td><span class="tag ${d.confidence >= 0.6 ? 'tag-success' : 'tag-warning'}">${d.confidence >= 0.6 ? '已核实' : '待核实'}</span></td>
    </tr>
  `).join('');
  document.querySelector('#demandsTable tbody').innerHTML = rows || '<tr><td colspan="4" class="empty-text">无匹配结果</td></tr>';
}

async function renderRelationsTab(container) {
  container.innerHTML = `
    <div class="relations-layout">
      <div class="relations-left">
        <div class="relation-filter">
          <select id="relationFilterType" onchange="renderRelationNetwork()">
            <option value="all">全部关系</option>
            <option value="equity">股权</option>
            <option value="transaction">交易</option>
            <option value="cooperation">合作</option>
            <option value="supply_demand">供需</option>
          </select>
          <select id="relationFilterLocal" onchange="renderRelationNetwork()">
            <option value="all">全部企业</option>
            <option value="local">只看本区</option>
            <option value="external">只看外地</option>
          </select>
        </div>
        <div id="relationNetworkChart"></div>
      </div>
      <div class="relations-right">
        <div class="card-title" style="--title-bar-color:#722ED1;margin-bottom:12px">关联企业列表</div>
        <div class="relation-list" id="relationList"></div>
      </div>
    </div>
  `;
  setTimeout(() => renderRelationNetwork(), 0);
}

async function renderRelationNetwork() {
  if (!document.getElementById('relationNetworkChart')) return;
  const typeFilter = document.getElementById('relationFilterType').value;
  const localFilter = document.getElementById('relationFilterLocal').value;

  const allIds = new Set([currentEnterpriseId]);
  const filteredRels = relations.filter(r => {
    if (typeFilter !== 'all' && r.relation_type !== typeFilter) return false;
    return true;
  });

  filteredRels.forEach(r => {
    allIds.add(r.from_enterprise_id);
    allIds.add(r.to_enterprise_id);
  });

  const nodeList = [];
  for (const id of allIds) {
    const e = await MockAPI.getEnterpriseDetail(id);
    if (!e) continue;
    if (localFilter === 'local' && !e.is_local) continue;
    if (localFilter === 'external' && e.is_local) continue;
    nodeList.push(e);
  }

  const nodeMap = new Map(nodeList.map(n => [n.id, n]));
  const edges = filteredRels
    .filter(r => nodeMap.has(r.from_enterprise_id) && nodeMap.has(r.to_enterprise_id))
    .map(r => ({
      source: r.from_enterprise_id,
      target: r.to_enterprise_id,
      value: r.relation_strength,
      relation_type: r.relation_type,
      lineStyle: {
        width: Math.max(1, r.relation_strength * 5),
        color: RELATION_COLORS[r.relation_type] || '#999',
        type: r.relation_type === 'cooperation' ? 'dashed' : r.relation_type === 'supply_demand' ? 'dotted' : 'solid'
      }
    }));

  const nodes = nodeList.map(n => ({
    id: n.id,
    name: n.name,
    symbolSize: n.id === currentEnterpriseId ? 50 : Math.max(20, 15 + n.annual_revenue * 2),
    itemStyle: {
      color: n.id === currentEnterpriseId ? '#F5222D' : ROLE_COLORS[n.industry_role] || '#8C8C8C',
      borderColor: n.id === currentEnterpriseId ? '#F5222D' : (n.risk_level !== 'normal' ? '#FAAD14' : 'transparent'),
      borderWidth: n.id === currentEnterpriseId ? 4 : (n.risk_level !== 'normal' ? 2 : 1)
    },
    label: { show: true, position: 'bottom', fontSize: 11 }
  }));

  if (!relationChart) {
    relationChart = echarts.init(document.getElementById('relationNetworkChart'));
    relationChart.on('click', params => {
      if (params.dataType === 'node' && params.data.id !== currentEnterpriseId) {
        window.open(`enterprise-profile.html?enterpriseId=${params.data.id}`, '_blank');
      }
    });
  }

  relationChart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: params => {
        if (params.dataType === 'node') {
          const n = nodeMap.get(params.data.id);
          return `<strong>${n.name}</strong><br/>${ROLE_LABELS[n.industry_role]}<br/>年营收：${n.annual_revenue}亿`;
        }
        return `${RELATION_LABELS[params.data.relation_type]}关系<br/>强度：${(params.data.value * 100).toFixed(0)}%`;
      }
    },
    series: [{
      type: 'graph',
      layout: 'force',
      data: nodes,
      links: edges,
      roam: true,
      force: { repulsion: 600, edgeLength: [60, 150] },
      emphasis: { focus: 'adjacency' }
    }]
  }, true);

  renderRelationList(filteredRels, nodeMap);
}

function renderRelationList(rels, nodeMap) {
  const list = document.getElementById('relationList');
  if (!list) return;
  list.innerHTML = rels.sort((a, b) => b.relation_strength - a.relation_strength).map(r => {
    const isFrom = r.from_enterprise_id === currentEnterpriseId;
    const peerId = isFrom ? r.to_enterprise_id : r.from_enterprise_id;
    const peer = nodeMap.get(peerId);
    if (!peer) return '';
    return `
      <div class="relation-item" style="cursor:pointer" onclick="window.open('enterprise-profile.html?enterpriseId=${peerId}','_blank')">
        <span class="tag tag-default">${RELATION_LABELS[r.relation_type]}</span>
        <div class="relation-peer">
          <div class="relation-peer-name">${peer.name}</div>
          <div class="relation-peer-type">${ROLE_LABELS[peer.industry_role]} · ${peer.is_local ? '本区' : '外地'}</div>
        </div>
        <span class="relation-strength">${(r.relation_strength * 100).toFixed(0)}%</span>
      </div>
    `;
  }).join('') || '<div class="empty-text">暂无关联企业</div>';
}

function renderChainTab(container) {
  const cp = enterpriseDetail.chain_position;
  const roleIcon = { core: '⭐', supporting: '○', service: '□' }[cp.role];
  container.innerHTML = `
    <div class="chain-position-card">
      <div class="position-item">
        <div class="position-icon ${cp.role}">${roleIcon}</div>
        <div class="position-content">
          <div class="position-label">所属产业链</div>
          <div class="position-value">${cp.chain_name}产业链</div>
        </div>
      </div>
      <div class="position-item">
        <div class="position-icon supporting">◎</div>
        <div class="position-content">
          <div class="position-label">所属环节</div>
          <div class="position-value">${cp.node_name}</div>
        </div>
      </div>
      <div class="position-item">
        <div class="position-icon ${cp.role}">${roleIcon}</div>
        <div class="position-content">
          <div class="position-label">产业角色</div>
          <div class="position-value">${cp.role === 'core' ? '核心企业' : cp.role === 'supporting' ? '配套企业' : '服务机构'}</div>
        </div>
      </div>
      <div class="position-item">
        <div class="position-icon service">◈</div>
        <div class="position-content">
          <div class="position-label">关联类型</div>
          <div class="position-value">${cp.relation_type}</div>
        </div>
      </div>
      <div class="info-card">
        <div class="info-card-title">产业链贡献度</div>
        <div id="chainContributionChart" style="height:260px"></div>
      </div>
    </div>
  `;
  setTimeout(() => {
    const chart = echarts.init(document.getElementById('chainContributionChart'));
    chart.setOption({
      radar: {
        indicator: [
          { name: '营收规模', max: 100 },
          { name: '就业带动', max: 100 },
          { name: '技术引领', max: 100 },
          { name: '本地配套', max: 100 },
          { name: '供应链枢纽', max: 100 },
          { name: '创新投入', max: 100 }
        ],
        radius: '65%'
      },
      series: [{
        type: 'radar',
        data: [{
          value: [85, 70, 75, 60, 80, 65],
          name: enterpriseDetail.name,
          areaStyle: { color: 'rgba(24,144,255,0.2)' },
          lineStyle: { color: '#1890FF' },
          itemStyle: { color: '#1890FF' }
        }]
      }]
    });
  }, 0);
}

async function renderRisksTab(container) {
  const allRisks = await MockAPI.getRiskWarnings();
  const risks = allRisks.filter(r => r.enterprise_id === currentEnterpriseId);
  const levelClass = { '紧急': 'urgent', '重要': 'important', '关注': 'normal' };

  container.innerHTML = `
    <div class="card-header" style="padding-bottom:12px;border-bottom:1px solid var(--border-light);margin-bottom:12px">
      <div class="card-title" style="--title-bar-color:#F5222D">风险状态（${risks.length}）</div>
    </div>
    <div class="risk-timeline">
      ${risks.length ? risks.map(r => `
        <div class="risk-item ${levelClass[r.risk_level]}">
          <div class="risk-header">
            <span class="tag tag-danger">${r.risk_level}</span>
            <span class="risk-title">${r.risk_type}</span>
          </div>
          <div class="risk-desc">${r.risk_desc}</div>
          <div class="risk-meta">
            <span>影响企业：${r.affected_enterprises} 家</span>
            <span>状态：${r.status}</span>
            <span>发生时间：${r.created_at.slice(0, 10)}</span>
          </div>
        </div>
      `).join('') : '<div class="empty-text">暂无风险记录</div>'}
    </div>
  `;
}

init();
