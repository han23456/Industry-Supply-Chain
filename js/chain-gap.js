/**
 * 强链补链分析 - V1 逻辑
 */

let currentChainId = 'chain-robot';
let gapData = { completeness_score: 0, nodes: [] };
let radarChart = null;
let selectedNodeId = null;

const GAP_COLORS = {
  '严重缺失': '#F5222D',
  '轻度缺失': '#FA8C16',
  '基本覆盖': '#52C41A'
};

async function init() {
  if (document.getElementById('globalSearchContainer')) {
    document.getElementById('globalSearchContainer').innerHTML = renderGlobalSearch();
  }
  if (document.getElementById('breadcrumbContainer')) {
    document.getElementById('breadcrumbContainer').innerHTML = renderBreadcrumb('chain-gap.html');
  }
  const params = getUrlParams();
  if (params.chainId) currentChainId = params.chainId;
  if (params.category) {
    document.getElementById('chainSelect').value = currentChainId;
  }
  await runChainGapAnalysis();
  window.addEventListener('resize', debounce(() => radarChart && radarChart.resize(), 200));
}

function onChainChange() {
  currentChainId = document.getElementById('chainSelect').value;
}

async function runChainGapAnalysis() {
  gapData = await MockAPI.getChainGapAnalysis(currentChainId);
  renderScore();
  renderRadar();
  renderGapList();
}

function renderScore() {
  const score = gapData.completeness_score;
  document.getElementById('completenessScore').textContent = score + '%';
  document.getElementById('completenessScore').style.color = score >= 80 ? '#52C41A' : score >= 60 ? '#1890FF' : '#F5222D';
  document.getElementById('scoreRing').innerHTML = renderProgressRing(score, 72, 7);

  const severe = gapData.nodes.filter(n => n.gap_type === '严重缺失').length;
  const light = gapData.nodes.filter(n => n.gap_type === '轻度缺失').length;
  document.getElementById('scoreTags').innerHTML = `
    <span class="tag tag-danger">严重缺失 ${severe} 项</span>
    <span class="tag tag-warning">轻度缺失 ${light} 项</span>
    <span class="tag tag-success">基本覆盖 ${gapData.nodes.length - severe - light} 项</span>
  `;
}

function renderRadar() {
  const chartDom = document.getElementById('radarChart');
  if (!radarChart) radarChart = echarts.init(chartDom);

  const indicators = [
    { name: '核心零部件', max: 100 },
    { name: '机器人本体', max: 100 },
    { name: '集成系统', max: 100 },
    { name: '应用终端', max: 100 },
    { name: '使能技术', max: 100 },
    { name: '服务支撑', max: 100 }
  ];

  const values = [35, 68, 72, 85, 45, 55];

  radarChart.setOption({
    tooltip: {},
    radar: {
      indicator: indicators,
      radius: '60%',
      splitNumber: 4
    },
    series: [{
      type: 'radar',
      data: [{
        value: values,
        name: '本区覆盖率',
        areaStyle: { color: 'rgba(24,144,255,0.2)' },
        lineStyle: { color: '#1890FF' },
        itemStyle: { color: '#1890FF' }
      }]
    }]
  });
}

function renderGapList() {
  const list = document.getElementById('gapList');
  const sorted = gapData.nodes.sort((a, b) => b.priority_score - a.priority_score);

  list.innerHTML = sorted.map((n, i) => {
    const priority = i < 3 ? 'P1' : i < 6 ? 'P2' : 'P3';
    const cls = n.gap_type === '严重缺失' ? 'severe' : n.gap_type === '轻度缺失' ? 'light' : 'covered';
    return `
      <div class="gap-item ${cls}" onclick="selectGapNode('${n.node_id}')">
        <div class="gap-priority ${priority}">${priority}</div>
        <div class="gap-info">
          <div class="gap-name">${n.node_name}</div>
          <div class="gap-meta">
            <span class="tag ${n.gap_type === '严重缺失' ? 'tag-danger' : n.gap_type === '轻度缺失' ? 'tag-warning' : 'tag-success'}">${n.gap_type}</span>
            <span>缺口比例：${(n.gap_ratio * 100).toFixed(0)}%</span>
            <span>影响企业：${n.affected_enterprises} 家</span>
            <span>推荐企业：${n.recommended_count} 家</span>
          </div>
        </div>
        <div class="gap-score">
          <div class="gap-score-value">${(n.priority_score * 100).toFixed(0)}</div>
          <div class="gap-score-label">优先级</div>
        </div>
      </div>
    `;
  }).join('');
}

async function selectGapNode(nodeId) {
  selectedNodeId = nodeId;
  const node = gapData.nodes.find(n => n.node_id === nodeId);
  if (!node) return;

  const recommended = await MockAPI.getRecommendedEnterprises(nodeId);
  renderPlan(node, recommended);
  openRecommendDrawer(node, recommended);
}

function renderPlan(node, recommended) {
  const planCard = document.getElementById('planCard');
  planCard.style.display = 'block';
  document.getElementById('planBody').innerHTML = `
    <div class="plan-section">
      <div class="plan-section-title">现状分析：${node.node_name}</div>
      <div class="plan-section-content">
        该环节${node.gap_type === '严重缺失' ? '本区暂无企业布局' : '企业数量不足，竞争力偏弱'}，
        缺口比例达 ${(node.gap_ratio * 100).toFixed(0)}%，影响下游企业 ${node.affected_enterprises} 家。
        建议优先引进具备技术优势和产能规模的目标企业，补齐产业链短板。
      </div>
    </div>
    <div class="plan-section">
      <div class="plan-section-title">推荐目标企业（${recommended.length}）</div>
      <div class="plan-enterprise-list">
        ${recommended.slice(0, 4).map(e => `
          <div class="plan-enterprise-item">
            <span class="plan-enterprise-name">${e.enterprise_name}</span>
            <span class="plan-enterprise-score">${(e.match_score * 100).toFixed(0)}%</span>
            <button class="btn btn-text btn-sm" onclick="window.open('enterprise-profile.html?enterpriseId=${e.id}','_blank')">画像</button>
          </div>
        `).join('')}
      </div>
    </div>
    <div class="plan-section">
      <div class="plan-section-title">政策建议</div>
      <div class="plan-section-content">
        1. 设立专项产业基金，对引进企业给予固定资产投资补贴；<br>
        2. 优先保障土地/厂房资源，提供人才公寓与子女入学配套；<br>
        3. 搭建与本地龙头企业的对接平台，促成供应链合作意向。
      </div>
    </div>
    <div class="plan-section">
      <div class="plan-section-title">风险提示</div>
      <div class="plan-section-content">
        外地龙头企业落地谈判周期较长；本地同类企业可能存在同质化竞争；
        技术引进后需关注知识产权保护与人才稳定性。
      </div>
    </div>
  `;
  planCard.scrollIntoView({ behavior: 'smooth' });
}

async function openRecommendDrawer(node, recommended) {
  document.getElementById('gapDrawerTitle').textContent = node.node_name + ' - 目标企业推荐';
  document.getElementById('gapDrawerBody').innerHTML = recommended.map(e => {
    const score = e.match_score;
    const level = score >= 0.8 ? '强烈推荐' : score >= 0.6 ? '推荐' : score >= 0.4 ? '谨慎推荐' : '不推荐';
    const color = score >= 0.8 ? '#52C41A' : score >= 0.6 ? '#1890FF' : score >= 0.4 ? '#FA8C16' : '#8C8C8C';
    const feasibility = score >= 0.8 ? 0.9 : score >= 0.6 ? 0.75 : score >= 0.4 ? 0.55 : 0.3;
    return `
      <div class="recommend-card">
        <div class="recommend-header">
          <div class="recommend-logo">${e.enterprise_name.charAt(0)}</div>
          <div class="recommend-title">
            <div class="recommend-name">${e.enterprise_name}</div>
            <div class="recommend-region">📍 ${e.region} · 年营收 ${e.annual_revenue} 亿</div>
          </div>
          <div class="recommend-score">${(score * 100).toFixed(0)}%</div>
        </div>
        <div class="recommend-meta">
          <span>扩张信号：${e.expansion_signal}</span>
          <span>来源：${e.data_source}</span>
          <span>状态：${e.status}</span>
        </div>
        <div class="feasibility-bar">
          <span style="font-size:12px;color:var(--text-secondary)">落地可行性</span>
          <div class="feasibility-score"><div class="feasibility-fill" style="width:${feasibility * 100}%;background:${color}"></div></div>
          <span style="font-size:12px;color:${color};font-weight:600">${level}</span>
        </div>
        <div class="recommend-actions" style="margin-top:10px">
          <button class="btn btn-primary btn-sm" onclick="markStatus(this,'${e.id}')">标记跟进</button>
          <button class="btn btn-default btn-sm" onclick="window.open('enterprise-profile.html?enterpriseId=${e.id}','_blank')">查看画像</button>
        </div>
      </div>
    `;
  }).join('') || '<div class="empty-text">暂无推荐企业</div>';
  document.getElementById('gapDrawerFooter').innerHTML = `
    <button class="btn btn-primary" onclick="generateNodeReport()">生成专项方案</button>
    <button class="btn btn-default" onclick="closeGapDrawer()">关闭</button>
  `;
  document.getElementById('drawerOverlay').classList.add('open');
  document.getElementById('gapDrawer').classList.add('open');
}

function closeGapDrawer() {
  document.getElementById('drawerOverlay').classList.remove('open');
  document.getElementById('gapDrawer').classList.remove('open');
}

function markStatus(btn, id) {
  btn.textContent = '已跟进';
  btn.disabled = true;
  showToast('企业状态已更新为：洽谈中', 'success');
}

function resetGapFilters() {
  currentChainId = 'chain-robot';
  document.getElementById('chainSelect').value = 'chain-robot';
  document.getElementById('planCard').style.display = 'none';
  runChainGapAnalysis();
}

function generateNodeReport() {
  showToast('专项补链方案报告生成中...', 'info');
  setTimeout(() => {
    const rows = [['环节', '缺失类型', '缺口比例', '优先级', '推荐企业', '匹配度']];
    gapData.nodes.forEach(n => {
      rows.push([n.node_name, n.gap_type, (n.gap_ratio * 100).toFixed(0) + '%', (n.priority_score * 100).toFixed(0), '', '']);
    });
    exportCSV('强链补链分析报告.csv', rows);
    showToast('报告已导出', 'success');
  }, 800);
}

function generateFullReport() {
  generateNodeReport();
}

init();
