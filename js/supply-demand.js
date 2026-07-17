/**
 * 供需对接服务 - V1 逻辑
 */

let currentMode = 'who-needs-me';
let enterprises = [];
let matches = [];
let gaps = [];
let gapChart = null;
let pathChart = null;

async function init() {
  if (document.getElementById('globalSearchContainer')) {
    document.getElementById('globalSearchContainer').innerHTML = renderGlobalSearch();
  }
  if (document.getElementById('breadcrumbContainer')) {
    document.getElementById('breadcrumbContainer').innerHTML = renderBreadcrumb('supply-demand.html');
  }
  enterprises = await MockAPI.getAllEnterprises();
  renderEnterpriseSelect();
  const params = getUrlParams();
  if (params.enterpriseId) {
    document.getElementById('enterpriseSelect').value = params.enterpriseId;
    onEnterpriseChange();
  }
  window.addEventListener('resize', debounce(() => {
    gapChart && gapChart.resize();
    pathChart && pathChart.resize();
  }, 200));
}

function renderEnterpriseSelect() {
  const select = document.getElementById('enterpriseSelect');
  select.innerHTML = '<option value="">请选择企业</option>' + enterprises.map(e => `<option value="${e.id}">${e.name}</option>`).join('');
}

function switchMode(mode) {
  currentMode = mode;
  document.querySelectorAll('.mode-tab').forEach(t => t.classList.toggle('active', t.dataset.mode === mode));

  const productBox = document.getElementById('productSelectBox');
  const pathBox = document.getElementById('pathProductBox');
  const btn = document.getElementById('btnRunMatch');

  if (mode === 'path-analysis') {
    productBox.style.display = 'none';
    pathBox.style.display = 'flex';
    btn.textContent = '分析路径';
  } else if (mode === 'gap-analysis') {
    productBox.style.display = 'none';
    pathBox.style.display = 'none';
    btn.textContent = '查看缺口';
  } else {
    productBox.style.display = 'flex';
    pathBox.style.display = 'none';
    btn.textContent = '开始匹配';
    onEnterpriseChange();
  }

  document.getElementById('resultBody').innerHTML = `
    <div class="empty-state">
      <div class="empty-state-icon">📊</div>
      <div class="empty-state-title">请选择企业和匹配模式</div>
      <p>系统将基于产品/需求目录自动计算本地供需匹配度</p>
    </div>
  `;
}

async function onEnterpriseChange() {
  const enterpriseId = document.getElementById('enterpriseSelect').value;
  const productSelect = document.getElementById('productSelect');
  productSelect.innerHTML = '<option value="">全部产品/需求</option>';
  if (!enterpriseId) return;

  let items = [];
  if (currentMode === 'who-needs-me') {
    items = await MockAPI.getEnterpriseProducts(enterpriseId);
  } else if (currentMode === 'i-need-who') {
    items = await MockAPI.getEnterpriseDemands(enterpriseId);
  }

  productSelect.innerHTML = '<option value="">全部产品/需求</option>' + items.map(i => `<option value="${i.product_name || i.demand_name}">${i.product_name || i.demand_name}</option>`).join('');
}

function onProductChange() {
  // 可扩展实时匹配
}

async function runMatch() {
  const enterpriseId = document.getElementById('enterpriseSelect').value;
  if (!enterpriseId && currentMode !== 'gap-analysis') {
    showToast('请先选择企业', 'warning');
    return;
  }

  if (currentMode === 'gap-analysis') {
    await renderGapAnalysis();
    return;
  }

  if (currentMode === 'path-analysis') {
    await renderPathAnalysis(enterpriseId);
    return;
  }

  matches = await MockAPI.getSupplyDemandMatches(currentMode === 'who-needs-me' ? 'who_needs_me' : 'i_need_who', enterpriseId);
  const selectedProduct = document.getElementById('productSelect').value;
  if (selectedProduct) {
    matches = matches.filter(m => (m.product_name === selectedProduct || m.demand_name === selectedProduct));
  }
  renderMatchResults();
}

function renderMatchResults() {
  const title = currentMode === 'who-needs-me' ? '谁需要我 - 下游需求匹配' : '我需要谁 - 上游供应匹配';
  document.getElementById('resultTitle').textContent = title + `（${matches.length}条）`;

  const statusClass = { '待撮合': 'tag-default', '已撮合': 'tag-primary', '已成交': 'tag-success' };

  document.getElementById('resultBody').innerHTML = matches.length ? `
    <div class="match-list">
      ${matches.map(m => {
        const isSupplier = currentMode === 'who-needs-me';
        const otherId = isSupplier ? m.demander_id : m.supplier_id;
        const other = enterprises.find(e => e.id === otherId);
        const score = Math.round(m.match_score * 100);
        const scoreClass = score >= 90 ? 'score-high' : score >= 70 ? 'score-medium' : 'score-low';
        return `
          <div class="match-card">
            <div class="match-score ${scoreClass}">
              <div class="match-score-value">${score}%</div>
              <div class="match-score-label">匹配度</div>
            </div>
            <div class="match-info">
              <div class="match-enterprise">${other ? other.name : otherId}</div>
              <div class="match-product">${isSupplier ? '供应：' + m.product_name : '需求：' + m.demand_name} → ${isSupplier ? '需求：' + m.demand_name : '供应：' + m.product_name}</div>
              <div class="match-reason">
                <span class="match-reason-item">语义相似 ${Math.round(m.match_reason.semantic * 100)}%</span>
                <span class="match-reason-item">分类一致 ${m.match_reason.category ? '是' : '否'}</span>
                <span class="match-reason-item">交易历史 ${m.match_reason.history ? '有' : '无'}</span>
              </div>
            </div>
            <div class="match-actions">
              <span class="tag ${statusClass[m.status]}">${m.status}</span>
              <button class="btn btn-primary btn-sm" onclick="openMatchDrawer('${m.id}')">撮合建议</button>
              <button class="btn btn-default btn-sm" onclick="window.open('enterprise-profile.html?enterpriseId=${encodeURIComponent(otherId)}','_blank')">画像</button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  ` : '<div class="empty-state"><div class="empty-state-icon">🔍</div><div class="empty-state-title">暂无匹配结果</div><p>请尝试更换企业或产品条件</p></div>';

  updateStats();
}

async function renderGapAnalysis() {
  gaps = await MockAPI.getSupplyDemandGapsDetail();
  document.getElementById('resultTitle').textContent = '本地供需缺口分析';

  const supplyGaps = gaps.filter(g => g.gap_type === '供应缺口');
  const demandGaps = gaps.filter(g => g.gap_type === '需求缺口');

  document.getElementById('resultBody').innerHTML = `
    <div class="gap-chart" id="gapChart"></div>
    <div class="gap-table-wrap">
      <table class="data-table">
        <thead><tr><th>缺口类型</th><th>产品分类</th><th>涉及企业</th><th>估算金额（亿）</th><th>操作</th></tr></thead>
        <tbody>
          ${gaps.map(g => `
            <tr>
              <td><span class="tag ${g.gap_type === '供应缺口' ? 'tag-danger' : 'tag-primary'}">${g.gap_type}</span></td>
              <td>${g.product_category}</td>
              <td>${g.enterprise_count} 家</td>
              <td>${g.estimated_amount}</td>
              <td><button class="btn btn-text btn-sm" onclick="window.location.href='chain-gap.html?category=${encodeURIComponent(g.product_category)}'">查看补链 →</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  setTimeout(() => {
    gapChart = echarts.init(document.getElementById('gapChart'));
    gapChart.setOption({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { data: ['供应缺口', '需求缺口'], top: 0 },
      grid: { left: '3%', right: '4%', bottom: '3%', top: '12%', containLabel: true },
      xAxis: { type: 'category', data: gaps.map(g => g.product_category), axisLabel: { rotate: 30 } },
      yAxis: { type: 'value', name: '估算金额（亿）' },
      series: [
        { name: '供应缺口', type: 'bar', data: gaps.map(g => g.gap_type === '供应缺口' ? g.estimated_amount : 0), itemStyle: { color: '#F5222D' } },
        { name: '需求缺口', type: 'bar', data: gaps.map(g => g.gap_type === '需求缺口' ? g.estimated_amount : 0), itemStyle: { color: '#1890FF' } }
      ]
    });
  }, 0);

  document.getElementById('sdStats').innerHTML = `
    <div class="sd-stat"><span class="sd-stat-label">供应缺口</span><span class="sd-stat-value" style="color:#F5222D">${supplyGaps.length} 项</span></div>
    <div class="sd-stat"><span class="sd-stat-label">需求缺口</span><span class="sd-stat-value" style="color:#1890FF">${demandGaps.length} 项</span></div>
    <div class="sd-stat"><span class="sd-stat-label">缺口总金额</span><span class="sd-stat-value">${gaps.reduce((s, g) => s + g.estimated_amount, 0).toFixed(1)} 亿</span></div>
  `;
}

async function renderPathAnalysis(enterpriseId) {
  const productName = document.getElementById('pathProductInput').value || '精密减速机';
  document.getElementById('resultTitle').textContent = '供需路径分析：' + productName;

  // 模拟一条供需路径
  const pathNodes = [
    { name: '原材料', type: '上游', local: false },
    { name: '精密减速机', type: '核心零部件', local: false },
    { name: '本体厂C', type: '机器人本体', local: true },
    { name: '集成商B', type: '系统集成', local: true },
    { name: '汽车厂A', type: '终端应用', local: true }
  ];

  document.getElementById('resultBody').innerHTML = `
    <div class="path-flow" id="pathFlow">
      ${pathNodes.map((n, i) => `
        <div class="path-node ${n.local ? 'local' : 'external'}">
          <span class="path-node-name">${n.name}</span>
          <span class="path-node-type">${n.type}</span>
        </div>
        ${i < pathNodes.length - 1 ? '<span class="path-arrow">→</span>' : ''}
      `).join('')}
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:16px">
      <div class="info-card"><div class="info-card-title">路径深度</div><div class="profile-metric-value">${pathNodes.length}</div><div class="profile-metric-label">环节数</div></div>
      <div class="info-card"><div class="info-card-title">本地占比</div><div class="profile-metric-value" style="color:#52C41A">60%</div><div class="profile-metric-label">本地企业覆盖</div></div>
      <div class="info-card"><div class="info-card-title">路径断点</div><div class="profile-metric-value" style="color:#F5222D">2</div><div class="profile-metric-label">外地依赖环节</div></div>
    </div>
    <div class="card-title" style="--title-bar-color:#722ED1;margin-bottom:8px">路径企业分布</div>
    <div id="pathChart" style="height:300px"></div>
  `;

  setTimeout(() => {
    pathChart = echarts.init(document.getElementById('pathChart'));
    pathChart.setOption({
      tooltip: { trigger: 'item' },
      series: [{
        type: 'sankey',
        data: pathNodes.map(n => ({ name: n.name, itemStyle: { color: n.local ? '#1890FF' : '#F5222D' } })),
        links: pathNodes.slice(0, -1).map((n, i) => ({ source: n.name, target: pathNodes[i + 1].name, value: 10 })),
        emphasis: { focus: 'adjacency' },
        lineStyle: { color: 'gradient', curveness: 0.5 }
      }]
    });
  }, 0);
}

function updateStats() {
  const high = matches.filter(m => m.match_score >= 0.9).length;
  const medium = matches.filter(m => m.match_score >= 0.7 && m.match_score < 0.9).length;
  const pending = matches.filter(m => m.status === '待撮合').length;

  document.getElementById('sdStats').innerHTML = `
    <div class="sd-stat"><span class="sd-stat-label">高匹配</span><span class="sd-stat-value" style="color:#52C41A">${high} 条</span></div>
    <div class="sd-stat"><span class="sd-stat-label">中匹配</span><span class="sd-stat-value" style="color:#1890FF">${medium} 条</span></div>
    <div class="sd-stat"><span class="sd-stat-label">待撮合</span><span class="sd-stat-value" style="color:#FA8C16">${pending} 条</span></div>
  `;
}

async function openMatchDrawer(matchId) {
  const m = matches.find(x => x.id === matchId);
  if (!m) return;
  const isSupplier = currentMode === 'who-needs-me';
  const otherId = isSupplier ? m.demander_id : m.supplier_id;
  const other = await MockAPI.getEnterpriseDetail(otherId);

  document.getElementById('matchDrawerTitle').textContent = '撮合建议报告';
  document.getElementById('matchDrawerBody').innerHTML = `
    <div class="suggestion-card">
      <div class="suggestion-title">供需双方</div>
      <div class="suggestion-row"><span class="suggestion-label">供应企业</span><span class="suggestion-value">${enterprises.find(e => e.id === m.supplier_id)?.name || m.supplier_id}</span></div>
      <div class="suggestion-row"><span class="suggestion-label">需求企业</span><span class="suggestion-value">${enterprises.find(e => e.id === m.demander_id)?.name || m.demander_id}</span></div>
      <div class="suggestion-row"><span class="suggestion-label">匹配产品</span><span class="suggestion-value">${m.product_name}</span></div>
      <div class="suggestion-row"><span class="suggestion-label">匹配度</span><span class="suggestion-value" style="color:#1890FF;font-weight:700">${(m.match_score * 100).toFixed(0)}%</span></div>
    </div>
    <div class="suggestion-card">
      <div class="suggestion-title">匹配理由</div>
      <div class="suggestion-row"><span class="suggestion-label">语义相似度</span><span class="suggestion-value">${Math.round(m.match_reason.semantic * 100)}%</span></div>
      <div class="suggestion-row"><span class="suggestion-label">分类一致性</span><span class="suggestion-value">${m.match_reason.category ? '一致' : '相关'}</span></div>
      <div class="suggestion-row"><span class="suggestion-label">交易历史</span><span class="suggestion-value">${m.match_reason.history ? '已有合作基础' : '潜在合作机会'}</span></div>
    </div>
    <div class="suggestion-card">
      <div class="suggestion-title">建议合作方式</div>
      <div style="font-size:13px;color:var(--text-secondary);line-height:1.8">
        双方在产品分类上高度匹配，建议优先组织线下对接会。
        ${m.match_reason.history ? '已有交易历史，可深化长期供货协议。' : '建议先进行小批量试单，建立信任后扩大合作规模。'}
      </div>
    </div>
    <div class="suggestion-card">
      <div class="suggestion-title">联系方式（脱敏）</div>
      <div class="contact-mask">
        <span>📞 ${other ? maskPhone('13800138000') : '暂无'}</span>
        <button class="btn btn-text btn-sm" onclick="showToast('已记录操作日志：申请查看联系方式','success')">申请查看</button>
      </div>
    </div>
  `;
  document.getElementById('matchDrawerFooter').innerHTML = `
    <button class="btn btn-primary" onclick="showToast('撮合状态已更新为：已撮合','success');closeMatchDrawer()">确认撮合</button>
    <button class="btn btn-default" onclick="closeMatchDrawer()">关闭</button>
  `;
  document.getElementById('drawerOverlay').classList.add('open');
  document.getElementById('matchDrawer').classList.add('open');
}

function closeMatchDrawer() {
  document.getElementById('drawerOverlay').classList.remove('open');
  document.getElementById('matchDrawer').classList.remove('open');
}

function maskPhone(phone) {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}

function exportMatchReport() {
  const rows = [['供应企业', '需求企业', '匹配产品', '匹配度', '状态']];
  matches.forEach(m => {
    const supplier = enterprises.find(e => e.id === m.supplier_id);
    const demander = enterprises.find(e => e.id === m.demander_id);
    rows.push([supplier ? supplier.name : m.supplier_id, demander ? demander.name : m.demander_id, m.product_name, (m.match_score * 100).toFixed(0) + '%', m.status]);
  });
  exportCSV('供需对接匹配报告.csv', rows);
  showToast('对接报告已导出', 'success');
}

init();
