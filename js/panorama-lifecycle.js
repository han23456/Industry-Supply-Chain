/**
 * 生命周期流转视图 - 集成到产业全景看板
 */

(function () {
  let lifecycleInitialized = false;
  let sankeyChart = null;

  const stageData = {
    future: [
      { name: '量子计算', count: 3 },
      { name: '脑机接口', count: 2 },
      { name: '深海探测', count: 2 },
      { name: '人工智能', count: 178 },
      { name: '绿色低碳', count: 132 }
    ],
    emerging: [
      { name: '机器人', count: 528 },
      { name: '新能源汽车', count: 346 },
      { name: '生物医药', count: 215 },
      { name: '半导体', count: 267 },
      { name: '工业互联网', count: 289 }
    ],
    advantage: [
      { name: '先进材料', count: 198 },
      { name: '金融科技', count: 415 },
      { name: '现代物流', count: 386 },
      { name: '新材料', count: 224 },
      { name: '高端装备', count: 168 }
    ]
  };

  const flowData = [
    { from: '未来', to: '新兴', industry: '量子计算', count: 5, revenue: 8.2, driver: '政策驱动', period: 18, status: 'healthy', bottleneck: '—' },
    { from: '未来', to: '新兴', industry: '人工智能', count: 86, revenue: 42.5, driver: '市场驱动', period: 12, status: 'healthy', bottleneck: '—' },
    { from: '未来', to: '新兴', industry: '数字孪生', count: 3, revenue: 2.1, driver: '市场驱动', period: 12, status: 'healthy', bottleneck: '—' },
    { from: '新兴', to: '优势', industry: '新能源汽车', count: 8, revenue: 156, driver: '市场驱动', period: 24, status: 'healthy', bottleneck: '—' },
    { from: '新兴', to: '优势', industry: '集成电路', count: 5, revenue: 42, driver: '技术驱动', period: 36, status: 'slow', bottleneck: '企业规模偏小' },
    { from: '未来', to: '—', industry: '脑机接口', count: 0, revenue: 0, driver: '—', period: 0, status: 'stuck', bottleneck: '缺乏临床验证平台' },
    { from: '未来', to: '—', industry: '深海探测', count: 0, revenue: 0, driver: '—', period: 0, status: 'stuck', bottleneck: '缺乏深海试验场' }
  ];

  const stuckData = [
    {
      name: '脑机接口', stage: '未来产业', count: 2, duration: 4, expected: '2025Q2进入新兴', actual: '未流转',
      reasons: ['缺乏临床验证平台（本区无三甲医院神经外科）', '人才流失严重（核心团队离职率40%）', '监管政策不明确（医疗器械审批周期长）'],
      actions: ['与XX医院合作建立脑机接口临床验证中心', '设立专项人才基金，核心人才给予50万安家补贴', '协调药监局开设绿色通道']
    },
    {
      name: '深海探测', stage: '未来产业', count: 2, duration: 3, expected: '2025Q3进入新兴', actual: '未流转',
      reasons: ['缺乏深海试验场（本区无近海深水测试条件）', '设备采购成本过高（单套声呐设备超500万）', '应用场景少，订单不稳定'],
      actions: ['与海洋大学共建深海装备试验基地', '设立首台套补贴，降低企业采购成本', '对接海洋渔业、海上风电等应用场景']
    }
  ];

  window.initLifecycleView = function () {
    if (lifecycleInitialized) return;
    lifecycleInitialized = true;
    document.getElementById('lifecycleView').classList.add('lifecycle');
    renderDashboard();
    renderStuckPanel();
    renderFlowTable();
    setTimeout(renderSankey, 50);
  };

  function renderDashboard() {
    const futureTotal = stageData.future.reduce((s, i) => s + i.count, 0);
    const emergingTotal = stageData.emerging.reduce((s, i) => s + i.count, 0);
    const advantageTotal = stageData.advantage.reduce((s, i) => s + i.count, 0);
    const total = futureTotal + emergingTotal + advantageTotal;
    const futureRatio = (futureTotal / total * 100).toFixed(0);
    const emergingRatio = (emergingTotal / total * 100).toFixed(0);
    const advantageRatio = (advantageTotal / total * 100).toFixed(0);
    const healthScore = Math.round(100 - Math.abs(futureRatio - 15) * 0.5 - Math.abs(emergingRatio - 35) * 0.5 - Math.abs(advantageRatio - 50) * 0.5);

    const dashboard = document.getElementById('lifecycleDashboard');
    dashboard.innerHTML = `
      <div class="dashboard-card stage-card stage-future">
        <div class="stage-title">🚀 未来产业</div>
        <div class="stage-count">${stageData.future.length}</div>
        <div style="font-size:12px;color:#595959">占比 ${futureRatio}% · 企业数 ${futureTotal}家</div>
        <div class="stage-info">理想占比 15% · 偏差 <span style="color:${futureRatio > 15 ? '#FA8C16' : '#52C41A'};font-weight:600">${futureRatio > 15 ? '+' : ''}${(futureRatio - 15).toFixed(0)}% ${futureRatio > 15 ? '⚠️ 偏高' : '✅ 正常'}</span></div>
      </div>
      <div class="dashboard-card stage-card stage-emerging">
        <div class="stage-title">💡 新兴产业</div>
        <div class="stage-count">${stageData.emerging.length}</div>
        <div style="font-size:12px;color:#595959">占比 ${emergingRatio}% · 企业数 ${emergingTotal}家</div>
        <div class="stage-info">理想占比 35% · 偏差 <span style="color:${Math.abs(emergingRatio - 35) > 5 ? '#FA8C16' : '#52C41A'};font-weight:600">${emergingRatio > 35 ? '+' : ''}${(emergingRatio - 35).toFixed(0)}% ${Math.abs(emergingRatio - 35) > 5 ? '⚠️ 偏高' : '✅ 正常'}</span></div>
      </div>
      <div class="dashboard-card stage-card stage-traditional">
        <div class="stage-title">🏭 优势传统</div>
        <div class="stage-count">${stageData.advantage.length}</div>
        <div style="font-size:12px;color:#595959">占比 ${advantageRatio}% · 企业数 ${advantageTotal}家</div>
        <div class="stage-info">理想占比 50% · 偏差 <span style="color:${advantageRatio < 50 ? '#F5222D' : '#52C41A'};font-weight:600">${(advantageRatio - 50).toFixed(0)}% ${advantageRatio < 50 ? '🔴 偏低' : '✅ 正常'}</span></div>
      </div>
      <div class="dashboard-card health-card">
        <div class="dashboard-label">生命周期健康度</div>
        <div class="health-score">${healthScore}</div>
        <div class="ring-wrap">
          <svg class="ring-svg" width="80" height="80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="#F0F0F0" stroke-width="8"/>
            <circle cx="40" cy="40" r="34" fill="none" stroke="${healthScore >= 80 ? '#36CFC9' : healthScore >= 60 ? '#165DFF' : '#FAAD14'}" stroke-width="8" stroke-dasharray="213.6" stroke-dashoffset="${213.6 * (1 - healthScore / 100)}" stroke-linecap="round"/>
          </svg>
          <div class="ring-text" style="color:${healthScore >= 80 ? '#36CFC9' : healthScore >= 60 ? '#165DFF' : '#FAAD14'}">${healthScore}%</div>
        </div>
        <div><span class="tag ${healthScore >= 80 ? 'tag-success' : healthScore >= 60 ? 'tag-primary' : 'tag-warning'}">${healthScore >= 80 ? '橄榄型 ✅' : healthScore >= 60 ? '金字塔型 ⚠️' : '倒三角型 🔴'}</span></div>
        <div class="health-warning">${advantageRatio < 50 ? '优势传统占比偏低，需稳住基本盘' : '未来产业占比偏高，培育资源分散'}</div>
        <div class="health-suggest">建议：加速未来产业转化，加大新兴招商，稳住优势传统基本盘</div>
      </div>
    `;
  }

  function renderSankey() {
    const chartDom = document.getElementById('lifecycleSankey');
    if (!chartDom) return;
    sankeyChart = echarts.init(chartDom);
    const nodes = [
      ...stageData.future.map(i => ({ name: i.name, itemStyle: { color: '#722ED1' }, value: i.count })),
      ...stageData.emerging.map(i => ({ name: i.name, itemStyle: { color: '#165DFF' }, value: i.count })),
      ...stageData.advantage.map(i => ({ name: i.name, itemStyle: { color: '#36CFC9' }, value: i.count }))
    ];
    const links = [
      { source: '人工智能', target: '机器人', value: 45, status: '健康流转', lineStyle: { color: '#36CFC9', opacity: 0.6 } },
      { source: '人工智能', target: '新能源汽车', value: 32, status: '健康流转', lineStyle: { color: '#36CFC9', opacity: 0.6 } },
      { source: '人工智能', target: '工业互联网', value: 28, status: '健康流转', lineStyle: { color: '#36CFC9', opacity: 0.6 } },
      { source: '绿色低碳', target: '新能源汽车', value: 18, status: '健康流转', lineStyle: { color: '#36CFC9', opacity: 0.6 } },
      { source: '绿色低碳', target: '先进材料', value: 12, status: '缓慢流转', lineStyle: { color: '#FAAD14', opacity: 0.4, type: 'dashed' } },
      { source: '机器人', target: '高端装备', value: 22, status: '健康流转', lineStyle: { color: '#36CFC9', opacity: 0.6 } },
      { source: '新能源汽车', target: '金融科技', value: 15, status: '健康流转', lineStyle: { color: '#36CFC9', opacity: 0.6 } },
      { source: '半导体', target: '先进材料', value: 8, status: '缓慢流转', lineStyle: { color: '#FAAD14', opacity: 0.4, type: 'dashed' } },
      { source: '工业互联网', target: '现代物流', value: 20, status: '健康流转', lineStyle: { color: '#36CFC9', opacity: 0.6 } }
    ];
    sankeyChart.setOption({
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
        formatter: params => {
          if (params.dataType === 'node') return `${params.name}<br/>企业数：${params.value}家`;
          return `${params.data.source} → ${params.data.target}<br/>流转企业数：${params.value}家<br/>状态：${params.data.status}`;
        }
      },
      series: [{
        type: 'sankey',
        layout: 'none',
        emphasis: { focus: 'adjacency' },
        data: nodes,
        links: links,
        lineStyle: { curveness: 0.5 },
        label: { fontSize: 12, color: '#1F2329' },
        nodeWidth: 20,
        nodeGap: 16
      }]
    });
    sankeyChart.on('click', params => {
      if (params.dataType === 'node') openLifecycleDrawer(params.name);
    });
  }

  function renderStuckPanel() {
    const panel = document.getElementById('stuckPanel');
    panel.innerHTML = stuckData.map(s => `
      <div class="stuck-card">
        <div class="stuck-title">🔴 ${s.name}</div>
        <div class="stuck-info">当前阶段：${s.stage} · 企业数：${s.count}家 · 卡滞时长：${s.duration}个季度<br>预期流转：${s.expected} · 实际：${s.actual}</div>
        <div class="stuck-info" style="margin-top:8px"><strong>卡滞原因：</strong><br>${s.reasons.map((r, i) => `${i + 1}. ${r}`).join('<br>')}</div>
        <div class="stuck-info" style="margin-top:8px"><strong>建议行动：</strong><br>${s.actions.map((a, i) => `${i + 1}. ${a}`).join('<br>')}</div>
        <div class="stuck-actions">
          <button class="btn btn-primary btn-sm" onclick="showToast('制定专项培育方案')">制定专项培育方案</button>
          <button class="btn btn-default btn-sm" onclick="window.location.href='chain-gap.html'">查看全国标杆 →</button>
        </div>
      </div>
    `).join('');
  }

  function renderFlowTable() {
    const container = document.getElementById('lifecycleFlowTable');
    container.innerHTML = `
      <table class="data-table">
        <thead>
          <tr><th>转出</th><th>转入</th><th>产业</th><th>流转企业数</th><th>营收</th><th>驱动力</th><th>周期</th><th>状态</th><th>瓶颈</th><th>操作</th></tr>
        </thead>
        <tbody>
          ${flowData.map(f => `
            <tr onclick="openLifecycleDrawer('${f.industry}')">
              <td>${f.from}</td><td>${f.to}</td><td>${f.industry}</td>
              <td>${f.count}家</td><td>${f.revenue ? f.revenue + '亿' : '—'}</td><td>${f.driver}</td>
              <td>${f.period ? f.period + '月' : '—'}</td>
              <td class="status-${f.status}">${f.status === 'healthy' ? '健康 ✅' : f.status === 'slow' ? '缓慢 △' : '卡滞 ✗'}</td>
              <td>${f.bottleneck}</td>
              <td><button class="btn btn-default btn-sm" onclick="event.stopPropagation();openLifecycleDrawer('${f.industry}')">详情</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  window.openLifecycleDrawer = function (name) {
    const allIndustries = [...stageData.future, ...stageData.emerging, ...stageData.advantage];
    const info = allIndustries.find(i => i.name === name) || { name, count: 120, stage: '新兴产业' };
    const title = name + ' — 生命周期深度分析';
    const content = `
      <div style="display:flex;gap:8px;margin-bottom:12px">
        <span class="tag tag-primary">当前阶段：${info.stage}</span>
        <span class="tag tag-purple">企业数：${info.count}家</span>
      </div>
      <hr class="section-divider">
      <div class="drawer-section-title">流转历史时间轴</div>
      <div class="timeline">
        <div class="timeline-node"><div class="timeline-dot"></div><div class="timeline-label">2023Q1</div><div class="timeline-count">未来</div></div>
        <div class="timeline-line"></div>
        <div class="timeline-node"><div class="timeline-dot"></div><div class="timeline-label">2024Q1</div><div class="timeline-count">政策发布</div></div>
        <div class="timeline-line"></div>
        <div class="timeline-node"><div class="timeline-dot"></div><div class="timeline-label">2025Q1</div><div class="timeline-count">新兴</div></div>
        <div class="timeline-line"></div>
        <div class="timeline-node"><div class="timeline-dot" style="background:#FA8C16;box-shadow:0 0 0 2px #FA8C16"></div><div class="timeline-label">2026Q2</div><div class="timeline-count">优势(目标)</div></div>
      </div>
      <hr class="section-divider">
      <div class="drawer-section-title">成长驱动力分析</div>
      <div class="bar-row"><div class="bar-label">政策驱动</div><div class="bar-track"><div class="bar-fill" style="width:45%;background:#1890FF"></div></div><div class="bar-value">45%</div></div>
      <div class="bar-row"><div class="bar-label">市场驱动</div><div class="bar-track"><div class="bar-fill" style="width:30%;background:#52C41A"></div></div><div class="bar-value">30%</div></div>
      <div class="bar-row"><div class="bar-label">技术驱动</div><div class="bar-track"><div class="bar-fill" style="width:20%;background:#FA8C16"></div></div><div class="bar-value">20%</div></div>
      <div class="bar-row"><div class="bar-label">资本驱动</div><div class="bar-track"><div class="bar-fill" style="width:5%;background:#722ED1"></div></div><div class="bar-value">5%</div></div>
      <hr class="section-divider">
      <div class="drawer-section-title">代表性成长企业</div>
      <table class="data-table">
        <thead><tr><th>企业</th><th>入驻时间</th><th>营收</th><th>增速</th></tr></thead>
        <tbody>
          <tr><td>X智算</td><td>2023Q1</td><td>5.2亿</td><td class="status-healthy">↑320%</td></tr>
          <tr><td>Y大模型</td><td>2023Q2</td><td>3.8亿</td><td class="status-healthy">↑280%</td></tr>
          <tr><td>Z机器人</td><td>2024Q1</td><td>1.2亿</td><td class="status-healthy">↑150%</td></tr>
        </tbody>
      </table>
      <hr class="section-divider">
      <div class="drawer-section-title">进入下一阶段的瓶颈</div>
      <ol style="font-size:12px;color:#595959;line-height:1.8;padding-left:18px">
        <li>企业规模普遍偏小（平均营收&lt;5000万）</li>
        <li>缺乏龙头企业（最大企业营收仅5.2亿）</li>
        <li>应用场景落地慢（从实验室到商业化周期长）</li>
      </ol>
      <div class="drawer-section-title" style="margin-top:12px">加速建议</div>
      <ol style="font-size:12px;color:#595959;line-height:1.8;padding-left:18px">
        <li>重点培育1-2家龙头企业（目标营收10亿+）</li>
        <li>开放政府场景（智慧政务、智慧城市）</li>
        <li>设立AI产业基金，支持企业并购扩张</li>
      </ol>
    `;
    const footer = `<button class="btn btn-primary" onclick="window.location.href='enterprise-network.html'">查看全部成长企业</button><button class="btn btn-default" onclick="window.location.href='chain-gap.html'">制定加速培育方案</button>`;
    openDrawer(title, content, footer);
  };

  window.toggleStuckPanel = function () {
    const panel = document.getElementById('stuckPanel');
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
  };

  window.exportLifecycleFlow = function () {
    const rows = [['转出', '转入', '产业', '流转企业数', '营收', '驱动力', '周期', '状态', '瓶颈']];
    flowData.forEach(f => rows.push([f.from, f.to, f.industry, f.count, f.revenue, f.driver, f.period, f.status, f.bottleneck]));
    exportCSV('生命周期流转明细.csv', rows);
    showToast('流转明细已导出', 'success');
  };

  window.addEventListener('resize', debounce(() => sankeyChart && sankeyChart.resize(), 200));
})();
