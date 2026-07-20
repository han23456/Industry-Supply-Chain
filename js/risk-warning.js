/**
 * 供应链风险预警 - V1 逻辑
 */

let allRisks = [];
let filteredRisks = [];
let selectedRiskId = null;
let enterprises = [];
let rippleChart = null;

const LEVEL_CLASS = { '紧急': 'urgent', '重要': 'important', '关注': 'normal' };
const LEVEL_COLOR = { '紧急': '#F5222D', '重要': '#FA8C16', '关注': '#FAAD14' };

async function init() {
  if (document.getElementById('globalSearchContainer')) {
    document.getElementById('globalSearchContainer').innerHTML = renderGlobalSearch();
  }
  if (document.getElementById('breadcrumbContainer')) {
    document.getElementById('breadcrumbContainer').innerHTML = renderBreadcrumb('risk-warning.html');
  }
  enterprises = await MockAPI.getAllEnterprises();
  allRisks = await MockAPI.getRiskWarnings();
  filteredRisks = [...allRisks];
  renderStats();
  renderRiskList();
  const params = getUrlParams();
  if (params.enterpriseId) {
    const risk = allRisks.find(r => r.enterprise_id === params.enterpriseId);
    if (risk) selectRisk(risk.id);
  }
  window.addEventListener('resize', debounce(() => rippleChart && rippleChart.resize(), 200));
}

function renderStats() {
  const urgent = allRisks.filter(r => r.risk_level === '紧急').length;
  const important = allRisks.filter(r => r.risk_level === '重要').length;
  const normal = allRisks.filter(r => r.risk_level === '关注').length;
  document.getElementById('urgentCount').textContent = urgent;
  document.getElementById('importantCount').textContent = important;
  document.getElementById('normalCount').textContent = normal;
  document.getElementById('totalCount').textContent = allRisks.length;
}

function applyRiskFilters() {
  const level = document.getElementById('levelFilter').value;
  const type = document.getElementById('typeFilter').value;
  const status = document.getElementById('statusFilter').value;

  filteredRisks = allRisks.filter(r => {
    if (level && r.risk_level !== level) return false;
    if (type && r.risk_type !== type) return false;
    if (status && r.status !== status) return false;
    return true;
  });

  // 按等级和时间排序
  const levelOrder = { '紧急': 0, '重要': 1, '关注': 2 };
  filteredRisks.sort((a, b) => {
    if (levelOrder[a.risk_level] !== levelOrder[b.risk_level]) return levelOrder[a.risk_level] - levelOrder[b.risk_level];
    return new Date(b.created_at) - new Date(a.created_at);
  });

  renderRiskList();
}

function resetRiskFilters() {
  document.getElementById('levelFilter').value = '';
  document.getElementById('typeFilter').value = '';
  document.getElementById('statusFilter').value = '';
  filteredRisks = [...allRisks];
  renderRiskList();
}

function renderRiskList() {
  const container = document.getElementById('riskItems');
  document.getElementById('listCount').textContent = `共 ${filteredRisks.length} 条`;

  container.innerHTML = filteredRisks.map(r => `
    <div class="risk-item ${LEVEL_CLASS[r.risk_level]} ${selectedRiskId === r.id ? 'active' : ''}" onclick="selectRisk('${r.id}')">
      <div class="risk-item-header">
        <span class="tag ${r.risk_level === '紧急' ? 'tag-danger' : r.risk_level === '重要' ? 'tag-warning' : 'tag-default'}">${r.risk_level}</span>
        <span class="risk-item-title">${r.enterprise_name}</span>
      </div>
      <div class="risk-item-desc">${r.risk_desc}</div>
      <div class="risk-item-meta">
        <span>${r.risk_type}</span>
        <span>${r.created_at.slice(0, 10)}</span>
      </div>
    </div>
  `).join('') || '<div class="empty-state"><div class="empty-state-title">无符合条件的预警</div></div>';
}

async function selectRisk(riskId) {
  selectedRiskId = riskId;
  renderRiskList();
  const risk = allRisks.find(r => r.id === riskId);
  if (!risk) return;

  const enterprise = await MockAPI.getEnterpriseDetail(risk.enterprise_id);
  renderRiskDetail(risk, enterprise);
}

function renderRiskDetail(risk, enterprise) {
  const cls = LEVEL_CLASS[risk.risk_level];
  const color = LEVEL_COLOR[risk.risk_level];
  document.getElementById('detailCard').innerHTML = `
    <div class="detail-header">
      <div class="detail-icon ${cls}">⚠️</div>
      <div class="detail-title">
        <h2>${risk.enterprise_name}</h2>
        <p>${risk.risk_type} · 影响 ${risk.affected_enterprises} 家企业 · ${risk.created_at.slice(0, 10)}</p>
      </div>
      <span class="detail-level" style="color:${color}">${risk.risk_level}</span>
    </div>

    <div class="detail-section">
      <div class="detail-section-title">风险描述</div>
      <div class="detail-desc">${risk.risk_desc}</div>
    </div>

    <div class="detail-section">
      <div class="detail-section-title">风险传导图谱</div>
      <div id="rippleChart"></div>
    </div>

    <div class="detail-section">
      <div class="detail-section-title">替代方案推荐</div>
      <table class="alternative-table" id="alternativeTable">
        <thead><tr><th>替代企业</th><th>产品匹配度</th><th>产能评估</th><th>距离</th><th>可行性</th><th>操作</th></tr></thead>
        <tbody></tbody>
      </table>
    </div>

    <div class="detail-actions">
      <button class="btn btn-primary" onclick="handleRisk('${risk.id}')">${risk.status === '未处理' ? '开始处置' : '更新状态'}</button>
      <button class="btn btn-default" onclick="window.open('enterprise-profile.html?enterpriseId=${encodeURIComponent(risk.enterprise_id)}','_blank')">查看企业画像</button>
      <button class="btn btn-default" onclick="window.open('enterprise-network.html?focusId=${risk.enterprise_id}','_blank')">查看传导网络</button>
    </div>
  `;

  setTimeout(() => renderRippleChart(risk, enterprise), 0);
  renderAlternativeTable(risk);
}

function renderRippleChart(risk, enterprise) {
  const chartDom = document.getElementById('rippleChart');
  if (!chartDom) return;
  if (!rippleChart) rippleChart = echarts.init(chartDom);

  // 模拟涟漪图数据
  const center = { name: risk.enterprise_name, value: 100 };
  const neighbors = [
    { name: '直接上游A', value: 60, level: 1 },
    { name: '直接下游B', value: 50, level: 1 },
    { name: '间接关联C', value: 30, level: 2 },
    { name: '间接关联D', value: 25, level: 2 },
    { name: '间接关联E', value: 15, level: 3 }
  ];

  const data = [
    center,
    ...neighbors
  ];

  rippleChart.setOption({
    tooltip: { trigger: 'item' },
    series: [{
      type: 'graph',
      layout: 'force',
      data: data.map(d => ({
        name: d.name,
        value: d.value,
        symbolSize: d.level === undefined ? 50 : 20 + d.value / 3,
        itemStyle: {
          color: d.level === undefined ? '#F5222D' : d.level === 1 ? '#FA8C16' : '#FAAD14'
        }
      })),
      links: neighbors.map(n => ({ source: center.name, target: n.name, value: n.value })),
      roam: true,
      force: { repulsion: 400, edgeLength: [60, 120] },
      emphasis: { focus: 'adjacency' }
    }]
  });
}

function renderAlternativeTable(risk) {
  const tbody = document.querySelector('#alternativeTable tbody');
  if (!tbody) return;

  const alternatives = [
    { name: '替代供应商A', match: 0.92, capacity: '充足', distance: 12, feasibility: '高' },
    { name: '替代供应商B', match: 0.85, capacity: '一般', distance: 28, feasibility: '高' },
    { name: '替代供应商C', match: 0.78, capacity: '充足', distance: 45, feasibility: '中' }
  ];

  tbody.innerHTML = alternatives.map(a => `
    <tr>
      <td>${a.name}</td>
      <td>${(a.match * 100).toFixed(0)}%</td>
      <td>${a.capacity}</td>
      <td>${a.distance} km</td>
      <td><span class="tag ${a.feasibility === '高' ? 'tag-success' : a.feasibility === '中' ? 'tag-warning' : 'tag-default'}">${a.feasibility}</span></td>
      <td><button class="btn btn-text btn-sm" onclick="window.open('enterprise-profile.html?enterpriseId=ent-net-001','_blank')">查看画像</button></td>
    </tr>
  `).join('');
}

function handleRisk(riskId) {
  const risk = allRisks.find(r => r.id === riskId);
  if (!risk) return;
  const nextStatus = risk.status === '未处理' ? '处理中' : risk.status === '处理中' ? '已处理' : '已处理';
  risk.status = nextStatus;
  showToast(`风险状态已更新为：${nextStatus}`, 'success');
  renderRiskList();
  const enterprise = enterprises.find(e => e.id === risk.enterprise_id);
  renderRiskDetail(risk, enterprise);
}

function exportRiskReport() {
  const rows = [['企业名称', '风险类型', '风险等级', '影响企业数', '状态', '发生时间']];
  filteredRisks.forEach(r => {
    rows.push([r.enterprise_name, r.risk_type, r.risk_level, r.affected_enterprises, r.status, r.created_at.slice(0, 10)]);
  });
  exportCSV('供应链风险预警报告.csv', rows);
  showToast('预警报告已导出', 'success');
}

init();
