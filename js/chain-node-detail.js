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
  document.getElementById('nodeDetailHead').innerHTML = renderSegmentHeadHTML(currentNode);
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

function renderNodeModulesHTML(node) {
  const stats = buildNodeDetailStats(node);
  const localBarWidth = Math.min(100, parseFloat(stats.localGrossMargin)).toFixed(0);
  const nationalBarWidth = Math.min(100, parseFloat(stats.nationalGrossMargin)).toFixed(0);
  const spatial = getStreetDistribution(node);
  const localCount = node.localCount || 0;

  return `
    <div class="node-modules-grid">
      <!-- 模块一：产业规模 -->
      <div class="node-module-card">
        <div class="node-module-header">
          <div class="node-module-title-wrap">
            <span class="node-module-bar"></span>
            <h2 class="node-module-title">模块一：产业规模</h2>
          </div>
          ${renderModuleHelpHTML([
            `本地产值：辖区${localCount}家企业工商年报主营业务收入汇总。`,
            `全国产值：基于全国${node.name}行业年报总额计算。`
          ])}
        </div>
        <div class="node-module-body">
          <div class="node-metrics-grid cols-2">
            <div class="node-metric-item">
              <p class="node-metric-label">本地总产值</p>
              <p class="node-metric-value">${stats.localOutput} <span class="node-metric-unit">亿元</span></p>
            </div>
            <div class="node-metric-item">
              <p class="node-metric-label">全国总产值</p>
              <p class="node-metric-value">${stats.nationalOutput} <span class="node-metric-unit">亿元</span></p>
            </div>
            <div class="node-metric-item">
              <p class="node-metric-label">全国产值占比</p>
              <p class="node-metric-value primary">${stats.outputShare}%</p>
            </div>
            <div class="node-metric-item">
              <p class="node-metric-label">企业节点数量</p>
              <p class="node-metric-value">${stats.enterpriseCount} <span class="node-metric-unit">家</span></p>
            </div>
          </div>
        </div>
        <div class="node-module-footer blue">
          <p class="node-ai-label">🤖 AI 汇报解读：</p>
          <p class="node-ai-text">辖区${node.name}产业产值${stats.localOutput}亿元，全国占比${stats.outputShare}%，整体产业规模处于全国中等水平，具备良好集聚成长基础。</p>
        </div>
      </div>

      <!-- 模块二：产业效益 -->
      <div class="node-module-card">
        <div class="node-module-header">
          <div class="node-module-title-wrap">
            <span class="node-module-bar"></span>
            <h2 class="node-module-title">模块二：产业效益</h2>
          </div>
          ${renderModuleHelpHTML([
            '利润与毛利率：源自企业工商年报财务表。',
            `全国对比：取同类别上市及规上企业平均毛利率（${stats.nationalGrossMargin}%）对比。`
          ])}
        </div>
        <div class="node-module-body">
          <div class="node-metrics-grid cols-2">
            <div class="node-metric-item">
              <p class="node-metric-label">辖区利润总额</p>
              <p class="node-metric-value">${stats.totalProfit} <span class="node-metric-unit">亿元</span></p>
            </div>
            <div class="node-metric-item">
              <p class="node-metric-label">平均营业利润率</p>
              <p class="node-metric-value">${stats.profitMargin}%</p>
            </div>
          </div>
          <div class="node-metric-item mt-3">
            <div class="node-comparison-header">
              <span class="node-metric-label">平均毛利率对比</span>
              <span class="node-highlight-success">+${stats.grossMarginDiff}% (高于全国)</span>
            </div>
            <div class="node-progress-row">
              <div class="node-progress-label">
                <span>本地企业平均毛利率</span>
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
        </div>
        <div class="node-module-footer green">
          <p class="node-ai-label">🤖 AI 汇报解读：</p>
          <p class="node-ai-text">辖区${node.name}产业平均毛利率达${stats.localGrossMargin}%，高于全国行业平均${stats.grossMarginDiff}个百分点，表明辖区产业规模虽小但处于高附加值高端制造环节，盈利能力强劲。</p>
        </div>
      </div>

      <!-- 模块三：创新能力 -->
      <div class="node-module-card">
        <div class="node-module-header">
          <div class="node-module-title-wrap">
            <span class="node-module-bar"></span>
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
            <span class="node-module-bar"></span>
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
            <span class="node-module-bar"></span>
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
            <span class="node-module-bar"></span>
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

  const rows = enterprises.map((e, index) => `
    <tr class="enterprise-row">
      <td class="cell-checkbox"><input type="checkbox" class="enterprise-checkbox" value="${escapeHtml(e.id)}" ${index === 0 ? 'checked' : ''} aria-label="选择 ${escapeHtml(e.name)}"></td>
      <td class="cell-rank"><span class="enterprise-rank rank-${index < 3 ? index + 1 : 'other'}" aria-label="第 ${index + 1} 名">${index + 1}</span></td>
      <td class="cell-name">
        <div class="enterprise-name">${escapeHtml(e.name)}</div>
        <div class="enterprise-code">${escapeHtml(e.credit_code)}</div>
      </td>
      <td class="cell-date">${escapeHtml(e.establishment_date)}</td>
      <td class="cell-capital"><strong>${formatNumber(e.registered_capital)}万人民币</strong></td>
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
        <span class="node-enterprise-selected" id="enterpriseSelectedCount" aria-live="polite" aria-atomic="true">已选中 <strong>1</strong> / ${enterprises.length} 家企业</span>
        <button class="btn-chain-analysis" id="chainGapBtn" type="button" aria-label="对选中企业进行强链补链分析">强链补链分析</button>
      </div>
    </div>
    <p class="node-enterprise-desc">自动筛选该子产业产值最高的前10家企业，作为强链补链分析的主角</p>
    <div class="node-enterprise-table-wrap" role="region" aria-label="核心链主企业列表，可横向滚动" tabindex="0">
      <table class="node-enterprise-table">
        <thead>
          <tr>
            <th scope="col" class="cell-checkbox"><input type="checkbox" id="selectAllEnterprises" aria-label="全选企业"></th>
            <th scope="col" class="cell-rank">排名</th>
            <th scope="col" class="cell-name">企业名称 / 统一社会信用代码</th>
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

  const selectAll = section.querySelector('#selectAllEnterprises');
  let checkboxes = section.querySelectorAll('.enterprise-checkbox');
  const selectedCountEl = section.querySelector('#enterpriseSelectedCount strong');
  const chainGapBtn = section.querySelector('#chainGapBtn');
  const retryBtn = section.querySelector('#retryEnterpriseBtn');

  function getCheckboxes() {
    checkboxes = section.querySelectorAll('.enterprise-checkbox');
    return checkboxes;
  }

  function updateSelectedCount() {
    const checked = section.querySelectorAll('.enterprise-checkbox:checked').length;
    if (selectedCountEl) selectedCountEl.textContent = checked;
  }

  function notifyNoSelection() {
    if (typeof showToast === 'function') {
      showToast('请至少选择一家企业', 'warning');
    } else {
      alert('请至少选择一家企业');
    }
  }

  function getSelectedIds() {
    return Array.from(section.querySelectorAll('.enterprise-checkbox:checked')).map(cb => cb.value);
  }

  function navigateToChainGap() {
    const selected = getSelectedIds();
    if (selected.length === 0) {
      notifyNoSelection();
      return;
    }
    const url = `chain-gap1.html?chainId=${encodeURIComponent(currentChainId)}&nodeId=${encodeURIComponent(currentNodeId)}&enterprises=${encodeURIComponent(selected.join(','))}`;
    // 保持与页面其它跳转一致的过渡体验
    window.location.href = url;
  }

  if (selectAll) {
    selectAll.addEventListener('change', () => {
      getCheckboxes().forEach(cb => { cb.checked = selectAll.checked; });
      updateSelectedCount();
    });
  }

  function onCheckboxChange() {
    const all = getCheckboxes();
    const allChecked = all.length > 0 && Array.from(all).every(c => c.checked);
    if (selectAll) selectAll.checked = allChecked;
    updateSelectedCount();
  }

  getCheckboxes().forEach(cb => {
    cb.addEventListener('change', onCheckboxChange);
  });

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

  updateSelectedCount();
}

function renderBreadcrumbWithNode(node) {
  const graphUrl = `chain-graph.html?chainId=${encodeURIComponent(currentChainId)}&nodeId=${encodeURIComponent(currentNodeId)}`;
  const container = document.getElementById('breadcrumbContainer');
  if (!container) return;
  container.innerHTML = `
    <a href="index.html">首页</a>
    <span class="sep">/</span>
    <a href="index.html">产业全景</a>
    <span class="sep">/</span>
    <a href="${graphUrl}">产业链结构图谱</a>
    <span class="sep">/</span>
    <span class="current">${node ? escapeHtml(node.name) : '产业链环节详情'}</span>
  `;
}

function bindActions() {
  const backUrl = `chain-graph.html?chainId=${encodeURIComponent(currentChainId)}&nodeId=${encodeURIComponent(currentNodeId)}`;
  const backBtns = [document.getElementById('backBtn'), document.getElementById('bottomBackBtn')];
  backBtns.forEach(btn => {
    if (!btn) return;
    btn.addEventListener('click', () => {
      window.location.href = backUrl;
    });
  });

  const networkBtn = document.getElementById('viewNetworkBtn');
  if (networkBtn) {
    networkBtn.addEventListener('click', () => {
      window.location.href = `enterprise-network.html?chainId=${encodeURIComponent(currentChainId)}&nodeId=${encodeURIComponent(currentNodeId)}`;
    });
  }

  bindEnterpriseActions();
}

function renderError(message) {
  document.title = '加载失败 - 产业链环节详情';
  const head = document.getElementById('nodeDetailHead');
  const modules = document.getElementById('nodeDetailModules');
  const enterprises = document.getElementById('nodeDetailEnterprises');
  const actions = document.getElementById('nodeDetailActions');
  if (head) head.innerHTML = `<div class="node-detail-error">${escapeHtml(message)}</div>`;
  if (modules) modules.innerHTML = '';
  if (enterprises) enterprises.innerHTML = '';
  if (actions) actions.style.display = 'none';

  const container = document.getElementById('breadcrumbContainer');
  if (container) {
    container.innerHTML = `
      <a href="index.html">首页</a>
      <span class="sep">/</span>
      <a href="index.html">产业全景</a>
      <span class="sep">/</span>
      <span class="current">产业链环节详情</span>
    `;
  }

  const backBtn = document.getElementById('backBtn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.location.href = currentChainId
        ? `chain-graph.html?chainId=${encodeURIComponent(currentChainId)}`
        : 'index.html';
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

function showLoading(show) {
  // 复用 common.js 中可能存在的全局 loading，若无则静默处理
  if (typeof window.showGlobalLoading === 'function') {
    window.showGlobalLoading(show);
  }
}

document.addEventListener('DOMContentLoaded', init);
