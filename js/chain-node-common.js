/**
 * 产业链节点详情 - 公共逻辑
 * 供 chain-graph.js 弹窗重构后的页面跳转与 chain-node-detail.js 详情页复用
 */

function findNodeInTree(nodes, nodeId) {
  if (!nodes || !nodeId) return null;
  for (const node of nodes) {
    if (node.id === nodeId) return node;
    if (node.children && node.children.length) {
      const found = findNodeInTree(node.children, nodeId);
      if (found) return found;
    }
  }
  return null;
}

function classifyNode(node) {
  if (!node) return { key: 'broken', label: '断', color: '#9CA3AF' };
  const local = node.localCount || 0;
  const national = node.nationalCount || 0;
  if (local === 0 || node.status === 'missing') {
    return { key: 'broken', label: '断', color: '#9CA3AF' };
  }
  if (node.status === 'advantage') {
    return { key: 'advantage', label: '优', color: '#FA8C16' };
  }
  const ratio = national > 0 ? local / national : 1;
  if (ratio >= 0.005 || local >= 30) {
    return { key: 'core', label: '核', color: '#165DFF' };
  }
  return { key: 'weak', label: '弱', color: '#52C41A' };
}

function hashCode(str) {
  let h = 0;
  const s = String(str || '');
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h) + s.charCodeAt(i);
    h |= 0;
  }
  return h;
}

function escapeHtml(text) {
  if (text == null) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function seededRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function buildSegmentStats(node) {
  const local = node.localCount || 0;
  const national = node.nationalCount || 0;
  const seed = hashCode(node.id || node.name);
  const rand = seededRandom(seed);

  const localAvgRevenue = 0.5 + rand() * 2.5; // 亿/家
  const nationalAvgRevenue = 0.3 + rand() * 2.0;
  const localOutput = (local * localAvgRevenue).toFixed(1);
  const nationalOutput = (national * nationalAvgRevenue).toFixed(1);
  const outputShare = national > 0 ? ((local / national) * 100).toFixed(1) : '0.0';

  const marketShare = national > 0 ? ((local / national) * 100).toFixed(2) : '0.00';
  const completeness = Math.min(100, Math.round(45 + rand() * 50));
  const gapIndex = Math.min(100, Math.round(rand() * 100));

  const leadingEnterprises = Math.round(local * (0.05 + rand() * 0.15));
  const specializedEnterprises = Math.round(local * (0.08 + rand() * 0.20));
  const singleChampions = Math.round(local * (0.01 + rand() * 0.06));

  const top100Local = Math.min(20, Math.round(local * (0.005 + rand() * 0.03)));
  const top100National = Math.min(100, Math.round(national * (0.02 + rand() * 0.08)));

  return {
    localOutput, nationalOutput, outputShare,
    inventionPatents: Math.round(local * (0.2 + rand() * 1.5)),
    utilityModels: Math.round(local * (0.1 + rand() * 1.0)),
    softwareCopyrights: Math.round(local * (0.05 + rand() * 0.8)),
    highValuePatents: Math.round(local * (0.05 + rand() * 0.4)),
    marketShare, completeness, gapIndex,
    leadingEnterprises, specializedEnterprises, singleChampions,
    top100Local, top100National
  };
}

function renderSegmentHeadHTML(node, cfg) {
  cfg = cfg || classifyNode(node);
  const local = node.localCount || 0;
  const national = node.nationalCount || 0;
  const coverageRate = national > 0 ? (local / national * 100).toFixed(1) : '0.0';
  const countText = national > 0
    ? `本区企业数：${local} 家 / 全国企业数：${national} 家（本区覆盖率 ${coverageRate}%）`
    : `本区企业数：${local} 家`;

  return `
    <div class="node-detail-head">
      <div class="node-detail-title">
        <h1 class="node-detail-name">${node.name}</h1>
        <span class="node-detail-tag" style="background:${cfg.color}">${cfg.label}</span>
      </div>
      <div class="node-detail-meta">${countText}</div>
    </div>
  `;
}

function renderSegmentModulesHTML(node, stats) {
  stats = stats || buildSegmentStats(node);
  return `
    <div class="segment-modal-grid">
      <div class="segment-module">
        <div class="segment-module-title">① 产业产值</div>
        <div class="segment-module-body">
          <div class="segment-metric"><span class="segment-metric-label">本地总产值</span><span class="segment-metric-value">${stats.localOutput} 亿</span></div>
          <div class="segment-metric"><span class="segment-metric-label">全国总产值</span><span class="segment-metric-value">${stats.nationalOutput} 亿</span></div>
          <div class="segment-metric"><span class="segment-metric-label">本地占全国比重</span><span class="segment-metric-value">${stats.outputShare}%</span></div>
        </div>
      </div>
      <div class="segment-module">
        <div class="segment-module-title">② 专利科创</div>
        <div class="segment-module-body">
          <div class="segment-metric"><span class="segment-metric-label">发明专利</span><span class="segment-metric-value">${stats.inventionPatents} 件</span></div>
          <div class="segment-metric"><span class="segment-metric-label">实用新型</span><span class="segment-metric-value">${stats.utilityModels} 件</span></div>
          <div class="segment-metric"><span class="segment-metric-label">软著</span><span class="segment-metric-value">${stats.softwareCopyrights} 项</span></div>
          <div class="segment-metric"><span class="segment-metric-label">高价值专利</span><span class="segment-metric-value">${stats.highValuePatents} 件</span></div>
        </div>
      </div>
      <div class="segment-module">
        <div class="segment-module-title">③ 市场竞争力</div>
        <div class="segment-module-body">
          <div class="segment-metric"><span class="segment-metric-label">本地市占率</span><span class="segment-metric-value">${stats.marketShare}%</span></div>
          <div class="segment-metric"><span class="segment-metric-label">产业链完备度</span><span class="segment-metric-value">${stats.completeness}%</span></div>
          <div class="segment-metric"><span class="segment-metric-label">供需缺口指数</span><span class="segment-metric-value">${stats.gapIndex}</span></div>
        </div>
      </div>
      <div class="segment-module">
        <div class="segment-module-title">④ 龙头企业统计</div>
        <div class="segment-module-body">
          <div class="segment-metric"><span class="segment-metric-label">规上龙头</span><span class="segment-metric-value">${stats.leadingEnterprises} 家</span></div>
          <div class="segment-metric"><span class="segment-metric-label">专精特新</span><span class="segment-metric-value">${stats.specializedEnterprises} 家</span></div>
          <div class="segment-metric"><span class="segment-metric-label">单项冠军</span><span class="segment-metric-value">${stats.singleChampions} 家</span></div>
        </div>
      </div>
      <div class="segment-module segment-module-wide">
        <div class="segment-module-title">⑤ 全国Top100分布</div>
        <div class="segment-module-body">
          <div class="segment-metric"><span class="segment-metric-label">本地落地数量</span><span class="segment-metric-value">${stats.top100Local} 家</span></div>
          <div class="segment-metric"><span class="segment-metric-label">全国Top100总部</span><span class="segment-metric-value">${stats.top100National} 家</span></div>
        </div>
      </div>
    </div>
  `;
}

function renderSegmentDetailHTML(node) {
  if (!node) return '';
  const cfg = classifyNode(node);
  const stats = buildSegmentStats(node);
  return renderSegmentHeadHTML(node, cfg) + renderSegmentModulesHTML(node, stats);
}

function getNodeDetailPageUrl(chainId, nodeId, from) {
  if (!chainId || !nodeId) return '#';
  const params = new URLSearchParams();
  params.set('chainId', chainId);
  params.set('nodeId', nodeId);
  if (from) params.set('from', from);
  return `chain-node-detail.html?${params.toString()}`;
}

function navigateToNodeDetail(chainId, nodeId, event, from) {
  if (event) {
    event.stopPropagation();
    triggerPageTransition(event.target || event.srcElement);
  }
  const url = getNodeDetailPageUrl(chainId, nodeId, from);
  setTimeout(() => {
    window.location.href = url;
  }, 220);
}

function triggerPageTransition(targetEl) {
  if (!targetEl) return;
  let overlay = document.getElementById('pageTransitionOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'pageTransitionOverlay';
    overlay.className = 'page-transition-overlay';
    document.body.appendChild(overlay);
  }
  const rect = targetEl.getBoundingClientRect();
  overlay.style.left = rect.left + 'px';
  overlay.style.top = rect.top + 'px';
  overlay.style.width = rect.width + 'px';
  overlay.style.height = rect.height + 'px';
  overlay.classList.remove('active');
  // 强制重绘以触发 transition
  void overlay.offsetWidth;
  overlay.classList.add('active');
}

/**
 * 生成产业链节点详情页 6 大模块数据
 * 对应第二张原型图：产业规模、产业效益、创新能力、龙头与产业集聚、政策扶持落地、空间布局与载体
 */
function buildNodeDetailStats(node) {
  const local = node.localCount || 0;
  const national = node.nationalCount || 0;
  const seed = hashCode(node.id || node.name);
  const rand = seededRandom(seed);

  // 模块一：产业规模
  const localAvgRevenue = 0.1 + rand() * 0.4; // 亿元/家
  const nationalAvgRevenue = 0.15 + rand() * 0.5;
  const localOutput = local > 0 ? (local * localAvgRevenue).toFixed(1) : '0.0';
  const nationalOutput = national > 0 ? (national * nationalAvgRevenue).toFixed(1) : '0.0';
  const outputShare = national > 0 ? (local / national * 100).toFixed(1) : '0.0';

  // 模块二：产业效益
  const totalProfit = localOutput > 0 ? (parseFloat(localOutput) * (0.15 + rand() * 0.25)).toFixed(1) : '0.0';
  const profitMargin = (15 + rand() * 25).toFixed(1);
  const localGrossMargin = (25 + rand() * 25).toFixed(1);
  const nationalGrossMargin = Math.max(5, parseFloat(localGrossMargin) - (10 + rand() * 20)).toFixed(1);
  const grossMarginDiff = (parseFloat(localGrossMargin) - parseFloat(nationalGrossMargin)).toFixed(1);

  // 模块三：创新能力
  const inventionPatents = local > 0 ? Math.round(local * (1 + rand() * 5)) : 0;
  const highValuePatents = inventionPatents > 0 ? Math.round(inventionPatents * (0.05 + rand() * 0.2)) : 0;
  const avgPatentsPerEnterprise = local > 0 ? (inventionPatents / local).toFixed(1) : '0.0';
  const nationalAvgPatents = parseFloat(avgPatentsPerEnterprise) > 0
    ? (parseFloat(avgPatentsPerEnterprise) * (0.2 + rand() * 0.4)).toFixed(1)
    : '0.0';
  const innovationDensityDiff = parseFloat(nationalAvgPatents) > 0
    ? ((parseFloat(avgPatentsPerEnterprise) / parseFloat(nationalAvgPatents) - 1) * 100).toFixed(0)
    : '0';

  // 模块四：龙头与产业集聚
  const listedCompanies = local > 0 ? Math.min(local, Math.max(0, Math.round(local * (0.02 + rand() * 0.08)))) : 0;
  const specialized = local > 0 ? Math.min(local, Math.max(0, Math.round(local * (0.05 + rand() * 0.15)))) : 0;
  const singleChampions = local > 0 ? Math.min(local, Math.max(0, Math.round(local * (0.01 + rand() * 0.05)))) : 0;
  const top100National = national > 0 ? Math.min(100, Math.round(national * (0.02 + rand() * 0.08))) : 0;
  const top100Local = top100National > 0 ? Math.min(top100National, Math.round(top100National * (0.05 + rand() * 0.3))) : 0;
  const top100LocalRatio = national > 0 ? (top100Local / national * 100).toFixed(0) : '0';

  // 模块五：政策扶持落地
  const subsidyAmount = local > 0 ? Math.round(local * (20 + rand() * 180)) : 0;
  const subsidizedEnterprises = local > 0 ? Math.min(local, Math.round(local * (0.4 + rand() * 0.4))) : 0;
  const subsidizedRatio = local > 0 ? (subsidizedEnterprises / local * 100).toFixed(0) : '0';
  const policyCount = Math.round(5 + rand() * 20);

  // 模块六：空间布局与载体
  const parkEnterprises = local > 0 ? Math.min(local, Math.round(local * (0.3 + rand() * 0.5))) : 0;
  const parkEnterpriseRatio = local > 0 ? (parkEnterprises / local * 100).toFixed(0) : '0';

  return {
    localOutput, nationalOutput, outputShare, enterpriseCount: local,
    totalProfit, profitMargin, localGrossMargin, nationalGrossMargin, grossMarginDiff,
    inventionPatents, highValuePatents, avgPatentsPerEnterprise, nationalAvgPatents, innovationDensityDiff,
    listedCompanies, specialized, singleChampions, top100National, top100Local, top100LocalRatio,
    subsidyAmount, subsidizedEnterprises, subsidizedRatio, policyCount,
    parkEnterprises, parkEnterpriseRatio
  };
}
