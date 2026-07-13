/**
 * 产业链/供应链图谱系统 - V2 公共工具函数
 */

const CONFIG = {
  strategic: {
    all: { label: '全部', color: '#8C8C8C', class: 'tag-default' },
    chain_master: { label: '链主产业', color: '#096DD9', class: 'tag-chain-master' },
    core_pillar: { label: '核心支柱', color: '#1890FF', class: 'tag-core-pillar' },
    cultivating: { label: '培育中', color: '#FA8C16', class: 'tag-cultivating' }
  },
  lifecycle: {
    all: { label: '全部', color: '#8C8C8C', class: 'tag-default' },
    future: { label: '未来产业', color: '#722ED1', class: 'tag-future' },
    emerging: { label: '新兴产业', color: '#1890FF', class: 'tag-emerging' },
    advantage_traditional: { label: '优势传统', color: '#52C41A', class: 'tag-advantage' }
  },
  enabling: {
    all: { label: '全部', color: '#8C8C8C', class: 'tag-default' },
    ai: { label: '+AI', color: '#2F54EB', class: 'tag-indigo' },
    iot: { label: '+物联网', color: '#389E0D', class: 'tag-success' },
    green_energy: { label: '+绿色能源', color: '#13C2C2', class: 'tag-cyan' },
    industrial_internet: { label: '+工业互联网', color: '#EB2F96', class: 'tag-magenta' }
  },
  category: {
    manufacturing: '战略性新兴产业',
    new_energy: '新能源',
    biotech: '生物医药',
    information: '信息技术',
    modern_service: '现代服务'
  },
  nodeStatus: {
    strong: { label: '优势', icon: '✓', color: '#52C41A', class: 'tag-success' },
    normal: { label: '一般', icon: '△', color: '#1890FF', class: 'tag-primary' },
    missing: { label: '缺失', icon: '✗', color: '#F5222D', class: 'tag-danger' },
    advantage: { label: '本区优势', icon: '✓', color: '#52C41A', class: 'tag-success' }
  },
  enterpriseType: {
    parts: { label: '零部件企业', color: '#1890FF' },
    body: { label: '本体企业', color: '#52C41A' },
    integration: { label: '集成企业', color: '#722ED1' },
    terminal: { label: '终端应用企业', color: '#FA8C16' }
  },
  relationType: {
    transaction: { label: '交易关系', color: '#1890FF', dash: 'solid' },
    equity: { label: '股权关系', color: '#722ED1', dash: 'dashed' },
    supply_demand: { label: '供需推断', color: '#D9D9D9', dash: 'dashed' },
    enabling: { label: '使能支撑', color: '#13C2C2', dash: 'dotted' }
  }
};

function debounce(fn, delay = 300) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

function formatNumber(num) {
  if (num === null || num === undefined) return '-';
  return num.toLocaleString('zh-CN');
}

function formatMoney(value, unit = '亿') {
  if (value === null || value === undefined) return '-';
  return value + unit;
}

function formatPercent(value) {
  if (value === null || value === undefined) return '-';
  return value + '%';
}

function renderTag(text, type = 'primary') {
  return `<span class="tag tag-${type}">${text}</span>`;
}

function renderStrategicTag(value) {
  const cfg = CONFIG.strategic[value] || CONFIG.strategic.all;
  return `<span class="tag ${cfg.class}">${cfg.label}</span>`;
}

function renderLifecycleTag(value) {
  const cfg = CONFIG.lifecycle[value] || CONFIG.lifecycle.all;
  return `<span class="tag ${cfg.class}">${cfg.label}</span>`;
}

function renderEnablingTags(tags) {
  if (!tags || !tags.length) return '';
  return tags.map(tag => {
    const cfg = CONFIG.enabling[tag] || CONFIG.enabling.all;
    return `<span class="tag ${cfg.class}">${cfg.label}</span>`;
  }).join('');
}

function renderTreeStatusTag(status) {
  const cfg = CONFIG.nodeStatus[status] || CONFIG.nodeStatus.normal;
  return `<span class="tag ${cfg.class}">${cfg.icon} ${cfg.label}</span>`;
}

function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const result = {};
  for (const [key, value] of params.entries()) {
    if (result[key]) {
      if (!Array.isArray(result[key])) result[key] = [result[key]];
      result[key].push(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

function setUrlParams(params) {
  const url = new URL(window.location.href);
  Object.keys(params).forEach(key => {
    url.searchParams.delete(key);
    const value = params[key];
    if (value === undefined || value === null || value === '') return;
    if (Array.isArray(value)) {
      value.forEach(v => url.searchParams.append(key, v));
    } else {
      url.searchParams.set(key, value);
    }
  });
  window.history.replaceState({}, '', url);
}

function parseFilters() {
  const params = getUrlParams();
  const parseArray = (key) => {
    if (!params[key]) return ['all'];
    const val = Array.isArray(params[key]) ? params[key] : [params[key]];
    return val.length ? val : ['all'];
  };
  return {
    strategic: parseArray('strategic'),
    lifecycle: parseArray('lifecycle'),
    enabling: parseArray('enabling')
  };
}

function buildFilterUrl(filters) {
  const params = {};
  if (filters.strategic && !filters.strategic.includes('all')) params.strategic = filters.strategic;
  if (filters.lifecycle && !filters.lifecycle.includes('all')) params.lifecycle = filters.lifecycle;
  if (filters.enabling && !filters.enabling.includes('all')) params.enabling = filters.enabling;
  return params;
}

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function renderProgressRing(percent, size = 56, stroke = 6, color = null) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent / 100);
  const c = color || (percent >= 80 ? '#52C41A' : percent >= 60 ? '#1890FF' : '#F5222D');
  return `
    <div class="progress-ring">
      <svg width="${size}" height="${size}">
        <circle class="progress-ring-bg" cx="${size/2}" cy="${size/2}" r="${radius}"></circle>
        <circle class="progress-ring-fill" cx="${size/2}" cy="${size/2}" r="${radius}"
          stroke="${c}" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"></circle>
      </svg>
      <div class="progress-ring-text" style="color:${c}">${Math.round(percent)}%</div>
    </div>
  `;
}

function renderTrend(value) {
  if (value === undefined || value === null) return '';
  const cls = value >= 0 ? 'up' : 'down';
  const arrow = value >= 0 ? '↑' : '↓';
  return `<div class="metric-trend ${cls}">${arrow} ${Math.abs(value).toFixed(1)}%</div>`;
}

function openModal(title, content, footer = '') {
  let modal = document.getElementById('commonModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'commonModal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header"><span class="modal-title"></span><button class="drawer-close" onclick="closeModal()">✕</button></div>
        <div class="modal-body"></div>
        <div class="modal-footer"></div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  }
  modal.querySelector('.modal-title').textContent = title;
  modal.querySelector('.modal-body').innerHTML = content;
  modal.querySelector('.modal-footer').innerHTML = footer || '<button class="btn btn-primary" onclick="closeModal()">知道了</button>';
  modal.classList.add('open');
}

function closeModal() {
  const modal = document.getElementById('commonModal');
  if (modal) modal.classList.remove('open');
}

function openDrawer(title, content, footer = '') {
  let drawer = document.getElementById('commonDrawer');
  let overlay = document.getElementById('commonDrawerOverlay');
  if (!drawer) {
    overlay = document.createElement('div');
    overlay.id = 'commonDrawerOverlay';
    overlay.className = 'drawer-overlay';
    overlay.addEventListener('click', closeDrawer);
    document.body.appendChild(overlay);

    drawer = document.createElement('div');
    drawer.id = 'commonDrawer';
    drawer.className = 'drawer';
    drawer.innerHTML = `
      <div class="drawer-header"><span class="drawer-title"></span><button class="drawer-close" onclick="closeDrawer()">✕</button></div>
      <div class="drawer-body"></div>
      <div class="drawer-footer"></div>
    `;
    document.body.appendChild(drawer);
  }
  drawer.querySelector('.drawer-title').textContent = title;
  drawer.querySelector('.drawer-body').innerHTML = content;
  drawer.querySelector('.drawer-footer').innerHTML = footer;
  overlay.classList.add('open');
  drawer.classList.add('open');
}

function closeDrawer() {
  const drawer = document.getElementById('commonDrawer');
  const overlay = document.getElementById('commonDrawerOverlay');
  if (drawer) drawer.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
}

function exportCSV(filename, rows) {
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

function showToast(message, type = 'info') {
  let toast = document.getElementById('commonToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'commonToast';
    toast.style.cssText = `
      position: fixed; top: 80px; left: 50%; transform: translateX(-50%);
      padding: 10px 20px; border-radius: 4px; color: #fff; font-size: 13px;
      z-index: 2000; box-shadow: 0 4px 12px rgba(0,0,0,0.15); opacity: 0; transition: opacity 0.3s;
    `;
    document.body.appendChild(toast);
  }
  const colors = { info: '#1890FF', success: '#52C41A', warning: '#FA8C16', error: '#F5222D' };
  toast.style.background = colors[type] || colors.info;
  toast.textContent = message;
  toast.style.opacity = '1';
  setTimeout(() => { toast.style.opacity = '0'; }, 2500);
}

const NAV_MENU = [
  { id: 'panorama', label: '产业全景看板', icon: '▦', url: 'index.html' },
  { id: 'graph', label: '产业链结构图谱', icon: '🕸', url: 'chain-graph.html' },
  { id: 'network', label: '企业关系网络', icon: '🔗', url: 'enterprise-network.html' },
  { id: 'profile', label: '企业画像', icon: '👤', url: 'enterprise-profile.html' },
  { id: 'supply', label: '供需对接', icon: '📊', url: 'supply-demand.html' },
  { id: 'gap', label: '强链补链', icon: '🔧', url: 'chain-gap.html' },
  { id: 'risk', label: '风险预警', icon: '⚠️', url: 'risk-warning.html' }
];

function renderSidebar(currentPageId) {
  return `
    <aside class="sidebar">
      <div class="sidebar-title">功能导航</div>
      <nav class="sidebar-menu">
        ${NAV_MENU.map(item => `
          <div class="sidebar-item ${item.id === currentPageId ? 'active' : ''}" onclick="window.location.href='${item.url}'">
            <span class="sidebar-icon">${item.icon}</span>
            <span>${item.label}</span>
          </div>
        `).join('')}
      </nav>
    </aside>
  `;
}

function renderGlobalSearch() {
  return `
    <div class="global-search">
      <div class="search-box" id="globalSearchBox" onclick="toggleGlobalSearch()">
        <span class="search-icon">🔍</span>
        <span class="search-placeholder">搜索企业、产业链、环节...</span>
        <span class="search-hint">按 Enter 搜索</span>
      </div>
      <div class="search-dropdown" id="globalSearchDropdown">
        <div class="search-input-wrap">
          <input type="text" id="globalSearchInput" placeholder="搜索企业名称、产业链名称、环节名称..." onkeydown="if(event.key==='Enter')doGlobalSearch()">
          <button class="search-clear" id="searchClearBtn" onclick="clearGlobalSearch()" style="display:none">✕</button>
        </div>
        <div class="search-tabs">
          <button class="search-tab active" data-type="all" onclick="setSearchType('all')">全部</button>
          <button class="search-tab" data-type="enterprise" onclick="setSearchType('enterprise')">企业</button>
          <button class="search-tab" data-type="chain" onclick="setSearchType('chain')">产业链</button>
          <button class="search-tab" data-type="node" onclick="setSearchType('node')">环节</button>
        </div>
        <div class="search-results" id="globalSearchResults"></div>
        <div class="search-footer">
          <span class="search-stat" id="searchStat">输入关键词开始搜索</span>
        </div>
      </div>
    </div>
  `;
}

let currentSearchType = 'all';

const BREADCRUMB_CONFIG = {
  'index.html': [{ label: '首页', url: 'index.html' }, { label: '产业全景看板', url: '#', current: true }],
  'chain-graph.html': [{ label: '首页', url: 'index.html' }, { label: '产业全景', url: 'index.html' }, { label: '产业链结构图谱', url: '#', current: true }],
  'enterprise-network.html': [{ label: '首页', url: 'index.html' }, { label: '企业关系网络', url: '#', current: true }],
  'enterprise-profile.html': [{ label: '首页', url: 'index.html' }, { label: '企业关系网络', url: 'enterprise-network.html' }, { label: '企业画像', url: '#', current: true }],
  'supply-demand.html': [{ label: '首页', url: 'index.html' }, { label: '供需对接', url: '#', current: true }],
  'chain-gap.html': [{ label: '首页', url: 'index.html' }, { label: '强链补链', url: '#', current: true }],
  'risk-warning.html': [{ label: '首页', url: 'index.html' }, { label: '风险预警', url: '#', current: true }]
};

function renderBreadcrumb(pageId) {
  const config = BREADCRUMB_CONFIG[pageId] || [{ label: '首页', url: '#', current: true }];
  return config.map((item, index) => {
    if (item.current) {
      return `<span class="current">${item.label}</span>`;
    }
    const sep = index < config.length - 1 ? '<span class="sep">/</span>' : '';
    return `<a href="${item.url}">${item.label}</a>${sep}`;
  }).join('');
}

function toggleGlobalSearch() {
  const dropdown = document.getElementById('globalSearchDropdown');
  dropdown.classList.toggle('open');
  if (dropdown.classList.contains('open')) {
    document.getElementById('globalSearchInput').focus();
  }
}

function setSearchType(type) {
  currentSearchType = type;
  document.querySelectorAll('.search-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.type === type);
  });
  const input = document.getElementById('globalSearchInput').value.trim();
  if (input) doGlobalSearch();
}

function doGlobalSearch() {
  const query = document.getElementById('globalSearchInput').value.trim();
  if (!query) {
    document.getElementById('globalSearchResults').innerHTML = '<div class="search-empty">请输入搜索关键词</div>';
    document.getElementById('searchStat').textContent = '输入关键词开始搜索';
    return;
  }

  const results = performSearch(query, currentSearchType);
  renderSearchResults(results);
}

function performSearch(query, type) {
  const lowerQuery = query.toLowerCase();
  const results = [];

  if (type === 'all' || type === 'enterprise') {
    const enterprises = [
      { id: 'ent-001', name: '深圳市大疆创新科技有限公司', type: 'enterprise', desc: '无人机制造 · 行业龙头', url: 'enterprise-profile.html?enterpriseId=ent-001' },
      { id: 'ent-002', name: '比亚迪股份有限公司', type: 'enterprise', desc: '新能源汽车 · 核心支柱', url: 'enterprise-profile.html?enterpriseId=ent-002' },
      { id: 'ent-003', name: '华为技术有限公司', type: 'enterprise', desc: '通信设备 · 链主企业', url: 'enterprise-profile.html?enterpriseId=ent-003' },
      { id: 'ent-004', name: '中兴通讯股份有限公司', type: 'enterprise', desc: '通信设备 · 核心支柱', url: 'enterprise-profile.html?enterpriseId=ent-004' },
      { id: 'ent-005', name: '深圳迈瑞生物医疗电子股份有限公司', type: 'enterprise', desc: '医疗器械 · 新兴产业', url: 'enterprise-profile.html?enterpriseId=ent-005' }
    ];
    enterprises.forEach(e => {
      if (e.name.toLowerCase().includes(lowerQuery) || e.desc.toLowerCase().includes(lowerQuery)) {
        results.push(e);
      }
    });
  }

  if (type === 'all' || type === 'chain') {
    const chains = [
      { id: 'chain-robot', name: '机器人产业链', type: 'chain', desc: '战略性新兴产业', url: 'chain-graph.html?chainId=chain-robot' },
      { id: 'chain-002', name: '新能源汽车产业链', type: 'chain', desc: '新能源', url: 'chain-graph.html?chainId=chain-002' },
      { id: 'chain-003', name: '生物医药产业链', type: 'chain', desc: '生物医药', url: 'chain-graph.html?chainId=chain-003' },
      { id: 'chain-004', name: '人工智能产业链', type: 'chain', desc: '信息技术', url: 'chain-graph.html?chainId=chain-004' },
      { id: 'chain-005', name: '半导体产业链', type: 'chain', desc: '信息技术', url: 'chain-graph.html?chainId=chain-005' }
    ];
    chains.forEach(c => {
      if (c.name.toLowerCase().includes(lowerQuery) || c.desc.toLowerCase().includes(lowerQuery)) {
        results.push(c);
      }
    });
  }

  if (type === 'all' || type === 'node') {
    const nodes = [
      { id: 'node-001', name: '精密减速机', type: 'node', desc: '机器人核心部件', url: 'chain-graph.html?chainId=chain-robot' },
      { id: 'node-002', name: '伺服电机', type: 'node', desc: '机器人核心部件', url: 'chain-graph.html?chainId=chain-robot' },
      { id: 'node-003', name: '动力电池', type: 'node', desc: '新能源汽车核心部件', url: 'chain-graph.html?chainId=chain-002' },
      { id: 'node-004', name: '智能座舱', type: 'node', desc: '新能源汽车核心部件', url: 'chain-graph.html?chainId=chain-002' }
    ];
    nodes.forEach(n => {
      if (n.name.toLowerCase().includes(lowerQuery) || n.desc.toLowerCase().includes(lowerQuery)) {
        results.push(n);
      }
    });
  }

  return results.slice(0, 10);
}

function renderSearchResults(results) {
  const container = document.getElementById('globalSearchResults');
  const stat = document.getElementById('searchStat');

  if (!results || !results.length) {
    container.innerHTML = '<div class="search-empty">未找到匹配结果</div>';
    stat.textContent = '未找到匹配结果';
    return;
  }

  stat.textContent = `找到 ${results.length} 条结果`;

  const typeIcons = {
    enterprise: '🏢',
    chain: '🔗',
    node: '📦'
  };

  const typeLabels = {
    enterprise: '企业',
    chain: '产业链',
    node: '环节'
  };

  container.innerHTML = results.map(item => `
    <div class="search-result-item" onclick="window.location.href='${item.url}'">
      <span class="search-result-icon">${typeIcons[item.type] || '📄'}</span>
      <div class="search-result-info">
        <div class="search-result-name">${item.name}</div>
        <div class="search-result-desc">${item.desc}</div>
      </div>
      <span class="search-result-type">${typeLabels[item.type] || ''}</span>
    </div>
  `).join('');
}

function clearGlobalSearch() {
  document.getElementById('globalSearchInput').value = '';
  document.getElementById('globalSearchInput').focus();
  document.getElementById('searchClearBtn').style.display = 'none';
  document.getElementById('globalSearchResults').innerHTML = '<div class="search-empty">请输入搜索关键词</div>';
  document.getElementById('searchStat').textContent = '输入关键词开始搜索';
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        closeDrawer();
        closeModal();
        const dropdown = document.getElementById('globalSearchDropdown');
        if (dropdown) dropdown.classList.remove('open');
      }
    });

    const searchInput = document.getElementById('globalSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', debounce(() => {
        searchInput.value.trim() 
          ? document.getElementById('searchClearBtn').style.display = 'block'
          : document.getElementById('searchClearBtn').style.display = 'none';
        doGlobalSearch();
      }, 300));
    }

    document.addEventListener('click', e => {
      const searchBox = document.getElementById('globalSearchBox');
      const dropdown = document.getElementById('globalSearchDropdown');
      if (searchBox && dropdown && !searchBox.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
      }
    });
  });
}
