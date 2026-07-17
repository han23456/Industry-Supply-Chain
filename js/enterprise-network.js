/**
 * 企业关系网络 - V1 逻辑
 */

let networkChart = null;
let enterprises = [];
let relations = [];
let currentLayout = 'force';
let currentZoom = 1;
let selectedRelationTypes = ['equity', 'transaction', 'cooperation', 'supply_demand'];
let selectedStrength = 'all';
let searchKeyword = '';
let pathSource = '';
let pathTarget = '';
let isPathExpanded = false;
let isBoxSelectMode = false;
let focusedNodeId = null;

const ROLE_COLORS = {
  parts_supplier: '#1890FF',
  manufacturer: '#52C41A',
  integrator: '#722ED1',
  terminal: '#FA8C16',
  service: '#13C2C2',
  enabling: '#EB2F96'
};

const ROLE_LABELS = {
  parts_supplier: '零部件',
  manufacturer: '制造商',
  integrator: '集成商',
  terminal: '终端',
  service: '服务商',
  enabling: '使能技术'
};

const RELATION_COLORS = {
  equity: '#722ED1',
  transaction: '#1890FF',
  cooperation: '#52C41A',
  supply_demand: '#FA8C16'
};

const RELATION_LABELS = {
  equity: '股权',
  transaction: '交易',
  cooperation: '合作',
  supply_demand: '供需'
};

const RISK_BORDERS = {
  normal: 'transparent',
  warning: '#FAAD14',
  danger: '#F5222D'
};

async function init() {
  if (document.getElementById('globalSearchContainer')) {
    document.getElementById('globalSearchContainer').innerHTML = renderGlobalSearch();
  }
  if (document.getElementById('breadcrumbContainer')) {
    document.getElementById('breadcrumbContainer').innerHTML = renderBreadcrumb('enterprise-network.html');
  }
  
  await loadData();
  
  const params = getUrlParams();
  if (params.enterpriseId) {
    const targetEnterprise = enterprises.find(e => e.id === params.enterpriseId);
    if (targetEnterprise) {
      searchKeyword = targetEnterprise.name;
      document.getElementById('searchInput').value = targetEnterprise.name;
    }
  }
  
  initChart();
  renderPathSelects();
  
  if (params.enterpriseId) {
    setTimeout(() => {
      networkChart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        name: params.enterpriseId
      });
      networkChart.dispatchAction({
        type: 'focusNodeAdjacency',
        seriesIndex: 0,
        name: params.enterpriseId
      });
    }, 500);
  }
  
  window.addEventListener('resize', debounce(() => {
    if (networkChart) networkChart.resize();
    if (document.getElementById('pathSourceDropdown').classList.contains('open')) {
      positionDropdown('pathSource');
    }
    if (document.getElementById('pathTargetDropdown').classList.contains('open')) {
      positionDropdown('pathTarget');
    }
  }, 200));
  
  const pageContent = document.querySelector('.page-content');
  const scrollHandler = () => {
    if (document.getElementById('pathSourceDropdown').classList.contains('open')) {
      positionDropdown('pathSource');
    }
    if (document.getElementById('pathTargetDropdown').classList.contains('open')) {
      positionDropdown('pathTarget');
    }
  };
  if (pageContent) {
    pageContent.addEventListener('scroll', scrollHandler);
  }
  window.addEventListener('scroll', scrollHandler, true);
  
  document.addEventListener('click', function(e) {
    const sourceContainer = document.getElementById('sourceSelectContainer');
    const targetContainer = document.getElementById('targetSelectContainer');
    if (!sourceContainer.contains(e.target) && !targetContainer.contains(e.target)) {
      closeSelectDropdown('pathSource');
      closeSelectDropdown('pathTarget');
    }
  });
}

async function loadData() {
  enterprises = NETWORK_DATA.enterprises;
  relations = MOCK_ENTERPRISE_RELATIONS;
}

function initChart() {
  const chartDom = document.getElementById('networkChart');
  networkChart = echarts.init(chartDom);
  renderNetwork();

  networkChart.on('click', params => {
    if (params.dataType === 'node') {
      if (focusedNodeId === params.data.id) {
        focusedNodeId = null;
      } else {
        focusedNodeId = params.data.id;
      }
      renderNetwork();
      openEnterpriseDrawer(params.data.id);
    }
  });

  networkChart.on('dblclick', params => {
    if (params.dataType === 'node') {
      window.location.href = `enterprise-profile.html?enterpriseId=${encodeURIComponent(params.data.id)}`;
    }
  });

  initBoxSelectEvents();
}

function getFilteredRelations() {
  let filtered = relations.filter(r => {
    if (!selectedRelationTypes.includes(r.relation_type)) return false;
    if (selectedStrength === 'high' && r.relation_strength < 0.8) return false;
    if (selectedStrength === 'medium' && (r.relation_strength < 0.5 || r.relation_strength >= 0.8)) return false;
    if (selectedStrength === 'low' && r.relation_strength >= 0.5) return false;
    return true;
  });

  if (searchKeyword) {
    const matchedIds = new Set();
    enterprises.forEach(e => {
      if (e.name.includes(searchKeyword) || (e.credit_code && e.credit_code.includes(searchKeyword))) {
        matchedIds.add(e.id);
      }
    });
    filtered = filtered.filter(r => 
      matchedIds.has(r.from_enterprise_id) || matchedIds.has(r.to_enterprise_id)
    );
  }

  return filtered;
}

function getFilteredNodes() {
  if (searchKeyword) {
    const matchedIds = new Set();
    enterprises.forEach(e => {
      if (e.name.includes(searchKeyword) || (e.credit_code && e.credit_code.includes(searchKeyword))) {
        matchedIds.add(e.id);
      }
    });

    const relatedIds = new Set(matchedIds);
    relations.forEach(r => {
      if (matchedIds.has(r.from_enterprise_id) || matchedIds.has(r.to_enterprise_id)) {
        relatedIds.add(r.from_enterprise_id);
        relatedIds.add(r.to_enterprise_id);
      }
    });

    return enterprises.filter(e => relatedIds.has(e.id));
  }

  const activeIds = new Set();
  getFilteredRelations().forEach(r => {
    activeIds.add(r.from_enterprise_id);
    activeIds.add(r.to_enterprise_id);
  });

  return enterprises.filter(e => activeIds.has(e.id));
}

function renderNetwork() {
  const filteredRelations = getFilteredRelations();
  const filteredNodes = getFilteredNodes();
  const nodeMap = new Map(filteredNodes.map(n => [n.id, n]));
  
  const activeIds = new Set();
  if (focusedNodeId) {
    activeIds.add(focusedNodeId);
    relations.forEach(r => {
      if (r.from_enterprise_id === focusedNodeId || r.to_enterprise_id === focusedNodeId) {
        activeIds.add(r.from_enterprise_id);
        activeIds.add(r.to_enterprise_id);
      }
    });
    relations.forEach(r => {
      if (activeIds.has(r.from_enterprise_id) || activeIds.has(r.to_enterprise_id)) {
        activeIds.add(r.from_enterprise_id);
        activeIds.add(r.to_enterprise_id);
      }
    });
  }

  const nodes = filteredNodes.map(e => {
    const isLeading = e.is_leading || e.enterprise_scale === 'large';
    const baseSize = isLeading ? 45 : (e.enterprise_scale === 'medium' ? 28 : (e.enterprise_scale === 'small' ? 20 : 14));
    const size = Math.max(12, Math.min(70, baseSize));
    
    const isActive = !focusedNodeId || activeIds.has(e.id);
    const opacity = e.is_local ? (isActive ? 1 : 0.15) : (isActive ? 0.6 : 0.1);
    
    return {
      id: e.id,
      name: e.name,
      value: e.annual_revenue,
      symbolSize: isActive ? size : size * 0.6,
      x: null,
      y: null,
      itemStyle: {
        color: ROLE_COLORS[e.industry_role] || '#8C8C8C',
        borderColor: RISK_BORDERS[e.risk_level] || 'transparent',
        borderWidth: e.risk_level !== 'normal' ? 3 : (isLeading ? 2 : 1),
        opacity: opacity
      },
      label: {
        show: isActive && size >= 24,
        position: 'bottom',
        formatter: '{b}',
        fontSize: Math.max(10, size * 0.35),
        color: '#262626',
        opacity: isActive ? 1 : 0
      },
      emphasis: {
        focus: 'adjacency',
        label: { show: true },
        itemStyle: { opacity: 1 }
      }
    };
  });

  const edges = filteredRelations
    .filter(r => nodeMap.has(r.from_enterprise_id) && nodeMap.has(r.to_enterprise_id))
    .map(r => {
      const isActive = !focusedNodeId || (activeIds.has(r.from_enterprise_id) && activeIds.has(r.to_enterprise_id));
      const baseOpacity = r.relation_strength > 0.7 ? 0.85 : (r.relation_strength > 0.4 ? 0.6 : 0.35);
      
      return {
        source: r.from_enterprise_id,
        target: r.to_enterprise_id,
        value: r.relation_strength,
        lineStyle: {
          width: isActive ? Math.max(1, r.relation_strength * 5) : 0.5,
          color: RELATION_COLORS[r.relation_type] || '#999',
          type: r.relation_type === 'cooperation' ? 'dashed' : r.relation_type === 'supply_demand' ? 'dotted' : 'solid',
          curveness: 0.15,
          opacity: isActive ? baseOpacity : 0.05
        },
        relation: r
      };
    });

  const option = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderColor: '#E8E8E8',
      textStyle: { color: '#262626', fontSize: 13 },
      formatter: params => {
        if (params.dataType === 'node') {
          const e = nodeMap.get(params.data.id);
          return `
            <div style="font-weight:600;margin-bottom:4px">${e.name}</div>
            <div>角色：${ROLE_LABELS[e.industry_role] || e.industry_role}</div>
            <div>年营收：${e.annual_revenue} 亿</div>
            <div>员工：${formatNumber(e.employee_count)} 人</div>
            <div>风险等级：${e.risk_level === 'normal' ? '正常' : e.risk_level === 'warning' ? '关注' : '危险'}</div>
            <div style="color:#8C8C8C;font-size:12px;margin-top:4px">双击查看企业画像</div>
          `;
        } else {
          const r = params.data.relation;
          return `
            <div style="font-weight:600;margin-bottom:4px">${RELATION_LABELS[r.relation_type]}关系</div>
            <div>强度：${(r.relation_strength * 100).toFixed(0)}%</div>
            ${r.transaction_amount ? `<div>年交易额：${formatNumber(r.transaction_amount)} 万</div>` : ''}
            ${r.transaction_frequency ? `<div>交易频次：${r.transaction_frequency} 次/年</div>` : ''}
            <div>最近交互：${r.last_transaction_date}</div>
          `;
        }
      }
    },
    animationDuration: 1500,
    animationEasingUpdate: 'quinticInOut',
    series: [{
      type: 'graph',
      layout: currentLayout === 'force' ? 'force' : 'none',
      data: nodes,
      links: edges,
      roam: true,
      draggable: true,
      scaleLimit: { min: 0.5, max: 3 },
      zoom: currentZoom,
      label: { show: true },
      force: {
        repulsion: 1800,
        gravity: 0.05,
        edgeLength: [120, 300],
        layoutAnimation: true
      },
      lineStyle: { opacity: 0.8 }
    }]
  };

  if (currentLayout === 'hierarchy') {
    applyHierarchyLayout(nodes, edges);
  } else if (currentLayout === 'circular') {
    applyCircularLayout(nodes, edges);
  }

  networkChart.setOption(option, true);
  networkChart.on('finished', () => {
    const opt = networkChart.getOption();
    if (opt.series && opt.series[0]) {
      currentZoom = opt.series[0].zoom || 1;
      document.getElementById('zoomValue').textContent = currentZoom.toFixed(1) + 'x';
    }
  });
}

function applyHierarchyLayout(nodes, edges) {
  const layers = { terminal: 0, integrator: 1, manufacturer: 2, parts_supplier: 3, service: 1, enabling: 1 };
  const layerGroups = {};
  nodes.forEach(n => {
    const e = enterprises.find(ent => ent.id === n.id);
    const layer = layers[e.industry_role] !== undefined ? layers[e.industry_role] : 2;
    if (!layerGroups[layer]) layerGroups[layer] = [];
    layerGroups[layer].push(n);
  });

  const width = networkChart.getWidth() || 1000;
  const height = networkChart.getHeight() || 600;
  const layerKeys = Object.keys(layerGroups).map(Number).sort((a, b) => a - b);
  layerKeys.forEach((layer, i) => {
    const count = layerGroups[layer].length;
    const y = height * 0.2 + (height * 0.6) * i / Math.max(layerKeys.length - 1, 1);
    layerGroups[layer].forEach((n, j) => {
      n.x = width * 0.1 + (width * 0.8) * j / Math.max(count - 1, 1);
      n.y = y;
      n.fixed = true;
    });
  });
}

function applyCircularLayout(nodes, edges) {
  const width = networkChart.getWidth() || 1000;
  const height = networkChart.getHeight() || 600;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.35;
  const count = nodes.length;
  nodes.forEach((n, i) => {
    const angle = (2 * Math.PI * i) / count - Math.PI / 2;
    n.x = centerX + radius * Math.cos(angle);
    n.y = centerY + radius * Math.sin(angle);
    n.fixed = true;
  });
}

function onRelationCheckboxChange() {
  const checkboxes = document.querySelectorAll('.relation-checkboxes input[type="checkbox"]');
  selectedRelationTypes = Array.from(checkboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.value);
  renderNetwork();
}

function applyFilters() {
  selectedStrength = document.getElementById('strengthFilter').value;
  renderNetwork();
}

function debounceSearch() {
  const input = document.getElementById('searchInput');
  searchKeyword = input.value.trim();
  debounce(renderNetwork, 300)();
}

function switchLayout() {
  currentLayout = document.getElementById('layoutSelect').value;
  renderNetwork();
}

function resetNetworkFilters() {
  document.querySelectorAll('.relation-checkboxes input[type="checkbox"]').forEach(cb => cb.checked = true);
  document.getElementById('strengthFilter').value = 'all';
  document.getElementById('searchInput').value = '';
  document.getElementById('layoutSelect').value = 'force';
  selectedRelationTypes = ['equity', 'transaction', 'cooperation', 'supply_demand'];
  selectedStrength = 'all';
  searchKeyword = '';
  currentLayout = 'force';
  focusedNodeId = null;
  renderNetwork();
}

function zoomIn() {
  networkChart.dispatchAction({ type: 'graphZoom', zoom: currentZoom * 1.2 });
}

function zoomOut() {
  networkChart.dispatchAction({ type: 'graphZoom', zoom: currentZoom / 1.2 });
}

function zoomReset() {
  networkChart.dispatchAction({ type: 'graphRestore' });
  currentZoom = 1;
  document.getElementById('zoomValue').textContent = '1.0x';
}

function centerGraph() {
  networkChart.dispatchAction({ type: 'graphRestore' });
  currentZoom = 1;
  document.getElementById('zoomValue').textContent = '1.0x';
}

function clearFocus() {
  focusedNodeId = null;
  renderNetwork();
}

function toggleBoxSelect() {
  isBoxSelectMode = !isBoxSelectMode;
  const btn = document.getElementById('btnBoxSelect');
  if (isBoxSelectMode) {
    btn.style.background = '#2563EB';
    btn.style.color = '#fff';
    btn.style.borderColor = '#2563EB';
    document.getElementById('networkChart').style.cursor = 'crosshair';
  } else {
    btn.style.background = '';
    btn.style.color = '';
    btn.style.borderColor = '';
    document.getElementById('networkChart').style.cursor = 'default';
    clearSelectionRect();
  }
}

let selectRectEl = null;
let selectStartX = 0;
let selectStartY = 0;

function createSelectionRect() {
  if (!selectRectEl) {
    selectRectEl = document.createElement('div');
    selectRectEl.style.cssText = `
      position: absolute;
      border: 1px dashed #2563EB;
      background: rgba(37, 99, 235, 0.1);
      pointer-events: none;
      z-index: 100;
    `;
    document.getElementById('networkChart').appendChild(selectRectEl);
  }
}

function clearSelectionRect() {
  if (selectRectEl) {
    selectRectEl.style.display = 'none';
  }
}

function updateSelectionRect(x1, y1, x2, y2) {
  if (!selectRectEl) createSelectionRect();
  const left = Math.min(x1, x2);
  const top = Math.min(y1, y2);
  const width = Math.abs(x2 - x1);
  const height = Math.abs(y2 - y1);
  selectRectEl.style.left = left + 'px';
  selectRectEl.style.top = top + 'px';
  selectRectEl.style.width = width + 'px';
  selectRectEl.style.height = height + 'px';
  selectRectEl.style.display = width > 5 && height > 5 ? 'block' : 'none';
}

function initBoxSelectEvents() {
  const chartDom = document.getElementById('networkChart');
  
  chartDom.addEventListener('mousedown', function(e) {
    if (!isBoxSelectMode) return;
    const rect = chartDom.getBoundingClientRect();
    selectStartX = e.clientX - rect.left;
    selectStartY = e.clientY - rect.top;
    createSelectionRect();
    
    const onMouseMove = function(e) {
      if (!isBoxSelectMode) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      updateSelectionRect(selectStartX, selectStartY, x, y);
    };
    
    const onMouseUp = function(e) {
      if (!isBoxSelectMode) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      updateSelectionRect(selectStartX, selectStartY, x, y);
      
      const width = Math.abs(x - selectStartX);
      const height = Math.abs(y - selectStartY);
      
      if (width > 10 && height > 10) {
        const minX = Math.min(selectStartX, x);
        const maxX = Math.max(selectStartX, x);
        const minY = Math.min(selectStartY, y);
        const maxY = Math.max(selectStartY, y);
        
        const option = networkChart.getOption();
        const selectedNodes = [];
        
        option.series[0].data.forEach((node, index) => {
          if (node.x !== null && node.y !== null) {
            const screenPos = networkChart.convertToPixel({ seriesIndex: 0 }, [node.x, node.y]);
            if (screenPos && screenPos[0] >= minX && screenPos[0] <= maxX &&
                screenPos[1] >= minY && screenPos[1] <= maxY) {
              selectedNodes.push(index);
            }
          }
        });
        
        if (selectedNodes.length > 0) {
          networkChart.dispatchAction({ type: 'downplay', seriesIndex: 0 });
          networkChart.dispatchAction({
            type: 'highlight',
            seriesIndex: 0,
            dataIndex: selectedNodes
          });
        }
      }
      
      clearSelectionRect();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
}

function renderPathSelects() {
  renderSearchableSelectOptions('pathSource');
  renderSearchableSelectOptions('pathTarget');
}

function renderSearchableSelectOptions(type) {
  const containerId = type === 'pathSource' ? 'pathSourceOptions' : 'pathTargetOptions';
  const container = document.getElementById(containerId);
  if (!container) return;
  
  if (!enterprises || !enterprises.length) {
    container.innerHTML = '<div class="dropdown-empty">企业数据加载中...</div>';
    return;
  }
  
  const optionsHTML = enterprises.map(e => {
    const tags = [];
    if (e.is_local) {
      tags.push('<span class="option-tag local">本区</span>');
    } else {
      tags.push('<span class="option-tag remote">外地</span>');
    }
    if (e.is_leading || e.enterprise_scale === 'large') {
      tags.push('<span class="option-tag leading">龙头</span>');
    }
    return `<div class="dropdown-option" data-id="${e.id}" data-name="${e.name}" onclick="selectOption('${type}', '${e.id}', '${e.name}')">
      ${e.name}
      ${tags.join('')}
    </div>`;
  }).join('');
  
  container.innerHTML = optionsHTML;
}

function openSelectDropdown(type) {
  const inputId = type === 'pathSource' ? 'pathSourceInput' : 'pathTargetInput';
  const dropdownId = type === 'pathSource' ? 'pathSourceDropdown' : 'pathTargetDropdown';
  const dropdown = document.getElementById(dropdownId);
  const otherType = type === 'pathSource' ? 'pathTarget' : 'pathSource';
  document.getElementById(otherType + 'Dropdown').classList.remove('open');
  
  positionDropdown(type);
  dropdown.classList.add('open');
}

function closeSelectDropdown(type) {
  const dropdownId = type === 'pathSource' ? 'pathSourceDropdown' : 'pathTargetDropdown';
  const dropdown = document.getElementById(dropdownId);
  dropdown.classList.remove('open');
  dropdown.style.top = '';
  dropdown.style.bottom = '';
  dropdown.style.left = '';
  dropdown.style.width = '';
  dropdown.classList.remove('drop-up');
}

function positionDropdown(type) {
  const inputId = type === 'pathSource' ? 'pathSourceInput' : 'pathTargetInput';
  const dropdownId = type === 'pathSource' ? 'pathSourceDropdown' : 'pathTargetDropdown';
  const input = document.getElementById(inputId);
  const dropdown = document.getElementById(dropdownId);
  if (!input || !dropdown) return;
  
  const rect = input.getBoundingClientRect();
  // 输入框滚出视口时关闭下拉框
  if (rect.bottom < 0 || rect.top > window.innerHeight) {
    closeSelectDropdown(type);
    return;
  }
  
  const dropdownHeight = Math.min(dropdown.scrollHeight || 200, 200);
  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceAbove = rect.top;
  
  dropdown.style.left = rect.left + 'px';
  dropdown.style.width = rect.width + 'px';
  
  if (spaceBelow >= dropdownHeight + 4 || spaceBelow >= spaceAbove) {
    // 优先向下展开；下方空间不足时，若仍比上方大也向下（部分内容可滚动查看）
    dropdown.style.top = (rect.bottom + 4) + 'px';
    dropdown.style.bottom = '';
    dropdown.classList.remove('drop-up');
  } else {
    // 向上展开
    dropdown.style.bottom = (window.innerHeight - rect.top + 4) + 'px';
    dropdown.style.top = '';
    dropdown.classList.add('drop-up');
  }
}

function toggleSelectDropdown(type) {
  const dropdownId = type === 'pathSource' ? 'pathSourceDropdown' : 'pathTargetDropdown';
  const dropdown = document.getElementById(dropdownId);
  if (dropdown.classList.contains('open')) {
    closeSelectDropdown(type);
  } else {
    openSelectDropdown(type);
  }
}

function filterSelectOptions(type) {
  const inputId = type === 'pathSource' ? 'pathSourceInput' : 'pathTargetInput';
  const optionsId = type === 'pathSource' ? 'pathSourceOptions' : 'pathTargetOptions';
  const input = document.getElementById(inputId);
  const optionsContainer = document.getElementById(optionsId);
  if (!input || !optionsContainer) return;
  
  const filter = input.value.toLowerCase().trim();
  
  // 输入时自动展开下拉框
  openSelectDropdown(type);
  
  // 移除之前的空提示
  const existingEmpty = optionsContainer.querySelector('.dropdown-empty');
  if (existingEmpty) existingEmpty.remove();
  
  const options = optionsContainer.querySelectorAll('.dropdown-option');
  let visibleCount = 0;
  options.forEach(opt => {
    const text = opt.textContent.toLowerCase();
    const match = text.includes(filter);
    opt.style.display = match ? 'flex' : 'none';
    if (match) visibleCount++;
  });
  
  if (visibleCount === 0) {
    const emptyDiv = document.createElement('div');
    emptyDiv.className = 'dropdown-empty';
    emptyDiv.textContent = '未找到匹配的企业';
    optionsContainer.appendChild(emptyDiv);
  }
  
  // 如果输入内容精确匹配某企业，自动回填隐藏值
  resolvePathInput(type);
}

function handleSelectKeydown(event, type) {
  if (event.key === 'Enter') {
    event.preventDefault();
    const inputId = type === 'pathSource' ? 'pathSourceInput' : 'pathTargetInput';
    const input = document.getElementById(inputId);
    const val = input.value.trim();
    if (!val) return;
    
    // 优先精确匹配，其次唯一包含匹配，再次选择第一个可见项
    let matched = resolveEnterpriseByName(val);
    if (!matched) {
      const optionsId = type === 'pathSource' ? 'pathSourceOptions' : 'pathTargetOptions';
      const optionsContainer = document.getElementById(optionsId);
      const firstVisible = optionsContainer.querySelector('.dropdown-option:not([style*="none"])');
      if (firstVisible) {
        matched = enterprises.find(e => e.id === firstVisible.dataset.id);
      }
    }
    if (matched) {
      selectOption(type, matched.id, matched.name);
    }
  } else if (event.key === 'Escape') {
    closeSelectDropdown(type);
  }
}

function resolveEnterpriseByName(name) {
  if (!name) return null;
  const exact = enterprises.find(e => e.name === name);
  if (exact) return exact;
  const includes = enterprises.filter(e => e.name.includes(name));
  return includes.length === 1 ? includes[0] : null;
}

function resolvePathInput(type) {
  const inputId = type === 'pathSource' ? 'pathSourceInput' : 'pathTargetInput';
  const hiddenId = type === 'pathSource' ? 'pathSource' : 'pathTarget';
  const input = document.getElementById(inputId);
  const val = input.value.trim();
  const matched = resolveEnterpriseByName(val);
  document.getElementById(hiddenId).value = matched ? matched.id : '';
  onPathSelectChange();
}

function selectOption(type, id, name) {
  const inputId = type === 'pathSource' ? 'pathSourceInput' : 'pathTargetInput';
  const hiddenId = type === 'pathSource' ? 'pathSource' : 'pathTarget';
  const dropdownId = type === 'pathSource' ? 'pathSourceDropdown' : 'pathTargetDropdown';
  
  document.getElementById(inputId).value = name;
  document.getElementById(hiddenId).value = id;
  
  const dropdown = document.getElementById(dropdownId);
  dropdown.classList.remove('open');
  
  onPathSelectChange();
}

function onPathSelectChange() {
  pathSource = document.getElementById('pathSource').value;
  pathTarget = document.getElementById('pathTarget').value;
  document.getElementById('btnAnalyzePath').disabled = !(pathSource && pathTarget && pathSource !== pathTarget);
}

function analyzePath() {
  // 若未从下拉框选择，尝试按输入的企业名称匹配
  if (!pathSource) {
    const sourceName = document.getElementById('pathSourceInput').value.trim();
    const matched = resolveEnterpriseByName(sourceName);
    if (matched) {
      document.getElementById('pathSource').value = matched.id;
      pathSource = matched.id;
    }
  }
  if (!pathTarget) {
    const targetName = document.getElementById('pathTargetInput').value.trim();
    const matched = resolveEnterpriseByName(targetName);
    if (matched) {
      document.getElementById('pathTarget').value = matched.id;
      pathTarget = matched.id;
    }
  }
  
  if (!pathSource || !pathTarget || pathSource === pathTarget) return;
  const graph = buildGraph();
  const result = findShortestPath(graph, pathSource, pathTarget);
  renderPathResult(result);
  highlightPath(result.path);
}

function buildGraph() {
  const graph = {};
  enterprises.forEach(e => graph[e.id] = []);
  relations.forEach(r => {
    graph[r.from_enterprise_id].push({ to: r.to_enterprise_id, weight: 1 - r.relation_strength, strength: r.relation_strength, relation: r });
    if (r.relation_type !== 'transaction' && r.relation_type !== 'supply_demand') {
      graph[r.to_enterprise_id].push({ to: r.from_enterprise_id, weight: 1 - r.relation_strength, strength: r.relation_strength, relation: r });
    }
  });
  return graph;
}

function findShortestPath(graph, start, end) {
  const dist = {};
  const prev = {};
  const visited = new Set();
  Object.keys(graph).forEach(k => dist[k] = Infinity);
  dist[start] = 0;

  while (true) {
    let minNode = null;
    let minDist = Infinity;
    Object.keys(dist).forEach(k => {
      if (!visited.has(k) && dist[k] < minDist) {
        minDist = dist[k];
        minNode = k;
      }
    });
    if (minNode === null) break;
    visited.add(minNode);
    if (minNode === end) break;

    graph[minNode].forEach(edge => {
      const alt = dist[minNode] + edge.weight;
      if (alt < dist[edge.to]) {
        dist[edge.to] = alt;
        prev[edge.to] = { node: minNode, edge };
      }
    });
  }

  const path = [];
  let curr = end;
  while (curr && curr !== start) {
    if (!prev[curr]) return { path: [], length: 0, strength: 0 };
    path.unshift({ node: curr, edge: prev[curr].edge });
    curr = prev[curr].node;
  }
  path.unshift({ node: start });

  const strength = path.length > 1
    ? path.slice(1).reduce((s, p) => s + p.edge.strength, 0) / (path.length - 1)
    : 0;

  return { path, length: path.length - 1, strength };
}

function renderPathResult(result) {
  const container = document.getElementById('pathResult');
  if (!result.path.length) {
    container.innerHTML = '<div class="path-result-title">未找到连接路径</div>';
    container.style.display = 'block';
    return;
  }

  const nodeEls = result.path.map((p, i) => {
    const e = enterprises.find(ent => ent.id === p.node);
    const isLast = i === result.path.length - 1;
    return `
      <div class="path-node ${e.is_local ? 'local' : 'external'}">
        <span>${e.name}</span>
      </div>
      ${!isLast ? '<span style="color:#8C8C8C">→</span>' : ''}
    `;
  }).join('');

  container.innerHTML = `
    <div class="path-result-title">最短路径分析结果</div>
    <div class="path-nodes">${nodeEls}</div>
    <div class="path-stats">
      <span>路径长度：<strong>${result.length} 跳</strong></span>
      <span>平均关系强度：<strong>${(result.strength * 100).toFixed(1)}%</strong></span>
      <span>经过企业数：<strong>${result.path.length} 家</strong></span>
    </div>
  `;
  container.style.display = 'block';
}

function highlightPath(pathNodes) {
  const ids = pathNodes.map(p => p.node);
  networkChart.dispatchAction({
    type: 'downplay',
    seriesIndex: 0
  });
  networkChart.dispatchAction({
    type: 'highlight',
    seriesIndex: 0,
    dataIndex: ids.map(id => {
      const opt = networkChart.getOption();
      return opt.series[0].data.findIndex(n => n.id === id);
    }).filter(i => i >= 0)
  });
}

function clearPath() {
  document.getElementById('pathSource').value = '';
  document.getElementById('pathTarget').value = '';
  document.getElementById('pathSourceInput').value = '';
  document.getElementById('pathTargetInput').value = '';
  document.getElementById('pathResult').style.display = 'none';
  document.getElementById('btnAnalyzePath').disabled = true;
  networkChart.dispatchAction({ type: 'downplay', seriesIndex: 0 });
}

function toggleLegend() {
  const popup = document.getElementById('legendPopup');
  popup.classList.toggle('show');
}

function togglePathAnalysis() {
  isPathExpanded = !isPathExpanded;
  const body = document.getElementById('pathBody');
  const toggle = document.getElementById('pathToggle');
  const canvas = document.querySelector('.network-canvas');
  const result = document.getElementById('pathResult');
  
  if (isPathExpanded) {
    body.classList.add('expanded');
    toggle.classList.add('expanded');
    canvas.classList.add('path-expanded');
  } else {
    body.classList.remove('expanded');
    toggle.classList.remove('expanded');
    canvas.classList.remove('path-expanded');
    result.style.display = 'none';
  }
  
  if (networkChart) {
    setTimeout(() => networkChart.resize(), 350);
  }
}

async function openEnterpriseDrawer(enterpriseId) {
  let detail = await MockAPI.getEnterpriseDetail(enterpriseId);
  const enterprise = enterprises.find(e => e.id === enterpriseId);
  
  if (!detail && enterprise) {
    detail = enterprise;
  }
  
  if (!detail) return;

  const products = await MockAPI.getEnterpriseProducts(enterpriseId);
  const demands = await MockAPI.getEnterpriseDemands(enterpriseId);
  const rels = await MockAPI.getEnterpriseRelations(enterpriseId);

  const roleLabel = ROLE_LABELS[detail.industry_role] || detail.industry_role;
  const scaleMap = { large: '大型', medium: '中型', small: '小型', micro: '微型' };
  const statusMap = { active: '存续', revoked: '注销', moved_out: '迁出' };

  document.getElementById('drawerTitle').textContent = '企业画像卡片';
  document.getElementById('drawerBody').innerHTML = `
    <div class="enterprise-card">
      <div class="enterprise-header">
        <div class="enterprise-logo">${detail.name.charAt(0)}</div>
        <div class="enterprise-title">
          <div class="enterprise-name">${detail.name}</div>
          <div class="enterprise-code">${detail.credit_code || '-'}</div>
          <div class="enterprise-tags">
            <span class="tag tag-primary">${roleLabel}</span>
            <span class="tag ${detail.is_local ? 'tag-success' : 'tag-default'}">${detail.is_local ? '本区企业' : '外地企业'}</span>
            ${detail.tags ? detail.tags.map(t => `<span class="tag tag-default">${t}</span>`).join('') : ''}
          </div>
        </div>
      </div>
      <div class="enterprise-metrics">
        <div class="metric-item"><div class="metric-item-label">年营收</div><div class="metric-item-value">${detail.annual_revenue} 亿</div></div>
        <div class="metric-item"><div class="metric-item-label">员工人数</div><div class="metric-item-value">${formatNumber(detail.employee_count)}</div></div>
        <div class="metric-item"><div class="metric-item-label">企业规模</div><div class="metric-item-value">${scaleMap[detail.enterprise_scale] || detail.enterprise_scale}</div></div>
        <div class="metric-item"><div class="metric-item-label">经营状态</div><div class="metric-item-value">${statusMap[detail.status] || detail.status}</div></div>
      </div>
      <div class="enterprise-info">
        <div class="info-row"><span class="info-label">注册地址</span><span class="info-value">${detail.register_address || '-'}</span></div>
        <div class="info-row"><span class="info-label">法定代表人</span><span class="info-value">${detail.legal_person || '-'}</span></div>
        <div class="info-row"><span class="info-label">成立日期</span><span class="info-value">${detail.establishment_date || '-'}</span></div>
        <div class="info-row"><span class="info-label">注册资本</span><span class="info-value">${detail.registered_capital ? formatNumber(detail.registered_capital) + ' 万' : '-'}</span></div>
      </div>
    </div>
    <div class="enterprise-card">
      <div class="card-title" style="--title-bar-color:#1890FF;font-size:14px">产业链定位</div>
      <div class="info-row"><span class="info-label">所属产业链</span><span class="info-value">${detail.chain_position ? detail.chain_position.chain_name : '-'}</span></div>
      <div class="info-row"><span class="info-label">所属环节</span><span class="info-value">${detail.chain_position ? detail.chain_position.node_name : '-'}</span></div>
      <div class="info-row"><span class="info-label">产业角色</span><span class="info-value">${detail.chain_position && detail.chain_position.role === 'core' ? '⭐ 核心企业' : detail.chain_position && detail.chain_position.role === 'supporting' ? '○ 配套企业' : '□ 服务机构'}</span></div>
    </div>
    <div class="enterprise-card">
      <div class="card-title" style="--title-bar-color:#52C41A;font-size:14px">主营产品/服务（${products.length}）</div>
      ${products.length ? `
        <div class="mini-list">
          ${products.map(p => `
            <div class="mini-item">
              <span class="mini-name">${p.product_name}</span>
              <span class="tag ${p.confidence >= 0.6 ? 'tag-success' : 'tag-warning'}">${p.confidence >= 0.6 ? '已核实' : '待核实'}</span>
            </div>
          `).join('')}
        </div>
      ` : '<div class="empty-text">暂无产品/服务数据</div>'}
    </div>
    <div class="enterprise-card">
      <div class="card-title" style="--title-bar-color:#FA8C16;font-size:14px">关联关系（${rels.length}）</div>
      <div class="relation-list">
        ${rels.length ? rels.slice(0, 5).map(r => {
          const isFrom = r.from_enterprise_id === enterpriseId;
          const peerId = isFrom ? r.to_enterprise_id : r.from_enterprise_id;
          const peer = enterprises.find(e => e.id === peerId);
          return `
            <div class="relation-item">
              <span class="tag tag-default">${RELATION_LABELS[r.relation_type]}</span>
              <div class="relation-peer">
                <div class="relation-peer-name">${peer ? peer.name : peerId}</div>
                <div class="relation-peer-type">${isFrom ? ' outgoing' : ' incoming'}</div>
              </div>
              <span class="relation-strength">${(r.relation_strength * 100).toFixed(0)}%</span>
              ${r.transaction_amount ? `<span class="relation-amount">${formatNumber(r.transaction_amount)}万</span>` : ''}
            </div>
          `;
        }).join('') : '<div class="empty-text">暂无关联关系数据</div>'}
      </div>
    </div>
  `;
  document.getElementById('drawerFooter').innerHTML = `
    <button class="btn btn-primary" onclick="window.location.href='enterprise-profile.html?enterpriseId=${encodeURIComponent(enterpriseId)}'">查看完整画像</button>
    <button class="btn btn-default" onclick="closeNetworkDrawer()">关闭</button>
  `;
  document.getElementById('drawerOverlay').classList.add('open');
  document.getElementById('networkDrawer').classList.add('open');
}

function closeNetworkDrawer() {
  document.getElementById('drawerOverlay').classList.remove('open');
  document.getElementById('networkDrawer').classList.remove('open');
}

function exportNetworkReport() {
  const rows = [['源企业', '目标企业', '关系类型', '关系强度', '交易金额（万）', '交易频次', '最近交互日期']];
  getFilteredRelations().forEach(r => {
    const from = enterprises.find(e => e.id === r.from_enterprise_id);
    const to = enterprises.find(e => e.id === r.to_enterprise_id);
    rows.push([
      from ? from.name : r.from_enterprise_id,
      to ? to.name : r.to_enterprise_id,
      RELATION_LABELS[r.relation_type],
      r.relation_strength,
      r.transaction_amount,
      r.transaction_frequency,
      r.last_transaction_date
    ]);
  });
  exportCSV('企业关系网络报告.csv', rows);
  showToast('网络报告已导出', 'success');
}

init();
