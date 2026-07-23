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
    renderPage();
    bindActions();
  } catch (err) {
    showLoading(false);
    console.error('加载节点详情失败', err);
    renderError('加载节点详情失败，请稍后重试');
  }
}

function renderPage() {
  renderBreadcrumbWithNode(currentNode);
  document.getElementById('nodeDetailHead').innerHTML = renderSegmentHeadHTML(currentNode);
  document.getElementById('nodeDetailModules').innerHTML = renderNodeModulesHTML(currentNode);
  initModuleTooltips();
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
  const parkName = getMainParkName(node);
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
      <div class="node-module-card">
        <div class="node-module-header">
          <div class="node-module-title-wrap">
            <span class="node-module-bar"></span>
            <h2 class="node-module-title">模块六：空间布局与载体</h2>
          </div>
          ${renderModuleHelpHTML([
            '园区数据：基于各区产业园入驻企业登记信息汇总。',
            '企业分布：按工商注册地址与园区边界进行空间匹配。'
          ])}
        </div>
        <div class="node-module-body">
          <div class="node-park-card">
            <div>
              <p class="node-park-name">核心集聚园区</p>
              <p class="node-park-value">${parkName}</p>
            </div>
            <span class="node-park-tag">主阵地</span>
          </div>
          <div class="node-metrics-grid cols-2">
            <div class="node-metric-item">
              <span class="node-metric-label">园区落户企业数</span>
              <span class="node-metric-value block">${stats.parkEnterprises} 家</span>
            </div>
            <div class="node-metric-item">
              <span class="node-metric-label">辖区企业占比</span>
              <span class="node-metric-value block primary">${stats.parkEnterpriseRatio}%</span>
            </div>
          </div>
        </div>
        <div class="node-module-footer gray">
          <p class="node-ai-label">🤖 AI 汇报解读：</p>
          <p class="node-ai-text">产业企业主要集聚于${parkName}，集聚度高达${stats.parkEnterpriseRatio}%，空间物理分布高度集中，形成明显的板块联动。</p>
        </div>
      </div>
    </div>
  `;
}

function getMainParkName(node) {
  const parks = [
    '前海深港现代服务业合作区',
    '高新园区',
    '经济技术开发区',
    '智能制造产业园',
    '科技创新孵化基地',
    '数字经济产业园'
  ];
  const seed = hashCode(node.id || node.name);
  return parks[seed % parks.length];
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
    <span class="current">${node ? node.name : '产业链环节详情'}</span>
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
}

function renderError(message) {
  document.title = '加载失败 - 产业链环节详情';
  const head = document.getElementById('nodeDetailHead');
  const modules = document.getElementById('nodeDetailModules');
  const actions = document.getElementById('nodeDetailActions');
  if (head) head.innerHTML = `<div class="node-detail-error">${message}</div>`;
  if (modules) modules.innerHTML = '';
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
