/**
 * 产业链环节详情页脚本
 */

let currentChainId = null;
let currentNodeId = null;
let currentFrom = null;
let currentNode = null;

function init() {
  const params = getUrlParams();
  currentChainId = params.chainId;
  currentNodeId = params.nodeId;
  currentFrom = params.from || 'chain-graph';

  if (!currentChainId || !currentNodeId) {
    renderError('缺少必要的页面参数：chainId 或 nodeId');
    return;
  }

  loadData();
  initEntranceTransition();
}

async function loadData() {
  showLoading(true);
  try {
    const categoryTree = await MockAPI.getCategoryTree(currentChainId);
    showLoading(false);

    if (!categoryTree || !categoryTree.tree) {
      renderError('未找到产业链数据');
      return;
    }

    // 方案3：详情页同样复用聚合逻辑，保证非叶子节点的状态与统计准确
    aggregateTreeNodes(categoryTree.tree);

    currentNode = findNodeInTree(categoryTree.tree, currentNodeId);
    if (!currentNode) {
      renderError(`未找到节点：${currentNodeId}`);
      return;
    }

    document.title = `${currentNode.name} - 产业链环节详情 - 产业链/供应链图谱系统`;
    await renderPage();
    bindActions();
  } catch (err) {
    showLoading(false);
    console.error('加载节点详情失败', err);
    renderError('加载节点详情失败，请稍后重试');
  }
}

async function renderPage() {
  renderBreadcrumbWithNode(currentNode);
  document.getElementById('nodeDetailHead').innerHTML = renderSegmentHeadHTML(currentNode, null, { showDashboard: true });
  document.getElementById('nodeDetailModules').innerHTML = renderNodeModulesHTML(currentNode);
  initModuleTooltips();

  const enterprisesContainer = document.getElementById('nodeDetailEnterprises');
  if (!enterprisesContainer) return;

  // 显示加载状态，优化感知性能
  enterprisesContainer.innerHTML = renderEnterpriseLoadingHTML();

  try {
    // 使用 requestAnimationFrame 让 loading 先渲染，避免大数据阻塞主线程
    await new Promise(resolve => requestAnimationFrame(resolve));
    const enterprises = await getTopEnterprises(currentNode);
    enterprisesContainer.innerHTML = renderTopEnterprisesHTML(enterprises);
    bindEnterpriseActions();
  } catch (err) {
    console.error('加载企业列表失败', err);
    enterprisesContainer.innerHTML = renderEnterpriseErrorHTML(err && err.message ? err.message : '企业列表加载失败，请稍后重试');
  }
}

function initModuleTooltips() {
  const grid = document.getElementById('nodeDetailModules');
  if (!grid) return;

  // 点击帮助按钮切换当前 tooltip；同时打开一个时关闭其它
  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('.node-module-help');
    if (!btn) return;
    e.stopPropagation();

    const wrap = btn.closest('.node-module-help-wrap');
    const tooltip = wrap ? wrap.querySelector('.node-module-tooltip') : null;
    if (!tooltip) return;

    const isVisible = tooltip.classList.contains('visible');

    // 关闭所有已打开的 tooltip
    grid.querySelectorAll('.node-module-tooltip.visible').forEach(t => t.classList.remove('visible'));
    grid.querySelectorAll('.node-module-help.active').forEach(b => b.classList.remove('active'));

    if (!isVisible) {
      tooltip.classList.add('visible');
      btn.classList.add('active');
    }
  });

  // 点击页面其它区域关闭所有 tooltip
  document.addEventListener('click', () => {
    grid.querySelectorAll('.node-module-tooltip.visible').forEach(t => t.classList.remove('visible'));
    grid.querySelectorAll('.node-module-help.active').forEach(b => b.classList.remove('active'));
  });
}

function renderModuleHelpHTML(items) {
  const listItems = items.map(item => `<li>${item}</li>`).join('');
  return `
    <div class="node-module-help-wrap">
      <button class="node-module-help" type="button" aria-label="查看指标说明">?</button>
      <div class="node-module-tooltip">
        <div class="node-module-tooltip-title">指标算法与来源：</div>
        <ul class="node-module-tooltip-list">${listItems}</ul>
      </div>
    </div>
  `;
}

function renderModulesSectionHeaderHTML() {
  return `
    <div class="node-modules-section-header">
      <div class="node-modules-section-header-main">
        <div class="node-section-icon" aria-hidden="true">
          <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 26V6"/>
            <path d="M4 22L10 16L15 20L22 10L28 14"/>
            <path d="M4 26H28"/>
          </svg>
        </div>
        <h2 class="node-section-title">产业综合运行指标与空间布局</h2>
      </div>
      <span class="node-section-range">模块一～模块六</span>
    </div>
  `;
}

function renderNodeModulesHTML(node) {
  const stats = buildNodeDetailStats(node);
  const localBarWidth = Math.min(100, parseFloat(stats.localGrossMargin)).toFixed(0);
  const nationalBarWidth = Math.min(100, parseFloat(stats.nationalGrossMargin)).toFixed(0);
  const spatial = getStreetDistribution(node);
  const localCount = node.localCount || 0;
  const national = node.nationalCount || 0;

  const coverageRate = national > 0 ? (localCount / national * 100).toFixed(1) : '0.0';

  return `
    ${renderModulesSectionHeaderHTML()}
    <div class="node-modules-grid">
      <!-- 模块一：产业竞争力 -->
      <div class="node-module-card">
        <div class="node-module-header">
          <div class="node-module-title-wrap">
            <span class="node-module-dot blue"></span>
            <h2 class="node-module-title">一、产业竞争力</h2>
          </div>
          ${renderModuleHelpHTML([
            `本区企业数：辖区${localCount}家真实存续企业。`,
            `全国企业数：基于全国${node.name}行业企业名录去重统计。`,
            `本地产值：辖区企业工商年报主营业务收入汇总。`,
            `全国产值：基于全国${node.name}行业年报总额计算。`
          ])}
        </div>
        <div class="node-module-body">
          <div class="node-overview-card">
            <div class="node-overview-label">企业数量概况</div>
            <div class="node-overview-row">
              <div class="node-overview-value">
                本区：<strong>${localCount}</strong> 家 / 全国：<span class="muted">${national}</span> 家
              </div>
              <div class="node-overview-badge blue">
                <span class="node-overview-badge-label">本区覆盖率</span>
                <span class="node-overview-badge-value">${coverageRate}%</span>
              </div>
            </div>
          </div>
          <div class="node-overview-card">
            <div class="node-overview-label">产业产值概况</div>
            <div class="node-overview-row">
              <div class="node-overview-value">
                本地：<strong>${stats.localOutput}</strong> 亿 / 全国：<span class="muted">${stats.nationalOutput}</span> 亿
              </div>
              <div class="node-overview-badge blue">
                <span class="node-overview-badge-label">本地产值占比</span>
                <span class="node-overview-badge-value">${stats.outputShare}%</span>
              </div>
            </div>
          </div>
          <div class="node-ai-conclusion">
            <svg class="node-ai-conclusion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"/>
              <path d="M9 21h6"/>
            </svg>
            <div class="node-ai-conclusion-text">
              <strong>AI 解读结论：</strong>辖区${node.name}年产值${stats.localOutput}亿元，全国占比${stats.outputShare}%。整体产业规模处于全国中等水平，具备良好集聚成长基础。
            </div>
          </div>
        </div>
      </div>

      <!-- 模块二：产业效益 -->
      <div class="node-module-card">
        <div class="node-module-header">
          <div class="node-module-title-wrap">
            <span class="node-module-dot green"></span>
            <h2 class="node-module-title">模块二：产业效益</h2>
          </div>
          ${renderModuleHelpHTML([
            '利润与毛利率：源自企业工商年报财务表。',
            `全国对比：取同类别上市及规上企业平均毛利率（${stats.nationalGrossMargin}%）对比。`
          ])}
        </div>
        <div class="node-module-body">
          <div class="node-metric-highlights">
            <div class="node-metric-highlight">
              <div class="node-metric-highlight-label">辖区利润总额</div>
              <div class="node-metric-highlight-value">${stats.totalProfit}<span class="unit">亿元</span></div>
            </div>
            <div class="node-metric-highlight green">
              <div class="node-metric-highlight-label">平均毛利率</div>
              <div class="node-metric-highlight-value">${stats.localGrossMargin}%</div>
            </div>
          </div>
          <div class="node-metric-item mt-3">
            <div class="node-comparison-header">
              <span class="node-metric-label">平均毛利率对比</span>
              <span class="node-highlight-success">+${stats.grossMarginDiff}% (高于全国)</span>
            </div>
            <div class="node-progress-row">
              <div class="node-progress-label">
                <span>本区企业平均毛利率</span>
                <span class="primary">${stats.localGrossMargin}%</span>
              </div>
              <div class="node-progress-track">
                <div class="node-progress-fill primary" style="width:${localBarWidth}%"></div>
              </div>
            </div>
            <div class="node-progress-row">
              <div class="node-progress-label">
                <span>全国行业平均毛利率</span>
                <span>${stats.nationalGrossMargin}%</span>
              </div>
              <div class="node-progress-track">
                <div class="node-progress-fill secondary" style="width:${nationalBarWidth}%"></div>
              </div>
            </div>
          </div>
          <div class="node-ai-conclusion">
            <svg class="node-ai-conclusion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"/>
              <path d="M9 21h6"/>
            </svg>
            <div class="node-ai-conclusion-text">
              <strong>AI 解读结论：</strong>辖区${node.name}产业平均毛利率达${stats.localGrossMargin}%，高于全国行业平均${stats.grossMarginDiff}个百分点，表明辖区产业规模虽小但处于高附加值高端制造环节，盈利能力强劲。
            </div>
          </div>
        </div>
      </div>

      <!-- 模块三：创新能力 -->
      <div class="node-module-card">
        <div class="node-module-header">
          <div class="node-module-title-wrap">
            <span class="node-module-dot purple"></span>
            <h2 class="node-module-title">模块三：创新能力</h2>
          </div>
          ${renderModuleHelpHTML([
            '专利数据：全量接入国家知识产权局专利库。',
            `均企专利数：辖区专利总量 ÷ 企业总数（${localCount}家）。`
          ])}
        </div>
        <div class="node-module-body">
          <div class="node-metrics-grid cols-2">
            <div class="node-metric-item">
              <p class="node-metric-label">发明专利总量</p>
              <p class="node-metric-value">${stats.inventionPatents} <span class="node-metric-unit">件</span></p>
            </div>
            <div class="node-metric-item">
              <p class="node-metric-label">高价值核心专利</p>
              <p class="node-metric-value primary">${stats.highValuePatents} <span class="node-metric-unit">件</span></p>
            </div>
          </div>
          <div class="node-innovation-box">
            <div class="node-innovation-row">
              <span class="node-metric-label">企业平均拥有发明专利</span>
              <span class="node-innovation-value">${stats.avgPatentsPerEnterprise} 件/家</span>
            </div>
            <div class="node-innovation-row secondary">
              <span>全国同行业平均水平</span>
              <span>${stats.nationalAvgPatents} 件/家</span>
            </div>
            <div class="node-innovation-row success">
              <span>创新密度超全国平均</span>
              <span>↑ ${stats.innovationDensityDiff}%</span>
            </div>
          </div>
        </div>
        <div class="node-module-footer purple">
          <p class="node-ai-label">🤖 AI 汇报解读：</p>
          <p class="node-ai-text">辖区企业平均专利申请量是行业平均水平的${(stats.avgPatentsPerEnterprise / Math.max(stats.nationalAvgPatents, 0.1)).toFixed(1)}倍，专利质量高（高价值专利${stats.highValuePatents}件），区域自主创新活力全国领先。</p>
        </div>
      </div>

      <!-- 模块四：龙头与产业集聚 -->
      <div class="node-module-card">
        <div class="node-module-header">
          <div class="node-module-title-wrap">
            <span class="node-module-dot indigo"></span>
            <h2 class="node-module-title">模块四：龙头与产业集聚</h2>
          </div>
          ${renderModuleHelpHTML([
            '数据源于工信部专精特新及行业Top100认定名册。',
            '强调代表性龙头企业在辖区的落户分布。'
          ])}
        </div>
        <div class="node-module-body">
          <div class="node-metrics-grid cols-3">
            <div class="node-metric-item center">
              <p class="node-metric-label">上市企业</p>
              <p class="node-metric-value">${stats.listedCompanies} <span class="node-metric-unit">家</span></p>
            </div>
            <div class="node-metric-item center">
              <p class="node-metric-label">专精特新</p>
              <p class="node-metric-value primary">${stats.specialized} <span class="node-metric-unit">家</span></p>
            </div>
            <div class="node-metric-item center">
              <p class="node-metric-label">单项冠军</p>
              <p class="node-metric-value warning">${stats.singleChampions} <span class="node-metric-unit">家</span></p>
            </div>
          </div>
          <div class="node-metric-item mt-3">
            <div class="node-innovation-row">
              <span class="node-metric-label">全国 Top100 企业总部及重点子公司</span>
              <span class="node-metric-value">${stats.top100National} 家</span>
            </div>
            <div class="node-innovation-row">
              <span class="node-metric-label">Top100 本地落户占比</span>
              <span class="primary">${stats.top100LocalRatio}%</span>
            </div>
          </div>
        </div>
        <div class="node-module-footer indigo">
          <p class="node-ai-label">🤖 AI 汇报解读：</p>
          <p class="node-ai-text">全国Top100龙头企业总部及重点子公司${stats.top100National}家（占比${stats.top100LocalRatio}%），叠加单项冠军与专精特新梯队，产业龙头支撑力极强。</p>
        </div>
      </div>

      <!-- 模块五：政策扶持落地 -->
      <div class="node-module-card">
        <div class="node-module-header">
          <div class="node-module-title-wrap">
            <span class="node-module-dot amber"></span>
            <h2 class="node-module-title">模块五：政策扶持落地</h2>
          </div>
          ${renderModuleHelpHTML([
            '数据源自政府查册网及拟奖补资金公示数据库。',
            '统计近三年企业实际申请并拿到的奖补资金额。'
          ])}
        </div>
        <div class="node-module-body">
          <div class="node-highlight-box amber">
            <p class="node-highlight-label">近三年累计获得财政补贴金额</p>
            <p class="node-highlight-value">${formatNumber(stats.subsidyAmount)} <span class="node-metric-unit">万元</span></p>
          </div>
          <div class="node-metrics-grid cols-2">
            <div class="node-metric-item">
              <span class="node-metric-label">获得奖补企业数</span>
              <span class="node-metric-value block">${stats.subsidizedEnterprises} 家 (占比${stats.subsidizedRatio}%)</span>
            </div>
            <div class="node-metric-item">
              <span class="node-metric-label">涉及兑现政策数</span>
              <span class="node-metric-value block">${stats.policyCount} 项</span>
            </div>
          </div>
        </div>
        <div class="node-module-footer amber">
          <p class="node-ai-label">🤖 AI 汇报解读：</p>
          <p class="node-ai-text">近三年累计${stats.subsidizedRatio}%的本地企业精准享受政策红利，共获得奖补${formatNumber(stats.subsidyAmount)}万元，涉及${stats.policyCount}项专项政策，政府扶持撬动成效显著。</p>
        </div>
      </div>

      <!-- 模块六：空间布局与载体 -->
      <div class="node-module-card module-spatial">
        <div class="node-module-header">
          <div class="node-module-title-wrap">
            <span class="node-module-dot gray"></span>
            <h2 class="node-module-title">模块六：空间布局与载体</h2>
          </div>
          ${renderModuleHelpHTML([
            '街道企业分布：基于工商注册地址与辖区行政区划边界进行空间匹配。',
            '集聚度计算：Top1/Top3街道企业数占辖区该产业总企业数比例。',
            '数据来源：企业工商登记注册地址、国家统计局行政区划数据。'
          ])}
        </div>
        <div class="node-module-body">
          <div class="spatial-ranking-section">
            <div class="spatial-ranking-header">
              <div class="spatial-ranking-title">
                <span>辖区街道企业分布 TOP 3 榜单</span>
              </div>
              <div class="spatial-ranking-total">辖区该产业总企业数：${spatial.total} 家</div>
            </div>
            <div class="spatial-ranking-list">
              ${spatial.ranking.map((item, index) => `
                <div class="spatial-ranking-item">
                  <div class="spatial-rank-badge rank-${index + 1}">${index + 1}</div>
                  <div class="spatial-rank-info">
                    <div class="spatial-rank-name">${item.name}</div>
                    <div class="spatial-rank-district">${item.district}</div>
                  </div>
                  <div class="spatial-rank-density">
                    <div class="spatial-density-header">
                      <span class="spatial-density-label">分布密度</span>
                      <span class="spatial-density-percent">${item.ratio}%</span>
                    </div>
                    <div class="spatial-density-bar">
                      <div class="spatial-density-fill" style="width:${item.ratio}%"></div>
                    </div>
                  </div>
                  <div class="spatial-rank-percent">${item.ratio}%</div>
                  <div class="spatial-rank-count">${item.count} <span>家</span></div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        <div class="node-module-footer gray spatial-footer">
          <div class="spatial-ai-header">
            <span class="node-ai-label">🤖 AI 智能智能分析解读</span>
            <span class="spatial-ai-source">基于工商注册地址聚合生成</span>
          </div>
          <p class="node-ai-text">产业企业在空间分布上呈现明显的集中态势。其中，<strong>${spatial.top1Street.name}</strong>为核心集聚主阵地，共集中企业 <strong>${spatial.top1Street.count} 家</strong>，集聚度达 <strong>${spatial.top1Ratio}%</strong>。Top 3 街道（${spatial.ranking.map(i => i.name).join('、')}）合计占比 <strong>${spatial.top3Ratio}%</strong>，形成良好的区域板块联动效应。</p>
        </div>
      </div>
    </div>
  `;
}

function getStreetDistribution(node) {
  const streets = [
    { name: '粤海街道', district: '辖区行政区划' },
    { name: '南山街道', district: '辖区行政区划' },
    { name: '西丽街道', district: '辖区行政区划' },
    { name: '桃源街道', district: '辖区行政区划' },
    { name: '蛇口街道', district: '辖区行政区划' },
    { name: '招商街道', district: '辖区行政区划' },
    { name: '沙河街道', district: '辖区行政区划' },
    { name: '南头街道', district: '辖区行政区划' }
  ];

  const total = Math.max(node.localCount || 20, 6);
  const seed = Math.abs(hashCode(node.id || node.name));

  // 基于节点特征生成前三街道分布：Top1 占 35-55%，Top2 占 15-28%，Top3 占 8-18%
  const top1RatioSeed = 35 + (seed % 21);
  const top2RatioSeed = 15 + ((seed >> 4) % 14);
  const top3RatioSeed = 8 + ((seed >> 8) % 11);

  let top1Count = Math.max(1, Math.round(total * top1RatioSeed / 100));
  let top2Count = Math.max(1, Math.round(total * top2RatioSeed / 100));
  let top3Count = Math.max(1, Math.round(total * top3RatioSeed / 100));

  // 防止前三企业数超过辖区总数
  if (top1Count + top2Count + top3Count > total) {
    top3Count = Math.max(1, total - top1Count - top2Count);
  }

  const ranking = [
    { ...streets[0], count: top1Count },
    { ...streets[1], count: top2Count },
    { ...streets[2], count: top3Count }
  ];

  ranking.forEach(item => {
    item.ratio = total > 0 ? Math.round(item.count / total * 100) : 0;
  });

  return {
    total,
    top1Street: ranking[0],
    top1Ratio: ranking[0].ratio,
    top3Ratio: ranking.reduce((sum, item) => sum + item.ratio, 0),
    ranking
  };
}

async function getTopEnterprises(node) {
  if (!node) {
    throw new Error('节点数据缺失，无法生成企业列表');
  }

  // 模拟异步数据获取，便于后续接入真实接口
  await new Promise(resolve => setTimeout(resolve, 120));

  try {
    // 优先取节点关联企业，不足时从 ALL_ENTERPRISES 补充
    let sourceList = [];
    const nodeEnterprises = (typeof MOCK_ENTERPRISES !== 'undefined' && MOCK_ENTERPRISES[node.id]) || [];

    if (nodeEnterprises.length > 0) {
      sourceList = nodeEnterprises.filter(e => !e.placeholder).map(e => {
        const real = (typeof ALL_ENTERPRISES !== 'undefined' && ALL_ENTERPRISES.find(ent => ent.id === e.id)) || {};
        return buildEnterpriseListItem(real, e);
      }).filter(Boolean);
    }

    // 补充至 10 家
    if (sourceList.length < 10 && typeof ALL_ENTERPRISES !== 'undefined' && ALL_ENTERPRISES.length > 0) {
      const seed = Math.abs(hashCode(node.id || node.name));
      const pool = ALL_ENTERPRISES.filter(e => !sourceList.some(s => s.id === e.id));
      const needed = 10 - sourceList.length;
      for (let i = 0; i < needed; i++) {
        const idx = (seed + i * 7) % Math.max(pool.length, 1);
        const ent = pool[idx];
        if (!ent) continue;
        const item = buildEnterpriseListItem(ent);
        if (item && !sourceList.some(s => s.id === item.id)) {
          sourceList.push(item);
        }
      }
    }

    // 按产值规模降序，产值相同则按 ID 字典序升序，确保排序稳定
    sourceList.sort((a, b) => {
      const diff = b.annual_revenue - a.annual_revenue;
      if (Math.abs(diff) > 1e-6) return diff;
      return String(a.id).localeCompare(String(b.id));
    });
    return sourceList.slice(0, 10);
  } catch (err) {
    console.error('生成 Top10 企业列表失败', err);
    throw new Error('生成企业列表时发生错误');
  }
}

function buildEnterpriseListItem(ent, fallback = {}) {
  if (!ent || !ent.id) return null;
  // 使用企业 ID 生成确定性种子，确保每次刷新数据一致（复用公共 seededRandom）
  const seed = hashCode(ent.id);
  const rand = typeof seededRandom === 'function' ? seededRandom(seed) : () => 0.5;
  const rnd = (min = 0, max = 1) => min + rand() * (max - min);
  const rndInt = (min, max) => min + Math.floor(rand() * (max - min + 1));

  const revenue = ent.annual_revenue || fallback.annual_revenue || rnd(0.5, 50.5);
  const registeredCapital = ent.registered_capital || rndInt(500, 50500);
  const establishDate = ent.establishment_date || `${2000 + rndInt(0, 23)}-${String(rndInt(1, 12)).padStart(2, '0')}-${String(rndInt(1, 28)).padStart(2, '0')}`;
  const creditCode = ent.credit_code || `91440300${Math.floor(rand() * 1e12).toString().padStart(12, '0')}`;
  const address = ent.register_address || fallback.address || '深圳市南山区高新技术产业区';

  return {
    id: ent.id,
    name: ent.name || fallback.name || '未知企业',
    annual_revenue: parseFloat(revenue),
    registered_capital: registeredCapital,
    establishment_date: establishDate,
    credit_code: creditCode,
    register_address: address
  };
}

function renderTopEnterprisesHTML(enterprises) {
  if (!Array.isArray(enterprises) || enterprises.length === 0) {
    return renderEnterpriseEmptyHTML();
  }

  const allIds = enterprises.map(e => e.id).join(',');

  const rows = enterprises.map((e, index) => `
    <tr class="enterprise-row">
      <td class="cell-rank"><span class="enterprise-rank rank-${index < 3 ? index + 1 : 'other'}" aria-label="第 ${index + 1} 名">${index + 1}</span></td>
      <td class="cell-name">
        <div class="enterprise-name">${escapeHtml(e.name)}</div>
        <div class="enterprise-code">${escapeHtml(e.credit_code)}</div>
      </td>
      <td class="cell-output">
        <strong>${formatNumber(e.annual_revenue)}</strong><span class="node-metric-unit">亿元</span>
      </td>
      <td class="cell-date">${escapeHtml(e.establishment_date)}</td>
      <td class="cell-capital"><strong>${formatNumber(e.registered_capital)}</strong><span class="node-metric-unit">万人民币</span></td>
      <td class="cell-address">${escapeHtml(e.register_address)}</td>
    </tr>
  `).join('');

  return `
    <div class="node-enterprise-header">
      <div class="node-enterprise-title-wrap">
        <span class="node-module-bar"></span>
        <div>
          <h2 class="node-enterprise-title">辖区核心链主企业列表 (Top 10)</h2>
          <p class="node-enterprise-subtitle">按辖区产值规模排序</p>
        </div>
      </div>
      <div class="node-enterprise-actions">
        <button class="btn-chain-analysis" id="chainGapBtn" type="button" aria-label="对全部 Top10 企业进行强链补链分析" data-all-ids="${escapeHtml(allIds)}">强链补链分析</button>
      </div>
    </div>
    <p class="node-enterprise-desc">自动筛选该子产业产值最高的前10家企业，作为强链补链分析的主角</p>
    <div class="node-enterprise-table-wrap" role="region" aria-label="核心链主企业列表，可横向滚动" tabindex="0">
      <table class="node-enterprise-table">
        <thead>
          <tr>
            <th scope="col" class="cell-rank">排名</th>
            <th scope="col" class="cell-name">企业名称 / 统一社会信用代码</th>
            <th scope="col" class="cell-output">年产值</th>
            <th scope="col" class="cell-date">成立日期</th>
            <th scope="col" class="cell-capital">注册资本</th>
            <th scope="col" class="cell-address">注册地址</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  `;
}

function renderEnterpriseLoadingHTML() {
  return `
    <div class="node-enterprise-header">
      <div class="node-enterprise-title-wrap">
        <span class="node-module-bar"></span>
        <div>
          <h2 class="node-enterprise-title">辖区核心链主企业列表 (Top 10)</h2>
          <p class="node-enterprise-subtitle">按辖区产值规模排序</p>
        </div>
      </div>
    </div>
    <div class="node-enterprise-loading" role="status" aria-live="polite" aria-label="企业列表加载中">
      正在加载企业数据，请稍候…
    </div>
  `;
}

function renderEnterpriseErrorHTML(message) {
  return `
    <div class="node-enterprise-header">
      <div class="node-enterprise-title-wrap">
        <span class="node-module-bar"></span>
        <div>
          <h2 class="node-enterprise-title">辖区核心链主企业列表 (Top 10)</h2>
          <p class="node-enterprise-subtitle">按辖区产值规模排序</p>
        </div>
      </div>
    </div>
    <div class="node-enterprise-error" role="alert" aria-live="assertive">
      <div>⚠️ ${escapeHtml(message)}</div>
      <button class="btn btn-primary" id="retryEnterpriseBtn" type="button">重新加载</button>
    </div>
  `;
}

function renderEnterpriseEmptyHTML() {
  return `
    <div class="node-enterprise-header">
      <div class="node-enterprise-title-wrap">
        <span class="node-module-bar"></span>
        <div>
          <h2 class="node-enterprise-title">辖区核心链主企业列表 (Top 10)</h2>
          <p class="node-enterprise-subtitle">按辖区产值规模排序</p>
        </div>
      </div>
    </div>
    <div class="node-enterprise-empty" role="status" aria-live="polite">
      暂无相关企业数据
    </div>
  `;
}

function bindEnterpriseActions() {
  const section = document.getElementById('nodeDetailEnterprises');
  if (!section) return;

  const chainGapBtn = section.querySelector('#chainGapBtn');
  const retryBtn = section.querySelector('#retryEnterpriseBtn');

  function navigateToChainGap() {
    const allIds = chainGapBtn ? chainGapBtn.getAttribute('data-all-ids') : '';
    if (!allIds) {
      if (typeof showToast === 'function') {
        showToast('暂无企业可分析', 'warning');
      } else {
        alert('暂无企业可分析');
      }
      return;
    }
    const params = new URLSearchParams();
    params.set('chainId', currentChainId);
    params.set('nodeId', currentNodeId);
    if (currentNode && currentNode.name) params.set('nodeName', currentNode.name);
    const chainData = (typeof CHAIN_INDUSTRY_DATA !== 'undefined' && CHAIN_INDUSTRY_DATA[currentChainId]) ? CHAIN_INDUSTRY_DATA[currentChainId] : null;
    const chainName = chainData && chainData.name ? chainData.name : (typeof currentChainId === 'string' && currentChainId ? currentChainId : '');
    if (chainName) params.set('chainName', chainName);
    params.set('enterprises', allIds);
    const url = `chain-gap1.html?${params.toString()}`;
    // 保持与页面其它跳转一致的过渡体验
    window.location.href = url;
  }

  if (chainGapBtn) {
    chainGapBtn.addEventListener('click', navigateToChainGap);
    chainGapBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        navigateToChainGap();
      }
    });
  }

  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      renderPage();
    });
  }
}

function renderBreadcrumbWithNode(node) {
  renderGlobalBreadcrumb('breadcrumbContainer', {
    chainId: currentChainId,
    nodeId: currentNodeId,
    currentLabel: node ? node.name : '产业链环节详情'
  });
}

function bindActions() {
  const networkBtn = document.getElementById('viewNetworkBtn');
  if (networkBtn) {
    networkBtn.addEventListener('click', () => {
      window.location.href = `enterprise-network.html?chainId=${encodeURIComponent(currentChainId)}&nodeId=${encodeURIComponent(currentNodeId)}`;
    });
  }

  bindEnterpriseActions();
  bindEnterpriseModalEvents();
  bindEnterpriseFormEvents();
  bindConfirmModalEvents();
}

function renderError(message) {
  document.title = '加载失败 - 产业链环节详情';
  const head = document.getElementById('nodeDetailHead');
  const modules = document.getElementById('nodeDetailModules');
  const enterprises = document.getElementById('nodeDetailEnterprises');
  if (head) head.innerHTML = `<div class="node-detail-error">${escapeHtml(message)}</div>`;
  if (modules) modules.innerHTML = '';
  if (enterprises) enterprises.innerHTML = '';

  const container = document.getElementById('breadcrumbContainer');
  if (container) {
    renderGlobalBreadcrumb('breadcrumbContainer', {
      chainId: currentChainId,
      nodeId: currentNodeId,
      currentLabel: '产业链环节详情'
    });
  }
}

function initEntranceTransition() {
  const overlay = document.getElementById('pageTransitionOverlay');
  if (!overlay) return;
  // 只有从其它页面跳转过来时才播放入场遮罩，直接访问 URL 时不出现白色闪屏
  const hasTransitionContext = currentFrom || document.referrer;
  if (!hasTransitionContext) {
    overlay.style.display = 'none';
    return;
  }
  overlay.classList.add('enter');
  setTimeout(() => {
    overlay.classList.remove('enter');
  }, 50);
  setTimeout(() => {
    overlay.style.opacity = '0';
  }, 80);
  setTimeout(() => {
    overlay.style.display = 'none';
  }, 380);
}

/* ================== 本地企业明细清单弹窗 ================== */

const EM_PAGE_SIZE = 10;
let emEnterprises = [];
let emCurrentPage = 1;
let emSearchQuery = '';
let emScaleFilter = '';
let emYearFilter = '';
let emDeleteTargetId = null;

const EM_SCALE_LABELS = {
  large: '大型企业',
  medium: '中型企业',
  small: '小型企业',
  micro: '微型企业'
};

function getEMStorageKey() {
  return `chain_node_em_${currentChainId}_${currentNodeId}`;
}

function generateModalEnterprise(seedBase, index) {
  const seed = Math.abs(hashCode(`${currentNodeId}_${seedBase}_${index}`));
  const rand = seededRandom(seed);
  const rnd = (min = 0, max = 1) => min + rand() * (max - min);
  const rndInt = (min, max) => min + Math.floor(rand() * (max - min + 1));

  const scales = ['large', 'medium', 'small', 'micro'];
  const scaleWeights = [0.1, 0.25, 0.4, 0.25];
  let scale = scales[scales.length - 1];
  let r = rand();
  let cumulative = 0;
  for (let i = 0; i < scales.length; i++) {
    cumulative += scaleWeights[i];
    if (r <= cumulative) {
      scale = scales[i];
      break;
    }
  }

  const year = 1995 + rndInt(0, 28);
  const month = String(rndInt(1, 12)).padStart(2, '0');
  const day = String(rndInt(1, 28)).padStart(2, '0');
  const employeesByScale = { large: [1000, 5000], medium: [300, 1000], small: [50, 300], micro: [5, 50] };
  const [empMin, empMax] = employeesByScale[scale];
  const employees = rndInt(empMin, empMax);
  const revenue = (rnd(0.1, 8.0) * (scale === 'large' ? 3 : scale === 'medium' ? 1.5 : 1)).toFixed(2);

  const prefixes = ['深圳', '广东', '华南', '创新', '高新', '智汇', '云联', '锐科', '博远', '新能'];
  const suffixes = ['科技有限公司', '股份有限公司', '集团有限公司', '实业有限公司', '智能科技有限公司'];
  const prefix = prefixes[rndInt(0, prefixes.length - 1)];
  const suffix = suffixes[rndInt(0, suffixes.length - 1)];
  const serial = String(rndInt(100, 999));
  const name = `${prefix}${currentNode ? currentNode.name.slice(0, 4) : ''}${serial}${suffix}`;

  const creditCode = `${String.fromCharCode(65 + rndInt(0, 25))}${String.fromCharCode(65 + rndInt(0, 25))}${String(rndInt(100000000, 999999999)).padStart(9, '0')}${String(rndInt(10000000, 99999999))}`;

  return {
    id: `em_${currentChainId}_${currentNodeId}_${seedBase}_${index}`,
    name,
    credit_code: creditCode,
    industry: currentNode ? currentNode.name : '未分类',
    scale,
    establishment_date: `${year}-${month}-${day}`,
    employees,
    annual_revenue: parseFloat(revenue),
    register_address: '深圳市南山区高新技术产业区'
  };
}

function loadModalEnterprises() {
  const count = currentNode ? (currentNode.localCount || 0) : 0;
  const storageKey = getEMStorageKey();
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        emEnterprises = parsed;
        return;
      }
    }
  } catch (err) {
    console.warn('读取本地企业缓存失败', err);
  }

  // 优先复用节点已有企业数据
  let list = [];
  const nodeEnterprises = (typeof MOCK_ENTERPRISES !== 'undefined' && MOCK_ENTERPRISES[currentNodeId]) || [];
  if (nodeEnterprises.length > 0) {
    list = nodeEnterprises.filter(e => !e.placeholder).map((e, idx) => {
      const real = (typeof ALL_ENTERPRISES !== 'undefined' && ALL_ENTERPRISES.find(ent => ent.id === e.id)) || {};
      const seed = hashCode(e.id || idx);
      const rand = seededRandom(seed);
      const rnd = (min = 0, max = 1) => min + rand() * (max - min);
      const rndInt = (min, max) => min + Math.floor(rand() * (max - min + 1));
      return {
        id: e.id,
        name: real.name || e.name || '未知企业',
        credit_code: real.credit_code || `${String.fromCharCode(65 + rndInt(0, 25))}${String.fromCharCode(65 + rndInt(0, 25))}${String(rndInt(100000000, 999999999)).padStart(9, '0')}${String(rndInt(10000000, 99999999))}`,
        industry: currentNode ? currentNode.name : '未分类',
        scale: ['large', 'medium', 'small', 'micro'][rndInt(0, 3)],
        establishment_date: real.establishment_date || `${2000 + rndInt(0, 23)}-${String(rndInt(1, 12)).padStart(2, '0')}-${String(rndInt(1, 28)).padStart(2, '0')}`,
        employees: rndInt(10, 2000),
        annual_revenue: parseFloat(real.annual_revenue || e.annual_revenue || rnd(0.5, 50.5)),
        register_address: real.register_address || '深圳市南山区高新技术产业区'
      };
    }).filter(Boolean);
  }

  // 补充至本地企业数
  const seedBase = Math.abs(hashCode(currentNodeId || 'default'));
  while (list.length < count) {
    list.push(generateModalEnterprise(seedBase, list.length));
  }
  emEnterprises = list.slice(0, count);
  saveModalEnterprises();
}

function saveModalEnterprises() {
  try {
    localStorage.setItem(getEMStorageKey(), JSON.stringify(emEnterprises));
  } catch (err) {
    console.warn('保存本地企业缓存失败', err);
  }
}

function getFilteredEnterprises() {
  const q = emSearchQuery.trim().toLowerCase();
  return emEnterprises.filter(e => {
    const matchesSearch = !q ||
      (e.name && e.name.toLowerCase().includes(q)) ||
      (e.credit_code && e.credit_code.toLowerCase().includes(q)) ||
      (e.industry && e.industry.toLowerCase().includes(q));
    const matchesScale = !emScaleFilter || e.scale === emScaleFilter;
    let matchesYear = true;
    if (emYearFilter && e.establishment_date) {
      const year = parseInt(e.establishment_date.split('-')[0], 10);
      switch (emYearFilter) {
        case 'before2000': matchesYear = year < 2000; break;
        case '2000-2010': matchesYear = year >= 2000 && year <= 2010; break;
        case '2010-2020': matchesYear = year >= 2010 && year <= 2020; break;
        case 'after2020': matchesYear = year > 2020; break;
      }
    }
    return matchesSearch && matchesScale && matchesYear;
  });
}

function openEnterpriseModal() {
  loadModalEnterprises();
  emCurrentPage = 1;
  emSearchQuery = '';
  emScaleFilter = '';
  emYearFilter = '';

  const searchInput = document.getElementById('enterpriseModalSearch');
  const scaleFilter = document.getElementById('enterpriseModalScaleFilter');
  const yearFilter = document.getElementById('enterpriseModalYearFilter');
  if (searchInput) searchInput.value = '';
  if (scaleFilter) scaleFilter.value = '';
  if (yearFilter) yearFilter.value = '';

  renderEnterpriseModal();
  const overlay = document.getElementById('enterpriseModalOverlay');
  if (overlay) {
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
}

function closeEnterpriseModal() {
  const overlay = document.getElementById('enterpriseModalOverlay');
  if (overlay) {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

function renderEnterpriseModal() {
  const filtered = getFilteredEnterprises();
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / EM_PAGE_SIZE));
  if (emCurrentPage > totalPages) emCurrentPage = totalPages;
  if (emCurrentPage < 1) emCurrentPage = 1;
  const start = (emCurrentPage - 1) * EM_PAGE_SIZE;
  const pageItems = filtered.slice(start, start + EM_PAGE_SIZE);

  const tbody = document.getElementById('enterpriseModalTableBody');
  const stats = document.getElementById('enterpriseModalStats');
  const pagination = document.getElementById('enterpriseModalPagination');

  if (stats) {
    const totalEmployees = emEnterprises.reduce((sum, e) => sum + (parseInt(e.employees, 10) || 0), 0);
    const totalRevenue = emEnterprises.reduce((sum, e) => sum + (parseFloat(e.annual_revenue) || 0), 0);
    stats.innerHTML = `
      <span>共 <strong>${emEnterprises.length}</strong> 家企业</span>
      <span>当前筛选 <strong>${total}</strong> 家</span>
      <span>从业人员合计 <strong>${formatNumber(totalEmployees)}</strong> 人</span>
      <span>年产值合计 <strong>${formatNumber(totalRevenue.toFixed(2))}</strong> 亿元</span>
    `;
  }

  if (tbody) {
    if (pageItems.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" class="enterprise-modal-empty">未找到符合条件的企业</td></tr>`;
    } else {
      tbody.innerHTML = pageItems.map(e => `
        <tr data-id="${escapeHtml(e.id)}">
          <td class="em-cell-name">${escapeHtml(e.name)}</td>
          <td class="em-cell-code">${escapeHtml(e.credit_code)}</td>
          <td class="em-cell-industry">${escapeHtml(e.industry)}</td>
          <td class="em-cell-scale">${EM_SCALE_LABELS[e.scale] || escapeHtml(e.scale)}</td>
          <td class="em-cell-date">${escapeHtml(e.establishment_date)}</td>
          <td class="em-cell-employees">${formatNumber(e.employees)}</td>
          <td class="em-cell-revenue">${formatNumber(parseFloat(e.annual_revenue).toFixed(2))}</td>
          <td class="em-cell-actions">
            <button class="enterprise-modal-action enterprise-modal-action--edit" data-action="edit" type="button">编辑</button>
            <button class="enterprise-modal-action enterprise-modal-action--delete" data-action="delete" type="button">删除</button>
          </td>
        </tr>
      `).join('');
    }
  }

  if (pagination) {
    pagination.innerHTML = renderEMPagination(totalPages, emCurrentPage, total);
  }
}

function renderEMPagination(totalPages, current, total) {
  if (totalPages <= 1 && total <= EM_PAGE_SIZE) return '';
  let html = `<button class="enterprise-page-btn" data-page="prev" ${current === 1 ? 'disabled' : ''}>上一页</button>`;
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= current - 1 && i <= current + 1)) {
      html += `<button class="enterprise-page-btn ${i === current ? 'active' : ''}" data-page="${i}">${i}</button>`;
    } else if (i === current - 2 || i === current + 2) {
      html += `<span class="enterprise-page-info">…</span>`;
    }
  }
  html += `<button class="enterprise-page-btn" data-page="next" ${current === totalPages ? 'disabled' : ''}>下一页</button>`;
  html += `<span class="enterprise-page-info">第 ${current} / ${totalPages} 页，共 ${total} 条</span>`;
  return html;
}

function bindEnterpriseModalEvents() {
  const overlay = document.getElementById('enterpriseModalOverlay');
  const closeBtn = document.getElementById('enterpriseModalClose');
  const searchInput = document.getElementById('enterpriseModalSearch');
  const scaleFilter = document.getElementById('enterpriseModalScaleFilter');
  const yearFilter = document.getElementById('enterpriseModalYearFilter');
  const addBtn = document.getElementById('enterpriseModalAddBtn');
  const pagination = document.getElementById('enterpriseModalPagination');
  const tableBody = document.getElementById('enterpriseModalTableBody');

  document.addEventListener('click', (e) => {
    const metric = e.target.closest('[data-metric="local-enterprise"]');
    if (metric) {
      e.stopPropagation();
      openEnterpriseModal();
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeEnterpriseModal);
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeEnterpriseModal();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', debounce(() => {
      emSearchQuery = searchInput.value;
      emCurrentPage = 1;
      renderEnterpriseModal();
    }, 250));
  }

  if (scaleFilter) {
    scaleFilter.addEventListener('change', () => {
      emScaleFilter = scaleFilter.value;
      emCurrentPage = 1;
      renderEnterpriseModal();
    });
  }

  if (yearFilter) {
    yearFilter.addEventListener('change', () => {
      emYearFilter = yearFilter.value;
      emCurrentPage = 1;
      renderEnterpriseModal();
    });
  }

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      openEnterpriseForm();
    });
  }

  if (pagination) {
    pagination.addEventListener('click', (e) => {
      const btn = e.target.closest('.enterprise-page-btn');
      if (!btn || btn.disabled) return;
      const page = btn.dataset.page;
      const totalPages = Math.max(1, Math.ceil(getFilteredEnterprises().length / EM_PAGE_SIZE));
      if (page === 'prev') {
        emCurrentPage = Math.max(1, emCurrentPage - 1);
      } else if (page === 'next') {
        emCurrentPage = Math.min(totalPages, emCurrentPage + 1);
      } else {
        emCurrentPage = parseInt(page, 10);
      }
      renderEnterpriseModal();
    });
  }

  if (tableBody) {
    tableBody.addEventListener('click', (e) => {
      const btn = e.target.closest('.enterprise-modal-action');
      if (!btn) return;
      const row = btn.closest('tr');
      const id = row ? row.dataset.id : null;
      const action = btn.dataset.action;
      if (!id) return;
      if (action === 'edit') {
        const ent = emEnterprises.find(e => e.id === id);
        if (ent) openEnterpriseForm(ent);
      } else if (action === 'delete') {
        emDeleteTargetId = id;
        const ent = emEnterprises.find(e => e.id === id);
        openConfirmModal(`确定删除企业“${ent ? ent.name : ''}”吗？删除后不可恢复。`, () => {
          if (emDeleteTargetId) {
            emEnterprises = emEnterprises.filter(e => e.id !== emDeleteTargetId);
            saveModalEnterprises();
            updateLocalEnterpriseCount();
            renderEnterpriseModal();
            emDeleteTargetId = null;
          }
          closeConfirmModal();
          if (typeof showToast === 'function') {
            showToast('企业已删除', 'success');
          }
        });
      }
    });
  }
}

function openEnterpriseForm(ent) {
  const isEdit = !!ent;
  const overlay = document.getElementById('enterpriseFormOverlay');
  const title = document.getElementById('enterpriseFormTitle');
  const idField = document.getElementById('enterpriseFormId');
  const nameField = document.getElementById('enterpriseFormName');
  const codeField = document.getElementById('enterpriseFormCode');
  const industryField = document.getElementById('enterpriseFormIndustry');
  const scaleField = document.getElementById('enterpriseFormScale');
  const dateField = document.getElementById('enterpriseFormDate');
  const employeesField = document.getElementById('enterpriseFormEmployees');
  const revenueField = document.getElementById('enterpriseFormRevenue');
  const addressField = document.getElementById('enterpriseFormAddress');
  const errorEl = document.getElementById('enterpriseFormError');

  if (title) title.textContent = isEdit ? '编辑企业信息' : '添加企业';
  if (idField) idField.value = isEdit ? ent.id : '';
  if (nameField) nameField.value = isEdit ? ent.name : '';
  if (codeField) codeField.value = isEdit ? ent.credit_code : '';
  if (industryField) industryField.value = isEdit ? ent.industry : (currentNode ? currentNode.name : '');
  if (scaleField) scaleField.value = isEdit ? ent.scale : '';
  if (dateField) dateField.value = isEdit ? ent.establishment_date : '';
  if (employeesField) employeesField.value = isEdit ? ent.employees : '';
  if (revenueField) revenueField.value = isEdit ? ent.annual_revenue : '';
  if (addressField) addressField.value = isEdit ? (ent.register_address || '') : '';
  if (errorEl) errorEl.classList.remove('visible');

  if (overlay) {
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
  }
}

function closeEnterpriseForm() {
  const overlay = document.getElementById('enterpriseFormOverlay');
  if (overlay) {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
  }
}

function bindEnterpriseFormEvents() {
  const overlay = document.getElementById('enterpriseFormOverlay');
  const closeBtn = document.getElementById('enterpriseFormClose');
  const cancelBtn = document.getElementById('enterpriseFormCancel');
  const form = document.getElementById('enterpriseForm');

  if (closeBtn) closeBtn.addEventListener('click', closeEnterpriseForm);
  if (cancelBtn) cancelBtn.addEventListener('click', closeEnterpriseForm);
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeEnterpriseForm();
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const errorEl = document.getElementById('enterpriseFormError');
      const idField = document.getElementById('enterpriseFormId');
      const nameField = document.getElementById('enterpriseFormName');
      const codeField = document.getElementById('enterpriseFormCode');
      const industryField = document.getElementById('enterpriseFormIndustry');
      const scaleField = document.getElementById('enterpriseFormScale');
      const dateField = document.getElementById('enterpriseFormDate');
      const employeesField = document.getElementById('enterpriseFormEmployees');
      const revenueField = document.getElementById('enterpriseFormRevenue');
      const addressField = document.getElementById('enterpriseFormAddress');

      const name = (nameField ? nameField.value : '').trim();
      const code = (codeField ? codeField.value : '').trim().toUpperCase();
      const industry = (industryField ? industryField.value : '').trim();
      const scale = scaleField ? scaleField.value : '';
      const date = dateField ? dateField.value : '';
      const employees = parseInt(employeesField ? employeesField.value : '', 10);
      const revenue = parseFloat(revenueField ? revenueField.value : '');
      const address = (addressField ? addressField.value : '').trim();

      const errors = [];
      if (!name) errors.push('企业名称不能为空');
      if (!code) errors.push('统一社会信用代码不能为空');
      else if (!/^[A-Z0-9]{18}$/.test(code)) errors.push('统一社会信用代码应为18位字母或数字');
      if (!industry) errors.push('所属行业不能为空');
      if (!scale) errors.push('请选择企业规模');
      if (!date) errors.push('成立日期不能为空');
      if (isNaN(employees) || employees < 1) errors.push('从业人数应为大于0的整数');
      if (isNaN(revenue) || revenue < 0) errors.push('年产值应为非负数');

      // 统一社会信用代码唯一性校验
      const editId = idField ? idField.value : '';
      const duplicate = emEnterprises.find(e => e.credit_code === code && e.id !== editId);
      if (duplicate) errors.push(`统一社会信用代码已被企业“${duplicate.name}”使用`);

      if (errors.length > 0) {
        if (errorEl) {
          errorEl.innerHTML = errors.map(msg => `<div>${escapeHtml(msg)}</div>`).join('');
          errorEl.classList.add('visible');
        }
        return;
      }

      if (errorEl) errorEl.classList.remove('visible');

      const newEnt = {
        id: editId || `em_manual_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        name,
        credit_code: code,
        industry,
        scale,
        establishment_date: date,
        employees,
        annual_revenue: revenue,
        register_address: address || '深圳市南山区高新技术产业区'
      };

      if (editId) {
        const idx = emEnterprises.findIndex(e => e.id === editId);
        if (idx >= 0) {
          emEnterprises[idx] = newEnt;
        } else {
          emEnterprises.push(newEnt);
        }
      } else {
        emEnterprises.push(newEnt);
      }

      saveModalEnterprises();
      updateLocalEnterpriseCount();
      renderEnterpriseModal();
      closeEnterpriseForm();

      if (typeof showToast === 'function') {
        showToast(editId ? '企业信息已更新' : '企业已添加', 'success');
      }
    });
  }
}

function openConfirmModal(message, onOk) {
  const overlay = document.getElementById('enterpriseConfirmOverlay');
  const body = document.getElementById('enterpriseConfirmBody');
  const okBtn = document.getElementById('enterpriseConfirmOk');
  const cancelBtn = document.getElementById('enterpriseConfirmCancel');

  if (body) body.innerHTML = escapeHtml(message);
  if (overlay) {
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
  }

  const newOkBtn = okBtn.cloneNode(true);
  okBtn.parentNode.replaceChild(newOkBtn, okBtn);
  newOkBtn.addEventListener('click', () => {
    if (typeof onOk === 'function') onOk();
  });

  const newCancelBtn = cancelBtn.cloneNode(true);
  cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
  newCancelBtn.addEventListener('click', closeConfirmModal);
}

function closeConfirmModal() {
  const overlay = document.getElementById('enterpriseConfirmOverlay');
  if (overlay) {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
  }
}

function bindConfirmModalEvents() {
  const overlay = document.getElementById('enterpriseConfirmOverlay');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeConfirmModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const formOverlay = document.getElementById('enterpriseFormOverlay');
    const confirmOverlay = document.getElementById('enterpriseConfirmOverlay');
    const listOverlay = document.getElementById('enterpriseModalOverlay');
    if (formOverlay && formOverlay.classList.contains('active')) {
      closeEnterpriseForm();
    } else if (confirmOverlay && confirmOverlay.classList.contains('active')) {
      closeConfirmModal();
    } else if (listOverlay && listOverlay.classList.contains('active')) {
      closeEnterpriseModal();
    }
  });
}

function updateLocalEnterpriseCount() {
  if (!currentNode) return;
  currentNode.localCount = emEnterprises.length;
  const head = document.getElementById('nodeDetailHead');
  if (head) {
    head.innerHTML = renderSegmentHeadHTML(currentNode, null, { showDashboard: true });
  }
}

function debounce(fn, wait) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}

function showLoading(show) {
  // 复用 common.js 中可能存在的全局 loading，若无则静默处理
  if (typeof window.showGlobalLoading === 'function') {
    window.showGlobalLoading(show);
  }
}

document.addEventListener('DOMContentLoaded', init);
