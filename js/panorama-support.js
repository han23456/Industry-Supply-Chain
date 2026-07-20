/**
 * 产业支撑力视图 - 集成到产业全景看板
 */

(function () {
  let supportInitialized = false;
  let currentSupportFilter = 'all';

  const services = ['金融服务', '贸易物流', '科技服务', '人力资源', '法律服务', '信息服务'];
  const industries = ['人工智能与具身智能机器人', '海洋产业', '智能终端', '低空经济', '细胞与基因', '数据产业', '信息服务', '金融服务', '贸易物流', '专业服务', '科技服务', '文体旅商'];

  const heatmapData = [
    [{ count: 85, amount: 1250, health: 106, services: 12, active: 10, status: 'strong' }, { count: 38, amount: 580, health: 65, services: 5, active: 3, status: 'normal' }, { count: 55, amount: 820, health: 88, services: 7, active: 6, status: 'strong' }, { count: 28, amount: 420, health: 35, services: 2, active: 1, status: 'weak' }, { count: 45, amount: 680, health: 78, services: 6, active: 4, status: 'normal' }, { count: 62, amount: 890, health: 95, services: 8, active: 7, status: 'strong' }, { count: 78, amount: 1120, health: 98, services: 11, active: 10, status: 'strong' }, { count: 95, amount: 1420, health: 120, services: 16, active: 15, status: 'strong' }, { count: 88, amount: 1280, health: 110, services: 14, active: 13, status: 'strong' }, { count: 45, amount: 680, health: 72, services: 6, active: 4, status: 'normal' }, { count: 42, amount: 620, health: 70, services: 5, active: 3, status: 'normal' }, { count: 35, amount: 520, health: 58, services: 4, active: 2, status: 'weak' }],
    [{ count: 72, amount: 980, health: 96, services: 10, active: 9, status: 'strong' }, { count: 28, amount: 420, health: 38, services: 2, active: 1, status: 'weak' }, { count: 48, amount: 720, health: 82, services: 7, active: 6, status: 'strong' }, { count: 35, amount: 520, health: 45, services: 3, active: 2, status: 'normal' }, { count: 58, amount: 870, health: 92, services: 8, active: 7, status: 'strong' }, { count: 32, amount: 480, health: 55, services: 4, active: 2, status: 'normal' }, { count: 65, amount: 970, health: 95, services: 9, active: 8, status: 'strong' }, { count: 82, amount: 1220, health: 105, services: 12, active: 11, status: 'strong' }, { count: 92, amount: 1380, health: 115, services: 15, active: 14, status: 'strong' }, { count: 38, amount: 580, health: 65, services: 5, active: 3, status: 'normal' }, { count: 35, amount: 520, health: 62, services: 4, active: 2, status: 'weak' }, { count: 48, amount: 720, health: 78, services: 6, active: 5, status: 'normal' }],
    [{ count: 52, amount: 780, health: 85, services: 7, active: 6, status: 'strong' }, { count: 22, amount: 320, health: 22, services: 0, active: 0, status: 'missing' }, { count: 82, amount: 1220, health: 105, services: 12, active: 11, status: 'strong' }, { count: 45, amount: 680, health: 75, services: 6, active: 4, status: 'normal' }, { count: 65, amount: 970, health: 95, services: 9, active: 8, status: 'strong' }, { count: 38, amount: 580, health: 68, services: 5, active: 3, status: 'normal' }, { count: 58, amount: 880, health: 92, services: 8, active: 7, status: 'strong' }, { count: 68, amount: 980, health: 98, services: 9, active: 8, status: 'strong' }, { count: 55, amount: 820, health: 88, services: 7, active: 6, status: 'strong' }, { count: 32, amount: 480, health: 55, services: 4, active: 2, status: 'weak' }, { count: 52, amount: 780, health: 85, services: 6, active: 5, status: 'strong' }, { count: 28, amount: 420, health: 48, services: 3, active: 2, status: 'weak' }],
    [{ count: 58, amount: 880, health: 92, services: 8, active: 7, status: 'strong' }, { count: 35, amount: 520, health: 55, services: 4, active: 2, status: 'weak' }, { count: 42, amount: 620, health: 65, services: 5, active: 3, status: 'normal' }, { count: 32, amount: 480, health: 48, services: 4, active: 2, status: 'weak' }, { count: 68, amount: 980, health: 98, services: 9, active: 8, status: 'strong' }, { count: 25, amount: 380, health: 35, services: 2, active: 1, status: 'weak' }, { count: 48, amount: 720, health: 82, services: 6, active: 5, status: 'strong' }, { count: 42, amount: 620, health: 70, services: 5, active: 3, status: 'normal' }, { count: 55, amount: 820, health: 85, services: 7, active: 6, status: 'strong' }, { count: 28, amount: 420, health: 48, services: 3, active: 2, status: 'weak' }, { count: 38, amount: 580, health: 65, services: 4, active: 3, status: 'normal' }, { count: 22, amount: 320, health: 38, services: 2, active: 1, status: 'weak' }],
    [{ count: 32, amount: 480, health: 55, services: 4, active: 2, status: 'weak' }, { count: 18, amount: 280, health: 28, services: 1, active: 0, status: 'weak' }, { count: 28, amount: 420, health: 48, services: 3, active: 2, status: 'weak' }, { count: 22, amount: 320, health: 38, services: 2, active: 1, status: 'weak' }, { count: 42, amount: 620, health: 65, services: 5, active: 3, status: 'normal' }, { count: 38, amount: 580, health: 62, services: 5, active: 3, status: 'normal' }, { count: 35, amount: 520, health: 55, services: 4, active: 2, status: 'weak' }, { count: 38, amount: 580, health: 62, services: 5, active: 3, status: 'normal' }, { count: 42, amount: 620, health: 68, services: 5, active: 3, status: 'normal' }, { count: 22, amount: 320, health: 38, services: 2, active: 1, status: 'weak' }, { count: 28, amount: 420, health: 48, services: 3, active: 2, status: 'weak' }, { count: 18, amount: 280, health: 32, services: 2, active: 1, status: 'weak' }],
    [{ count: 55, amount: 820, health: 85, services: 7, active: 6, status: 'strong' }, { count: 25, amount: 380, health: 32, services: 2, active: 1, status: 'weak' }, { count: 72, amount: 1080, health: 98, services: 10, active: 9, status: 'strong' }, { count: 55, amount: 820, health: 88, services: 7, active: 6, status: 'strong' }, { count: 48, amount: 720, health: 78, services: 6, active: 5, status: 'normal' }, { count: 35, amount: 520, health: 58, services: 4, active: 2, status: 'weak' }, { count: 62, amount: 890, health: 95, services: 8, active: 7, status: 'strong' }, { count: 55, amount: 820, health: 88, services: 7, active: 6, status: 'strong' }, { count: 68, amount: 980, health: 98, services: 9, active: 8, status: 'strong' }, { count: 35, amount: 520, health: 55, services: 4, active: 2, status: 'weak' }, { count: 45, amount: 680, health: 75, services: 5, active: 4, status: 'normal' }, { count: 32, amount: 480, health: 52, services: 4, active: 2, status: 'weak' }]
  ];

  const actions = [
    { priority: 'P1', target: '海洋产业', service: '科技服务', action: '引进海洋科研机构1家', dept: '招商局', deadline: '2026-09', status: 'pending' },
    { priority: 'P1', target: '海洋产业', service: '金融服务', action: '设立海洋产业专项基金', dept: '发改局', deadline: '2026-08', status: 'progress' },
    { priority: 'P2', target: '低空经济', service: '科技服务', action: '建设低空飞行试验场', dept: '工信局', deadline: '2026-12', status: 'pending' },
    { priority: 'P2', target: '细胞与基因', service: '科技服务', action: '建设细胞与基因中试平台', dept: '卫健局', deadline: '2026-10', status: 'done' },
    { priority: 'P3', target: '智能终端', service: '人力资源', action: '组织高端人才对接会', dept: '人社局', deadline: '2026-07', status: 'done' },
    { priority: 'P3', target: '数据产业', service: '信息服务', action: '建设数据交易平台', dept: '网信办', deadline: '2026-11', status: 'pending' },
    { priority: 'P2', target: '信息服务', service: '科技服务', action: '建设云计算数据中心', dept: '工信局', deadline: '2026-10', status: 'progress' },
    { priority: 'P1', target: '金融服务', service: '金融服务', action: '设立跨境金融服务中心', dept: '金融局', deadline: '2026-08', status: 'done' },
    { priority: 'P2', target: '贸易物流', service: '贸易物流', action: '建设智慧物流园区', dept: '交通局', deadline: '2026-11', status: 'pending' },
    { priority: 'P3', target: '专业服务', service: '法律服务', action: '引进国际仲裁机构', dept: '司法局', deadline: '2026-12', status: 'pending' },
    { priority: 'P2', target: '科技服务', service: '科技服务', action: '建设检验检测认证平台', dept: '市场监管局', deadline: '2026-09', status: 'progress' },
    { priority: 'P3', target: '文体旅商', service: '信息服务', action: '打造智慧文旅平台', dept: '文旅局', deadline: '2026-11', status: 'pending' }
  ];

  window.initSupportView = function () {
    if (supportInitialized) return;
    supportInitialized = true;
    renderDashboard();
    renderHeatmap();
    renderActions();
  };

  function renderDashboard() {
    const cells = heatmapData.flat().map((c, i) => ({ ...c, index: i, benchmark: Math.round(c.health * 1.5) }));
    const overallScore = Math.round(cells.reduce((s, c) => s + c.health, 0) / cells.length);
    const gap = cells.reduce((max, c) => c.health < max.health ? c : max, cells[0]);
    const gapSi = Math.floor(gap.index / industries.length);
    const gapIi = gap.index % industries.length;
    const potential = cells.reduce((max, c) => (c.benchmark - c.count) > (max.benchmark - max.count) ? c : max, cells[0]);
    const potSi = Math.floor(potential.index / industries.length);
    const potIi = potential.index % industries.length;

    const scoreColor = overallScore >= 80 ? 'score-green' : overallScore >= 60 ? 'score-blue' : overallScore >= 40 ? 'score-orange' : 'score-red';
    const scoreLevel = overallScore >= 80 ? '优秀' : overallScore >= 60 ? '良好' : overallScore >= 40 ? '预警' : '危险';

    const strong = cells.filter(c => c.status === 'strong').length;
    const normal = cells.filter(c => c.status === 'normal').length;
    const weak = cells.filter(c => c.status === 'weak').length;
    const missing = cells.filter(c => c.status === 'missing').length;

    const dashboard = document.getElementById('supportDashboard');
    dashboard.innerHTML = `
      <div class="dashboard-card">
        <div class="dashboard-label">整体支撑评分</div>
        <div class="dashboard-main">
          <div style="flex:1">
            <div class="dashboard-score ${scoreColor}">${overallScore}</div>
            <div style="margin-top:6px"><span class="tag ${overallScore >= 80 ? 'tag-success' : overallScore >= 60 ? 'tag-primary' : 'tag-warning'}">${scoreLevel}</span></div>
            <div class="trend trend-up">↑ 环比 +5%</div>
          </div>
          <div class="ring-wrap">
            <svg class="ring-svg" width="80" height="80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="#F0F0F0" stroke-width="8"/>
              <circle cx="40" cy="40" r="34" fill="none" stroke="${overallScore >= 80 ? '#36CFC9' : overallScore >= 60 ? '#165DFF' : overallScore >= 40 ? '#FAAD14' : '#F5222D'}" stroke-width="8" stroke-dasharray="213.6" stroke-dashoffset="${213.6 * (1 - overallScore / 100)}" stroke-linecap="round"/>
          </svg>
          <div class="ring-text" style="color:${overallScore >= 80 ? '#36CFC9' : overallScore >= 60 ? '#165DFF' : overallScore >= 40 ? '#FAAD14' : '#F5222D'}">${overallScore}%</div>
          </div>
        </div>
        <div class="dashboard-info">覆盖 ${services.length}类服务 × ${industries.length}类产业，充足 <strong>${strong}</strong> | 一般 <strong>${normal}</strong> | 薄弱 <strong>${weak}</strong> | 缺失 <strong>${missing}</strong></div>
      </div>
      <div class="dashboard-card">
        <div class="dashboard-label">最大支撑缺口 🔴</div>
        <div style="font-size:14px;font-weight:600;color:#F5222D;margin-bottom:4px">${industries[gapIi]} — ${services[gapSi]}支撑不足</div>
        <div style="font-size:12px;color:#F5222D;margin-bottom:4px">支撑得分：${gap.health}分（预期100分）</div>
        <div class="dashboard-score score-red" style="font-size:24px">${Math.round(gap.amount * 0.3)}万</div>
        <div class="dashboard-info">年外流金额估算 · 本区服务企业 <strong>${gap.services}家</strong></div>
        <div class="dashboard-actions">
          <button class="btn btn-primary btn-sm" onclick="openSupportDrawer(${gapSi}, ${gapIi})">查看缺口详情</button>
          <button class="btn btn-default btn-sm" onclick="window.location.href='enterprise-profile.html?enterpriseId=ent-net-001'">查看目标企业</button>
        </div>
      </div>
      <div class="dashboard-card">
        <div class="dashboard-label">最大提升潜力 💡</div>
        <div style="font-size:14px;font-weight:600;color:#1890FF;margin-bottom:4px">${services[potSi]} → ${industries[potIi]}</div>
        <div style="font-size:12px;color:#8C8C8C;margin-bottom:4px">当前 ${potential.count}次 / ${potential.amount}万 · 理论 ${potential.benchmark}次 / ${Math.round(potential.benchmark * 14.5)}万</div>
        <div class="dashboard-score score-blue" style="font-size:24px">+${potential.benchmark - potential.count}次（+${Math.round((potential.benchmark - potential.count) * 14.5)}万）</div>
        <div class="dashboard-info">可激活企业 <strong>${potential.services - potential.active}家</strong> · 建议组织${services[potSi]}对接会</div>
        <div class="dashboard-actions">
          <button class="btn btn-primary btn-sm" onclick="openSupportDrawer(${potSi}, ${potIi})">查看可激活企业</button>
          <button class="btn btn-default btn-sm" onclick="showToast('已发起撮合行动')">发起撮合行动</button>
        </div>
      </div>
    `;
  }

  function renderHeatmap() {
    const legend = document.getElementById('supportLegend');
    legend.innerHTML = `
      <span>图例：</span>
      <div class="legend-item"><div class="legend-dot" style="background:#096DD9"></div>充足</div>
      <div class="legend-item"><div class="legend-dot" style="background:#1890FF"></div>一般</div>
      <div class="legend-item"><div class="legend-dot" style="background:#91D5FF"></div>薄弱</div>
      <div class="legend-item"><div class="legend-dot" style="background:#F5222D"></div>缺失</div>
    `;

    const filter = document.getElementById('supportHeatmapFilter');
    filter.innerHTML = ['全部', '只看缺失 🔴', '只看薄弱 △', '只看一般', '只看充足 ✅'].map((label, i) => {
      const type = ['all', 'missing', 'weak', 'normal', 'strong'][i];
      return `<button class="filter-btn ${currentSupportFilter === type ? 'active' : ''}" onclick="filterSupportHeatmap('${type}')">${label}</button>`;
    }).join('');

    const grid = document.getElementById('supportHeatmapGrid');
    let html = '<div class="heatmap-axis-x">' + industries.map(i => `<div class="heatmap-axis-x-item">${i}</div>`).join('') + '</div>';

    heatmapData.forEach((row, si) => {
      html += '<div class="heatmap-row">';
      html += `<div class="heatmap-row-label">${services[si]}</div>`;
      row.forEach((cell, ii) => {
        const isVisible = currentSupportFilter === 'all' || cell.status === currentSupportFilter;
        const bgClass = cell.status === 'strong' ? 'bg-strong' : cell.status === 'normal' ? 'bg-normal' : cell.status === 'weak' ? 'bg-weak' : 'bg-missing';
        const fire = cell.status === 'missing' ? '<span class="cell-fire">🔴</span>' : '';
        const metrics = cell.status === 'missing'
          ? `<div>健康度：${cell.health}% ❌</div><div>本区服务：${cell.services}家 🔴</div><div class="cell-btn">查看缺口分析</div>`
          : `<div>健康度：${cell.health}% ${cell.health >= 100 ? '✅' : cell.health >= 60 ? '' : '△'}</div><div>本区服务：${cell.services}家</div><div>活跃：${cell.active}家（${cell.services ? Math.round(cell.active / cell.services * 100) : 0}%）</div>`;
        html += `
          <div class="heatmap-cell ${bgClass} ${isVisible ? '' : 'cell-muted'}" onclick="${isVisible ? `openSupportDrawer(${si}, ${ii})` : ''}">
            ${fire}
            <div class="cell-count">${cell.count}</div>
            <div class="cell-amount">${cell.amount}万</div>
            <div class="cell-metrics">${metrics}</div>
          </div>
        `;
      });
      html += '</div>';
    });
    grid.innerHTML = html;
  }

  function renderActions() {
    const statusMap = { pending: '待办', progress: '进行中', done: '已落地' };
    const statusClass = { pending: 'status-pending', progress: 'status-progress', done: 'status-done' };
    const container = document.getElementById('supportActionList');
    container.innerHTML = `
      <table class="data-table">
        <thead>
          <tr><th>优先级</th><th>目标产业</th><th>缺失服务</th><th>建议行动</th><th>责任部门</th><th>目标完成</th><th>状态</th><th>操作</th></tr>
        </thead>
        <tbody>
          ${actions.map(a => `
            <tr>
              <td><span class="tag ${a.priority === 'P1' ? 'tag-danger' : a.priority === 'P2' ? 'tag-warning' : 'tag-default'}">${a.priority}</span></td>
              <td>${a.target}</td><td>${a.service}</td><td>${a.action}</td><td>${a.dept}</td><td>${a.deadline}</td>
              <td><span class="status-tag ${statusClass[a.status]}">${statusMap[a.status]}</span></td>
              <td><button class="btn btn-default btn-sm" onclick="showToast('编辑行动')">编辑</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  window.filterSupportHeatmap = function (type) {
    currentSupportFilter = type;
    renderHeatmap();
  };

  window.openSupportDrawer = function (si, ii) {
    const service = services[si];
    const industry = industries[ii];
    const cell = heatmapData[si][ii];
    const title = `${service} ↔ ${industry} — 交互关系深度分析`;
    const content = `
      <div class="metric-cards">
        <div class="metric-card-small"><div class="metric-card-value">${cell.count}</div><div class="metric-card-label">交互频次</div></div>
        <div class="metric-card-small"><div class="metric-card-value">${cell.amount}万</div><div class="metric-card-label">交互金额</div></div>
        <div class="metric-card-small"><div class="metric-card-value">${cell.services}</div><div class="metric-card-label">关联企业</div></div>
      </div>
      <hr class="section-divider">
      <div class="drawer-section-title">支撑力健康度：${cell.health}分</div>
      <p style="font-size:12px;color:#8C8C8C;margin-bottom:12px">理论基准：${cell.benchmark}次/季度，当前${cell.count}次，缺口${Math.max(0, cell.benchmark - cell.count)}次</p>
      <hr class="section-divider">
      <div class="drawer-section-title">主要交互类型分布</div>
      <div class="bar-row"><div class="bar-label">核心服务</div><div class="bar-track"><div class="bar-fill" style="width:55%;background:#1890FF"></div></div><div class="bar-value">55%</div></div>
      <div class="bar-row"><div class="bar-label">增值服务</div><div class="bar-track"><div class="bar-fill" style="width:30%;background:#52C41A"></div></div><div class="bar-value">30%</div></div>
      <div class="bar-row"><div class="bar-label">其他</div><div class="bar-track"><div class="bar-fill" style="width:15%;background:#FA8C16"></div></div><div class="bar-value">15%</div></div>
      <hr class="section-divider">
      <div class="drawer-section-title">本区TOP5交互企业</div>
      <table class="data-table">
        <thead><tr><th>企业名称</th><th>服务类型</th><th>金额</th><th>趋势</th></tr></thead>
        <tbody>
          <tr><td>AI研究院</td><td>高端服务</td><td>120万</td><td class="trend-up">↑+20%</td></tr>
          <tr><td>B智算中心</td><td>专业服务</td><td>80万</td><td class="trend-up">↑+15%</td></tr>
          <tr><td>C产业公司</td><td>综合服务</td><td>60万</td><td>→持平</td></tr>
          <tr><td>D科技企业</td><td>高端服务</td><td>45万</td><td class="trend-up">↑+10%</td></tr>
          <tr><td>E服务公司</td><td>专业服务</td><td>30万</td><td class="trend-down">↓-5%</td></tr>
        </tbody>
      </table>
      <hr class="section-divider">
      <div class="drawer-section-title">缺口识别</div>
      <p style="font-size:13px;color:#1F2329;line-height:1.6">⚠️ ${industry}产业急需"${service}"高端服务，本区相关专业服务机构不足，企业多从外地采购，年外流约${Math.round(cell.amount * 0.3)}万。</p>
      <div class="drawer-section-title" style="margin-top:12px">提升建议</div>
      <ol style="font-size:12px;color:#595959;line-height:1.8;padding-left:18px">
        <li>引进1-2家专业${service}机构</li>
        <li>建立${industry}产业服务对接平台</li>
        <li>组织${service}专题撮合会</li>
      </ol>
    `;
    const footer = `<button class="btn btn-primary" onclick="window.location.href='enterprise-network.html'">查看全部交互企业</button><button class="btn btn-default" onclick="showToast('已加入服务提升清单','success')">加入服务提升清单</button>`;
    openDrawer(title, content, footer);
  };

  window.exportSupportActions = function () {
    const rows = [['优先级', '目标产业', '缺失服务', '建议行动', '责任部门', '目标完成', '状态']];
    actions.forEach(a => rows.push([a.priority, a.target, a.service, a.action, a.dept, a.deadline, a.status]));
    exportCSV('产业支撑力提升行动清单.csv', rows);
    showToast('行动清单已导出', 'success');
  };
})();
