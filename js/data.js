/**
 * 产业链/供应链图谱系统 - V2 Mock 数据
 * 数据模型适配《产业链供应链系统_产业图谱完整PRD_V2.md》
 */

// 前海「6+4+2」产业矩阵：六大现代服务业 + 四大战略性新兴产业 + 两大重点前瞻产业
const MOCK_INDUSTRY_CHAINS = [
  // ==================== 一、六大现代服务业 ====================
  {
    id: 'chain-007',
    name: '信息服务',
    category: 'information',
    matrix_group: 'modern_service',
    strategic_orientation: 'chain_master',
    life_cycle: 'emerging',
    enabling_tags: ['ai', 'industrial_internet'],
    completeness_score: 78,
    enterprise_count: 412,
    tax_contribution: 26.8,
    employment_count: 9800,
    revenue_total: 128.6,
    projects_under_construction: 4,
    investment_completed: 3,
    growth_rate: 14.6,
    key_gaps: [
      { name: '云计算基础设施', count: 2 },
      { name: '数据安全服务', count: 1 }
    ],
    gap_count: 3
  },
  {
    id: 'chain-008',
    name: '金融服务',
    category: 'finance',
    matrix_group: 'modern_service',
    strategic_orientation: 'chain_master',
    life_cycle: 'advantage_traditional',
    enabling_tags: ['ai', 'green_energy'],
    completeness_score: 85,
    enterprise_count: 356,
    tax_contribution: 42.3,
    employment_count: 7600,
    revenue_total: 186.4,
    projects_under_construction: 2,
    investment_completed: 2,
    growth_rate: 8.9,
    key_gaps: [
      { name: '跨境支付结算', count: 3 },
      { name: '绿色金融产品', count: 2 }
    ],
    gap_count: 2
  },
  {
    id: 'chain-009',
    name: '贸易物流',
    category: 'logistics',
    matrix_group: 'modern_service',
    strategic_orientation: 'core_pillar',
    life_cycle: 'advantage_traditional',
    enabling_tags: ['iot', 'industrial_internet'],
    completeness_score: 82,
    enterprise_count: 528,
    tax_contribution: 31.6,
    employment_count: 12500,
    revenue_total: 215.8,
    projects_under_construction: 3,
    investment_completed: 4,
    growth_rate: 11.2,
    key_gaps: [
      { name: '海外仓网络', count: 1 },
      { name: '冷链物流装备', count: 2 }
    ],
    gap_count: 3
  },
  {
    id: 'chain-010',
    name: '专业服务',
    category: 'professional',
    matrix_group: 'modern_service',
    strategic_orientation: 'core_pillar',
    life_cycle: 'emerging',
    enabling_tags: ['ai'],
    completeness_score: 74,
    enterprise_count: 268,
    tax_contribution: 15.2,
    employment_count: 5400,
    revenue_total: 68.4,
    projects_under_construction: 2,
    investment_completed: 1,
    growth_rate: 16.8,
    key_gaps: [
      { name: '涉外法律服务', count: 0 },
      { name: '国际仲裁机构', count: 1 }
    ],
    gap_count: 3
  },
  {
    id: 'chain-011',
    name: '科技服务',
    category: 'tech_service',
    matrix_group: 'modern_service',
    strategic_orientation: 'core_pillar',
    life_cycle: 'emerging',
    enabling_tags: ['ai', 'iot'],
    completeness_score: 71,
    enterprise_count: 234,
    tax_contribution: 12.8,
    employment_count: 4600,
    revenue_total: 56.2,
    projects_under_construction: 3,
    investment_completed: 2,
    growth_rate: 18.5,
    key_gaps: [
      { name: '检验检测认证', count: 2 },
      { name: '技术转移服务', count: 1 }
    ],
    gap_count: 2
  },
  {
    id: 'chain-012',
    name: '文体旅商',
    category: 'culture_tourism',
    matrix_group: 'modern_service',
    strategic_orientation: 'cultivating',
    life_cycle: 'advantage_traditional',
    enabling_tags: ['ai', 'iot'],
    completeness_score: 66,
    enterprise_count: 186,
    tax_contribution: 9.6,
    employment_count: 8900,
    revenue_total: 42.7,
    projects_under_construction: 2,
    investment_completed: 1,
    growth_rate: 12.4,
    key_gaps: [
      { name: '高端演艺场馆', count: 0 },
      { name: '邮轮旅游服务', count: 1 }
    ],
    gap_count: 4
  },
  // ==================== 二、四大战略性新兴产业 ====================
  {
    id: 'chain-robot',
    name: '人工智能与具身智能机器人',
    category: 'information',
    matrix_group: 'strategic_emerging',
    strategic_orientation: 'chain_master',
    life_cycle: 'emerging',
    enabling_tags: ['ai', 'iot', 'industrial_internet'],
    completeness_score: 58,
    enterprise_count: 386,
    tax_contribution: 22.4,
    employment_count: 8200,
    revenue_total: 96.5,
    projects_under_construction: 6,
    investment_completed: 3,
    growth_rate: 32.6,
    key_gaps: [
      { name: '精密减速机', count: 0 },
      { name: '具身智能大模型', count: 1 }
    ],
    gap_count: 5
  },
  {
    id: 'chain-002',
    name: '海洋产业',
    category: 'marine',
    matrix_group: 'strategic_emerging',
    strategic_orientation: 'core_pillar',
    life_cycle: 'emerging',
    enabling_tags: ['iot', 'green_energy'],
    completeness_score: 52,
    enterprise_count: 142,
    tax_contribution: 8.6,
    employment_count: 3600,
    revenue_total: 38.9,
    projects_under_construction: 4,
    investment_completed: 2,
    growth_rate: 24.3,
    key_gaps: [
      { name: '深海探测装备', count: 0 },
      { name: '海洋传感器', count: 1 }
    ],
    gap_count: 4
  },
  {
    id: 'chain-004',
    name: '智能终端',
    category: 'information',
    matrix_group: 'strategic_emerging',
    strategic_orientation: 'chain_master',
    life_cycle: 'emerging',
    enabling_tags: ['ai', 'iot'],
    completeness_score: 69,
    enterprise_count: 312,
    tax_contribution: 18.9,
    employment_count: 6800,
    revenue_total: 88.2,
    projects_under_construction: 5,
    investment_completed: 3,
    growth_rate: 21.7,
    key_gaps: [
      { name: '高端显示面板', count: 2 },
      { name: '射频前端芯片', count: 1 }
    ],
    gap_count: 4
  },
  {
    id: 'chain-005',
    name: '低空经济',
    category: 'low_altitude',
    matrix_group: 'strategic_emerging',
    strategic_orientation: 'cultivating',
    life_cycle: 'future',
    enabling_tags: ['ai', 'iot', 'industrial_internet'],
    completeness_score: 46,
    enterprise_count: 98,
    tax_contribution: 5.2,
    employment_count: 2400,
    revenue_total: 22.6,
    projects_under_construction: 5,
    investment_completed: 2,
    growth_rate: 38.9,
    key_gaps: [
      { name: 'eVTOL整机', count: 0 },
      { name: '低空空域管理', count: 0 }
    ],
    gap_count: 6
  },
  // ==================== 三、两大重点前瞻产业 ====================
  {
    id: 'chain-003',
    name: '细胞与基因',
    category: 'biotech',
    matrix_group: 'forward_looking',
    strategic_orientation: 'cultivating',
    life_cycle: 'future',
    enabling_tags: ['ai'],
    completeness_score: 44,
    enterprise_count: 86,
    tax_contribution: 4.8,
    employment_count: 2100,
    revenue_total: 18.5,
    projects_under_construction: 3,
    investment_completed: 1,
    growth_rate: 28.6,
    key_gaps: [
      { name: '基因测序设备', count: 0 },
      { name: '细胞治疗CDMO', count: 1 }
    ],
    gap_count: 5
  },
  {
    id: 'chain-006',
    name: '数据产业',
    category: 'data_industry',
    matrix_group: 'forward_looking',
    strategic_orientation: 'cultivating',
    life_cycle: 'future',
    enabling_tags: ['ai', 'industrial_internet'],
    completeness_score: 51,
    enterprise_count: 124,
    tax_contribution: 6.2,
    employment_count: 2800,
    revenue_total: 26.8,
    projects_under_construction: 4,
    investment_completed: 2,
    growth_rate: 35.2,
    key_gaps: [
      { name: '数据交易所', count: 1 },
      { name: '隐私计算', count: 0 }
    ],
    gap_count: 4
  }
];

const MOCK_SUPPLY_DEMAND_GAPS = [
  { rank: 1, product_category: '精密减速机', enterprise_count: 3, gap_type: '供应缺口', estimated_amount: 2.5 },
  { rank: 2, product_category: '高端运动控制器', enterprise_count: 2, gap_type: '供应缺口', estimated_amount: 1.8 },
  { rank: 3, product_category: '视觉传感器', enterprise_count: 2, gap_type: '供应缺口', estimated_amount: 1.2 },
  { rank: 4, product_category: '喷涂机器人', enterprise_count: 2, gap_type: '需求缺口', estimated_amount: 0.9 },
  { rank: 5, product_category: '激光加工设备', enterprise_count: 1, gap_type: '供应缺口', estimated_amount: 0.6 }
];

const MOCK_RISKS = [
  { risk_level: '紧急', enterprise_name: '汽车厂A', risk_type: '精密减速机外地依赖', affected_count: 3, occurred_at: '2026-07-06' },
  { risk_level: '重要', enterprise_name: '集成商B', risk_type: '控制器单一供应商', affected_count: 2, occurred_at: '2026-07-05' },
  { risk_level: '重要', enterprise_name: '本体厂C', risk_type: '上游电机价格波动', affected_count: 2, occurred_at: '2026-07-04' },
  { risk_level: '关注', enterprise_name: '传感器厂G', risk_type: '产能利用率下降', affected_count: 1, occurred_at: '2026-07-03' },
  { risk_level: '关注', enterprise_name: '电机厂F', risk_type: '原材料成本上升', affected_count: 1, occurred_at: '2026-07-02' }
];

const MOCK_HEATMAP = {
  services: ['金融服务', '贸易物流', '科技服务', '人力资源', '检验检测'],
  industries: ['具身智能机器人', '海洋产业', '细胞与基因', '智能终端', '低空经济'],
  data: [
    [86, 72, 45, 38, 92],
    [65, 88, 56, 42, 78],
    [34, 28, 62, 95, 51],
    [22, 18, 35, 68, 44],
    [55, 48, 29, 31, 60]
  ]
};

// V2 产业分类树（机器人产业示例，3-4层）
const MOCK_CATEGORY_TREES = {
  'chain-robot': {
    chainId: 'chain-robot',
    tree: [
      {
        id: 'cr-l1-1',
        name: '机器人',
        level: 1,
        isLeaf: false,
        children: [
          {
            id: 'cr-l2-1',
            name: '核心零部件',
            level: 2,
            isLeaf: false,
            children: [
              {
                id: 'cr-l3-1',
                name: '控制器',
                level: 3,
                isLeaf: false,
                children: [
                  { id: 'cr-l4-1', name: 'MCU（微控制器）', level: 4, isLeaf: true, nationalCount: 437, localCount: 12, status: 'normal' },
                  { id: 'cr-l4-2', name: '电机控制器', level: 4, isLeaf: true, nationalCount: 1641, localCount: 8, status: 'normal' },
                  { id: 'cr-l4-3', name: '视觉控制器', level: 4, isLeaf: true, nationalCount: 111, localCount: 0, status: 'missing' },
                  { id: 'cr-l4-4', name: '伺服控制器', level: 4, isLeaf: true, nationalCount: 3057, localCount: 25, status: 'advantage' }
                ]
              },
              {
                id: 'cr-l3-2',
                name: '减速器',
                level: 3,
                isLeaf: false,
                children: [
                  { id: 'cr-l4-5', name: '精密减速机', level: 4, isLeaf: true, nationalCount: 8314, localCount: 0, status: 'missing' }
                ]
              },
              {
                id: 'cr-l3-3',
                name: '智能芯片',
                level: 3,
                isLeaf: false,
                children: [
                  { id: 'cr-l4-6', name: '人工智能芯片', level: 4, isLeaf: true, nationalCount: 708, localCount: 3, status: 'normal' },
                  { id: 'cr-l4-7', name: '机器人芯片', level: 4, isLeaf: true, nationalCount: 1233, localCount: 5, status: 'normal' }
                ]
              },
              {
                id: 'cr-l3-4',
                name: '传感器',
                level: 3,
                isLeaf: true,
                nationalCount: 97510,
                localCount: 156,
                status: 'advantage'
              }
            ]
          },
          {
            id: 'cr-l2-2',
            name: '机器人本体',
            level: 2,
            isLeaf: false,
            children: [
              { id: 'cr-l3-5', name: '直角坐标型', level: 3, isLeaf: true, nationalCount: 70, localCount: 5, status: 'normal' },
              { id: 'cr-l3-6', name: '球坐标型', level: 3, isLeaf: true, nationalCount: 2, localCount: 0, status: 'missing' },
              { id: 'cr-l3-7', name: '圆柱坐标型', level: 3, isLeaf: true, nationalCount: 22, localCount: 1, status: 'normal' },
              { id: 'cr-l3-8', name: '关节坐标型', level: 3, isLeaf: true, nationalCount: 442, localCount: 18, status: 'advantage' }
            ]
          },
          {
            id: 'cr-l2-3',
            name: '集成系统',
            level: 2,
            isLeaf: false,
            children: [
              { id: 'cr-l3-9', name: '焊接服务', level: 3, isLeaf: true, nationalCount: 1400, localCount: 22, status: 'advantage' },
              { id: 'cr-l3-10', name: '激光加工', level: 3, isLeaf: true, nationalCount: 10432, localCount: 8, status: 'normal' },
              { id: 'cr-l3-11', name: '喷涂服务', level: 3, isLeaf: true, nationalCount: 23597, localCount: 0, status: 'missing' },
              { id: 'cr-l3-12', name: '装配服务', level: 3, isLeaf: false, children: [
                { id: 'cr-l4-8', name: '装配流水线', level: 4, isLeaf: true, nationalCount: 390, localCount: 2, status: 'normal' },
                { id: 'cr-l4-9', name: '自动装配机', level: 4, isLeaf: true, nationalCount: 1670, localCount: 6, status: 'normal' }
              ]},
              { id: 'cr-l3-13', name: '医疗服务', level: 3, isLeaf: true, nationalCount: 3312, localCount: 15, status: 'normal' }
            ]
          },
          {
            id: 'cr-l2-4',
            name: '应用终端',
            level: 2,
            isLeaf: false,
            children: [
              { id: 'cr-l3-14', name: '工业用途', level: 3, isLeaf: true, nationalCount: 33941, localCount: 128, status: 'advantage' },
              { id: 'cr-l3-15', name: '农业用途', level: 3, isLeaf: true, nationalCount: 776, localCount: 3, status: 'normal' },
              { id: 'cr-l3-16', name: '建筑服务', level: 3, isLeaf: true, nationalCount: 510, localCount: 2, status: 'normal' },
              { id: 'cr-l3-17', name: '能源服务', level: 3, isLeaf: true, nationalCount: 8, localCount: 0, status: 'missing' },
              { id: 'cr-l3-18', name: '应急救援', level: 3, isLeaf: false, children: [
                { id: 'cr-l4-10', name: '安防机器人', level: 4, isLeaf: true, nationalCount: 1135, localCount: 4, status: 'normal' },
                { id: 'cr-l4-11', name: '救援机器人', level: 4, isLeaf: true, nationalCount: 316, localCount: 1, status: 'normal' }
              ]},
              { id: 'cr-l3-19', name: '军事用途', level: 3, isLeaf: true, nationalCount: 13, localCount: 0, status: 'missing' }
            ]
          }
        ]
      }
    ]
  }
};

// V2 企业供需关系网络数据（机器人产业示例）
const MOCK_ENTERPRISE_NETWORKS = {
  'chain-robot': {
    nodes: [
      { id: 'e-a', name: '汽车厂A', type: 'terminal', revenue: 50, employees: 3200, local: true, enabling: ['ai', 'iot'] },
      { id: 'e-b', name: '机器人集成商B', type: 'integration', revenue: 8, employees: 650, local: true, enabling: ['ai'] },
      { id: 'e-c', name: '本体厂C', type: 'body', revenue: 5, employees: 480, local: true, enabling: ['industrial_internet'] },
      { id: 'e-d', name: '减速器厂D', type: 'parts', revenue: 2, employees: 220, local: true, enabling: [] },
      { id: 'e-e', name: '减速器厂E', type: 'parts', revenue: 10, employees: 800, local: false, enabling: [] },
      { id: 'e-f', name: '电机厂F', type: 'parts', revenue: 1.5, employees: 180, local: true, enabling: [] },
      { id: 'e-g', name: '传感器厂G', type: 'parts', revenue: 3, employees: 350, local: true, enabling: ['iot'] },
      { id: 'e-h', name: 'AI云公司H', type: 'integration', revenue: 4, employees: 300, local: true, enabling: ['ai'] }
    ],
    edges: [
      { source: 'e-a', target: 'e-b', type: 'transaction', amount: 8000, product: '机器人集成系统', local: true },
      { source: 'e-b', target: 'e-c', type: 'transaction', amount: 5000, product: '机器人本体', local: true },
      { source: 'e-c', target: 'e-d', type: 'transaction', amount: 3000, product: '减速器', local: true },
      { source: 'e-c', target: 'e-e', type: 'supply_demand', amount: 0, product: '精密减速机', local: false },
      { source: 'e-d', target: 'e-f', type: 'transaction', amount: 1200, product: '电机', local: true },
      { source: 'e-f', target: 'e-g', type: 'transaction', amount: 800, product: '传感器', local: true },
      { source: 'e-h', target: 'e-b', type: 'enabling', amount: 0, product: 'AI算力服务', local: true },
      { source: 'e-h', target: 'e-a', type: 'equity', amount: 15, product: '股权', local: true }
    ]
  }
};

// V2 缺口视图数据
const MOCK_GAP_DATA = {
  'chain-robot': {
    gaps: [
      {
        nodeId: 'cr-l4-5',
        name: '精密减速机',
        nationalCount: 8314,
        localCount: 0,
        gapType: '严重缺失',
        affectedDownstream: ['本体厂C', '本体厂D', '本体厂E'],
        affectedAmount: 2.5,
        recommended: ['日本纳博特斯克', '绿的谐波', '来福谐波'],
        policy: '建议设立机器人核心零部件专项，对减速器引进企业给予土地、税收、人才三重优惠。'
      },
      {
        nodeId: 'cr-l4-3',
        name: '视觉控制器',
        nationalCount: 111,
        localCount: 0,
        gapType: '严重缺失',
        affectedDownstream: ['集成商B', '集成商C'],
        affectedAmount: 1.2,
        recommended: ['固高科技', '汇川技术', '埃斯顿'],
        policy: '引导视觉算法企业与本地控制器厂商合作，共建机器人视觉实验室。'
      },
      {
        nodeId: 'cr-l3-11',
        name: '喷涂服务',
        nationalCount: 23597,
        localCount: 0,
        gapType: '严重缺失',
        affectedDownstream: ['汽车厂A', '汽车厂B'],
        affectedAmount: 0.9,
        recommended: ['埃夫特', '新时达', '拓斯达'],
        policy: '依托本地汽车产业集群，引进喷涂机器人集成商。'
      },
      {
        nodeId: 'cr-l3-4',
        name: '传感器',
        nationalCount: 97510,
        localCount: 156,
        gapType: '轻度缺失',
        affectedDownstream: ['本体厂C', '电机厂F'],
        affectedAmount: 0.6,
        recommended: ['奥比中光', '禾赛科技', '速腾聚创'],
        policy: '支持本地传感器企业向机器人专用传感器升级。'
      }
    ]
  }
};

// V2 场景视图数据
const MOCK_SCENARIO_DATA = {
  'chain-robot': {
    scenarios: [
      {
        id: 'sc-1',
        name: '工业用途',
        nationalCount: 33941,
        localCount: 128,
        components: [
          { name: '工业机器人本体', localCount: 7, nationalCount: 1200, status: 'local', impact: '本地本体厂C、D可满足需求' },
          { name: '焊接设备', localCount: 3, nationalCount: 1400, status: 'local', impact: '本地焊接集成商可覆盖' },
          { name: '喷涂设备', localCount: 0, nationalCount: 23597, status: 'missing', impact: '汽车厂A、B需从外地采购喷涂机器人' },
          { name: '装配流水线', localCount: 2, nationalCount: 390, status: 'weak', impact: '规模较小，需引进自动装配设备商' },
          { name: '激光加工设备', localCount: 0, nationalCount: 10432, status: 'missing', impact: '本地金属加工企业依赖外地激光设备' }
        ]
      },
      {
        id: 'sc-2',
        name: '农业用途',
        nationalCount: 776,
        localCount: 3,
        components: [
          { name: '农业机器人本体', localCount: 1, nationalCount: 120, status: 'weak', impact: '仅1家小型企业' },
          { name: '导航传感器', localCount: 0, nationalCount: 450, status: 'missing', impact: '依赖外地供应商' }
        ]
      },
      {
        id: 'sc-3',
        name: '医疗服务',
        nationalCount: 3312,
        localCount: 15,
        components: [
          { name: '手术机器人本体', localCount: 0, nationalCount: 85, status: 'missing', impact: '高端医疗机器人完全缺失' },
          { name: '康复机器人', localCount: 2, nationalCount: 560, status: 'weak', impact: '本地有2家中小企业' }
        ]
      },
      {
        id: 'sc-4',
        name: '应急救援',
        nationalCount: 1451,
        localCount: 5,
        components: [
          { name: '安防机器人', localCount: 4, nationalCount: 1135, status: 'local', impact: '本地有一定基础' },
          { name: '救援机器人', localCount: 1, nationalCount: 316, status: 'weak', impact: '规模较小' }
        ]
      },
      {
        id: 'sc-5',
        name: '能源服务',
        nationalCount: 8,
        localCount: 0,
        components: [
          { name: '石油化工机器人', localCount: 0, nationalCount: 8, status: 'missing', impact: '本区完全缺失' }
        ]
      }
    ]
  }
};

// 企业列表（按环节）
const MOCK_ENTERPRISES = {
  'cr-l4-1': [
    { id: 'e-mcu-1', name: '瑞芯微', scale: '大型', annual_revenue: 12.3, relation_type: '主营', enabling_tags: [] },
    { id: 'e-mcu-2', name: '全志科技', scale: '中型', annual_revenue: 6.8, relation_type: '主营', enabling_tags: [] }
  ],
  'cr-l4-5': [
    { id: 'e-reducer-placeholder', name: '暂无本区企业', scale: '-', annual_revenue: 0, relation_type: '-', enabling_tags: [], placeholder: true }
  ],
  'cr-l3-4': [
    { id: 'e-sensor-1', name: '奥比中光', scale: '大型', annual_revenue: 8.5, relation_type: '主营', enabling_tags: ['ai'] },
    { id: 'e-sensor-2', name: '速腾聚创', scale: '中型', annual_revenue: 5.2, relation_type: '主营', enabling_tags: ['ai', 'iot'] }
  ],
  'e-a': [
    { id: 'e-a', name: '汽车厂A', scale: '大型', annual_revenue: 50, relation_type: '主营', enabling_tags: ['ai', 'iot'] }
  ],
  'e-b': [
    { id: 'e-b', name: '机器人集成商B', scale: '中型', annual_revenue: 8, relation_type: '主营', enabling_tags: ['ai'] }
  ],
  'e-c': [
    { id: 'e-c', name: '本体厂C', scale: '中型', annual_revenue: 5, relation_type: '主营', enabling_tags: ['industrial_internet'] }
  ]
};

// 模拟API
const MockAPI = {
  filterIndustries(filters, sortBy) {
    return new Promise(resolve => {
      setTimeout(() => {
        let result = MOCK_INDUSTRY_CHAINS.filter(item => {
          const matchStrategic = filters.strategic.includes('all') || filters.strategic.includes(item.strategic_orientation);
          const matchLifecycle = filters.lifecycle.includes('all') || filters.lifecycle.includes(item.life_cycle);
          const matchEnabling = filters.enabling.includes('all') || item.enabling_tags.some(t => filters.enabling.includes(t));
          const matchMatrix = !filters.matrix || filters.matrix === 'all' || item.matrix_group === filters.matrix;
          return matchStrategic && matchLifecycle && matchEnabling && matchMatrix;
        });

        const strategicOrder = { chain_master: 1, core_pillar: 2, cultivating: 3 };
        if (sortBy === 'urgent') {
          result.sort((a, b) => {
            const aUrgent = a.key_gaps.some(g => g.count === 0) ? 0 : 1;
            const bUrgent = b.key_gaps.some(g => g.count === 0) ? 0 : 1;
            if (aUrgent !== bUrgent) return aUrgent - bUrgent;
            return a.completeness_score - b.completeness_score;
          });
        } else {
          result.sort((a, b) => {
            const aUrgent = a.key_gaps.some(g => g.count === 0) ? 0 : 1;
            const bUrgent = b.key_gaps.some(g => g.count === 0) ? 0 : 1;
            if (aUrgent !== bUrgent) return aUrgent - bUrgent;
            if (a.completeness_score !== b.completeness_score) return a.completeness_score - b.completeness_score;
            if (b.revenue_total !== a.revenue_total) return b.revenue_total - a.revenue_total;
            return (strategicOrder[a.strategic_orientation] || 9) - (strategicOrder[b.strategic_orientation] || 9);
          });
        }

        resolve(result);
      }, 150);
    });
  },

  getMetrics(filters) {
    return new Promise(resolve => {
      setTimeout(async () => {
        const industries = await this.filterIndustries(filters);
        // 急需补链数：动态汇总全部产业缺口
        const urgentCount = industries.reduce((s, item) => s + (item.gap_count || 0), 0);
        const avgCompleteness = industries.length ? (industries.reduce((s, i) => s + i.completeness_score, 0) / industries.length).toFixed(1) : 0;
        const totalEnterprises = industries.reduce((s, i) => s + i.enterprise_count, 0);
        const enablingEnterprises = industries.reduce((s, i) => s + Math.round(i.enterprise_count * (i.enabling_tags.length * 0.25)), 0);
        const penetration = totalEnterprises ? ((enablingEnterprises / totalEnterprises) * 100).toFixed(1) : 0;

        resolve({
          total: industries.length,
          urgent: urgentCount,
          avgCompleteness: parseFloat(avgCompleteness),
          avgCompletenessTrend: 2.3,
          penetration: parseFloat(penetration),
          penetrationTrend: -1.2
        });
      }, 100);
    });
  },

  getSupplyDemandGaps(filters) {
    return new Promise(resolve => {
      setTimeout(() => resolve(MOCK_SUPPLY_DEMAND_GAPS), 120);
    });
  },

  getRisks(filters) {
    return new Promise(resolve => {
      setTimeout(() => resolve(MOCK_RISKS), 120);
    });
  },

  getHeatmap(filters) {
    return new Promise(resolve => {
      setTimeout(() => resolve(MOCK_HEATMAP), 120);
    });
  },

  getChainDetail(chainId) {
    return new Promise(resolve => {
      setTimeout(() => {
        const chain = MOCK_INDUSTRY_CHAINS.find(c => c.id === chainId);
        resolve(chain || null);
      }, 100);
    });
  },

  // V2 产业分类树
  getCategoryTree(chainId) {
    return new Promise(resolve => {
      setTimeout(() => {
        const data = MOCK_CATEGORY_TREES[chainId];
        resolve(data || this.generateDefaultTree(chainId));
      }, 150);
    });
  },

  generateDefaultTree(chainId) {
    const chain = MOCK_INDUSTRY_CHAINS.find(c => c.id === chainId);
    return {
      chainId,
      tree: [{
        id: uuid(),
        name: chain ? chain.name : '产业链',
        level: 1,
        isLeaf: false,
        children: [
          {
            id: uuid(),
            name: '上游原材料',
            level: 2,
            isLeaf: false,
            children: [
              { id: uuid(), name: '核心材料A', level: 3, isLeaf: true, nationalCount: 120, localCount: 8, status: 'normal' },
              { id: uuid(), name: '核心材料B', level: 3, isLeaf: true, nationalCount: 80, localCount: 0, status: 'missing' }
            ]
          },
          {
            id: uuid(),
            name: '中游制造',
            level: 2,
            isLeaf: false,
            children: [
              { id: uuid(), name: '核心制造', level: 3, isLeaf: true, nationalCount: 250, localCount: 35, status: 'advantage' },
              { id: uuid(), name: '系统集成', level: 3, isLeaf: true, nationalCount: 180, localCount: 12, status: 'normal' }
            ]
          },
          {
            id: uuid(),
            name: '下游应用',
            level: 2,
            isLeaf: false,
            children: [
              { id: uuid(), name: '终端产品', level: 3, isLeaf: true, nationalCount: 300, localCount: 28, status: 'advantage' }
            ]
          }
        ]
      }]
    };
  },

  // V2 企业供需关系网络
  getEnterpriseNetwork(chainId) {
    return new Promise(resolve => {
      setTimeout(() => {
        const data = MOCK_ENTERPRISE_NETWORKS[chainId];
        resolve(data || this.generateDefaultNetwork(chainId));
      }, 150);
    });
  },

  generateDefaultNetwork(chainId) {
    const nodes = [];
    const edges = [];
    const types = ['parts', 'body', 'integration', 'terminal'];
    const typeNames = { parts: '零部件企业', body: '本体企业', integration: '集成企业', terminal: '终端企业' };
    for (let i = 0; i < 12; i++) {
      const type = types[i % 4];
      nodes.push({
        id: 'e-' + i,
        name: typeNames[type] + (i + 1),
        type,
        revenue: +(Math.random() * 10 + 0.5).toFixed(1),
        employees: Math.floor(Math.random() * 1000 + 100),
        local: i < 9,
        enabling: i % 3 === 0 ? ['ai'] : []
      });
    }
    for (let i = 0; i < nodes.length - 1; i++) {
      if (Math.random() > 0.4) {
        edges.push({
          source: nodes[i].id,
          target: nodes[i + 1].id,
          type: Math.random() > 0.3 ? 'transaction' : 'supply_demand',
          amount: Math.floor(Math.random() * 5000 + 100),
          product: '产品' + i,
          local: nodes[i].local && nodes[i + 1].local
        });
      }
    }
    return { nodes, edges };
  },

  // V2 缺口数据
  getGapData(chainId) {
    return new Promise(resolve => {
      setTimeout(() => {
        const data = MOCK_GAP_DATA[chainId];
        resolve(data || { gaps: [] });
      }, 120);
    });
  },

  // V2 场景数据
  getScenarioData(chainId) {
    return new Promise(resolve => {
      setTimeout(() => {
        const data = MOCK_SCENARIO_DATA[chainId];
        resolve(data || { scenarios: [] });
      }, 120);
    });
  },

  // 环节/企业详情
  getNodeEnterprises(nodeId) {
    return new Promise(resolve => {
      setTimeout(() => {
        const list = MOCK_ENTERPRISES[nodeId] || [
          { id: uuid(), name: '示例企业A', scale: '中型', annual_revenue: 5.6, relation_type: '主营', enabling_tags: [] },
          { id: uuid(), name: '示例企业B', scale: '小型', annual_revenue: 1.2, relation_type: '兼营', enabling_tags: [] }
        ];
        resolve(list);
      }, 120);
    });
  },

  getNodeEnablingTech(nodeId) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          { name: '+AI', value: Math.floor(Math.random() * 15) + 2 },
          { name: '+物联网', value: Math.floor(Math.random() * 12) + 1 },
          { name: '+绿色能源', value: Math.floor(Math.random() * 8) + 1 },
          { name: '+工业互联网', value: Math.floor(Math.random() * 10) + 1 }
        ]);
      }, 100);
    });
  }
};

// ==================== 其他功能模块模拟数据 ====================

// 企业详细画像（360°）
const MOCK_ENTERPRISE_DETAILS = {
  'e-a': {
    id: 'e-a',
    name: '汽车厂A',
    credit_code: '91310000MA1FL0XX0X',
    register_address: '上海市浦东新区智能汽车产业园A区',
    industry_code: 'C3612',
    enterprise_scale: 'large',
    registered_capital: 50000,
    establishment_date: '2010-05-18',
    legal_person: '张伟',
    employee_count: 3200,
    annual_revenue: 50.0,
    high_tech_flag: true,
    status: 'active',
    tags: ['龙头企业', '上市/挂牌', '高新技术企业'],
    data_sources: ['工商', '税务', '招投标'],
    industry_role: 'terminal',
    risk_level: 'normal',
    is_local: true,
    chain_position: {
      chain_name: '机器人',
      node_name: '应用终端 / 工业用途',
      role: 'core',
      relation_type: '主营'
    },
    description: '本区新能源汽车与智能机器人应用终端龙头企业，年产值超50亿元，带动上下游企业30余家。'
  },
  'e-b': {
    id: 'e-b',
    name: '机器人集成商B',
    credit_code: '91310000MA1FL1XX1X',
    register_address: '上海市浦东新区机器人产业园B座',
    industry_code: 'C3491',
    enterprise_scale: 'medium',
    registered_capital: 8000,
    establishment_date: '2015-09-22',
    legal_person: '李娜',
    employee_count: 650,
    annual_revenue: 8.0,
    high_tech_flag: true,
    status: 'active',
    tags: ['专精特新', '高新技术企业'],
    data_sources: ['工商', '税务', '专利'],
    industry_role: 'integrator',
    risk_level: 'normal',
    is_local: true,
    chain_position: {
      chain_name: '机器人',
      node_name: '集成系统 / 焊接服务',
      role: 'core',
      relation_type: '主营'
    },
    description: '专注于工业机器人焊接、装配系统集成，服务本地汽车厂A等大型终端客户。'
  },
  'e-c': {
    id: 'e-c',
    name: '本体厂C',
    credit_code: '91310000MA1FL2XX2X',
    register_address: '上海市浦东新区智能制造基地C区',
    industry_code: 'C3491',
    enterprise_scale: 'medium',
    registered_capital: 6000,
    establishment_date: '2016-03-10',
    legal_person: '王强',
    employee_count: 480,
    annual_revenue: 5.0,
    high_tech_flag: true,
    status: 'active',
    tags: ['专精特新'],
    data_sources: ['工商', '税务', '招聘'],
    industry_role: 'manufacturer',
    risk_level: 'warning',
    is_local: true,
    chain_position: {
      chain_name: '机器人',
      node_name: '机器人本体 / 关节坐标型',
      role: 'supporting',
      relation_type: '主营'
    },
    description: '关节坐标型机器人本体制造商，近期受精密减速机供应波动影响，产能利用率有所下降。'
  },
  'e-d': {
    id: 'e-d',
    name: '减速器厂D',
    credit_code: '91310000MA1FL3XX3X',
    register_address: '上海市浦东新区精密制造园D区',
    industry_code: 'C3453',
    enterprise_scale: 'small',
    registered_capital: 2500,
    establishment_date: '2018-07-08',
    legal_person: '赵敏',
    employee_count: 220,
    annual_revenue: 2.0,
    high_tech_flag: false,
    status: 'active',
    tags: ['隐形冠军'],
    data_sources: ['工商', '税务'],
    industry_role: 'parts_supplier',
    risk_level: 'normal',
    is_local: true,
    chain_position: {
      chain_name: '机器人',
      node_name: '核心零部件 / 减速器',
      role: 'supporting',
      relation_type: '主营'
    },
    description: '本地减速器配套企业，产品主要供应本体厂C，年产值2亿元。'
  },
  'e-e': {
    id: 'e-e',
    name: '减速器厂E（外地）',
    credit_code: '91320000MA1FL4XX4X',
    register_address: '江苏省苏州市吴中区精密减速器产业园',
    industry_code: 'C3453',
    enterprise_scale: 'large',
    registered_capital: 35000,
    establishment_date: '2008-11-15',
    legal_person: '孙涛',
    employee_count: 800,
    annual_revenue: 10.0,
    high_tech_flag: true,
    status: 'active',
    tags: ['龙头企业'],
    data_sources: ['工商', '招投标'],
    industry_role: 'parts_supplier',
    risk_level: 'normal',
    is_local: false,
    chain_position: {
      chain_name: '机器人',
      node_name: '核心零部件 / 减速器 / 精密减速机',
      role: 'core',
      relation_type: '主营'
    },
    description: '外地精密减速机龙头企业，为本区本体厂C提供核心零部件。'
  },
  'e-f': {
    id: 'e-f',
    name: '电机厂F',
    credit_code: '91310000MA1FL5XX5X',
    register_address: '上海市浦东新区电机产业园E区',
    industry_code: 'C3812',
    enterprise_scale: 'small',
    registered_capital: 1800,
    establishment_date: '2017-02-28',
    legal_person: '周杰',
    employee_count: 180,
    annual_revenue: 1.5,
    high_tech_flag: false,
    status: 'active',
    tags: [],
    data_sources: ['工商', '税务'],
    industry_role: 'parts_supplier',
    risk_level: 'normal',
    is_local: true,
    chain_position: {
      chain_name: '机器人',
      node_name: '核心零部件 / 控制器 / 电机控制器',
      role: 'supporting',
      relation_type: '主营'
    },
    description: '本地伺服电机制造企业，产品供应减速器厂D及本体厂C。'
  },
  'e-g': {
    id: 'e-g',
    name: '传感器厂G',
    credit_code: '91310000MA1FL6XX6X',
    register_address: '上海市浦东新区传感谷F区',
    industry_code: 'C3983',
    enterprise_scale: 'small',
    registered_capital: 3000,
    establishment_date: '2019-06-12',
    legal_person: '吴芳',
    employee_count: 350,
    annual_revenue: 3.0,
    high_tech_flag: true,
    status: 'active',
    tags: ['高新技术企业'],
    data_sources: ['工商', '专利'],
    industry_role: 'parts_supplier',
    risk_level: 'warning',
    is_local: true,
    chain_position: {
      chain_name: '机器人',
      node_name: '核心零部件 / 传感器',
      role: 'supporting',
      relation_type: '主营'
    },
    description: '机器人专用传感器研发制造企业，近期产能利用率下降至65%。'
  },
  'e-h': {
    id: 'e-h',
    name: 'AI云公司H',
    credit_code: '91310000MA1FL7XX7X',
    register_address: '上海市浦东新区人工智能岛G座',
    industry_code: 'I6450',
    enterprise_scale: 'medium',
    registered_capital: 10000,
    establishment_date: '2017-12-01',
    legal_person: '陈明',
    employee_count: 300,
    annual_revenue: 4.0,
    high_tech_flag: true,
    status: 'active',
    tags: ['高新技术企业', '专精特新'],
    data_sources: ['工商', '税务', '专利'],
    industry_role: 'enabling',
    risk_level: 'normal',
    is_local: true,
    chain_position: {
      chain_name: '机器人',
      node_name: '使能技术 / +AI',
      role: 'service',
      relation_type: '主营'
    },
    description: '为本地机器人企业提供AI算力与视觉算法服务，持有汽车厂A部分股权。'
  }
};

// 企业产品目录
const MOCK_ENTERPRISE_PRODUCTS = {
  'e-a': [
    { product_name: '新能源汽车整车', product_category: '整车制造', product_type: '产品', source: '发票', confidence: 0.95 },
    { product_name: '工业机器人应用系统集成服务', product_category: '集成服务', product_type: '服务', source: '招投标', confidence: 0.88 },
    { product_name: '智能驾驶舱', product_category: '汽车电子', product_type: '产品', source: '专利', confidence: 0.72 }
  ],
  'e-b': [
    { product_name: '焊接机器人集成系统', product_category: '焊接服务', product_type: '产品', source: '发票', confidence: 0.92 },
    { product_name: '装配机器人集成系统', product_category: '装配服务', product_type: '产品', source: '发票', confidence: 0.89 },
    { product_name: '机器人产线运维服务', product_category: '运维服务', product_type: '服务', source: '招投标', confidence: 0.81 }
  ],
  'e-c': [
    { product_name: '关节坐标型机器人本体', product_category: '机器人本体', product_type: '产品', source: '发票', confidence: 0.94 },
    { product_name: '协作机器人本体', product_category: '机器人本体', product_type: '产品', source: '推断', confidence: 0.55 }
  ],
  'e-d': [
    { product_name: '行星减速器', product_category: '减速器', product_type: '产品', source: '发票', confidence: 0.90 }
  ],
  'e-e': [
    { product_name: '精密减速机', product_category: '精密减速机', product_type: '产品', source: '发票', confidence: 0.96 },
    { product_name: '谐波减速器', product_category: '谐波减速器', product_type: '产品', source: '专利', confidence: 0.85 }
  ],
  'e-f': [
    { product_name: '伺服电机', product_category: '电机', product_type: '产品', source: '发票', confidence: 0.91 },
    { product_name: '电机控制器', product_category: '控制器', product_type: '产品', source: '发票', confidence: 0.87 }
  ],
  'e-g': [
    { product_name: '视觉传感器', product_category: '视觉传感器', product_type: '产品', source: '专利', confidence: 0.86 },
    { product_name: '力矩传感器', product_category: '力矩传感器', product_type: '产品', source: '推断', confidence: 0.52 }
  ],
  'e-h': [
    { product_name: 'AI视觉检测服务', product_category: 'AI服务', product_type: '服务', source: '发票', confidence: 0.93 },
    { product_name: '机器人云脑平台', product_category: '工业软件', product_type: '服务', source: '专利', confidence: 0.78 }
  ]
};

// 企业需求目录
const MOCK_ENTERPRISE_DEMANDS = {
  'e-a': [
    { demand_name: '焊接机器人集成系统', demand_category: '焊接服务', source: '招投标', confidence: 0.90 },
    { demand_name: '喷涂机器人', demand_category: '喷涂服务', source: '发票', confidence: 0.82 },
    { demand_name: '精密减速机', demand_category: '精密减速机', source: '发票', confidence: 0.78 }
  ],
  'e-b': [
    { demand_name: '机器人本体', demand_category: '机器人本体', source: '发票', confidence: 0.91 },
    { demand_name: '视觉传感器', demand_category: '视觉传感器', source: '招投标', confidence: 0.84 }
  ],
  'e-c': [
    { demand_name: '精密减速机', demand_category: '精密减速机', source: '发票', confidence: 0.92 },
    { demand_name: '伺服电机', demand_category: '电机', source: '发票', confidence: 0.88 },
    { demand_name: '力矩传感器', demand_category: '力矩传感器', source: '推断', confidence: 0.56 }
  ],
  'e-d': [
    { demand_name: '伺服电机', demand_category: '电机', source: '发票', confidence: 0.85 }
  ],
  'e-f': [
    { demand_name: '传感器芯片', demand_category: '智能芯片', source: '发票', confidence: 0.80 }
  ],
  'e-g': [
    { demand_name: 'AI视觉算法授权', demand_category: 'AI服务', source: '招投标', confidence: 0.75 }
  ]
};

// 企业关系明细（企业关系网络模块使用）
const MOCK_ENTERPRISE_RELATIONS = [
  { id: 'r-1', from_enterprise_id: 'e-a', to_enterprise_id: 'e-b', relation_type: 'transaction', relation_strength: 0.92, transaction_amount: 8000, transaction_frequency: 120, last_transaction_date: '2026-06-28', is_local: true, source: '税务发票' },
  { id: 'r-2', from_enterprise_id: 'e-b', to_enterprise_id: 'e-c', relation_type: 'transaction', relation_strength: 0.85, transaction_amount: 5000, transaction_frequency: 80, last_transaction_date: '2026-06-25', is_local: true, source: '税务发票' },
  { id: 'r-3', from_enterprise_id: 'e-c', to_enterprise_id: 'e-d', relation_type: 'transaction', relation_strength: 0.78, transaction_amount: 3000, transaction_frequency: 60, last_transaction_date: '2026-06-20', is_local: true, source: '税务发票' },
  { id: 'r-4', from_enterprise_id: 'e-c', to_enterprise_id: 'e-e', relation_type: 'supply_demand', relation_strength: 0.65, transaction_amount: 0, transaction_frequency: 0, last_transaction_date: '2026-06-15', is_local: false, source: '供需推断' },
  { id: 'r-5', from_enterprise_id: 'e-d', to_enterprise_id: 'e-f', relation_type: 'transaction', relation_strength: 0.72, transaction_amount: 1200, transaction_frequency: 40, last_transaction_date: '2026-06-22', is_local: true, source: '税务发票' },
  { id: 'r-6', from_enterprise_id: 'e-f', to_enterprise_id: 'e-g', relation_type: 'transaction', relation_strength: 0.68, transaction_amount: 800, transaction_frequency: 30, last_transaction_date: '2026-06-18', is_local: true, source: '税务发票' },
  { id: 'r-7', from_enterprise_id: 'e-h', to_enterprise_id: 'e-b', relation_type: 'cooperation', relation_strength: 0.80, transaction_amount: 0, transaction_frequency: 0, last_transaction_date: '2026-06-10', is_local: true, source: '合作协议' },
  { id: 'r-8', from_enterprise_id: 'e-h', to_enterprise_id: 'e-a', relation_type: 'equity', relation_strength: 0.55, transaction_amount: 15, transaction_frequency: 0, last_transaction_date: '2025-12-31', is_local: true, source: '工商股权' },
  { id: 'r-9', from_enterprise_id: 'e-h', to_enterprise_id: 'e-c', relation_type: 'cooperation', relation_strength: 0.60, transaction_amount: 0, transaction_frequency: 0, last_transaction_date: '2026-05-20', is_local: true, source: '合作协议' },
  { id: 'r-10', from_enterprise_id: 'e-a', to_enterprise_id: 'e-g', relation_type: 'transaction', relation_strength: 0.50, transaction_amount: 600, transaction_frequency: 20, last_transaction_date: '2026-06-05', is_local: true, source: '税务发票' }
];

// 供需匹配结果
const MOCK_SUPPLY_DEMAND_MATCHES = [
  { id: 'm-1', supplier_id: 'e-b', demander_id: 'e-a', match_type: 'who_needs_me', match_score: 0.94, match_reason: { semantic: 0.95, category: 1, history: 1 }, product_name: '焊接机器人集成系统', demand_name: '焊接机器人集成系统', status: '已成交' },
  { id: 'm-2', supplier_id: 'e-b', demander_id: 'e-a', match_type: 'who_needs_me', match_score: 0.88, match_reason: { semantic: 0.90, category: 1, history: 0 }, product_name: '装配机器人集成系统', demand_name: '装配产线升级', status: '已撮合' },
  { id: 'm-3', supplier_id: 'e-e', demander_id: 'e-c', match_type: 'i_need_who', match_score: 0.91, match_reason: { semantic: 0.95, category: 1, history: 0 }, product_name: '精密减速机', demand_name: '精密减速机', status: '待撮合' },
  { id: 'm-4', supplier_id: 'e-d', demander_id: 'e-c', match_type: 'i_need_who', match_score: 0.72, match_reason: { semantic: 0.80, category: 1, history: 0 }, product_name: '行星减速器', demand_name: '精密减速机', status: '待撮合' },
  { id: 'm-5', supplier_id: 'e-g', demander_id: 'e-b', match_type: 'who_needs_me', match_score: 0.85, match_reason: { semantic: 0.90, category: 1, history: 0 }, product_name: '视觉传感器', demand_name: '视觉传感器', status: '待撮合' },
  { id: 'm-6', supplier_id: 'e-h', demander_id: 'e-g', match_type: 'who_needs_me', match_score: 0.78, match_reason: { semantic: 0.85, category: 1, history: 0 }, product_name: 'AI视觉检测服务', demand_name: 'AI视觉算法授权', status: '待撮合' },
  { id: 'm-7', supplier_id: 'e-f', demander_id: 'e-d', match_type: 'who_needs_me', match_score: 0.82, match_reason: { semantic: 0.85, category: 1, history: 0 }, product_name: '伺服电机', demand_name: '伺服电机', status: '已撮合' }
];

// 风险预警数据
const MOCK_RISK_WARNINGS = [
  { id: 'rw-1', enterprise_id: 'e-c', enterprise_name: '本体厂C', risk_type: '经营异常', risk_level: '紧急', risk_desc: '精密减速机外地依赖度超80%，供应商减速器厂E近期产能波动，可能导致本体厂C停产风险', affected_enterprises: 5, status: '未处理', created_at: '2026-07-06T09:30:00' },
  { id: 'rw-2', enterprise_id: 'e-a', enterprise_name: '汽车厂A', risk_type: '供应商依赖', risk_level: '重要', risk_desc: '焊接机器人集成系统对集成商B采购占比达72%，存在单一供应商依赖风险', affected_enterprises: 3, status: '处理中', created_at: '2026-07-05T14:20:00' },
  { id: 'rw-3', enterprise_id: 'e-g', enterprise_name: '传感器厂G', risk_type: '经营异常', risk_level: '重要', risk_desc: '产能利用率连续3个月低于65%，员工招聘停止，经营现金流承压', affected_enterprises: 2, status: '未处理', created_at: '2026-07-04T11:10:00' },
  { id: 'rw-4', enterprise_id: 'e-f', enterprise_name: '电机厂F', risk_type: '税务异常', risk_level: '关注', risk_desc: '近季度纳税额同比下降35%，需关注原材料成本上升对企业利润的影响', affected_enterprises: 1, status: '已处理', created_at: '2026-07-02T16:45:00' },
  { id: 'rw-5', enterprise_id: 'e-e', enterprise_name: '减速器厂E（外地）', risk_type: '迁出风险', risk_level: '紧急', risk_desc: '外地核心供应商计划迁址，可能影响本区本体厂C、D的零部件供应', affected_enterprises: 4, status: '未处理', created_at: '2026-07-01T08:00:00' }
];

// 强链补链分析数据
const MOCK_CHAIN_GAP_ANALYSIS = {
  'chain-robot': {
    completeness_score: 62,
    nodes: [
      { node_id: 'cr-l4-5', node_name: '精密减速机', gap_type: '严重缺失', actual_count: 0, benchmark_count: 8, gap_ratio: 1.0, affected_enterprises: 5, priority_score: 0.92, recommended_count: 3 },
      { node_id: 'cr-l4-3', node_name: '视觉控制器', gap_type: '严重缺失', actual_count: 0, benchmark_count: 5, gap_ratio: 1.0, affected_enterprises: 3, priority_score: 0.85, recommended_count: 3 },
      { node_id: 'cr-l3-11', node_name: '喷涂服务', gap_type: '严重缺失', actual_count: 0, benchmark_count: 6, gap_ratio: 1.0, affected_enterprises: 2, priority_score: 0.78, recommended_count: 3 },
      { node_id: 'cr-l3-4', node_name: '传感器', gap_type: '轻度缺失', actual_count: 156, benchmark_count: 800, gap_ratio: 0.81, affected_enterprises: 4, priority_score: 0.65, recommended_count: 2 },
      { node_id: 'cr-l4-6', node_name: '人工智能芯片', gap_type: '轻度缺失', actual_count: 3, benchmark_count: 12, gap_ratio: 0.75, affected_enterprises: 3, priority_score: 0.58, recommended_count: 2 }
    ]
  }
};

// 目标招商企业推荐
const MOCK_RECOMMENDED_ENTERPRISES = {
  'cr-l4-5': [
    { id: 'rec-1', enterprise_name: '日本纳博特斯克', region: '日本', annual_revenue: 120.0, match_score: 0.95, expansion_signal: '新设子公司', data_source: '天眼查', status: '未接触' },
    { id: 'rec-2', enterprise_name: '绿的谐波', region: '江苏省苏州市', annual_revenue: 8.5, match_score: 0.88, expansion_signal: '招聘增加', data_source: '企查查', status: '已接触' },
    { id: 'rec-3', enterprise_name: '来福谐波', region: '浙江省宁波市', annual_revenue: 3.2, match_score: 0.76, expansion_signal: '融资', data_source: '手动录入', status: '洽谈中' }
  ],
  'cr-l4-3': [
    { id: 'rec-4', enterprise_name: '固高科技', region: '广东省深圳市', annual_revenue: 6.8, match_score: 0.90, expansion_signal: '招聘增加', data_source: '天眼查', status: '未接触' },
    { id: 'rec-5', enterprise_name: '汇川技术', region: '广东省深圳市', annual_revenue: 150.0, match_score: 0.86, expansion_signal: '新设子公司', data_source: '企查查', status: '未接触' },
    { id: 'rec-6', enterprise_name: '埃斯顿', region: '江苏省南京市', annual_revenue: 35.0, match_score: 0.82, expansion_signal: '融资', data_source: '手动录入', status: '已接触' }
  ],
  'cr-l3-11': [
    { id: 'rec-7', enterprise_name: '埃夫特', region: '安徽省芜湖市', annual_revenue: 18.0, match_score: 0.89, expansion_signal: '招聘增加', data_source: '天眼查', status: '未接触' },
    { id: 'rec-8', enterprise_name: '新时达', region: '上海市', annual_revenue: 25.0, match_score: 0.84, expansion_signal: '新设子公司', data_source: '企查查', status: '已接触' },
    { id: 'rec-9', enterprise_name: '拓斯达', region: '广东省东莞市', annual_revenue: 22.0, match_score: 0.79, expansion_signal: '融资', data_source: '手动录入', status: '未接触' }
  ],
  'cr-l3-4': [
    { id: 'rec-10', enterprise_name: '奥比中光', region: '广东省深圳市', annual_revenue: 8.5, match_score: 0.85, expansion_signal: '招聘增加', data_source: '天眼查', status: '未接触' },
    { id: 'rec-11', enterprise_name: '禾赛科技', region: '上海市', annual_revenue: 12.0, match_score: 0.80, expansion_signal: '新设子公司', data_source: '企查查', status: '已接触' }
  ]
};

// 扩展 MockAPI
Object.assign(MockAPI, {
  getEnterpriseDetail(enterpriseId) {
    return new Promise(resolve => {
      setTimeout(() => {
        const detail = MOCK_ENTERPRISE_DETAILS[enterpriseId];
        resolve(detail || null);
      }, 100);
    });
  },

  getEnterpriseProducts(enterpriseId) {
    return new Promise(resolve => {
      setTimeout(() => resolve(MOCK_ENTERPRISE_PRODUCTS[enterpriseId] || []), 80);
    });
  },

  getEnterpriseDemands(enterpriseId) {
    return new Promise(resolve => {
      setTimeout(() => resolve(MOCK_ENTERPRISE_DEMANDS[enterpriseId] || []), 80);
    });
  },

  getEnterpriseRelations(enterpriseId) {
    return new Promise(resolve => {
      setTimeout(() => {
        const relations = MOCK_ENTERPRISE_RELATIONS.filter(
          r => r.from_enterprise_id === enterpriseId || r.to_enterprise_id === enterpriseId
        );
        resolve(relations);
      }, 100);
    });
  },

  getAllEnterprises() {
    return new Promise(resolve => {
      setTimeout(() => resolve(Object.values(MOCK_ENTERPRISE_DETAILS)), 100);
    });
  },

  getSupplyDemandMatches(type, enterpriseId) {
    return new Promise(resolve => {
      setTimeout(() => {
        let result = MOCK_SUPPLY_DEMAND_MATCHES;
        if (type && type !== 'all') {
          result = result.filter(m => m.match_type === type);
        }
        if (enterpriseId) {
          result = result.filter(m => m.supplier_id === enterpriseId || m.demander_id === enterpriseId);
        }
        resolve(result);
      }, 120);
    });
  },

  getSupplyDemandGapsDetail() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          { gap_type: '供应缺口', product_category: '精密减速机', enterprise_count: 3, estimated_amount: 2.5, chain_id: 'chain-robot' },
          { gap_type: '供应缺口', product_category: '高端运动控制器', enterprise_count: 2, estimated_amount: 1.8, chain_id: 'chain-robot' },
          { gap_type: '供应缺口', product_category: '视觉传感器', enterprise_count: 2, estimated_amount: 1.2, chain_id: 'chain-robot' },
          { gap_type: '需求缺口', product_category: '喷涂机器人', enterprise_count: 2, estimated_amount: 0.9, chain_id: 'chain-robot' },
          { gap_type: '供应缺口', product_category: '激光加工设备', enterprise_count: 1, estimated_amount: 0.6, chain_id: 'chain-robot' },
          { gap_type: '需求缺口', product_category: '协作机器人', enterprise_count: 1, estimated_amount: 0.4, chain_id: 'chain-robot' }
        ]);
      }, 100);
    });
  },

  getRiskWarnings(filters = {}) {
    return new Promise(resolve => {
      setTimeout(() => {
        let result = MOCK_RISK_WARNINGS;
        if (filters.level) result = result.filter(r => r.risk_level === filters.level);
        if (filters.type) result = result.filter(r => r.risk_type === filters.type);
        if (filters.status) result = result.filter(r => r.status === filters.status);
        resolve(result);
      }, 100);
    });
  },

  getChainGapAnalysis(chainId) {
    return new Promise(resolve => {
      setTimeout(() => {
        const data = MOCK_CHAIN_GAP_ANALYSIS[chainId];
        resolve(data || { completeness_score: 0, nodes: [] });
      }, 120);
    });
  },

  getRecommendedEnterprises(nodeId) {
    return new Promise(resolve => {
      setTimeout(() => resolve(MOCK_RECOMMENDED_ENTERPRISES[nodeId] || []), 100);
    });
  }
});

Object.assign(MOCK_CATEGORY_TREES, {
  'chain-002': {
    chainId: 'chain-002',
    tree: [{
      id: 'ne-l1-1', name: '新能源汽车', level: 1, isLeaf: false,
      children: [
        { id: 'ne-l2-1', name: '整车制造', level: 2, isLeaf: false, children: [
          { id: 'ne-l4-1', name: '乘用车', level: 4, isLeaf: true, nationalCount: 1560, localCount: 35, status: 'advantage' },
          { id: 'ne-l4-2', name: '商用车', level: 4, isLeaf: true, nationalCount: 420, localCount: 8, status: 'normal' }
        ]},
        { id: 'ne-l2-2', name: '动力电池', level: 2, isLeaf: false, children: [
          { id: 'ne-l4-3', name: '三元锂电池', level: 4, isLeaf: true, nationalCount: 320, localCount: 12, status: 'advantage' },
          { id: 'ne-l4-4', name: '固态电池', level: 4, isLeaf: true, nationalCount: 45, localCount: 0, status: 'missing' }
        ]},
        { id: 'ne-l2-3', name: '驱动系统', level: 2, isLeaf: false, children: [
          { id: 'ne-l4-5', name: '电机', level: 4, isLeaf: true, nationalCount: 580, localCount: 18, status: 'advantage' },
          { id: 'ne-l4-6', name: '电控', level: 4, isLeaf: true, nationalCount: 410, localCount: 6, status: 'normal' }
        ]},
        { id: 'ne-l2-4', name: '智能网联', level: 2, isLeaf: false, children: [
          { id: 'ne-l4-7', name: '车规级芯片', level: 4, isLeaf: true, nationalCount: 120, localCount: 2, status: 'missing' },
          { id: 'ne-l4-8', name: '激光雷达', level: 4, isLeaf: true, nationalCount: 85, localCount: 1, status: 'missing' }
        ]},
        { id: 'ne-l2-5', name: '充电基础设施', level: 2, isLeaf: false, children: [
          { id: 'ne-l4-9', name: '充电桩', level: 4, isLeaf: true, nationalCount: 2500, localCount: 120, status: 'advantage' }
        ]}
      ]
    }]
  },
  'chain-003': {
    chainId: 'chain-003',
    tree: [{
      id: 'bm-l1-1', name: '生物医药', level: 1, isLeaf: false,
      children: [
        { id: 'bm-l2-1', name: '原料药', level: 2, isLeaf: false, children: [
          { id: 'bm-l4-1', name: '化学原料药', level: 4, isLeaf: true, nationalCount: 850, localCount: 22, status: 'advantage' },
          { id: 'bm-l4-2', name: '生物原料药', level: 4, isLeaf: true, nationalCount: 180, localCount: 3, status: 'normal' }
        ]},
        { id: 'bm-l2-2', name: '创新药', level: 2, isLeaf: false, children: [
          { id: 'bm-l4-3', name: '小分子药物', level: 4, isLeaf: true, nationalCount: 320, localCount: 5, status: 'normal' },
          { id: 'bm-l4-4', name: '抗体药物', level: 4, isLeaf: true, nationalCount: 150, localCount: 0, status: 'missing' }
        ]},
        { id: 'bm-l2-3', name: '医疗器械', level: 2, isLeaf: false, children: [
          { id: 'bm-l4-5', name: '诊断设备', level: 4, isLeaf: true, nationalCount: 620, localCount: 28, status: 'advantage' },
          { id: 'bm-l4-6', name: '高端治疗设备', level: 4, isLeaf: true, nationalCount: 95, localCount: 1, status: 'missing' }
        ]},
        { id: 'bm-l2-4', name: '医疗服务', level: 2, isLeaf: false, children: [
          { id: 'bm-l4-7', name: 'CRO服务', level: 4, isLeaf: true, nationalCount: 480, localCount: 12, status: 'normal' }
        ]}
      ]
    }]
  },
  'chain-004': {
    chainId: 'chain-004',
    tree: [{
      id: 'ai-l1-1', name: '人工智能', level: 1, isLeaf: false,
      children: [
        { id: 'ai-l2-1', name: '基础层', level: 2, isLeaf: false, children: [
          { id: 'ai-l4-1', name: 'AI芯片', level: 4, isLeaf: true, nationalCount: 180, localCount: 2, status: 'missing' },
          { id: 'ai-l4-2', name: '算力中心', level: 4, isLeaf: true, nationalCount: 320, localCount: 15, status: 'advantage' }
        ]},
        { id: 'ai-l2-2', name: '技术层', level: 2, isLeaf: false, children: [
          { id: 'ai-l4-3', name: '算法平台', level: 4, isLeaf: true, nationalCount: 280, localCount: 18, status: 'advantage' },
          { id: 'ai-l4-4', name: '大模型训练', level: 4, isLeaf: true, nationalCount: 65, localCount: 1, status: 'missing' }
        ]},
        { id: 'ai-l2-3', name: '应用层', level: 2, isLeaf: false, children: [
          { id: 'ai-l4-5', name: '智能制造', level: 4, isLeaf: true, nationalCount: 520, localCount: 32, status: 'advantage' },
          { id: 'ai-l4-6', name: '智慧城市', level: 4, isLeaf: true, nationalCount: 680, localCount: 28, status: 'advantage' }
        ]}
      ]
    }]
  },
  'chain-005': {
    chainId: 'chain-005',
    tree: [{
      id: 'sc-l1-1', name: '半导体', level: 1, isLeaf: false,
      children: [
        { id: 'sc-l2-1', name: '设计', level: 2, isLeaf: false, children: [
          { id: 'sc-l4-1', name: 'EDA工具', level: 4, isLeaf: true, nationalCount: 35, localCount: 0, status: 'missing' },
          { id: 'sc-l4-2', name: '芯片设计', level: 4, isLeaf: true, nationalCount: 1800, localCount: 45, status: 'advantage' }
        ]},
        { id: 'sc-l2-2', name: '制造', level: 2, isLeaf: false, children: [
          { id: 'sc-l4-3', name: '晶圆制造', level: 4, isLeaf: true, nationalCount: 120, localCount: 2, status: 'missing' },
          { id: 'sc-l4-4', name: '特色工艺', level: 4, isLeaf: true, nationalCount: 85, localCount: 8, status: 'normal' }
        ]},
        { id: 'sc-l2-3', name: '封测', level: 2, isLeaf: false, children: [
          { id: 'sc-l4-5', name: '封装测试', level: 4, isLeaf: true, nationalCount: 420, localCount: 22, status: 'advantage' }
        ]},
        { id: 'sc-l2-4', name: '设备材料', level: 2, isLeaf: false, children: [
          { id: 'sc-l4-6', name: '半导体材料', level: 4, isLeaf: true, nationalCount: 560, localCount: 16, status: 'normal' },
          { id: 'sc-l4-7', name: '刻蚀设备', level: 4, isLeaf: true, nationalCount: 45, localCount: 2, status: 'normal' },
          { id: 'sc-l4-8', name: '薄膜设备', level: 4, isLeaf: true, nationalCount: 38, localCount: 1, status: 'missing' },
          { id: 'sc-l4-9', name: '光刻机', level: 4, isLeaf: true, nationalCount: 12, localCount: 0, status: 'missing' }
        ]}
      ]
    }]
  }
});

Object.assign(MOCK_ENTERPRISE_NETWORKS, {
  'chain-002': {
    nodes: [
      { id: 'ne-e1', name: '新能源汽车厂A', type: 'terminal', revenue: 80, employees: 5000, local: true, enabling: ['ai', 'industrial_internet'] },
      { id: 'ne-e2', name: '电池厂B', type: 'parts', revenue: 45, employees: 2800, local: true, enabling: ['green_energy'] },
      { id: 'ne-e3', name: '电机厂C', type: 'parts', revenue: 18, employees: 1200, local: true, enabling: [] },
      { id: 'ne-e4', name: '电控厂D', type: 'parts', revenue: 12, employees: 800, local: true, enabling: ['ai'] },
      { id: 'ne-e5', name: '充电桩E', type: 'integration', revenue: 22, employees: 1500, local: true, enabling: ['iot'] },
      { id: 'ne-e6', name: '芯片厂F', type: 'parts', revenue: 120, employees: 6000, local: false, enabling: ['ai'] },
      { id: 'ne-e7', name: '激光雷达G', type: 'parts', revenue: 15, employees: 900, local: false, enabling: ['ai'] },
      { id: 'ne-e8', name: '固态电池H', type: 'parts', revenue: 35, employees: 2000, local: false, enabling: ['green_energy'] },
      { id: 'ne-e9', name: 'AI云公司I', type: 'enabling', revenue: 6, employees: 500, local: true, enabling: ['ai'] },
      { id: 'ne-e10', name: '商用车厂J', type: 'terminal', revenue: 28, employees: 1800, local: true, enabling: ['industrial_internet'] }
    ],
    edges: [
      { source: 'ne-e1', target: 'ne-e2', type: 'transaction', amount: 12000, product: '动力电池', local: true },
      { source: 'ne-e1', target: 'ne-e3', type: 'transaction', amount: 6500, product: '电机', local: true },
      { source: 'ne-e1', target: 'ne-e4', type: 'transaction', amount: 4800, product: '电控系统', local: true },
      { source: 'ne-e1', target: 'ne-e6', type: 'transaction', amount: 3500, product: '车规级芯片', local: false },
      { source: 'ne-e1', target: 'ne-e7', type: 'supply_demand', amount: 0, product: '激光雷达', local: false },
      { source: 'ne-e2', target: 'ne-e8', type: 'supply_demand', amount: 0, product: '固态电池', local: false },
      { source: 'ne-e5', target: 'ne-e1', type: 'transaction', amount: 2200, product: '充电服务', local: true },
      { source: 'ne-e9', target: 'ne-e1', type: 'cooperation', amount: 0, product: '智能驾驶', local: true },
      { source: 'ne-e10', target: 'ne-e3', type: 'transaction', amount: 3100, product: '电机', local: true },
      { source: 'ne-e4', target: 'ne-e9', type: 'cooperation', amount: 0, product: '算法服务', local: true }
    ]
  },
  'chain-003': {
    nodes: [
      { id: 'bm-e1', name: '创新药企A', type: 'terminal', revenue: 32, employees: 2200, local: true, enabling: ['ai'] },
      { id: 'bm-e2', name: '原料药厂B', type: 'parts', revenue: 15, employees: 1200, local: true, enabling: [] },
      { id: 'bm-e3', name: 'CRO企业C', type: 'service', revenue: 8, employees: 600, local: true, enabling: ['ai'] },
      { id: 'bm-e4', name: '诊断设备厂D', type: 'parts', revenue: 12, employees: 900, local: true, enabling: ['iot'] },
      { id: 'bm-e5', name: '抗体药企E', type: 'terminal', revenue: 45, employees: 3000, local: false, enabling: ['ai'] },
      { id: 'bm-e6', name: '高端设备厂F', type: 'parts', revenue: 28, employees: 1500, local: false, enabling: [] },
      { id: 'bm-e7', name: '医院集团G', type: 'terminal', revenue: 55, employees: 8000, local: true, enabling: [] },
      { id: 'bm-e8', name: 'AI制药H', type: 'enabling', revenue: 4, employees: 300, local: true, enabling: ['ai'] }
    ],
    edges: [
      { source: 'bm-e2', target: 'bm-e1', type: 'transaction', amount: 5200, product: '原料药', local: true },
      { source: 'bm-e3', target: 'bm-e1', type: 'transaction', amount: 2800, product: '研发服务', local: true },
      { source: 'bm-e4', target: 'bm-e7', type: 'transaction', amount: 4500, product: '诊断设备', local: true },
      { source: 'bm-e5', target: 'bm-e7', type: 'transaction', amount: 6200, product: '抗体药物', local: false },
      { source: 'bm-e6', target: 'bm-e7', type: 'supply_demand', amount: 0, product: '高端治疗设备', local: false },
      { source: 'bm-e8', target: 'bm-e1', type: 'cooperation', amount: 0, product: 'AI辅助研发', local: true },
      { source: 'bm-e1', target: 'bm-e7', type: 'transaction', amount: 3800, product: '创新药', local: true }
    ]
  },
  'chain-004': {
    nodes: [
      { id: 'ai-e1', name: 'AI芯片厂A', type: 'parts', revenue: 25, employees: 1800, local: true, enabling: ['ai'] },
      { id: 'ai-e2', name: '算法公司B', type: 'integration', revenue: 12, employees: 800, local: true, enabling: ['ai'] },
      { id: 'ai-e3', name: '大模型企业C', type: 'integration', revenue: 18, employees: 1200, local: true, enabling: ['ai'] },
      { id: 'ai-e4', name: '智能制造厂D', type: 'terminal', revenue: 35, employees: 2500, local: true, enabling: ['ai', 'industrial_internet'] },
      { id: 'ai-e5', name: 'AI芯片厂E', type: 'parts', revenue: 150, employees: 8000, local: false, enabling: ['ai'] },
      { id: 'ai-e6', name: '云服务商F', type: 'enabling', revenue: 42, employees: 3200, local: true, enabling: ['ai', 'industrial_internet'] },
      { id: 'ai-e7', name: '数据公司G', type: 'parts', revenue: 8, employees: 500, local: true, enabling: ['ai'] },
      { id: 'ai-e8', name: '机器人企业H', type: 'terminal', revenue: 15, employees: 900, local: true, enabling: ['ai', 'iot'] }
    ],
    edges: [
      { source: 'ai-e1', target: 'ai-e3', type: 'transaction', amount: 4500, product: 'AI芯片', local: true },
      { source: 'ai-e2', target: 'ai-e4', type: 'transaction', amount: 3200, product: '视觉算法', local: true },
      { source: 'ai-e3', target: 'ai-e4', type: 'transaction', amount: 5800, product: '大模型服务', local: true },
      { source: 'ai-e5', target: 'ai-e3', type: 'supply_demand', amount: 0, product: '训练芯片', local: false },
      { source: 'ai-e6', target: 'ai-e3', type: 'transaction', amount: 4200, product: '算力服务', local: true },
      { source: 'ai-e7', target: 'ai-e3', type: 'transaction', amount: 1800, product: '数据标注', local: true },
      { source: 'ai-e3', target: 'ai-e8', type: 'cooperation', amount: 0, product: '机器人大脑', local: true },
      { source: 'ai-e4', target: 'ai-e8', type: 'transaction', amount: 2500, product: '智能产线', local: true }
    ]
  },
  'chain-005': {
    nodes: [
      { id: 'sc-e1', name: '芯片设计公司A', type: 'integration', revenue: 28, employees: 1600, local: true, enabling: ['ai'] },
      { id: 'sc-e2', name: '晶圆厂B', type: 'manufacturer', revenue: 85, employees: 4500, local: false, enabling: ['industrial_internet'] },
      { id: 'sc-e3', name: '封测厂C', type: 'manufacturer', revenue: 22, employees: 1300, local: true, enabling: [] },
      { id: 'sc-e4', name: '半导体材料厂D', type: 'parts', revenue: 15, employees: 900, local: true, enabling: [] },
      { id: 'sc-e5', name: '设备商E', type: 'parts', revenue: 120, employees: 6000, local: false, enabling: ['industrial_internet'] },
      { id: 'sc-e6', name: '终端厂商F', type: 'terminal', revenue: 55, employees: 3200, local: true, enabling: ['ai'] },
      { id: 'sc-e7', name: 'EDA公司G', type: 'enabling', revenue: 8, employees: 500, local: false, enabling: ['ai'] },
      { id: 'sc-e8', name: '设计公司H', type: 'integration', revenue: 12, employees: 700, local: true, enabling: [] }
    ],
    edges: [
      { source: 'sc-e1', target: 'sc-e2', type: 'transaction', amount: 8500, product: '晶圆代工', local: false },
      { source: 'sc-e2', target: 'sc-e3', type: 'transaction', amount: 6200, product: '晶圆', local: true },
      { source: 'sc-e3', target: 'sc-e6', type: 'transaction', amount: 7800, product: '封装芯片', local: true },
      { source: 'sc-e4', target: 'sc-e2', type: 'transaction', amount: 3200, product: '硅片', local: false },
      { source: 'sc-e5', target: 'sc-e2', type: 'transaction', amount: 15000, product: '光刻设备', local: false },
      { source: 'sc-e7', target: 'sc-e1', type: 'supply_demand', amount: 0, product: 'EDA工具', local: false },
      { source: 'sc-e8', target: 'sc-e3', type: 'transaction', amount: 4100, product: '芯片设计', local: true },
      { source: 'sc-e6', target: 'sc-e1', type: 'transaction', amount: 5600, product: '芯片订单', local: true }
    ]
  }
});

Object.assign(MOCK_GAP_DATA, {
  'chain-002': {
    gaps: [
      { nodeId: 'ne-l4-4', name: '固态电池', nationalCount: 45, localCount: 0, gapType: '严重缺失', affectedDownstream: ['新能源汽车厂A', '电池厂B'], affectedAmount: 8.5, recommended: ['宁德时代', '比亚迪', '卫蓝新能源'], policy: '设立固态电池专项，引进头部企业建设研发+中试基地。' },
      { nodeId: 'ne-l4-7', name: '车规级芯片', nationalCount: 120, localCount: 2, gapType: '严重缺失', affectedDownstream: ['新能源汽车厂A', '商用车厂J'], affectedAmount: 5.2, recommended: ['地平线', '黑芝麻智能', '芯驰科技'], policy: '支持本地车企与芯片设计企业联合攻关。' },
      { nodeId: 'ne-l4-8', name: '激光雷达', nationalCount: 85, localCount: 1, gapType: '严重缺失', affectedDownstream: ['新能源汽车厂A'], affectedAmount: 3.8, recommended: ['禾赛科技', '速腾聚创', '华为激光雷达'], policy: '引进激光雷达整机及光学组件企业。' },
      { nodeId: 'ne-l4-6', name: '电控', nationalCount: 410, localCount: 6, gapType: '轻度缺失', affectedDownstream: ['新能源汽车厂A', '商用车厂J'], affectedAmount: 1.2, recommended: ['汇川技术', '英搏尔', '巨一科技'], policy: '培育本地电控系统供应商。' }
    ]
  },
  'chain-003': {
    gaps: [
      { nodeId: 'bm-l4-4', name: '抗体药物', nationalCount: 150, localCount: 0, gapType: '严重缺失', affectedDownstream: ['创新药企A', '医院集团G'], affectedAmount: 6.5, recommended: ['百济神州', '信达生物', '君实生物'], policy: '建设抗体药物中试平台和动物实验中心。' },
      { nodeId: 'bm-l4-6', name: '高端治疗设备', nationalCount: 95, localCount: 1, gapType: '严重缺失', affectedDownstream: ['医院集团G'], affectedAmount: 4.2, recommended: ['联影医疗', '迈瑞医疗', '微创医疗'], policy: '引进高端影像和治疗设备整机厂。' },
      { nodeId: 'bm-l4-2', name: '生物原料药', nationalCount: 180, localCount: 3, gapType: '轻度缺失', affectedDownstream: ['创新药企A'], affectedAmount: 1.8, recommended: ['药明生物', '三生制药', '华兰生物'], policy: '支持生物原料药CDMO产能建设。' }
    ]
  },
  'chain-004': {
    gaps: [
      { nodeId: 'ai-l4-1', name: 'AI芯片', nationalCount: 180, localCount: 2, gapType: '严重缺失', affectedDownstream: ['大模型企业C', '智能制造厂D'], affectedAmount: 7.2, recommended: ['寒武纪', '海光信息', '摩尔线程'], policy: '引进AI芯片设计企业，支持算力中心建设。' },
      { nodeId: 'ai-l4-4', name: '大模型训练', nationalCount: 65, localCount: 1, gapType: '严重缺失', affectedDownstream: ['算法公司B', '智能制造厂D'], affectedAmount: 5.5, recommended: ['智谱AI', '月之暗面', 'MiniMax'], policy: '建设大模型训练算力平台，引进基础模型团队。' },
      { nodeId: 'ai-l4-6', name: '智慧城市', nationalCount: 680, localCount: 28, gapType: '轻度缺失', affectedDownstream: ['算法公司B'], affectedAmount: 0.8, recommended: ['科大讯飞', '商汤科技', '旷视科技'], policy: '开放政府场景，推动AI企业与本地项目对接。' }
    ]
  },
  'chain-005': {
    gaps: [
      { nodeId: 'sc-l4-9', name: '光刻机', nationalCount: 12, localCount: 0, gapType: '严重缺失', affectedDownstream: ['芯片设计公司A', '晶圆厂B'], affectedAmount: 12.5, recommended: ['上海微电子', '尼康', '佳能'], policy: '引进光刻机核心零部件及维护服务企业。' },
      { nodeId: 'sc-l4-1', name: 'EDA工具', nationalCount: 35, localCount: 0, gapType: '严重缺失', affectedDownstream: ['芯片设计公司A', '设计公司H'], affectedAmount: 4.8, recommended: ['华大九天', '概伦电子', '广立微'], policy: '支持国产EDA工具在本区试点应用。' },
      { nodeId: 'sc-l4-3', name: '晶圆制造', nationalCount: 120, localCount: 2, gapType: '严重缺失', affectedDownstream: ['芯片设计公司A', '设计公司H'], affectedAmount: 9.2, recommended: ['中芯国际', '华虹半导体', '士兰微'], policy: '引进晶圆制造产线，提供用地和能耗配套。' },
      { nodeId: 'sc-l4-8', name: '薄膜设备', nationalCount: 38, localCount: 1, gapType: '轻度缺失', affectedDownstream: ['晶圆厂B'], affectedAmount: 2.1, recommended: ['北方华创', '拓荆科技', '盛美上海'], policy: '培育半导体设备配套企业。' }
    ]
  }
});

Object.assign(MOCK_SCENARIO_DATA, {
  'chain-002': {
    scenarios: [
      { id: 'ne-sc-1', name: '乘用车', nationalCount: 1560, localCount: 35, components: [
        { name: '动力电池', localCount: 12, nationalCount: 320, status: 'local', impact: '本地电池厂B可满足' },
        { name: '固态电池', localCount: 0, nationalCount: 45, status: 'missing', impact: '高端乘用车续航受限' },
        { name: '车规级芯片', localCount: 2, nationalCount: 120, status: 'missing', impact: '智能驾驶依赖外地' }
      ]},
      { id: 'ne-sc-2', name: '商用车', nationalCount: 420, localCount: 8, components: [
        { name: '电机', localCount: 18, nationalCount: 580, status: 'local', impact: '本地电机厂C可覆盖' },
        { name: '电控', localCount: 6, nationalCount: 410, status: 'weak', impact: '电控系统供应商不足' }
      ]}
    ]
  },
  'chain-003': {
    scenarios: [
      { id: 'bm-sc-1', name: '肿瘤治疗', nationalCount: 580, localCount: 12, components: [
        { name: '抗体药物', localCount: 0, nationalCount: 150, status: 'missing', impact: '本地医院依赖进口药物' },
        { name: '高端治疗设备', localCount: 1, nationalCount: 95, status: 'missing', impact: '放疗设备采购成本高' }
      ]},
      { id: 'bm-sc-2', name: '体外诊断', nationalCount: 720, localCount: 28, components: [
        { name: '诊断设备', localCount: 28, nationalCount: 620, status: 'local', impact: '本地诊断设备厂D可覆盖' },
        { name: '生物试剂', localCount: 3, nationalCount: 180, status: 'weak', impact: '核心试剂依赖外地' }
      ]}
    ]
  },
  'chain-004': {
    scenarios: [
      { id: 'ai-sc-1', name: '智能制造', nationalCount: 520, localCount: 32, components: [
        { name: 'AI芯片', localCount: 2, nationalCount: 180, status: 'missing', impact: '边缘算力依赖外地' },
        { name: '算法平台', localCount: 18, nationalCount: 280, status: 'local', impact: '本地算法公司B可覆盖' }
      ]},
      { id: 'ai-sc-2', name: '智慧城市', nationalCount: 680, localCount: 28, components: [
        { name: '大模型训练', localCount: 1, nationalCount: 65, status: 'missing', impact: '城市大脑基础模型能力不足' },
        { name: '算力中心', localCount: 15, nationalCount: 320, status: 'local', impact: '本地算力中心可支撑' }
      ]}
    ]
  },
  'chain-005': {
    scenarios: [
      { id: 'sc-sc-1', name: '消费电子', nationalCount: 1200, localCount: 45, components: [
        { name: '芯片设计', localCount: 45, nationalCount: 1800, status: 'local', impact: '本地设计公司A可覆盖' },
        { name: '晶圆制造', localCount: 2, nationalCount: 120, status: 'missing', impact: '设计企业需外出流片' },
        { name: '封测', localCount: 22, nationalCount: 420, status: 'local', impact: '本地封测厂C可覆盖' }
      ]},
      { id: 'sc-sc-2', name: '汽车电子', nationalCount: 380, localCount: 18, components: [
        { name: '车规级芯片', localCount: 2, nationalCount: 120, status: 'missing', impact: '汽车电子芯片依赖外地' },
        { name: 'EDA工具', localCount: 0, nationalCount: 35, status: 'missing', impact: '设计工具受国外限制' }
      ]}
    ]
  }
});

Object.assign(MOCK_RECOMMENDED_ENTERPRISES, {
  'ne-l4-4': [
    { id: 'rec-ne-1', enterprise_name: '宁德时代', region: '福建省宁德市', annual_revenue: 3500, match_score: 0.95, expansion_signal: '新设子公司', data_source: '天眼查', status: '未接触' },
    { id: 'rec-ne-2', enterprise_name: '比亚迪', region: '广东省深圳市', annual_revenue: 6000, match_score: 0.88, expansion_signal: '招聘增加', data_source: '企查查', status: '已接触' },
    { id: 'rec-ne-3', enterprise_name: '卫蓝新能源', region: '北京市', annual_revenue: 12, match_score: 0.78, expansion_signal: '融资', data_source: '手动录入', status: '洽谈中' }
  ],
  'ne-l4-7': [
    { id: 'rec-ne-4', enterprise_name: '地平线', region: '北京市', annual_revenue: 25, match_score: 0.92, expansion_signal: '招聘增加', data_source: '天眼查', status: '未接触' },
    { id: 'rec-ne-5', enterprise_name: '黑芝麻智能', region: '湖北省武汉市', annual_revenue: 8, match_score: 0.85, expansion_signal: '新设子公司', data_source: '企查查', status: '未接触' }
  ],
  'ne-l4-8': [
    { id: 'rec-ne-6', enterprise_name: '禾赛科技', region: '上海市', annual_revenue: 18, match_score: 0.90, expansion_signal: '招聘增加', data_source: '天眼查', status: '已接触' },
    { id: 'rec-ne-7', enterprise_name: '速腾聚创', region: '广东省深圳市', annual_revenue: 15, match_score: 0.84, expansion_signal: '新设子公司', data_source: '企查查', status: '未接触' }
  ],
  'bm-l4-4': [
    { id: 'rec-bm-1', enterprise_name: '信达生物', region: '江苏省苏州市', annual_revenue: 55, match_score: 0.93, expansion_signal: '新设子公司', data_source: '天眼查', status: '未接触' },
    { id: 'rec-bm-2', enterprise_name: '君实生物', region: '上海市', annual_revenue: 48, match_score: 0.87, expansion_signal: '融资', data_source: '企查查', status: '已接触' }
  ],
  'bm-l4-6': [
    { id: 'rec-bm-3', enterprise_name: '联影医疗', region: '上海市', annual_revenue: 120, match_score: 0.91, expansion_signal: '新设子公司', data_source: '天眼查', status: '未接触' },
    { id: 'rec-bm-4', enterprise_name: '迈瑞医疗', region: '广东省深圳市', annual_revenue: 300, match_score: 0.85, expansion_signal: '招聘增加', data_source: '企查查', status: '已接触' }
  ],
  'ai-l4-1': [
    { id: 'rec-ai-1', enterprise_name: '寒武纪', region: '北京市', annual_revenue: 12, match_score: 0.94, expansion_signal: '新设子公司', data_source: '天眼查', status: '未接触' },
    { id: 'rec-ai-2', enterprise_name: '海光信息', region: '天津市', annual_revenue: 35, match_score: 0.88, expansion_signal: '招聘增加', data_source: '企查查', status: '已接触' }
  ],
  'ai-l4-4': [
    { id: 'rec-ai-3', enterprise_name: '智谱AI', region: '北京市', annual_revenue: 8, match_score: 0.92, expansion_signal: '融资', data_source: '天眼查', status: '未接触' },
    { id: 'rec-ai-4', enterprise_name: '月之暗面', region: '北京市', annual_revenue: 5, match_score: 0.86, expansion_signal: '融资', data_source: '企查查', status: '未接触' }
  ],
  'sc-l4-9': [
    { id: 'rec-sc-1', enterprise_name: '上海微电子', region: '上海市', annual_revenue: 80, match_score: 0.95, expansion_signal: '新设子公司', data_source: '天眼查', status: '未接触' },
    { id: 'rec-sc-2', enterprise_name: '尼康', region: '日本', annual_revenue: 1200, match_score: 0.82, expansion_signal: '招聘增加', data_source: '手动录入', status: '已接触' }
  ],
  'sc-l4-1': [
    { id: 'rec-sc-3', enterprise_name: '华大九天', region: '北京市', annual_revenue: 10, match_score: 0.91, expansion_signal: '新设子公司', data_source: '天眼查', status: '未接触' },
    { id: 'rec-sc-4', enterprise_name: '概伦电子', region: '山东省济南市', annual_revenue: 3, match_score: 0.85, expansion_signal: '招聘增加', data_source: '企查查', status: '已接触' }
  ],
  'sc-l4-3': [
    { id: 'rec-sc-5', enterprise_name: '中芯国际', region: '上海市', annual_revenue: 450, match_score: 0.94, expansion_signal: '新设子公司', data_source: '天眼查', status: '未接触' },
    { id: 'rec-sc-6', enterprise_name: '华虹半导体', region: '上海市', annual_revenue: 220, match_score: 0.89, expansion_signal: '招聘增加', data_source: '企查查', status: '洽谈中' }
  ]
});
