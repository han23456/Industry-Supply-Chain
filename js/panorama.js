/**
 * 产业全景看板 - 新设计稿页面逻辑
 */

// SVG 图标辅助函数
function iconSvg(name, attrs = '') {
  const icons = {
    'arrow-up-right': '<path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
    'target': '<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="6" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="2" fill="currentColor"/>',
    'layers': '<polygon points="12 2 2 7 12 12 22 7 12 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><polyline points="2 17 12 22 22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><polyline points="2 12 12 17 22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
    'chevron-right': '<path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
    'check-circle-2': '<path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" fill="none"/><path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
    'calendar': '<rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2" fill="none"/><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    'users': '<path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2" fill="none"/><path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
  };
  return `<svg viewBox="0 0 24 24" ${attrs}>${icons[name] || ''}</svg>`;
}

// 全局 KPI 数据
const GLOBAL_KPIS = [
  {
    key: 'enterprise',
    label: '产业链企业',
    value: '1,863',
    unit: '家',
    note: '100% 官方真实核验企业',
    theme: 'blue',
    noteIcon: 'check-circle-2'
  },
  {
    key: 'revenue',
    label: '产业链年度产值规模',
    value: '4,520.8',
    unit: '亿元',
    badge: '官方核算',
    note: '基准：2025年年报数据',
    theme: 'green',
    noteIcon: 'calendar'
  },
  {
    key: 'employment',
    label: '产业链就业规模',
    value: '18.6',
    unit: '万人',
    badge: '社保真实口径',
    note: '基准：2026年上月社保口径',
    theme: 'indigo',
    noteIcon: 'users'
  },
  {
    key: 'investment',
    label: '储备招商目标 (增量)',
    value: '48',
    unit: '家重点目标',
    tag: '招商库',
    note: '预计引入产值：',
    noteValue: '280 亿元',
    theme: 'amber'
  }
];

// 三大板块汇总数据
const CATEGORY_SUMMARIES = [
  {
    title: '6大现代服务业',
    theme: 'blue',
    enterprise: '1,120',
    revenue: '2,850',
    regulatedLabel: '规上企业',
    regulatedValue: '410 家 (36%)'
  },
  {
    title: '4大战略性新兴产业',
    theme: 'indigo',
    enterprise: '569',
    revenue: '1,280',
    regulatedLabel: '规上企业',
    regulatedValue: '215 家 (37%)'
  },
  {
    title: '2大未来产业',
    theme: 'purple',
    enterprise: '174',
    revenue: '390.8',
    regulatedLabel: '规上企业',
    regulatedValue: '64 家 (37%)'
  }
];

// 产业板块数据（按设计稿）
const INDUSTRY_SECTIONS = [
  {
    id: 'modern-service',
    title: '一、6大现代服务业',
    badge: '巩固提升・筑牢基本盘',
    desc: '深化深港合作与规则衔接，打造高能级服务业集聚区',
    theme: 'blue',
    industries: [
      {
        id: 'chain-007',
        name: '信息服务',
        direction: '软件信息、互联网服务、数字创意、工业互联网、数字化解决方案',
        enterprise: 412,
        revenue: '1,120.5',
        employment: '6.4',
        regulated: '145 家 (35%)',
        investmentCount: 12,
        investmentAmount: '+80 亿'
      },
      {
        id: 'chain-008',
        name: '金融服务',
        direction: '跨境金融、融资租赁、创投私募、财富管理、绿色金融、航运金融',
        enterprise: 356,
        revenue: '1,450.0',
        employment: '2.8',
        regulated: '98 家 (28%)',
        investmentCount: 4,
        investmentAmount: '+60 亿'
      },
      {
        id: 'chain-009',
        name: '贸易物流',
        direction: '新型国际贸易、供应链服务、航运物流、保税与跨境商贸',
        enterprise: 520,
        revenue: '890.0',
        employment: '4.1',
        regulated: '112 家 (22%)',
        investmentCount: 6,
        investmentAmount: '+40 亿'
      },
      {
        id: 'chain-010',
        name: '专业服务',
        direction: '法律、会计、咨询、人力资源、知识产权、检验认证',
        enterprise: 268,
        revenue: '542.0',
        employment: '3.2',
        regulated: '88 家 (33%)',
        investmentCount: 5,
        investmentAmount: '+35 亿'
      },
      {
        id: 'chain-011',
        name: '科技服务',
        direction: '技术转移、研发服务、创业孵化、科技投融资、检验检测',
        enterprise: 234,
        revenue: '480.2',
        employment: '2.9',
        regulated: '76 家 (32%)',
        investmentCount: 8,
        investmentAmount: '+50 亿'
      },
      {
        id: 'chain-012',
        name: '文体旅商',
        direction: '会展、文旅、商业消费、文化创意、赛事演艺',
        enterprise: 186,
        revenue: '286.5',
        employment: '1.8',
        regulated: '42 家 (23%)',
        investmentCount: 3,
        investmentAmount: '+15 亿'
      }
    ]
  },
  {
    id: 'strategic-emerging',
    title: '二、4大战略性新兴产业',
    badge: '培育壮大・发展新质生产力',
    desc: '聚焦高精尖产业突破，构筑前海高新技术创新高地',
    theme: 'indigo',
    industries: [
      {
        id: 'chain-robot',
        name: '人工智能与具身智能机器人',
        direction: '大模型、智能感知、人形机器人、自动驾驶、AI 行业应用',
        enterprise: 207,
        revenue: '510.0',
        employment: '2.6',
        regulated: '82 家 (40%)',
        investmentCount: 9,
        investmentAmount: '+65 亿'
      },
      {
        id: 'chain-002',
        name: '现代海洋产业',
        direction: '海洋科技、航运服务、海洋金融、智慧港口、海洋新能源',
        enterprise: 142,
        revenue: '320.5',
        employment: '1.4',
        regulated: '48 家 (34%)',
        investmentCount: 2,
        investmentAmount: '+18 亿'
      },
      {
        id: 'chain-004',
        name: '智能终端',
        direction: '智能硬件、消费电子、物联网终端、智能装备配套',
        enterprise: 122,
        revenue: '264.5',
        employment: '1.2',
        regulated: '53 家 (43%)',
        investmentCount: 3,
        investmentAmount: '+22 亿'
      },
      {
        id: 'chain-005',
        name: '低空经济',
        direction: 'eVTOL、低空运营、无人机、低空配套服务、空域应用场景',
        enterprise: 98,
        revenue: '185.0',
        employment: '0.9',
        regulated: '32 家 (33%)',
        investmentCount: 4,
        investmentAmount: '+25 亿'
      }
    ]
  },
  {
    id: 'future-looking',
    title: '三、2大未来产业',
    badge: '前瞻布局・抢占产业制高点',
    desc: '预研前沿颠覆性技术，布局未来产业发展先行区',
    theme: 'purple',
    industries: [
      {
        id: 'chain-003',
        name: '细胞与基因产业',
        direction: '基因技术、细胞治疗、生物医药研发服务、生命健康科创服务',
        enterprise: 86,
        revenue: '210.0',
        employment: '0.8',
        regulated: '38 家 (44%)',
        investmentCount: 2,
        investmentAmount: '+30 亿'
      },
      {
        id: 'chain-006',
        name: '数据产业',
        direction: '数据要素流通、数据合规、数据服务、算力服务、数字治理',
        enterprise: 88,
        revenue: '180.8',
        employment: '0.6',
        regulated: '26 家 (30%)',
        investmentCount: 2,
        investmentAmount: '+15 亿'
      }
    ]
  }
];

function init() {
  if (document.getElementById('globalSearchContainer')) {
    document.getElementById('globalSearchContainer').innerHTML = renderGlobalSearch();
  }
  if (document.getElementById('breadcrumbContainer')) {
    document.getElementById('breadcrumbContainer').innerHTML = renderBreadcrumb('index.html');
  }
  renderKPIs();
  renderCategorySummaries();
  renderIndustrySections();
}

function renderKPIs() {
  const container = document.getElementById('kpiGrid');
  if (!container) return;
  container.innerHTML = GLOBAL_KPIS.map(kpi => {
    const noteHtml = kpi.noteIcon
      ? `<div class="kpi-note">${iconSvg(kpi.noteIcon, 'class="check-icon"')} ${escapeHtml(kpi.note)}</div>`
      : `<div class="kpi-note"><span>${escapeHtml(kpi.note)}</span><span class="font-bold" style="margin-left:auto;color:#92400E">${escapeHtml(kpi.noteValue)}</span></div>`;
    const badgeHtml = kpi.badge ? `<span class="kpi-badge">${escapeHtml(kpi.badge)}</span>` : '';
    const tagHtml = kpi.tag ? `<span class="kpi-tag">${escapeHtml(kpi.tag)}</span>` : '';
    return `
      <div class="kpi-card ${kpi.theme}">
        <div class="kpi-card-inner">
          <div class="kpi-label">
            <span>${escapeHtml(kpi.label)}</span>
            ${tagHtml || badgeHtml}
          </div>
          <div class="kpi-value">${escapeHtml(kpi.value)}<span class="unit">${escapeHtml(kpi.unit)}</span></div>
          ${noteHtml}
        </div>
      </div>
    `;
  }).join('');
}

function renderCategorySummaries() {
  const container = document.getElementById('categorySummaryGrid');
  if (!container) return;
  container.innerHTML = CATEGORY_SUMMARIES.map(item => `
    <div class="category-summary-card ${item.theme}">
      <div>
        <div class="category-summary-title">${escapeHtml(item.title)}</div>
        <div class="category-summary-main">
          链上企业 <strong>${escapeHtml(item.enterprise)}</strong> 家 | 产值规模 <strong>${escapeHtml(item.revenue)} 亿</strong>
        </div>
      </div>
      <div class="category-summary-side">
        <div class="category-summary-side-label">${escapeHtml(item.regulatedLabel)}</div>
        <div class="category-summary-side-value">${escapeHtml(item.regulatedValue)}</div>
      </div>
    </div>
  `).join('');
}

function renderIndustrySections() {
  const container = document.getElementById('industrySections');
  if (!container) return;
  container.innerHTML = INDUSTRY_SECTIONS.map(section => `
    <section class="industry-section" id="${escapeHtml(section.id)}">
      <div class="industry-section-header">
        <div class="industry-section-title-wrap">
          <h2 class="industry-section-title">${escapeHtml(section.title)}</h2>
          <span class="industry-section-badge ${section.theme}">${escapeHtml(section.badge)}</span>
        </div>
        <p class="industry-section-desc">${escapeHtml(section.desc)}</p>
      </div>
      <div class="industry-grid">
        ${section.industries.map(industry => renderIndustryCard(industry)).join('')}
      </div>
    </section>
  `).join('');
}

function renderIndustryCard(industry) {
  return `
    <div class="industry-card-new">
      <div class="industry-card-body">
        <div class="industry-card-header">
          <div>
            <h3 class="industry-card-name">${escapeHtml(industry.name)}</h3>
            <div class="industry-card-direction"><strong>重点方向：</strong>${escapeHtml(industry.direction)}</div>
          </div>
          <button class="industry-card-arrow" onclick="goToChainGraph('${industry.id}')" aria-label="查看产业图谱">
            ${iconSvg('arrow-up-right')}
          </button>
        </div>
        <div class="industry-metrics-wrap">
          <div class="industry-metrics-title">
            <span>核心指标概览</span>
            <span class="industry-metrics-sub">官方审定数据</span>
          </div>
          <div class="industry-metrics-grid">
            <div>
              <div class="industry-metric-label">链上企业</div>
              <div class="industry-metric-value">${industry.enterprise}<span class="unit">家</span></div>
            </div>
            <div>
              <div class="industry-metric-label">产值规模</div>
              <div class="industry-metric-value primary">${escapeHtml(industry.revenue)}<span class="unit">亿</span></div>
            </div>
            <div>
              <div class="industry-metric-label">就业规模</div>
              <div class="industry-metric-value">${escapeHtml(industry.employment)}<span class="unit">万人</span></div>
            </div>
            <div>
              <div class="industry-metric-label">规上企业</div>
              <div class="industry-metric-value success">${escapeHtml(industry.regulated)}</div>
            </div>
          </div>
        </div>
        <div class="investment-reserve">
          <div class="investment-reserve-main">
            <span class="investment-reserve-icon">${iconSvg('target')}</span>
            <div>
              <div class="investment-reserve-title">招商储备库 (增量)</div>
              <div class="investment-reserve-sub">意向与在洽接目标</div>
            </div>
          </div>
          <div class="investment-reserve-value">
            <div class="investment-reserve-count">${industry.investmentCount} 家企业</div>
            <div class="investment-reserve-amount">预计 ${escapeHtml(industry.investmentAmount)}</div>
          </div>
        </div>
      </div>
      <div class="industry-card-footer">
        <span class="industry-card-footer-label">${iconSvg('layers')} 细分方向解析</span>
        <button class="btn-view-graph" onclick="goToChainGraph('${industry.id}')">
          查看深度图谱与企业分析 ${iconSvg('chevron-right')}
        </button>
      </div>
    </div>
  `;
}

function goToChainGraph(chainId) {
  const params = new URLSearchParams(window.location.search);
  params.set('chainId', chainId);
  const query = params.toString();
  sessionStorage.setItem('pendingChainId', chainId);
  window.location.href = `chain-graph.html${query ? '?' + query : ''}`;
}

function escapeHtml(text) {
  if (text === null || text === undefined) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

document.addEventListener('DOMContentLoaded', init);
