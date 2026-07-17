/**
 * 企业画像 - V2 逻辑
 */

let currentEnterpriseId = null;
let enterpriseDetail = null;
let products = [];
let demands = [];
let relations = [];
let relationChart = null;

const ROLE_LABELS = {
  parts_supplier: '零部件供应商',
  manufacturer: '制造商',
  integrator: '集成商',
  terminal: '终端应用',
  service: '服务商',
  enabling: '使能技术企业'
};

const ROLE_COLORS = {
  parts_supplier: '#1890FF',
  manufacturer: '#52C41A',
  integrator: '#722ED1',
  terminal: '#FA8C16',
  service: '#13C2C2',
  enabling: '#EB2F96'
};

const RELATION_LABELS = {
  equity: '股权',
  transaction: '交易',
  cooperation: '合作',
  supply_demand: '供需'
};

const RELATION_COLORS = {
  equity: '#722ED1',
  transaction: '#1890FF',
  cooperation: '#52C41A',
  supply_demand: '#FA8C16'
};

async function init() {
  if (document.getElementById('globalSearchContainer')) {
    document.getElementById('globalSearchContainer').innerHTML = renderGlobalSearch();
  }
  if (document.getElementById('breadcrumbContainer')) {
    document.getElementById('breadcrumbContainer').innerHTML = renderBreadcrumb('enterprise-profile.html');
  }
  const params = getUrlParams();
  currentEnterpriseId = params.enterpriseId;

  if (!currentEnterpriseId) {
    showEnterpriseSelection();
    return;
  }

  await loadData();
  if (!enterpriseDetail) {
    console.warn('企业数据不存在:', currentEnterpriseId);
    showToast(`未找到企业“${currentEnterpriseId || ''}”的画像信息，请重新选择`, 'warning');
    showEnterpriseSelection();
    return;
  }
  renderHeader();
  switchTab('basic');
  window.addEventListener('resize', debounce(() => relationChart && relationChart.resize(), 200));
}

async function showEnterpriseSelection() {
  const header = document.querySelector('.profile-header');
  if (header) header.style.display = 'none';

  const container = document.querySelector('.profile-content-area');
  container.innerHTML = `
    <div class="enterprise-selection-page">
      <div class="selection-header">
        <h2>选择企业</h2>
        <p>请选择要查看的企业画像</p>
      </div>
      <div class="enterprise-search">
        <input type="text" id="enterpriseSearchInput" placeholder="搜索企业名称..." onkeyup="filterEnterprises()">
        <button class="btn btn-primary" onclick="filterEnterprises()">搜索</button>
      </div>
      <div class="enterprise-grid" id="enterpriseGrid">
        <div class="loading-text">加载中...</div>
      </div>
    </div>
  `;

  try {
    const allEnterprises = await MockAPI.getAllEnterprises();
    const grid = document.getElementById('enterpriseGrid');
    grid.innerHTML = allEnterprises.map(ent => `
      <div class="enterprise-card" onclick="window.location.href='enterprise-profile.html?enterpriseId=${encodeURIComponent(ent.id)}'">
        <div class="enterprise-card-header">
          <div class="enterprise-card-icon">${getEnterpriseIcon(ent.industry_role)}</div>
          <div class="enterprise-card-badge">${ent.is_local ? '本区企业' : '外地企业'}</div>
        </div>
        <div class="enterprise-card-name">${ent.name}</div>
        <div class="enterprise-card-tags">
          ${ent.tags ? ent.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
        </div>
        <div class="enterprise-card-meta">
          <span>年营收 ${ent.annual_revenue} 亿</span>
          <span>员工 ${ent.employee_count} 人</span>
        </div>
      </div>
    `).join('');
  } catch (e) {
    console.error('Failed to load enterprises:', e);
    document.getElementById('enterpriseGrid').innerHTML = '<div class="loading-text">加载失败，请刷新重试</div>';
  }
}

function getEnterpriseIcon(role) {
  const icons = {
    'core': '🏢',
    'supporting': '🏭',
    'terminal': '📱',
    'enabling': '💡',
    'integrator': '🔧',
    'service': '💼'
  };
  return icons[role] || '🏢';
}

function filterEnterprises() {
  const keyword = document.getElementById('enterpriseSearchInput').value.toLowerCase();
  const cards = document.querySelectorAll('.enterprise-card');
  cards.forEach(card => {
    const name = card.querySelector('.enterprise-card-name').textContent.toLowerCase();
    card.style.display = name.includes(keyword) ? 'block' : 'none';
  });
}

async function loadData() {
  enterpriseDetail = await MockAPI.getEnterpriseDetail(currentEnterpriseId);
  
  if (!enterpriseDetail) {
    const allEnterprises = await MockAPI.getAllEnterprises();
    enterpriseDetail = allEnterprises.find(e => e.id === currentEnterpriseId);
  }
  
  products = await MockAPI.getEnterpriseProducts(currentEnterpriseId);
  demands = await MockAPI.getEnterpriseDemands(currentEnterpriseId);
  relations = await MockAPI.getEnterpriseRelations(currentEnterpriseId);
}

function renderHeader() {
  if (!enterpriseDetail) return;
  
  const header = document.querySelector('.profile-header');
  if (header) header.style.display = '';
  
  const d = enterpriseDetail;
  document.title = d.name + ' - 企业画像';
  document.getElementById('profileLogo').textContent = d.name.charAt(0);
  document.getElementById('profileName').textContent = d.name;
  document.getElementById('profileRole').textContent = ROLE_LABELS[d.industry_role] || d.industry_role;
  const localTag = document.getElementById('profileLocal');
  localTag.textContent = d.is_local ? '本区企业' : '外地企业';
  localTag.className = 'tag ' + (d.is_local ? 'tag-success' : 'tag-default');
  document.getElementById('profileCode').textContent = '统一信用代码：' + d.credit_code;
  document.getElementById('profileTags').innerHTML = (d.tags || []).map(t => `<span class="tag tag-default">${t}</span>`).join('');

  document.getElementById('profileMetrics').innerHTML = `
    <div class="profile-metric">
      <div class="profile-metric-value">${d.annual_revenue}</div>
      <div class="profile-metric-label">年营收（亿）</div>
    </div>
    <div class="profile-metric">
      <div class="profile-metric-value">${formatNumber(d.employee_count)}</div>
      <div class="profile-metric-label">员工人数</div>
    </div>
    <div class="profile-metric">
      <div class="profile-metric-value">${(d.registered_capital / 10000).toFixed(2)}</div>
      <div class="profile-metric-label">注册资本（亿）</div>
    </div>
    <div class="profile-metric">
      <div class="profile-metric-value">${relations.length}</div>
      <div class="profile-metric-label">关联企业</div>
    </div>
  `;
}

function switchTab(tab) {
  document.querySelectorAll('.profile-tabs .tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  const content = document.getElementById('tabContent');
  content.innerHTML = '';

  switch (tab) {
    case 'basic': renderBasicTab(content); break;
    case 'business': renderBusinessTab(content); break;
    case 'layout': renderLayoutTab(content); break;
    case 'supply': renderSupplyTab(content); break;
    case 'innovation': renderInnovationTab(content); break;
    case 'finance': renderFinanceTab(content); break;
    case 'risk': renderRiskTab(content); break;
    case 'competition': renderCompetitionTab(content); break;
    case 'history': renderHistoryTab(content); break;
    case 'news': renderNewsTab(content); break;
    case 'policy': renderPolicyTab(content); break;
  }
}

function renderBasicTab(container) {
  const d = enterpriseDetail;
  const scaleMap = { large: '大型', medium: '中型', small: '小型', micro: '微型' };
  const statusMap = { active: '存续', revoked: '注销', moved_out: '迁出' };
  
  const tags = d.tags || [];
  const isHighTech = tags.includes('高新技术') || d.high_tech_flag;
  const isSpecialized = tags.includes('专精特新') || tags.includes('小巨人');

  container.innerHTML = `
    <div class="info-section">
      <div class="info-card">
        <div class="info-card-title">工商信息</div>
        <div class="info-row"><span class="info-label">企业名称</span><span class="info-value">${d.name || '-'}</span></div>
        <div class="info-row"><span class="info-label">统一信用代码</span><span class="info-value">${d.credit_code || '-'}</span></div>
        <div class="info-row"><span class="info-label">注册地址</span><span class="info-value">${d.register_address || '-'}</span></div>
        <div class="info-row"><span class="info-label">行业代码</span><span class="info-value">${d.industry_code || '-'}</span></div>
        <div class="info-row"><span class="info-label">成立日期</span><span class="info-value">${d.establishment_date || '-'}</span></div>
      </div>
      <div class="info-card">
        <div class="info-card-title">经营信息</div>
        <div class="info-row"><span class="info-label">法定代表人</span><span class="info-value">${d.legal_person || '-'}</span></div>
        <div class="info-row"><span class="info-label">企业规模</span><span class="info-value">${scaleMap[d.enterprise_scale] || d.enterprise_scale || '-'}</span></div>
        <div class="info-row"><span class="info-label">注册资本</span><span class="info-value">${d.registered_capital ? formatNumber(d.registered_capital) + ' 万' : '-'}</span></div>
        <div class="info-row"><span class="info-label">实缴资本</span><span class="info-value">${d.registered_capital ? formatNumber(Math.floor(d.registered_capital * 0.8)) + ' 万' : '-'}</span></div>
        <div class="info-row"><span class="info-label">员工人数</span><span class="info-value">${d.employee_count ? formatNumber(d.employee_count) + ' 人' : '-'}</span></div>
        <div class="info-row"><span class="info-label">参保人数</span><span class="info-value">${d.employee_count ? formatNumber(Math.floor(d.employee_count * 0.9)) + ' 人' : '-'}</span></div>
        <div class="info-row"><span class="info-label">经营状态</span><span class="info-value">${statusMap[d.status] || d.status || '-'}</span></div>
      </div>
      <div class="info-card">
        <div class="info-card-title">资质标签</div>
        <div class="info-row"><span class="info-label">高新技术企业</span><span class="info-value">${isHighTech ? '是' : '否'}</span></div>
        <div class="info-row"><span class="info-label">专精特新</span><span class="info-value">${isSpecialized ? '是' : '否'}</span></div>
        <div class="info-row"><span class="info-label">规上企业</span><span class="info-value">${d.annual_revenue && d.annual_revenue >= 1 ? '是' : '否'}</span></div>
        <div class="info-row"><span class="info-label">上市企业</span><span class="info-value">否</span></div>
        <div class="info-row"><span class="info-label">企业标签</span><span class="info-value">${tags.length > 0 ? tags.join('、') : '-'}</span></div>
      </div>
      <div class="info-card">
        <div class="info-card-title">属地信息</div>
        <div class="info-row"><span class="info-label">所属园区</span><span class="info-value">${d.is_local ? '深圳前海深港现代服务业合作区' : '外地园区'}</span></div>
        <div class="info-row"><span class="info-label">产业链归属</span><span class="info-value">${d.chain_position?.chain_name || '机器人产业链'}产业链</span></div>
        <div class="info-row"><span class="info-label">网格员</span><span class="info-value">张经理</span></div>
        <div class="info-row"><span class="info-label">联系电话</span><span class="info-value">0755-88888888</span></div>
      </div>
      <div class="info-card" style="grid-column: span 2;">
        <div class="info-card-title">经营范围</div>
        <div style="font-size:13px;color:var(--text-secondary);line-height:1.8">${d.description || '从事自动化设备、智能制造、工业机器人相关业务；提供技术咨询与服务；货物及技术进出口。'}</div>
      </div>
    </div>
  `;
}

function renderBusinessTab(container) {
  const d = enterpriseDetail;
  const cp = d.chain_position || {};

  container.innerHTML = `
    <div class="grid-2">
      <div class="section-card">
        <div class="section-card-title">主营产品/服务清单</div>
        <table class="data-table">
          <thead><tr><th>产品名称</th><th>所属品类</th><th>匹配环节</th><th>状态</th></tr></thead>
          <tbody>
            ${products.map(p => `
              <tr>
                <td><div class="product-name">${p.product_name}</div><div class="product-category">${p.product_category}</div></td>
                <td>${p.product_type}</td>
                <td><span class="tag tag-primary">${cp.node_name || '核心零部件'}</span></td>
                <td><span class="tag tag-success">正常经营</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="section-card">
        <div class="section-card-title">采购需求目录</div>
        <table class="data-table">
          <thead><tr><th>需求名称</th><th>需求品类</th><th>需求规模</th><th>状态</th></tr></thead>
          <tbody>
            ${demands.map(d => `
              <tr>
                <td><div class="product-name">${d.demand_name}</div><div class="product-category">${d.demand_category}</div></td>
                <td>上游采购</td>
                <td>年度采购</td>
                <td><span class="tag tag-warning">持续需求</span></td>
              </tr>
            `).join('')}
            <tr><td colspan="4" class="empty-text">暂无更多采购需求数据</td></tr>
          </tbody>
        </table>
      </div>

      <div class="section-card">
        <div class="section-card-title">销售供给目录</div>
        <table class="data-table">
          <thead><tr><th>产品名称</th><th>下游应用</th><th>供应规模</th><th>覆盖区域</th></tr></thead>
          <tbody>
            ${products.slice(0, 3).map(p => `
              <tr>
                <td><div class="product-name">${p.product_name}</div></td>
                <td><span class="tag tag-default">制造业</span></td>
                <td>年产能100万件</td>
                <td><span class="tag tag-success">全国</span></td>
              </tr>
            `).join('')}
            <tr><td colspan="4" class="empty-text">暂无更多销售数据</td></tr>
          </tbody>
        </table>
      </div>

      <div class="section-card">
        <div class="section-card-title">产业定位说明</div>
        <div class="info-card" style="margin-bottom:12px">
          <div class="info-row"><span class="info-label">本地配套率</span><span class="info-value">65%</span></div>
          <div class="info-row"><span class="info-label">产业链角色</span><span class="info-value">${cp.role === 'core' ? '上游供给' : cp.role === 'supporting' ? '中游制造' : '下游终端'}</span></div>
          <div class="info-row"><span class="info-label">技术领先度</span><span class="info-value">国内领先</span></div>
          <div class="info-row"><span class="info-label">市场份额</span><span class="info-value">区域占比12%</span></div>
        </div>
        <div style="font-size:13px;color:var(--text-secondary);line-height:1.8">
          企业在${cp.chain_name || '人工智能'}产业链中扮演核心配套角色，主要为下游终端厂商提供关键零部件，本地配套率达65%，具有较强的产业链协同能力。
        </div>
      </div>
    </div>
  `;
}

function renderLayoutTab(container) {
  const d = enterpriseDetail;
  const subNames = [
    '深圳市' + d.name.replace('有限公司', '') + '子公司',
    '苏州市' + d.name.replace('有限公司', '') + '子公司',
    '杭州市' + d.name.replace('有限公司', '') + '子公司'
  ];
  container.innerHTML = `
    <div class="grid-2">
      <div class="section-card">
        <div class="section-card-title">股权穿透</div>
        <div class="equity-tree">
          <div class="equity-node parent">
            <div class="equity-node-name">${d.name}</div>
            <div class="equity-node-role">母公司 / 实际控制人</div>
          </div>
          <div class="equity-node child">
            <div class="equity-node-name">${subNames[0]}</div>
            <div class="equity-node-role">参股企业（持股35%）</div>
          </div>
          <div class="equity-node child">
            <div class="equity-node-name">${subNames[1]}</div>
            <div class="equity-node-role">全资子公司</div>
          </div>
          <div class="equity-node child">
            <div class="equity-node-name">${subNames[2]}</div>
            <div class="equity-node-role">控股子公司（持股60%）</div>
          </div>
        </div>
      </div>

      <div class="section-card">
        <div class="section-card-title">分支机构分布</div>
        <div class="location-list">
          <div class="location-item">
            <div class="location-name">深圳总部</div>
            <div class="location-type">📍 广东省深圳市南山区</div>
            <div class="location-type">🏢 总部/研发中心</div>
          </div>
          <div class="location-item">
            <div class="location-name">苏州生产基地</div>
            <div class="location-type">📍 江苏省苏州市工业园区</div>
            <div class="location-type">🏭 生产制造</div>
          </div>
          <div class="location-item">
            <div class="location-name">杭州研发中心</div>
            <div class="location-type">📍 浙江省杭州市滨江区</div>
            <div class="location-type">💡 研发创新</div>
          </div>
          <div class="location-item">
            <div class="location-name">上海销售中心</div>
            <div class="location-type">📍 上海市浦东新区</div>
            <div class="location-type">📤 销售服务</div>
          </div>
        </div>
      </div>

      <div class="section-card" style="grid-column: span 2;">
        <div class="section-card-title">关联企业清单</div>
        <table class="data-table">
          <thead><tr><th>企业名称</th><th>关联类型</th><th>关联频率</th><th>合作品类</th><th>操作</th></tr></thead>
          <tbody>
            ${relations.slice(0, 5).map(r => {
              const freqClass = r.relation_strength > 0.7 ? 'relation-frequency-high' : r.relation_strength > 0.4 ? 'relation-frequency-medium' : 'relation-frequency-low';
              const freqLabel = r.relation_strength > 0.7 ? '高' : r.relation_strength > 0.4 ? '较高' : '普通';
              return `
                <tr>
                  <td><a href="enterprise-profile.html?enterpriseId=${encodeURIComponent(r.from_enterprise_id === currentEnterpriseId ? r.to_enterprise_id : r.from_enterprise_id)}" style="color:var(--primary)">企业名称</a></td>
                  <td><span class="tag tag-default">${RELATION_LABELS[r.relation_type]}</span></td>
                  <td><span class="tag ${freqClass}">${freqLabel}</span></td>
                  <td>零部件供应</td>
                  <td><button class="btn btn-sm btn-default" onclick="window.location.href='enterprise-profile.html?enterpriseId=${encodeURIComponent(r.from_enterprise_id === currentEnterpriseId ? r.to_enterprise_id : r.from_enterprise_id)}'">查看</button></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderSupplyTab(container) {
  container.innerHTML = `
    <div class="section-card">
      <div class="section-card-title">上游供应商列表</div>
      <table class="data-table supply-table">
        <thead><tr><th>供应商名称</th><th>合作频次</th><th>交易品类</th><th>本地/外地</th><th>合作规模</th><th>依赖等级</th></tr></thead>
        <tbody>
          <tr>
            <td><a href="enterprise-profile.html?enterpriseId=e-b" style="color:var(--primary)">深圳精密科技有限公司</a></td>
            <td>高频</td>
            <td>精密减速机</td>
            <td><span class="tag tag-local">本地</span></td>
            <td>年采购5000万</td>
            <td><span class="tag relation-frequency-high">高依赖</span></td>
          </tr>
          <tr>
            <td><a href="enterprise-profile.html?enterpriseId=e-c" style="color:var(--primary)">上海电机科技有限公司</a></td>
            <td>中频</td>
            <td>伺服电机</td>
            <td><span class="tag tag-external">外地</span></td>
            <td>年采购3000万</td>
            <td><span class="tag relation-frequency-medium">中依赖</span></td>
          </tr>
          <tr>
            <td><a href="enterprise-profile.html?enterpriseId=e-d" style="color:var(--primary)">东莞电子元件有限公司</a></td>
            <td>高频</td>
            <td>电子元器件</td>
            <td><span class="tag tag-local">本地</span></td>
            <td>年采购2500万</td>
            <td><span class="tag relation-frequency-high">高依赖</span></td>
          </tr>
          <tr>
            <td><a href="enterprise-profile.html?enterpriseId=e-e" style="color:var(--primary)">江苏传感器科技有限公司</a></td>
            <td>低频</td>
            <td>传感器</td>
            <td><span class="tag tag-external">外地</span></td>
            <td>年采购800万</td>
            <td><span class="tag relation-frequency-low">低依赖</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="section-card">
      <div class="section-card-title">下游客户列表</div>
      <table class="data-table supply-table">
        <thead><tr><th>客户名称</th><th>合作频次</th><th>采购品类</th><th>本地/外地</th><th>订单规模</th></tr></thead>
        <tbody>
          <tr>
            <td><a href="enterprise-profile.html?enterpriseId=e-f" style="color:var(--primary)">深圳智能装备有限公司</a></td>
            <td>高频</td>
            <td>工业机器人整机</td>
            <td><span class="tag tag-local">本地</span></td>
            <td>年供货8000万</td>
          </tr>
          <tr>
            <td><a href="enterprise-profile.html?enterpriseId=e-g" style="color:var(--primary)">广州自动化科技有限公司</a></td>
            <td>中频</td>
            <td>自动化设备</td>
            <td><span class="tag tag-local">本地</span></td>
            <td>年供货4000万</td>
          </tr>
          <tr>
            <td><a href="enterprise-profile.html?enterpriseId=e-h" style="color:var(--primary)">武汉智能制造有限公司</a></td>
            <td>中频</td>
            <td>机器人零部件</td>
            <td><span class="tag tag-external">外地</span></td>
            <td>年供货3000万</td>
          </tr>
          <tr>
            <td><a href="enterprise-profile.html?enterpriseId=e-i" style="color:var(--primary)">成都工业自动化有限公司</a></td>
            <td>低频</td>
            <td>控制系统</td>
            <td><span class="tag tag-external">外地</span></td>
            <td>年供货1500万</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="section-card">
      <div class="section-card-title">关联交易明细</div>
      <table class="data-table supply-table">
        <thead><tr><th>序号</th><th>合作企业</th><th>关联企业</th><th>关联频率</th><th>交易品类</th><th>关联情况说明</th></tr></thead>
        <tbody>
          <tr>
            <td>1</td>
            <td><a href="enterprise-profile.html?enterpriseId=e-b" style="color:var(--primary)">深圳精密科技有限公司</a></td>
            <td>${enterpriseDetail.name}</td>
            <td><span class="tag relation-frequency-high">高</span></td>
            <td>精密减速机采购</td>
            <td>核心供应商，月度采购</td>
          </tr>
          <tr>
            <td>2</td>
            <td><a href="enterprise-profile.html?enterpriseId=e-f" style="color:var(--primary)">深圳智能装备有限公司</a></td>
            <td>${enterpriseDetail.name}</td>
            <td><span class="tag relation-frequency-high">高</span></td>
            <td>机器人整机销售</td>
            <td>核心客户，季度供货</td>
          </tr>
          <tr>
            <td>3</td>
            <td><a href="enterprise-profile.html?enterpriseId=e-c" style="color:var(--primary)">上海电机科技有限公司</a></td>
            <td>${enterpriseDetail.name}</td>
            <td><span class="tag relation-frequency-medium">较高</span></td>
            <td>伺服电机采购</td>
            <td>重要供应商，双月采购</td>
          </tr>
          <tr>
            <td>4</td>
            <td><a href="enterprise-profile.html?enterpriseId=e-g" style="color:var(--primary)">广州自动化科技有限公司</a></td>
            <td>${enterpriseDetail.name}</td>
            <td><span class="tag relation-frequency-medium">较高</span></td>
            <td>自动化设备销售</td>
            <td>重要客户，季度供货</td>
          </tr>
          <tr>
            <td>5</td>
            <td><a href="enterprise-profile.html?enterpriseId=e-e" style="color:var(--primary)">江苏传感器科技有限公司</a></td>
            <td>${enterpriseDetail.name}</td>
            <td><span class="tag relation-frequency-low">普通</span></td>
            <td>传感器采购</td>
            <td>一般供应商，按需采购</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="supply-risk-summary">
      <div class="supply-risk-summary-title">供应链风险小结</div>
      <div class="supply-risk-item high-risk">
        <span class="supply-risk-icon">⚠️</span>
        <div>
          <div style="font-size:13px;font-weight:500;color:var(--danger)">高依赖供应商预警</div>
          <div style="font-size:12px;color:var(--text-secondary)">深圳精密科技有限公司（依赖度90%）存在供货集中风险，建议引入备选供应商</div>
        </div>
      </div>
      <div class="supply-risk-item">
        <span class="supply-risk-icon">🤝</span>
        <div>
          <div style="font-size:13px;font-weight:500;color:var(--text)">本地配套合作机会</div>
          <div style="font-size:12px;color:var(--text-secondary)">东莞电子元件有限公司可进一步深化合作，提升本地配套率</div>
        </div>
      </div>
      <div class="supply-risk-item">
        <span class="supply-risk-icon">📊</span>
        <div>
          <div style="font-size:13px;font-weight:500;color:var(--text)">断供风险提示</div>
          <div style="font-size:12px;color:var(--text-secondary)">当前无断供风险，供应链整体稳定</div>
        </div>
      </div>
    </div>
  `;
}

function renderInnovationTab(container) {
  container.innerHTML = `
    <div class="grid-2">
      <div class="section-card">
        <div class="section-card-title">专利统计</div>
        <div class="grid-3">
          <div class="info-card" style="text-align:center">
            <div style="font-size:28px;font-weight:700;color:var(--primary)">45</div>
            <div style="font-size:12px;color:var(--text-secondary);margin-top:4px">发明专利</div>
          </div>
          <div class="info-card" style="text-align:center">
            <div style="font-size:28px;font-weight:700;color:var(--success)">68</div>
            <div style="font-size:12px;color:var(--text-secondary);margin-top:4px">实用新型</div>
          </div>
          <div class="info-card" style="text-align:center">
            <div style="font-size:28px;font-weight:700;color:var(--purple)">23</div>
            <div style="font-size:12px;color:var(--text-secondary);margin-top:4px">软件著作权</div>
          </div>
        </div>
      </div>

      <div class="section-card">
        <div class="section-card-title">科创评分</div>
        <div class="innovation-score">
          <div class="innovation-score-circle">85</div>
          <div class="innovation-score-info">
            <div class="innovation-score-label">综合科创评分</div>
            <div class="innovation-score-value">优秀（85分）</div>
          </div>
        </div>
      </div>

      <div class="section-card">
        <div class="section-card-title">研发投入</div>
        <div class="info-card">
          <div class="info-row"><span class="info-label">研发投入金额</span><span class="info-value">2.5亿元/年</span></div>
          <div class="info-row"><span class="info-label">研发投入占比</span><span class="info-value">8.5%</span></div>
          <div class="info-row"><span class="info-label">研发人员数量</span><span class="info-value">320人</span></div>
          <div class="info-row"><span class="info-label">研发人员占比</span><span class="info-value">28%</span></div>
        </div>
      </div>

      <div class="section-card">
        <div class="section-card-title">产学研合作平台</div>
        <div class="info-card">
          <div class="info-row"><span class="info-label">合作高校</span><span class="info-value">清华大学、哈尔滨工业大学</span></div>
          <div class="info-row"><span class="info-label">科研机构</span><span class="info-value">中科院自动化研究所</span></div>
          <div class="info-row"><span class="info-label">共建实验室</span><span class="info-value">机器人控制技术联合实验室</span></div>
          <div class="info-row"><span class="info-label">博士后工作站</span><span class="info-value">有</span></div>
        </div>
      </div>

      <div class="section-card" style="grid-column: span 2;">
        <div class="section-card-title">核心技术对应产业链环节</div>
        <table class="data-table">
          <thead><tr><th>技术领域</th><th>核心技术</th><th>对应产业链环节</th><th>技术水平</th></tr></thead>
          <tbody>
            <tr>
              <td>运动控制</td>
              <td>高性能伺服驱动技术</td>
              <td><span class="tag tag-primary">核心零部件</span></td>
              <td><span class="tag tag-success">国内领先</span></td>
            </tr>
            <tr>
              <td>机器视觉</td>
              <td>高精度视觉识别算法</td>
              <td><span class="tag tag-primary">核心零部件</span></td>
              <td><span class="tag tag-success">国内领先</span></td>
            </tr>
            <tr>
              <td>人工智能</td>
              <td>工业机器人路径规划</td>
              <td><span class="tag tag-primary">机器人本体</span></td>
              <td><span class="tag tag-warning">行业先进</span></td>
            </tr>
            <tr>
              <td>自动化</td>
              <td>柔性生产线控制系统</td>
              <td><span class="tag tag-primary">系统集成</span></td>
              <td><span class="tag tag-success">国内领先</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderFinanceTab(container) {
  container.innerHTML = `
    <div class="section-card">
      <div class="section-card-title">近三年营收趋势</div>
      <div id="financeChart" class="finance-chart"></div>
    </div>

    <div class="grid-2">
      <div class="section-card">
        <div class="section-card-title">财务概览</div>
        <div class="info-card">
          <div class="info-row"><span class="info-label">2025年营收</span><span class="info-value">29.4亿元</span></div>
          <div class="info-row"><span class="info-label">2025年纳税</span><span class="info-value">2.1亿元</span></div>
          <div class="info-row"><span class="info-label">2025年利润</span><span class="info-value">3.8亿元</span></div>
          <div class="info-row"><span class="info-label">注册资本</span><span class="info-value">${formatNumber(enterpriseDetail.registered_capital)}万元</span></div>
          <div class="info-row"><span class="info-label">授信规模</span><span class="info-value">5亿元</span></div>
          <div class="info-row"><span class="info-label">重点税源</span><span class="info-value"><span class="tag tag-danger">是</span></span></div>
        </div>
      </div>

      <div class="section-card">
        <div class="section-card-title">投融资事件</div>
        <div class="timeline" style="padding-left:0">
          <div class="timeline-item" style="position:relative;padding-left:24px">
            <div style="position:absolute;left:0;top:20px;width:8px;height:8px;border-radius:50%;background:var(--success)"></div>
            <div class="timeline-date">2025-03</div>
            <div class="timeline-title">B轮融资</div>
            <div class="timeline-desc">获得深创投领投的2亿元融资，估值15亿元</div>
          </div>
          <div class="timeline-item" style="position:relative;padding-left:24px">
            <div style="position:absolute;left:0;top:20px;width:8px;height:8px;border-radius:50%;background:var(--primary)"></div>
            <div class="timeline-date">2024-06</div>
            <div class="timeline-title">A轮融资</div>
            <div class="timeline-desc">获得天使轮投资方追加投资5000万元</div>
          </div>
          <div class="timeline-item" style="position:relative;padding-left:24px">
            <div style="position:absolute;left:0;top:20px;width:8px;height:8px;border-radius:50%;background:var(--primary)"></div>
            <div class="timeline-date">2023-12</div>
            <div class="timeline-title">天使轮融资</div>
            <div class="timeline-desc">获得松禾资本等机构投资3000万元</div>
          </div>
        </div>
      </div>
    </div>

    <div class="section-card">
      <div class="section-card-title">资本流动</div>
      <div class="info-card">
        <div class="capital-flow-item"><span class="capital-flow-label">经营活动现金流</span><span class="capital-flow-value positive">+4.2亿元</span></div>
        <div class="capital-flow-item"><span class="capital-flow-label">投资活动现金流</span><span class="capital-flow-value negative">-1.8亿元</span></div>
        <div class="capital-flow-item"><span class="capital-flow-label">筹资活动现金流</span><span class="capital-flow-value positive">+2.0亿元</span></div>
        <div class="capital-flow-item"><span class="capital-flow-label">现金及等价物净增加</span><span class="capital-flow-value positive">+4.4亿元</span></div>
      </div>
    </div>
  `;

  setTimeout(() => {
    const chart = echarts.init(document.getElementById('financeChart'));
    chart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['营收', '利润', '纳税'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: ['2023年', '2024年', '2025年']
      },
      yAxis: { type: 'value', axisLabel: { formatter: '{value}亿' } },
      series: [
        { name: '营收', type: 'bar', data: [22, 26.8, 29.4], itemStyle: { color: '#165DFF' } },
        { name: '利润', type: 'bar', data: [2.5, 3.2, 3.8], itemStyle: { color: '#52C41A' } },
        { name: '纳税', type: 'line', data: [1.5, 1.8, 2.1], itemStyle: { color: '#FA8C16' } }
      ]
    });
  }, 0);
}

function renderRiskTab(container) {
  container.innerHTML = `
    <div class="risk-category">
      <div class="risk-category-card high">
        <div class="risk-category-title">经营风险</div>
        <div class="risk-item">
          <div class="risk-item-title">司法风险</div>
          <div class="risk-item-desc">无司法诉讼记录</div>
        </div>
        <div class="risk-item">
          <div class="risk-item-title">失信记录</div>
          <div class="risk-item-desc">无失信被执行人记录</div>
        </div>
        <div class="risk-item">
          <div class="risk-item-title">经营异常</div>
          <div class="risk-item-desc">无经营异常记录</div>
        </div>
      </div>

      <div class="risk-category-card medium">
        <div class="risk-category-title">供应链断供风险</div>
        <div class="risk-item">
          <div class="risk-item-title">核心供应商依赖</div>
          <div class="risk-item-desc">高依赖供应商1家，存在供货集中风险</div>
        </div>
        <div class="risk-item">
          <div class="risk-item-title">原材料价格波动</div>
          <div class="risk-item-desc">原材料价格上涨5%，影响利润</div>
        </div>
        <div class="risk-item">
          <div class="risk-item-title">物流运输风险</div>
          <div class="risk-item-desc">当前物流畅通，无明显风险</div>
        </div>
      </div>

      <div class="risk-category-card low">
        <div class="risk-category-title">产业缺口依赖风险</div>
        <div class="risk-item">
          <div class="risk-item-title">产业链缺口影响</div>
          <div class="risk-item-desc">上游精密减速机环节存在缺口，依赖外部供应</div>
        </div>
        <div class="risk-item">
          <div class="risk-item-title">本地配套率</div>
          <div class="risk-item-desc">本地配套率65%，低于行业平均水平</div>
        </div>
        <div class="risk-item">
          <div class="risk-item-title">风险等级</div>
          <div class="risk-item-desc"><span class="tag tag-success">无风险</span></div>
        </div>
      </div>
    </div>

    <div class="section-card">
      <div class="section-card-title">风险预警记录</div>
      <div class="timeline">
        <div class="timeline-item">
          <div class="timeline-date">2026-06-15</div>
          <div class="timeline-title">供应链风险预警</div>
          <div class="timeline-desc">上游供应商深圳精密科技有限公司供货延迟，已启动备选供应商</div>
        </div>
        <div class="timeline-item">
          <div class="timeline-date">2026-05-20</div>
          <div class="timeline-title">经营风险提示</div>
          <div class="timeline-desc">原材料成本上涨，建议优化采购策略</div>
        </div>
        <div class="timeline-item">
          <div class="timeline-date">2026-04-10</div>
          <div class="timeline-title">产业链缺口预警</div>
          <div class="timeline-desc">精密减速机环节本地配套率不足，建议引进补链企业</div>
        </div>
      </div>
    </div>
  `;
}

function renderCompetitionTab(container) {
  container.innerHTML = `
    <div class="section-card">
      <div class="section-card-title">本区同赛道竞品清单</div>
      <div class="competitor-list">
        <div class="competitor-card">
          <div class="competitor-name">深圳智动科技有限公司</div>
          <div class="competitor-meta">
            <span>📍 本区企业</span>
            <span>🏢 制造业</span>
          </div>
          <div class="competitor-compare">主营产品：工业机器人 | 年营收：25亿 | 市场份额：10%</div>
        </div>
        <div class="competitor-card">
          <div class="competitor-name">深圳自动化设备有限公司</div>
          <div class="competitor-meta">
            <span>📍 本区企业</span>
            <span>🏢 制造业</span>
          </div>
          <div class="competitor-compare">主营产品：自动化生产线 | 年营收：18亿 | 市场份额：8%</div>
        </div>
        <div class="competitor-card">
          <div class="competitor-name">深圳智能装备有限公司</div>
          <div class="competitor-meta">
            <span>📍 本区企业</span>
            <span>🏢 制造业</span>
          </div>
          <div class="competitor-compare">主营产品：智能机器人 | 年营收：32亿 | 市场份额：15%</div>
        </div>
        <div class="competitor-card">
          <div class="competitor-name">深圳科创机器人有限公司</div>
          <div class="competitor-meta">
            <span>📍 本区企业</span>
            <span>🏢 制造业</span>
          </div>
          <div class="competitor-compare">主营产品：协作机器人 | 年营收：12亿 | 市场份额：5%</div>
        </div>
      </div>
    </div>

    <div class="section-card">
      <div class="section-card-title">全国头部对标企业</div>
      <table class="data-table">
        <thead><tr><th>企业名称</th><th>所在城市</th><th>年营收</th><th>市场份额</th><th>核心优势</th></tr></thead>
        <tbody>
          <tr>
            <td>汇川技术</td>
            <td>深圳</td>
            <td>29.4亿</td>
            <td>12%</td>
            <td>伺服系统领先</td>
          </tr>
          <tr>
            <td>埃斯顿自动化</td>
            <td>南京</td>
            <td>55亿</td>
            <td>18%</td>
            <td>全产业链布局</td>
          </tr>
          <tr>
            <td>机器人</td>
            <td>沈阳</td>
            <td>48亿</td>
            <td>15%</td>
            <td>工业机器人龙头</td>
          </tr>
          <tr>
            <td>拓斯达</td>
            <td>东莞</td>
            <td>35亿</td>
            <td>10%</td>
            <td>自动化解决方案</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="grid-2">
      <div class="section-card">
        <div class="section-card-title">产能对比</div>
        <div id="capacityChart" style="height:250px"></div>
      </div>
      <div class="section-card">
        <div class="section-card-title">企业优劣势分析</div>
        <div class="info-card">
          <div style="font-size:13px;font-weight:600;color:var(--success);margin-bottom:8px">优势</div>
          <ul style="padding-left:20px;font-size:13px;color:var(--text-secondary);line-height:1.8">
            <li>技术研发实力强，专利数量领先</li>
            <li>本地配套率较高，供应链稳定</li>
            <li>客户资源丰富，市场口碑良好</li>
          </ul>
          <div style="font-size:13px;font-weight:600;color:var(--danger);margin:12px 0 8px">劣势</div>
          <ul style="padding-left:20px;font-size:13px;color:var(--text-secondary);line-height:1.8">
            <li>产能规模较小，规模化优势不足</li>
            <li>品牌影响力不及头部企业</li>
            <li>海外市场拓展较弱</li>
          </ul>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    const chart = echarts.init(document.getElementById('capacityChart'));
    chart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['本企业', '埃斯顿', '机器人'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['2023', '2024', '2025'] },
      yAxis: { type: 'value', axisLabel: { formatter: '{value}万件' } },
      series: [
        { name: '本企业', type: 'bar', data: [80, 100, 120], itemStyle: { color: '#165DFF' } },
        { name: '埃斯顿', type: 'bar', data: [200, 250, 300], itemStyle: { color: '#FA8C16' } },
        { name: '机器人', type: 'bar', data: [180, 220, 260], itemStyle: { color: '#52C41A' } }
      ]
    });
  }, 0);
}

function renderHistoryTab(container) {
  container.innerHTML = `
    <div class="timeline">
      <div class="timeline-item">
        <div class="timeline-date">2025-12</div>
        <div class="timeline-title">重大项目落地</div>
        <div class="timeline-desc">投资5亿元建设智能制造产业园，预计2026年投产</div>
      </div>
      <div class="timeline-item">
        <div class="timeline-date">2025-06</div>
        <div class="timeline-title">B轮融资完成</div>
        <div class="timeline-desc">获得深创投领投的2亿元融资，公司估值达15亿元</div>
      </div>
      <div class="timeline-item">
        <div class="timeline-date">2024-09</div>
        <div class="timeline-title">扩产升级</div>
        <div class="timeline-desc">完成生产线智能化改造，产能提升50%</div>
      </div>
      <div class="timeline-item">
        <div class="timeline-date">2024-03</div>
        <div class="timeline-title">获得国家级专精特新认定</div>
        <div class="timeline-desc">被认定为国家级专精特新小巨人企业</div>
      </div>
      <div class="timeline-item">
        <div class="timeline-date">2023-06</div>
        <div class="timeline-title">高新技术企业认定</div>
        <div class="timeline-desc">通过国家高新技术企业认定</div>
      </div>
      <div class="timeline-item">
        <div class="timeline-date">2022-04</div>
        <div class="timeline-title">企业成立</div>
        <div class="timeline-desc">在深圳前海注册成立，注册资本1亿元</div>
      </div>
    </div>
  `;
}

function renderNewsTab(container) {
  container.innerHTML = `
    <div class="news-list">
      <div class="news-item">
        <div class="news-icon">📋</div>
        <div class="news-content">
          <div class="news-title">中标深圳市智能制造装备采购项目</div>
          <div class="news-meta">2026-06-20 · 招投标公告</div>
        </div>
      </div>
      <div class="news-item">
        <div class="news-icon">🏭</div>
        <div class="news-content">
          <div class="news-title">智能制造产业园项目正式投产</div>
          <div class="news-meta">2026-06-15 · 项目投产</div>
        </div>
      </div>
      <div class="news-item">
        <div class="news-icon">💰</div>
        <div class="news-content">
          <div class="news-title">完成B轮融资2亿元，深创投领投</div>
          <div class="news-meta">2025-12-10 · 融资合作</div>
        </div>
      </div>
      <div class="news-item">
        <div class="news-icon">📰</div>
        <div class="news-content">
          <div class="news-title">深圳机器人产业发展白皮书发布，${enterpriseDetail.name}入选标杆企业</div>
          <div class="news-meta">2025-11-25 · 产业新闻</div>
        </div>
      </div>
      <div class="news-item">
        <div class="news-icon">📋</div>
        <div class="news-content">
          <div class="news-title">中标广州市自动化生产线项目</div>
          <div class="news-meta">2025-10-18 · 招投标公告</div>
        </div>
      </div>
      <div class="news-item">
        <div class="news-icon">💡</div>
        <div class="news-content">
          <div class="news-title">与清华大学联合研发项目取得重大突破</div>
          <div class="news-meta">2025-09-05 · 技术研发</div>
        </div>
      </div>
    </div>
  `;
}

function renderPolicyTab(container) {
  container.innerHTML = `
    <div class="section-card">
      <div class="section-card-title">已享受补贴政策</div>
      <div class="policy-list">
        <div class="policy-item applied">
          <div class="policy-title">深圳市科技创新券补贴</div>
          <div class="policy-desc">获得科技创新券补贴50万元，用于研发设备采购</div>
          <div class="policy-meta">
            <span>金额：50万元</span>
            <span>发放时间：2025-06</span>
            <span>状态：已发放</span>
          </div>
        </div>
        <div class="policy-item applied">
          <div class="policy-title">国家级专精特新企业奖励</div>
          <div class="policy-desc">获得国家级专精特新小巨人企业一次性奖励100万元</div>
          <div class="policy-meta">
            <span>金额：100万元</span>
            <span>发放时间：2024-09</span>
            <span>状态：已发放</span>
          </div>
        </div>
        <div class="policy-item applied">
          <div class="policy-title">前海产业扶持资金</div>
          <div class="policy-desc">获得前海现代服务业综合试点扶持资金80万元</div>
          <div class="policy-meta">
            <span>金额：80万元</span>
            <span>发放时间：2024-03</span>
            <span>状态：已发放</span>
          </div>
        </div>
      </div>
    </div>

    <div class="section-card">
      <div class="section-card-title">适配待申报产业政策</div>
      <div class="policy-list">
        <div class="policy-item recommended">
          <div class="policy-title">深圳市机器人产业扶持计划</div>
          <div class="policy-desc">支持机器人核心零部件研发与产业化，单个项目最高资助500万元</div>
          <div class="policy-meta">
            <span>申报截止：2026-08-31</span>
            <span>适配度：90%</span>
          </div>
          <button class="btn btn-sm btn-primary" style="margin-top:8px">去申报</button>
        </div>
        <div class="policy-item recommended">
          <div class="policy-title">广东省智能制造专项资金</div>
          <div class="policy-desc">支持智能制造装备研发、生产及应用推广，最高资助300万元</div>
          <div class="policy-meta">
            <span>申报截止：2026-09-15</span>
            <span>适配度：85%</span>
          </div>
          <button class="btn btn-sm btn-primary" style="margin-top:8px">去申报</button>
        </div>
        <div class="policy-item recommended">
          <div class="policy-title">深圳市研发投入激励计划</div>
          <div class="policy-desc">对企业研发投入给予一定比例的事后资助，最高不超过500万元</div>
          <div class="policy-meta">
            <span>申报截止：2026-10-31</span>
            <span>适配度：80%</span>
          </div>
          <button class="btn btn-sm btn-primary" style="margin-top:8px">去申报</button>
        </div>
      </div>
    </div>

    <div class="section-card">
      <div class="section-card-title">历史补贴发放记录</div>
      <table class="data-table">
        <thead><tr><th>政策名称</th><th>补贴金额</th><th>发放时间</th><th>资金用途</th><th>状态</th></tr></thead>
        <tbody>
          <tr>
            <td>深圳市科技创新券补贴</td>
            <td>50万元</td>
            <td>2025-06-15</td>
            <td>研发设备采购</td>
            <td><span class="tag tag-success">已发放</span></td>
          </tr>
          <tr>
            <td>国家级专精特新企业奖励</td>
            <td>100万元</td>
            <td>2024-09-20</td>
            <td>企业发展资金</td>
            <td><span class="tag tag-success">已发放</span></td>
          </tr>
          <tr>
            <td>前海产业扶持资金</td>
            <td>80万元</td>
            <td>2024-03-10</td>
            <td>研发投入</td>
            <td><span class="tag tag-success">已发放</span></td>
          </tr>
          <tr>
            <td>高新技术企业认定奖励</td>
            <td>30万元</td>
            <td>2023-08-25</td>
            <td>企业发展资金</td>
            <td><span class="tag tag-success">已发放</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

init();