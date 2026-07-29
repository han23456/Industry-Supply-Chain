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
    sub_industry_count: 6,
    regulated_enterprise_count: 268,
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
    sub_industry_count: 8,
    regulated_enterprise_count: 231,
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
    sub_industry_count: 7,
    regulated_enterprise_count: 343,
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
    sub_industry_count: 5,
    regulated_enterprise_count: 174,
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
    sub_industry_count: 6,
    regulated_enterprise_count: 152,
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
    sub_industry_count: 8,
    regulated_enterprise_count: 121,
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
    sub_industry_count: 9,
    regulated_enterprise_count: 251,
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
    sub_industry_count: 6,
    regulated_enterprise_count: 92,
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
    sub_industry_count: 7,
    regulated_enterprise_count: 203,
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
    sub_industry_count: 5,
    regulated_enterprise_count: 64,
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
    sub_industry_count: 4,
    regulated_enterprise_count: 56,
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
    sub_industry_count: 5,
    regulated_enterprise_count: 81,
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
        // 急需补链数：统计有严重缺失环节(count=0)的产业数量
        const urgentCount = industries.filter(item => item.key_gaps && item.key_gaps.some(g => g.count === 0)).length;
        // 重点补链企业数（P1级别）：统计所有严重缺失环节(count=0)对应的推荐补链企业数
        const p1Count = industries.reduce((sum, item) => {
          if (!item.key_gaps) return sum;
          return sum + item.key_gaps.filter(g => g.count === 0).length * 3;
        }, 0);
        const weightedData = industries.map(c => ({ score: c.completeness_score, weight: Math.round(c.revenue_total / 10) }));
        const totalWeight = weightedData.reduce((s, i) => s + i.weight, 0);
        const avgCompleteness = totalWeight ? (weightedData.reduce((s, i) => s + i.score * i.weight, 0) / totalWeight).toFixed(1) : 0;

        resolve({
          total: industries.length,
          urgent: urgentCount,
          avgCompleteness: parseFloat(avgCompleteness),
          avgCompletenessTrend: 2.3,
          penetration: p1Count,
          penetrationTrend: 5
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
        let list = MOCK_ENTERPRISES[nodeId];
        if (!list || list.length === 0) {
          // 无数据时返回企业池中的真实企业，保证点击可跳转画像页
          const sampleCount = Math.min(4, ALL_ENTERPRISES.length);
          list = ALL_ENTERPRISES.slice(0, sampleCount).map((e, idx) => ({
            id: e.id,
            name: e.name,
            scale: e.enterprise_scale === 'large' ? '大型' : e.enterprise_scale === 'medium' ? '中型' : e.enterprise_scale === 'small' ? '小型' : '微型',
            annual_revenue: e.annual_revenue,
            relation_type: idx === 0 ? '主营' : '配套',
            enabling_tags: [],
            tags: e.tags || [],
            address: e.register_address || '暂无地址',
            registered_capital: e.registered_capital ? `${e.registered_capital}万` : '-',
            founded_date: e.establishment_date || '-',
            upstream_count: Math.floor(Math.random() * 30) + 2,
            downstream_count: Math.floor(Math.random() * 50) + 5,
            score: Math.floor(Math.random() * 30) + 70,
            invest_score: Math.floor(Math.random() * 30) + 60,
            tech_score: Math.floor(Math.random() * 30) + 70
          }));
        }
        
        // 确保每个非占位企业都有可解析的真实 ID
        const result = list.map(item => {
          if (item.placeholder) return item;
          const real = ensureMockEnterpriseInPool(item);
          if (!real) return null;
          return {
            ...item,
            id: real.id,
            name: real.name,
            tags: real.tags || item.tags || []
          };
        }).filter(Boolean);
        
        resolve(result);
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
  },
  'ent-001': {
    id: 'ent-001',
    name: '深圳市大疆创新科技有限公司',
    credit_code: '91440300MA5DG0XX0X',
    register_address: '深圳市南山区科技园南区',
    industry_code: 'C3990',
    enterprise_scale: 'large',
    registered_capital: 100000,
    establishment_date: '2006-11-06',
    legal_person: '汪滔',
    employee_count: 12000,
    annual_revenue: 380.0,
    high_tech_flag: true,
    status: 'active',
    tags: ['龙头企业', '上市/挂牌', '高新技术企业', '国家级专精特新小巨人'],
    data_sources: ['工商', '税务', '招投标', '专利'],
    industry_role: 'terminal',
    risk_level: 'normal',
    is_local: true,
    chain_position: {
      chain_name: '人工智能与具身智能机器人',
      node_name: '应用终端 / 消费级无人机',
      role: 'core',
      relation_type: '主营'
    },
    description: '全球领先的无人飞行器控制系统及无人机解决方案研发和生产商，产品远销全球100多个国家和地区。'
  },
  'ent-002': {
    id: 'ent-002',
    name: '比亚迪股份有限公司',
    credit_code: '91440300MA5DG1XX1X',
    register_address: '深圳市坪山区比亚迪路',
    industry_code: 'C3611',
    enterprise_scale: 'large',
    registered_capital: 291114,
    establishment_date: '1995-02-10',
    legal_person: '王传福',
    employee_count: 570000,
    annual_revenue: 7700.0,
    high_tech_flag: true,
    status: 'active',
    tags: ['龙头企业', '上市/挂牌', '高新技术企业'],
    data_sources: ['工商', '税务', '招投标'],
    industry_role: 'terminal',
    risk_level: 'normal',
    is_local: true,
    chain_position: {
      chain_name: '人工智能与具身智能机器人',
      node_name: '应用终端 / 新能源汽车',
      role: 'core',
      relation_type: '主营'
    },
    description: '全球领先的新能源汽车制造商和电池生产商，业务涵盖新能源汽车、电池、光伏、轨道交通等领域。'
  },
  'ent-003': {
    id: 'ent-003',
    name: '华为技术有限公司',
    credit_code: '91440300MA5DG2XX2X',
    register_address: '深圳市龙岗区坂田华为基地',
    industry_code: 'I6312',
    enterprise_scale: 'large',
    registered_capital: 405000,
    establishment_date: '1987-09-15',
    legal_person: '赵明路',
    employee_count: 207000,
    annual_revenue: 7100.0,
    high_tech_flag: true,
    status: 'active',
    tags: ['龙头企业', '高新技术企业'],
    data_sources: ['工商', '税务', '专利'],
    industry_role: 'enabling',
    risk_level: 'normal',
    is_local: true,
    chain_position: {
      chain_name: '人工智能与具身智能机器人',
      node_name: '使能技术 / +AI',
      role: 'core',
      relation_type: '主营'
    },
    description: '全球领先的ICT基础设施和智能终端提供商，在5G、人工智能、云计算等领域处于世界领先地位。'
  },
  'ent-004': {
    id: 'ent-004',
    name: '中兴通讯股份有限公司',
    credit_code: '91440300MA5DG3XX3X',
    register_address: '深圳市南山区科技园',
    industry_code: 'I6312',
    enterprise_scale: 'large',
    registered_capital: 419269,
    establishment_date: '1985-02-13',
    legal_person: '李自学',
    employee_count: 85000,
    annual_revenue: 1240.0,
    high_tech_flag: true,
    status: 'active',
    tags: ['龙头企业', '上市/挂牌', '高新技术企业'],
    data_sources: ['工商', '税务', '招投标'],
    industry_role: 'enabling',
    risk_level: 'normal',
    is_local: true,
    chain_position: {
      chain_name: '人工智能与具身智能机器人',
      node_name: '使能技术 / +AI',
      role: 'core',
      relation_type: '主营'
    },
    description: '全球领先的综合通信解决方案提供商，在5G、物联网、云计算等领域具有强大的技术实力。'
  },
  'ent-005': {
    id: 'ent-005',
    name: '深圳迈瑞生物医疗电子股份有限公司',
    credit_code: '91440300MA5DG4XX4X',
    register_address: '深圳市南山区科技园',
    industry_code: 'C3581',
    enterprise_scale: 'large',
    registered_capital: 121767,
    establishment_date: '1991-07-22',
    legal_person: '李西廷',
    employee_count: 21000,
    annual_revenue: 380.0,
    high_tech_flag: true,
    status: 'active',
    tags: ['龙头企业', '上市/挂牌', '高新技术企业'],
    data_sources: ['工商', '税务', '招投标'],
    industry_role: 'terminal',
    risk_level: 'normal',
    is_local: true,
    chain_position: {
      chain_name: '人工智能与具身智能机器人',
      node_name: '应用终端 / 医疗设备',
      role: 'core',
      relation_type: '主营'
    },
    description: '中国领先的医疗设备制造商，产品涵盖生命信息与支持、体外诊断、医学影像三大领域。'
  },
  'e-i': {
    id: 'e-i',
    name: '成都工业自动化有限公司',
    credit_code: '91510100MA1FL8XX8X',
    register_address: '成都市高新区天府大道',
    industry_code: 'C3491',
    enterprise_scale: 'medium',
    registered_capital: 5000,
    establishment_date: '2016-08-15',
    legal_person: '刘洋',
    employee_count: 280,
    annual_revenue: 3.5,
    high_tech_flag: true,
    status: 'active',
    tags: ['高新技术企业'],
    data_sources: ['工商', '税务'],
    industry_role: 'integrator',
    risk_level: 'normal',
    is_local: false,
    chain_position: {
      chain_name: '机器人',
      node_name: '集成系统 / 自动化控制',
      role: 'supporting',
      relation_type: '主营'
    },
    description: '西南地区工业自动化解决方案提供商，服务本地制造业客户。'
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
  ],
  'ent-001': [
    { product_name: '大疆无人机系列', product_category: '消费级无人机', product_type: '产品', source: '发票', confidence: 0.98 },
    { product_name: '农业植保无人机', product_category: '行业应用', product_type: '产品', source: '发票', confidence: 0.95 },
    { product_name: '无人机飞控系统', product_category: '核心部件', product_type: '产品', source: '专利', confidence: 0.92 },
    { product_name: '无人机培训服务', product_category: '教育培训', product_type: '服务', source: '招投标', confidence: 0.85 }
  ],
  'ent-002': [
    { product_name: '比亚迪新能源汽车', product_category: '乘用车', product_type: '产品', source: '发票', confidence: 0.98 },
    { product_name: '动力电池', product_category: '新能源电池', product_type: '产品', source: '发票', confidence: 0.96 },
    { product_name: '储能系统', product_category: '储能设备', product_type: '产品', source: '发票', confidence: 0.90 },
    { product_name: '轨道交通装备', product_category: '轨道交通', product_type: '产品', source: '招投标', confidence: 0.88 }
  ],
  'ent-003': [
    { product_name: '5G通信设备', product_category: '通信基础设施', product_type: '产品', source: '发票', confidence: 0.98 },
    { product_name: '华为手机', product_category: '智能终端', product_type: '产品', source: '发票', confidence: 0.95 },
    { product_name: '云计算服务', product_category: '云服务', product_type: '服务', source: '发票', confidence: 0.92 },
    { product_name: 'AI芯片', product_category: '半导体', product_type: '产品', source: '专利', confidence: 0.88 }
  ],
  'ent-004': [
    { product_name: '5G基站设备', product_category: '通信基础设施', product_type: '产品', source: '发票', confidence: 0.96 },
    { product_name: '光通信设备', product_category: '光纤通信', product_type: '产品', source: '发票', confidence: 0.94 },
    { product_name: '物联网解决方案', product_category: '物联网', product_type: '服务', source: '招投标', confidence: 0.90 },
    { product_name: '云计算平台', product_category: '云服务', product_type: '服务', source: '发票', confidence: 0.85 }
  ],
  'ent-005': [
    { product_name: '生命信息监护仪', product_category: '生命信息与支持', product_type: '产品', source: '发票', confidence: 0.98 },
    { product_name: '体外诊断试剂', product_category: '体外诊断', product_type: '产品', source: '发票', confidence: 0.95 },
    { product_name: '医学影像设备', product_category: '医学影像', product_type: '产品', source: '发票', confidence: 0.92 },
    { product_name: '医疗IT解决方案', product_category: '医疗软件', product_type: '服务', source: '招投标', confidence: 0.88 }
  ],
  'e-i': [
    { product_name: '自动化生产线', product_category: '智能制造', product_type: '产品', source: '发票', confidence: 0.90 },
    { product_name: '工业控制系统', product_category: '控制系统', product_type: '产品', source: '发票', confidence: 0.87 },
    { product_name: '设备运维服务', product_category: '运维服务', product_type: '服务', source: '招投标', confidence: 0.82 }
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
  ],
  'ent-001': [
    { demand_name: '无人机飞控芯片', demand_category: '核心芯片', source: '招投标', confidence: 0.92 },
    { demand_name: '高性能电池', demand_category: '新能源电池', source: '发票', confidence: 0.88 },
    { demand_name: '碳纤维材料', demand_category: '复合材料', source: '发票', confidence: 0.85 },
    { demand_name: 'AI视觉算法', demand_category: 'AI服务', source: '招投标', confidence: 0.80 }
  ],
  'ent-002': [
    { demand_name: '动力电池材料', demand_category: '电池材料', source: '发票', confidence: 0.95 },
    { demand_name: '汽车芯片', demand_category: '半导体', source: '招投标', confidence: 0.90 },
    { demand_name: '汽车零部件', demand_category: '汽车配件', source: '发票', confidence: 0.88 },
    { demand_name: '智能驾驶算法', demand_category: 'AI服务', source: '招投标', confidence: 0.82 }
  ],
  'ent-003': [
    { demand_name: '半导体芯片', demand_category: '半导体', source: '发票', confidence: 0.98 },
    { demand_name: '光通信模块', demand_category: '光通信', source: '发票', confidence: 0.92 },
    { demand_name: '服务器设备', demand_category: 'IT设备', source: '招投标', confidence: 0.88 },
    { demand_name: 'AI算力服务', demand_category: 'AI服务', source: '发票', confidence: 0.85 }
  ],
  'ent-004': [
    { demand_name: '光通信芯片', demand_category: '半导体', source: '发票', confidence: 0.95 },
    { demand_name: '服务器设备', demand_category: 'IT设备', source: '招投标', confidence: 0.90 },
    { demand_name: '5G核心芯片', demand_category: '半导体', source: '招投标', confidence: 0.88 },
    { demand_name: '云计算服务', demand_category: '云服务', source: '发票', confidence: 0.82 }
  ],
  'ent-005': [
    { demand_name: '医疗芯片', demand_category: '半导体', source: '发票', confidence: 0.92 },
    { demand_name: '光学镜头', demand_category: '光学器件', source: '发票', confidence: 0.88 },
    { demand_name: '医疗软件', demand_category: '医疗IT', source: '招投标', confidence: 0.85 },
    { demand_name: '精密加工服务', demand_category: '加工服务', source: '发票', confidence: 0.80 }
  ],
  'e-i': [
    { demand_name: '工业控制器', demand_category: '控制系统', source: '发票', confidence: 0.88 },
    { demand_name: '传感器', demand_category: '传感器', source: '招投标', confidence: 0.82 },
    { demand_name: '自动化软件', demand_category: '工业软件', source: '招投标', confidence: 0.78 }
  ]
};

// 企业关系明细（企业关系网络模块使用）- 动态生成220家企业数据
function generateEnterpriseNetworkData() {
  const enterprises = [];
  const relations = [];
  
  const roleNames = {
    parts_supplier: '零部件企业',
    manufacturer: '制造商',
    integrator: '集成商',
    terminal: '终端企业',
    service: '服务商',
    enabling: '使能技术企业'
  };
  
  const roleCounts = {
    terminal: 25,
    integrator: 35,
    manufacturer: 40,
    parts_supplier: 60,
    service: 35,
    enabling: 25
  };
  
  const industryPrefixes = {
    terminal: ['深圳市智能', '深圳市高端', '深圳市精密', '深圳市智能装备', '深圳市新能源', '深圳市工业', '深圳市自动化', '深圳市机器人'],
    integrator: ['深圳市系统', '深圳市工程', '深圳市自动化', '深圳市集成', '深圳市智能制造', '深圳市工业'],
    manufacturer: ['深圳市精密', '深圳市机械', '深圳市电子', '深圳市科技', '深圳市自动化', '深圳市零部件'],
    parts_supplier: ['深圳市精密', '深圳市五金', '深圳市电子', '深圳市塑胶', '深圳市模具', '深圳市金属'],
    service: ['深圳市技术', '深圳市咨询', '深圳市软件', '深圳市科技服务', '深圳市检测', '深圳市物流'],
    enabling: ['深圳市人工智能', '深圳市大数据', '深圳市云计算', '深圳市物联网', '深圳市半导体', '深圳市AI']
  };
  
  const industrySuffixes = ['有限公司', '科技有限公司', '实业有限公司', '技术有限公司', '智能科技有限公司'];
  
  let idCounter = 1;
  const enterpriseMap = {};
  
  Object.keys(roleCounts).forEach(role => {
    for (let i = 0; i < roleCounts[role]; i++) {
      const isLocal = Math.random() > 0.25;
      const isLeading = role === 'terminal' && i < 3;
      const scale = isLeading ? 'large' : (Math.random() > 0.6 ? 'medium' : (Math.random() > 0.5 ? 'small' : 'micro'));
      const annualRevenue = isLeading ? 50 + Math.random() * 100 : (scale === 'medium' ? 5 + Math.random() * 20 : (scale === 'small' ? 0.5 + Math.random() * 5 : 0.1 + Math.random() * 0.5));
      const employeeCount = isLeading ? 2000 + Math.floor(Math.random() * 5000) : (scale === 'medium' ? 200 + Math.floor(Math.random() * 800) : (scale === 'small' ? 20 + Math.floor(Math.random() * 180) : 5 + Math.floor(Math.random() * 20)));
      
      const prefixes = industryPrefixes[role];
      const name = prefixes[Math.floor(Math.random() * prefixes.length)] + 
                   ['智能', '精密', '自动化', '科技', '工业', '机械', '电子'][Math.floor(Math.random() * 7)] + 
                   ['设备', '制造', '系统', '技术', '工程', '服务'][Math.floor(Math.random() * 6)] +
                   industrySuffixes[Math.floor(Math.random() * industrySuffixes.length)];
      
      const id = `ent-net-${idCounter.toString().padStart(3, '0')}`;
      idCounter++;
      
      const enterprise = {
        id,
        name,
        industry_role: role,
        industry_role_label: roleNames[role],
        is_local: isLocal,
        is_leading: isLeading,
        enterprise_scale: scale,
        annual_revenue: parseFloat(annualRevenue.toFixed(2)),
        employee_count: employeeCount,
        credit_code: `91440300${Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0')}`,
        legal_person: ['张三', '李四', '王五', '赵六', '孙七', '周八', '吴九', '郑十'][Math.floor(Math.random() * 8)] + '先生',
        register_address: isLocal ? `深圳市南山区/${['科技园', '前海', '蛇口', '南山中心', '西丽'][Math.floor(Math.random() * 5)]}/${Math.floor(Math.random() * 100) + 1}号` : `东莞市/${['松山湖', '长安', '虎门', '厚街'][Math.floor(Math.random() * 4)]}工业区`,
        establishment_date: `${2010 + Math.floor(Math.random() * 12)}-${(Math.floor(Math.random() * 12) + 1).toString().padStart(2, '0')}-${(Math.floor(Math.random() * 28) + 1).toString().padStart(2, '0')}`,
        registered_capital: Math.floor(Math.random() * 10000) + 100,
        status: 'active',
        risk_level: Math.random() > 0.95 ? 'warning' : (Math.random() > 0.99 ? 'danger' : 'normal'),
        tags: [roleNames[role], isLocal ? '本区企业' : '外地企业', scale === 'large' ? '龙头企业' : scale === 'medium' ? '骨干企业' : '小微企业'],
        chain_position: {
          chain_name: ['机器人产业链', '海洋装备产业链', '新能源汽车产业链'][Math.floor(Math.random() * 3)],
          node_name: role === 'terminal' ? '终端制造' : role === 'integrator' ? '系统集成' : role === 'manufacturer' ? '核心部件制造' : role === 'parts_supplier' ? '零部件配套' : role === 'service' ? '生产性服务' : '使能技术',
          role: isLeading ? 'core' : 'supporting'
        }
      };
      
      enterprises.push(enterprise);
      enterpriseMap[id] = enterprise;
    }
  });
  
  const terminals = enterprises.filter(e => e.industry_role === 'terminal');
  const integrators = enterprises.filter(e => e.industry_role === 'integrator');
  const manufacturers = enterprises.filter(e => e.industry_role === 'manufacturer');
  const suppliers = enterprises.filter(e => e.industry_role === 'parts_supplier');
  const services = enterprises.filter(e => e.industry_role === 'service');
  const enablings = enterprises.filter(e => e.industry_role === 'enabling');
  
  const leadingTerminals = terminals.filter(e => e.is_leading);
  
  let relationId = 1;
  
  leadingTerminals.forEach(terminal => {
    integrators.slice(0, 8).forEach(integrator => {
      const strength = 0.65 + Math.random() * 0.35;
      relations.push({
        id: `r-${relationId++}`,
        from_enterprise_id: terminal.id,
        to_enterprise_id: integrator.id,
        relation_type: 'transaction',
        relation_strength: parseFloat(strength.toFixed(2)),
        transaction_amount: Math.floor(500 + strength * 5000),
        transaction_frequency: Math.floor(10 + strength * 100),
        last_transaction_date: `2026-0${Math.floor(Math.random() * 6) + 1}-${(Math.floor(Math.random() * 28) + 1).toString().padStart(2, '0')}`,
        is_local: terminal.is_local && integrator.is_local,
        source: '税务发票'
      });
    });
    
    manufacturers.slice(0, 10).forEach(manufacturer => {
      const strength = 0.5 + Math.random() * 0.5;
      relations.push({
        id: `r-${relationId++}`,
        from_enterprise_id: terminal.id,
        to_enterprise_id: manufacturer.id,
        relation_type: 'supply_demand',
        relation_strength: parseFloat(strength.toFixed(2)),
        transaction_amount: 0,
        transaction_frequency: 0,
        last_transaction_date: `2026-0${Math.floor(Math.random() * 6) + 1}-${(Math.floor(Math.random() * 28) + 1).toString().padStart(2, '0')}`,
        is_local: terminal.is_local && manufacturer.is_local,
        source: '供需推断'
      });
    });
    
    suppliers.filter(s => !s.is_local).slice(0, 5).forEach(supplier => {
      const strength = 0.7 + Math.random() * 0.3;
      relations.push({
        id: `r-${relationId++}`,
        from_enterprise_id: terminal.id,
        to_enterprise_id: supplier.id,
        relation_type: 'supply_demand',
        relation_strength: parseFloat(strength.toFixed(2)),
        transaction_amount: Math.floor(1000 + strength * 10000),
        transaction_frequency: Math.floor(5 + strength * 50),
        last_transaction_date: `2026-0${Math.floor(Math.random() * 6) + 1}-${(Math.floor(Math.random() * 28) + 1).toString().padStart(2, '0')}`,
        is_local: false,
        source: '税务发票'
      });
    });
    
    enablings.slice(0, 3).forEach(enabling => {
      const strength = 0.55 + Math.random() * 0.45;
      relations.push({
        id: `r-${relationId++}`,
        from_enterprise_id: terminal.id,
        to_enterprise_id: enabling.id,
        relation_type: 'cooperation',
        relation_strength: parseFloat(strength.toFixed(2)),
        transaction_amount: 0,
        transaction_frequency: 0,
        last_transaction_date: `2026-0${Math.floor(Math.random() * 6) + 1}-${(Math.floor(Math.random() * 28) + 1).toString().padStart(2, '0')}`,
        is_local: terminal.is_local && enabling.is_local,
        source: '合作协议'
      });
    });
  });
  
  integrators.forEach(integrator => {
    manufacturers.slice(Math.floor(Math.random() * manufacturers.length), Math.floor(Math.random() * 5) + 3).forEach(manufacturer => {
      const strength = 0.5 + Math.random() * 0.5;
      relations.push({
        id: `r-${relationId++}`,
        from_enterprise_id: integrator.id,
        to_enterprise_id: manufacturer.id,
        relation_type: 'transaction',
        relation_strength: parseFloat(strength.toFixed(2)),
        transaction_amount: Math.floor(100 + strength * 2000),
        transaction_frequency: Math.floor(5 + strength * 50),
        last_transaction_date: `2026-0${Math.floor(Math.random() * 6) + 1}-${(Math.floor(Math.random() * 28) + 1).toString().padStart(2, '0')}`,
        is_local: integrator.is_local && manufacturer.is_local,
        source: '税务发票'
      });
    });
    
    suppliers.slice(Math.floor(Math.random() * suppliers.length), Math.floor(Math.random() * 5) + 2).forEach(supplier => {
      const strength = 0.4 + Math.random() * 0.4;
      relations.push({
        id: `r-${relationId++}`,
        from_enterprise_id: integrator.id,
        to_enterprise_id: supplier.id,
        relation_type: 'supply_demand',
        relation_strength: parseFloat(strength.toFixed(2)),
        transaction_amount: 0,
        transaction_frequency: 0,
        last_transaction_date: `2026-0${Math.floor(Math.random() * 6) + 1}-${(Math.floor(Math.random() * 28) + 1).toString().padStart(2, '0')}`,
        is_local: integrator.is_local && supplier.is_local,
        source: '供需推断'
      });
    });
    
    services.slice(Math.floor(Math.random() * services.length), Math.floor(Math.random() * 3) + 1).forEach(service => {
      const strength = 0.35 + Math.random() * 0.35;
      relations.push({
        id: `r-${relationId++}`,
        from_enterprise_id: integrator.id,
        to_enterprise_id: service.id,
        relation_type: 'transaction',
        relation_strength: parseFloat(strength.toFixed(2)),
        transaction_amount: Math.floor(50 + strength * 500),
        transaction_frequency: Math.floor(3 + strength * 20),
        last_transaction_date: `2026-0${Math.floor(Math.random() * 6) + 1}-${(Math.floor(Math.random() * 28) + 1).toString().padStart(2, '0')}`,
        is_local: integrator.is_local && service.is_local,
        source: '税务发票'
      });
    });
  });
  
  manufacturers.forEach(manufacturer => {
    suppliers.slice(Math.floor(Math.random() * suppliers.length), Math.floor(Math.random() * 8) + 3).forEach(supplier => {
      const strength = 0.45 + Math.random() * 0.45;
      relations.push({
        id: `r-${relationId++}`,
        from_enterprise_id: manufacturer.id,
        to_enterprise_id: supplier.id,
        relation_type: 'supply_demand',
        relation_strength: parseFloat(strength.toFixed(2)),
        transaction_amount: Math.floor(200 + strength * 2000),
        transaction_frequency: Math.floor(8 + strength * 60),
        last_transaction_date: `2026-0${Math.floor(Math.random() * 6) + 1}-${(Math.floor(Math.random() * 28) + 1).toString().padStart(2, '0')}`,
        is_local: manufacturer.is_local && supplier.is_local,
        source: '税务发票'
      });
    });
    
    enablings.slice(Math.floor(Math.random() * enablings.length), Math.floor(Math.random() * 3) + 1).forEach(enabling => {
      const strength = 0.4 + Math.random() * 0.4;
      relations.push({
        id: `r-${relationId++}`,
        from_enterprise_id: manufacturer.id,
        to_enterprise_id: enabling.id,
        relation_type: 'cooperation',
        relation_strength: parseFloat(strength.toFixed(2)),
        transaction_amount: 0,
        transaction_frequency: 0,
        last_transaction_date: `2026-0${Math.floor(Math.random() * 6) + 1}-${(Math.floor(Math.random() * 28) + 1).toString().padStart(2, '0')}`,
        is_local: manufacturer.is_local && enabling.is_local,
        source: '合作协议'
      });
    });
  });
  
  suppliers.filter(s => !s.is_local).forEach(supplier => {
    manufacturers.slice(Math.floor(Math.random() * manufacturers.length), Math.floor(Math.random() * 3) + 1).forEach(manufacturer => {
      if (!relations.some(r => r.from_enterprise_id === manufacturer.id && r.to_enterprise_id === supplier.id)) {
        const strength = 0.5 + Math.random() * 0.4;
        relations.push({
          id: `r-${relationId++}`,
          from_enterprise_id: manufacturer.id,
          to_enterprise_id: supplier.id,
          relation_type: 'supply_demand',
          relation_strength: parseFloat(strength.toFixed(2)),
          transaction_amount: Math.floor(500 + strength * 5000),
          transaction_frequency: Math.floor(5 + strength * 30),
          last_transaction_date: `2026-0${Math.floor(Math.random() * 6) + 1}-${(Math.floor(Math.random() * 28) + 1).toString().padStart(2, '0')}`,
          is_local: false,
          source: '税务发票'
        });
      }
    });
  });
  
  const nonLocalSuppliers = suppliers.filter(s => !s.is_local);
  const localManufacturers = manufacturers.filter(m => m.is_local);
  
  nonLocalSuppliers.slice(0, 10).forEach((supplier, i) => {
    const parentName = ['上海精密集团', '江苏机械控股', '浙江制造集团', '广州科技集团', '北京自动化集团'][Math.floor(i / 2)];
    const localSubsidiaries = localManufacturers.slice(i * 3, i * 3 + 3);
    
    localSubsidiaries.forEach(subsidiary => {
      const strength = Math.random() > 0.5 ? 0.75 + Math.random() * 0.25 : 0.3 + Math.random() * 0.4;
      relations.push({
        id: `r-${relationId++}`,
        from_enterprise_id: supplier.id,
        to_enterprise_id: subsidiary.id,
        relation_type: 'equity',
        relation_strength: parseFloat(strength.toFixed(2)),
        transaction_amount: strength > 0.7 ? Math.floor(500 + Math.random() * 2000) : Math.floor(50 + Math.random() * 200),
        transaction_frequency: 0,
        last_transaction_date: `${2020 + Math.floor(Math.random() * 6)}-${(Math.floor(Math.random() * 12) + 1).toString().padStart(2, '0')}-${(Math.floor(Math.random() * 28) + 1).toString().padStart(2, '0')}`,
        is_local: false,
        source: '工商股权'
      });
    });
  });
  
  enablings.forEach(enabling => {
    manufacturers.slice(Math.floor(Math.random() * manufacturers.length), Math.floor(Math.random() * 4) + 2).forEach(manufacturer => {
      if (!relations.some(r => r.from_enterprise_id === enabling.id && r.to_enterprise_id === manufacturer.id)) {
        const strength = 0.5 + Math.random() * 0.4;
        relations.push({
          id: `r-${relationId++}`,
          from_enterprise_id: enabling.id,
          to_enterprise_id: manufacturer.id,
          relation_type: 'cooperation',
          relation_strength: parseFloat(strength.toFixed(2)),
          transaction_amount: 0,
          transaction_frequency: 0,
          last_transaction_date: `2026-0${Math.floor(Math.random() * 6) + 1}-${(Math.floor(Math.random() * 28) + 1).toString().padStart(2, '0')}`,
          is_local: enabling.is_local && manufacturer.is_local,
          source: '合作协议'
        });
      }
    });
    
    services.slice(Math.floor(Math.random() * services.length), Math.floor(Math.random() * 3) + 1).forEach(service => {
      const strength = 0.45 + Math.random() * 0.35;
      relations.push({
        id: `r-${relationId++}`,
        from_enterprise_id: enabling.id,
        to_enterprise_id: service.id,
        relation_type: 'transaction',
        relation_strength: parseFloat(strength.toFixed(2)),
        transaction_amount: Math.floor(100 + strength * 800),
        transaction_frequency: Math.floor(4 + strength * 25),
        last_transaction_date: `2026-0${Math.floor(Math.random() * 6) + 1}-${(Math.floor(Math.random() * 28) + 1).toString().padStart(2, '0')}`,
        is_local: enabling.is_local && service.is_local,
        source: '税务发票'
      });
    });
  });
  
  services.forEach(service => {
    terminals.slice(Math.floor(Math.random() * terminals.length), Math.floor(Math.random() * 4) + 2).forEach(terminal => {
      const strength = 0.3 + Math.random() * 0.4;
      relations.push({
        id: `r-${relationId++}`,
        from_enterprise_id: service.id,
        to_enterprise_id: terminal.id,
        relation_type: 'transaction',
        relation_strength: parseFloat(strength.toFixed(2)),
        transaction_amount: Math.floor(30 + strength * 300),
        transaction_frequency: Math.floor(2 + strength * 15),
        last_transaction_date: `2026-0${Math.floor(Math.random() * 6) + 1}-${(Math.floor(Math.random() * 28) + 1).toString().padStart(2, '0')}`,
        is_local: service.is_local && terminal.is_local,
        source: '税务发票'
      });
    });
  });
  
  for (let i = 0; i < 50; i++) {
    const randomFrom = enterprises[Math.floor(Math.random() * enterprises.length)];
    const randomTo = enterprises[Math.floor(Math.random() * enterprises.length)];
    if (randomFrom.id !== randomTo.id && !relations.some(r => r.from_enterprise_id === randomFrom.id && r.to_enterprise_id === randomTo.id)) {
      const types = ['equity', 'transaction', 'cooperation', 'supply_demand'];
      const type = types[Math.floor(Math.random() * types.length)];
      const strength = 0.25 + Math.random() * 0.55;
      relations.push({
        id: `r-${relationId++}`,
        from_enterprise_id: randomFrom.id,
        to_enterprise_id: randomTo.id,
        relation_type: type,
        relation_strength: parseFloat(strength.toFixed(2)),
        transaction_amount: type === 'equity' ? (strength > 0.7 ? Math.floor(100 + Math.random() * 1000) : Math.floor(10 + Math.random() * 100)) : (type === 'transaction' || type === 'supply_demand') ? Math.floor(50 + strength * 500) : 0,
        transaction_frequency: type === 'transaction' ? Math.floor(2 + strength * 20) : 0,
        last_transaction_date: `2026-0${Math.floor(Math.random() * 6) + 1}-${(Math.floor(Math.random() * 28) + 1).toString().padStart(2, '0')}`,
        is_local: randomFrom.is_local && randomTo.is_local,
        source: type === 'equity' ? '工商股权' : type === 'cooperation' ? '合作协议' : (type === 'supply_demand' ? '供需推断' : '税务发票')
      });
    }
  }
  
  return { enterprises, relations };
}

const NETWORK_DATA = generateEnterpriseNetworkData();
const MOCK_ENTERPRISE_RELATIONS = NETWORK_DATA.relations;

// 合并企业数据：原有的详细企业数据 + 新生成的网络数据
const ALL_ENTERPRISES = [...Object.values(MOCK_ENTERPRISE_DETAILS), ...NETWORK_DATA.enterprises];

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

// 将强链补链推荐企业补充进企业库，使“画像/查看画像”跳转能正常解析
const RECOMMENDED_NODE_ROLES = {
  'cr-l4-5': { role: 'parts_supplier', node_name: '精密减速机' },
  'cr-l4-3': { role: 'enabling', node_name: '视觉控制器' },
  'cr-l3-11': { role: 'service', node_name: '喷涂服务' },
  'cr-l3-4': { role: 'parts_supplier', node_name: '传感器' }
};

const ROLE_LABELS_MAP = {
  parts_supplier: '零部件供应商',
  manufacturer: '制造商',
  integrator: '集成商',
  terminal: '终端应用',
  service: '服务商',
  enabling: '使能技术企业'
};

function resolveScaleAndCapital(revenue) {
  if (revenue >= 50) return { scale: 'large', capital: 8000 + Math.floor(revenue * 50), employees: 2000 + Math.floor(revenue * 30) };
  if (revenue >= 5) return { scale: 'medium', capital: 1000 + Math.floor(revenue * 100), employees: 200 + Math.floor(revenue * 80) };
  if (revenue >= 1) return { scale: 'small', capital: 100 + Math.floor(revenue * 200), employees: 20 + Math.floor(revenue * 80) };
  return { scale: 'micro', capital: 10 + Math.floor(revenue * 50), employees: 5 + Math.floor(revenue * 20) };
}

function enrichRecommendedEnterprises() {
  const result = [];
  Object.entries(MOCK_RECOMMENDED_ENTERPRISES).forEach(([nodeId, list]) => {
    const nodeMeta = RECOMMENDED_NODE_ROLES[nodeId] || { role: 'parts_supplier', node_name: '核心零部件' };
    list.forEach((rec, idx) => {
      const { scale, capital, employees } = resolveScaleAndCapital(rec.annual_revenue);
      const isLocal = rec.region && rec.region.includes('深圳市');
      const suffix = ['有限公司', '科技有限公司', '股份有限公司'][idx % 3];
      const fullName = rec.enterprise_name.endsWith('公司') ? rec.enterprise_name : rec.enterprise_name + suffix;
      result.push({
        id: rec.id,
        name: fullName,
        industry_role: nodeMeta.role,
        industry_role_label: ROLE_LABELS_MAP[nodeMeta.role],
        is_local: isLocal,
        is_leading: rec.annual_revenue >= 50,
        enterprise_scale: scale,
        annual_revenue: rec.annual_revenue,
        employee_count: employees,
        registered_capital: capital,
        credit_code: `91440300${(Math.floor(Math.random() * 1000000000000)).toString().padStart(12, '0')}`,
        legal_person: ['张', '李', '王', '赵', '刘'][idx % 5] + '先生',
        register_address: rec.region || '未知',
        establishment_date: `${2000 + (idx % 20)}-${((idx % 12) + 1).toString().padStart(2, '0')}-15`,
        status: 'active',
        risk_level: 'normal',
        tags: [ROLE_LABELS_MAP[nodeMeta.role], isLocal ? '本区企业' : '外地企业', scale === 'large' ? '龙头企业' : scale === 'medium' ? '骨干企业' : '小微企业'],
        chain_position: {
          chain_name: '人工智能与具身智能机器人',
          node_name: nodeMeta.node_name,
          role: 'supporting'
        }
      });
    });
  });
  return result;
}

const ALL_RECOMMENDED_ENTERPRISES = enrichRecommendedEnterprises();
ALL_ENTERPRISES.push(...ALL_RECOMMENDED_ENTERPRISES);

// 将强链补链页上游供应商清单补充进企业池，使“查看档案”可跳转企业画像页
if (typeof MockData !== 'undefined' && MockData.upstream && Array.isArray(MockData.upstream.suppliers)) {
  MockData.upstream.suppliers.forEach(function (supplier) {
    if (!supplier || !supplier.id) return;
    ensureMockEnterpriseInPool({
      id: supplier.id,
      name: supplier.name,
      annual_revenue: supplier.amount ? supplier.amount / 10000 : 1,
      address: supplier.province,
      tags: [supplier.category, '上游供应商']
    });
  });
}

// 把环节企业列表中的 mock/示例企业补充进企业池，确保点击名称能跳转到真实画像页
function ensureMockEnterpriseInPool(mockItem) {
  if (!mockItem || mockItem.placeholder) return null;
  
  // 优先按 ID 匹配真实企业
  let existing = ALL_ENTERPRISES.find(e => e.id === mockItem.id);
  if (existing) return existing;
  
  // 按名称匹配（支持包含关系）
  if (mockItem.name) {
    existing = ALL_ENTERPRISES.find(e => {
      if (!e.name) return false;
      return e.name === mockItem.name || e.name.includes(mockItem.name) || mockItem.name.includes(e.name);
    });
    if (existing) return existing;
  }
  
  // 未匹配到，则基于 mock 数据生成一个企业对象加入企业池
  const id = mockItem.id && !mockItem.id.startsWith('uuid-') ? mockItem.id : ('mock-' + Math.random().toString(36).substr(2, 9));
  const revenue = typeof mockItem.annual_revenue === 'number' ? mockItem.annual_revenue : 1;
  const { scale, capital, employees } = resolveScaleAndCapital(revenue);
  const enterprise = {
    id,
    name: mockItem.name || '未知企业',
    industry_role: 'parts_supplier',
    industry_role_label: '零部件供应商',
    is_local: false,
    is_leading: false,
    enterprise_scale: scale,
    annual_revenue: revenue,
    employee_count: employees,
    registered_capital: capital,
    credit_code: `91440300${Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0')}`,
    legal_person: '张先生',
    register_address: mockItem.address || '未知',
    establishment_date: mockItem.founded_date || '2018-06-15',
    status: 'active',
    risk_level: 'normal',
    tags: Array.isArray(mockItem.tags) ? mockItem.tags : [],
    chain_position: { chain_name: '人工智能与具身智能机器人', node_name: '核心零部件', role: 'supporting' }
  };
  ALL_ENTERPRISES.push(enterprise);
  return enterprise;
}

// 扩展 MockAPI
Object.assign(MockAPI, {
  getEnterpriseDetail(enterpriseId) {
    return new Promise(resolve => {
      setTimeout(() => {
        const detail = MOCK_ENTERPRISE_DETAILS[enterpriseId];
        if (detail) {
          resolve(detail);
        } else {
          const enterprise = ALL_ENTERPRISES.find(e => e.id === enterpriseId);
          resolve(enterprise || null);
        }
      }, 100);
    });
  },

  getEnterpriseProducts(enterpriseId) {
    return new Promise(resolve => {
      setTimeout(() => {
        const existing = MOCK_ENTERPRISE_PRODUCTS[enterpriseId];
        if (existing && existing.length > 0) {
          resolve(existing);
        } else {
          const enterprise = ALL_ENTERPRISES.find(e => e.id === enterpriseId);
          if (enterprise) {
            const productNames = {
              parts_supplier: ['精密齿轮', '轴承组件', '传动系统', '金属冲压件', '注塑模具'],
              manufacturer: ['工业机器人本体', '自动化生产线', '智能装备', '精密设备', '机械臂'],
              integrator: ['机器人集成方案', '自动化改造服务', '系统集成服务', '产线优化方案', '智能仓储系统'],
              terminal: ['智能终端产品', '消费电子设备', '新能源汽车零部件', '高端装备整机', '工业控制系统'],
              service: ['技术咨询服务', '检测认证服务', '物流配送服务', '软件开发服务', '运维服务'],
              enabling: ['AI算法服务', '大数据平台', '云计算服务', '物联网平台', '半导体器件']
            };
            const names = productNames[enterprise.industry_role] || productNames.service;
            const products = [];
            const count = Math.floor(Math.random() * 3) + 2;
            for (let i = 0; i < count; i++) {
              const name = names[Math.floor(Math.random() * names.length)] + (count > 1 ? ` ${i + 1}` : '');
              products.push({
                id: `prod-${enterpriseId}-${i}`,
                enterprise_id: enterpriseId,
                product_name: name,
                product_category: enterprise.industry_role_label || '产品',
                product_type: '主营产品',
                confidence: 0.7 + Math.random() * 0.3
              });
            }
            resolve(products);
          } else {
            resolve([]);
          }
        }
      }, 80);
    });
  },

  getEnterpriseDemands(enterpriseId) {
    return new Promise(resolve => {
      setTimeout(() => {
        const existing = MOCK_ENTERPRISE_DEMANDS[enterpriseId];
        if (existing && existing.length > 0) {
          resolve(existing);
        } else {
          const enterprise = ALL_ENTERPRISES.find(e => e.id === enterpriseId);
          if (enterprise) {
            const demandNames = {
              parts_supplier: ['原材料采购', '加工设备', '检测仪器', '物流服务', '技术培训'],
              manufacturer: ['核心零部件', '精密轴承', '控制系统', '传感器', '软件开发'],
              integrator: ['工业机器人', '自动化设备', '伺服电机', 'PLC控制器', '视觉系统'],
              terminal: ['核心芯片', '精密减速器', '高端元器件', '智能软件', '供应链服务'],
              service: ['办公设备', 'IT服务', '人力资源', '财务咨询', '法律事务'],
              enabling: ['服务器硬件', '网络设备', '软件许可', '云服务', '数据存储']
            };
            const names = demandNames[enterprise.industry_role] || demandNames.service;
            const demands = [];
            const count = Math.floor(Math.random() * 2) + 2;
            for (let i = 0; i < count; i++) {
              demands.push({
                id: `demand-${enterpriseId}-${i}`,
                enterprise_id: enterpriseId,
                demand_name: names[Math.floor(Math.random() * names.length)],
                demand_category: '采购需求',
                demand_scale: '年度采购',
                confidence: 0.6 + Math.random() * 0.4
              });
            }
            resolve(demands);
          } else {
            resolve([]);
          }
        }
      }, 80);
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
      setTimeout(() => resolve(ALL_ENTERPRISES), 100);
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

const CHAIN_INDUSTRY_DATA = {
  'chain-robot': {
    name: '人工智能与具身智能机器人',
    domains: [
      { value: 85, name: '核心零部件制造', color: '#3B82F6' },
      { value: 68, name: '机器人本体制造', color: '#10B981' },
      { value: 45, name: '系统集成服务', color: '#F59E0B' },
      { value: 32, name: 'AI算法服务', color: '#8B5CF6' },
      { value: 28, name: '智能传感器', color: '#EC4899' },
      { value: 22, name: '机器人应用终端', color: '#06B6D4' },
      { value: 18, name: '机器人运维服务', color: '#F97316' },
      { value: 12, name: '教育培训', color: '#EF4444' }
    ],
    links: ['精密减速机', '视觉控制器', '伺服电机', '工业机器人本体', '协作机器人'],
    linkData: [65, 42, 38, 55, 32],
    enterprises: [
      { name: '汇川技术股份有限公司', legalRep: '朱兴明', region: '广东省深圳市南山区', founded: '2003-04-10', capital: '12亿', tags: ['工业机器人', '伺服系统', '国家级专精特新小巨人', '高新技术企业'] },
      { name: '埃斯顿自动化股份有限公司', legalRep: '吴波', region: '江苏省南京市江宁区', founded: '1993-02-25', capital: '8亿', tags: ['工业机器人本体', '运动控制', '高新技术企业'] },
      { name: '固高科技（深圳）有限公司', legalRep: '李泽湘', region: '广东省深圳市南山区', founded: '1999-09-06', capital: '5000万', tags: ['运动控制器', '智能制造', '专精特新企业'] },
      { name: '绿的谐波传动科技股份有限公司', legalRep: '左昱昱', region: '江苏省苏州市吴中区', founded: '2011-01-13', capital: '3亿', tags: ['谐波减速器', '核心零部件', '专精特新企业'] },
      { name: '深圳市优必选科技股份有限公司', legalRep: '周剑', region: '广东省深圳市南山区', founded: '2012-03-31', capital: '6亿', tags: ['服务机器人', '人形机器人', '高新技术企业'] },
      { name: '浙江中控技术股份有限公司', legalRep: '崔山', region: '浙江省杭州市滨江区', founded: '1999-12-03', capital: '5亿', tags: ['工业自动化', '智能制造', '高新技术企业'] },
      { name: '深圳市大族激光科技产业集团股份有限公司', legalRep: '高云峰', region: '广东省深圳市南山区', founded: '1996-12-03', capital: '15亿', tags: ['激光加工设备', '机器人系统', '高新技术企业'] },
      { name: '上海新时达电气股份有限公司', legalRep: '纪德法', region: '上海市嘉定区', founded: '1995-03-10', capital: '6亿', tags: ['工业机器人', '电梯控制', '高新技术企业'] },
      { name: '广东拓斯达科技股份有限公司', legalRep: '吴丰礼', region: '广东省东莞市大岭山镇', founded: '2007-06-01', capital: '4亿', tags: ['工业机器人', '自动化设备', '高新技术企业'] },
      { name: '苏州汇川技术有限公司', legalRep: '朱兴明', region: '江苏省苏州市吴中区', founded: '2010-09-01', capital: '2亿', tags: ['伺服系统', '工业自动化', '高新技术企业'] }
    ],
    ageData: [0, 5, 18, 95, 165, 140, 2],
    capitalData: [35, 180, 130, 55, 38, 25],
    trendData: [320, 350, 380, 420, 480],
    growthData: [0.15, 0.09, 0.08, 0.11, 0.14],
    newData: [8, 12, 15, 20, 25, 18],
    newGrowthData: [0.3, 0.5, 0.25, 0.33, 0.25, 0.12],
    riskHigh: 28,
    riskMedium: 95,
    riskLow: 257
  },
  'chain-002': {
    name: '海洋产业',
    domains: [
      { value: 105, name: '涉海设备制造', color: '#3B82F6' },
      { value: 15, name: '涉海材料制造', color: '#10B981' },
      { value: 24, name: '海洋产业', color: '#F59E0B' },
      { value: 3, name: '海洋科研教育', color: '#8B5CF6' },
      { value: 3, name: '海洋科研教育', color: '#EC4899' },
      { value: 19, name: '海洋公共管理服务', color: '#06B6D4' },
      { value: 28, name: '涉海产品再加工', color: '#F97316' },
      { value: 28, name: '海洋产品批发与零售', color: '#EF4444' }
    ],
    links: ['海水淡化与综合利用装备制造', '海洋交通运输设备制造', '海洋矿产资源勘探开发', '海盐设备制造', '海洋工程通用设备制造'],
    linkData: [70, 41, 30, 30, 30],
    enterprises: [
      { name: '深圳华大海洋科技股份有限公司', legalRep: '徐军民', region: '广东省深圳市龙岗区葵涌街道', founded: '2012-09-07', capital: '1000万', tags: ['海洋功能性食品制造', '海洋药物制造', '海洋生物制品制造', '专精特新企业'] },
      { name: '深圳市朗诚科技股份有限公司', legalRep: '朱伟胜', region: '广东省深圳市福田区园岭街道', founded: '2003-02-27', capital: '3000万', tags: ['海洋信息装备制造及修理', '海洋航标器材与其他相关装置制造', '国家级专精特新小巨人', '专精特新企业', '高新技术企业'] },
      { name: '深圳市慧科恒科技有限公司', legalRep: '李少英', region: '广东省深圳市南山区蛇口街道', founded: '2012-02-28', capital: '800万', tags: ['海洋生物制品制造', '海洋鱼糜制品及水产品干腌制加工', '产业标签(1个)'] },
      { name: '广东粤强渔业有限公司', legalRep: '梁玉英', region: '广东省深圳市南山区', founded: '1994-08-19', capital: '300万', tags: ['海水捕捞产品'] },
      { name: '深圳市德润水下工程有限公司', legalRep: '宋春海', region: '广东省深圳市南山区粤海街道', founded: '2011-03-11', capital: '500万', tags: ['海洋油气资源勘探开发装备制造及修理', '海洋运输辅助活动', '专精特新企业', '高新技术企业'] },
      { name: '深圳市润控食品有限公司', legalRep: '郑晓文', region: '广东省深圳市罗湖区东晓街道', founded: '2018-01-16', capital: '200万', tags: ['海洋水产品冷冻加工', '海洋鱼糜制品及水产品干腌制加工'] },
      { name: '深圳市国坤餐厨食品集团有限公司', legalRep: '陈素芬', region: '广东省深圳市龙岗区吉华街道', founded: '2021-06-17', capital: '5000万', tags: ['海洋鱼糜制品及水产品干腌制加工', '海洋水产品冷冻加工', '近1个月新增对外投资'] },
      { name: '深圳市天勤投资发展有限公司', legalRep: '侯绍勇', region: '广东省深圳市罗湖区东晓街道', founded: '2009-08-28', capital: '1000万', tags: ['海洋水产品冷冻加工', '海洋鱼糜制品及水产品干腌制加工'] },
      { name: '深圳市恒丰源食品有限公司', legalRep: '刘延箱', region: '广东省深圳市坪山区龙田街道', founded: '2018-01-18', capital: '1000万', tags: ['海洋鱼糜制品及水产品干腌制加工', '海洋水产品冷冻加工'] },
      { name: '深圳市深港远洋实业有限公司', legalRep: '徐小昌', region: '广东省深圳市福田区福田街道', founded: '1998-01-19', capital: '5000万', tags: ['海水捕捞产品', '海洋鱼糜制品及水产品干腌制加工'] }
    ],
    ageData: [0, 3, 11, 80, 152, 152, 2],
    capitalData: [24, 154, 113, 47, 32, 53],
    trendData: [420, 380, 350, 360, 420],
    growthData: [0.8, 0.6, 0.3, 0.25, 0.2],
    newData: [3, 5, 2, 1, 1, 0],
    newGrowthData: [0.6, 0.5, 0.3, 0.4, 0.8, 0],
    riskHigh: 47,
    riskMedium: 168,
    riskLow: 171
  },
  'chain-003': {
    name: '细胞与基因',
    domains: [
      { value: 45, name: '基因测序服务', color: '#3B82F6' },
      { value: 38, name: '细胞治疗', color: '#10B981' },
      { value: 32, name: '基因编辑', color: '#F59E0B' },
      { value: 25, name: '生物制药', color: '#8B5CF6' },
      { value: 22, name: '诊断试剂', color: '#EC4899' },
      { value: 18, name: '医疗器械', color: '#06B6D4' },
      { value: 15, name: 'CRO服务', color: '#F97316' },
      { value: 10, name: 'CDMO服务', color: '#EF4444' }
    ],
    links: ['基因测序设备', '细胞治疗CDMO', '基因编辑技术', 'mRNA药物', '诊断试剂'],
    linkData: [25, 30, 22, 18, 35],
    enterprises: [
      { name: '华大基因股份有限公司', legalRep: '汪建', region: '广东省深圳市盐田区', founded: '1999-09-09', capital: '10亿', tags: ['基因测序', '生物技术', '高新技术企业'] },
      { name: '深圳迈瑞生物医疗电子股份有限公司', legalRep: '李西廷', region: '广东省深圳市南山区', founded: '1991-07-22', capital: '15亿', tags: ['医疗器械', '体外诊断', '高新技术企业'] },
      { name: '深圳市北科生物科技有限公司', legalRep: '胡祥', region: '广东省深圳市南山区', founded: '2005-07-12', capital: '5000万', tags: ['细胞治疗', '干细胞', '高新技术企业'] },
      { name: '深圳康泰生物制品股份有限公司', legalRep: '杜伟民', region: '广东省深圳市南山区', founded: '1992-09-08', capital: '8亿', tags: ['疫苗', '生物制药', '高新技术企业'] },
      { name: '深圳市卫光生物制品股份有限公司', legalRep: '王锦才', region: '广东省深圳市光明区', founded: '1988-01-21', capital: '4亿', tags: ['血液制品', '生物制药', '高新技术企业'] },
      { name: '深圳赛诺菲巴斯德生物制品有限公司', legalRep: '邓旭', region: '广东省深圳市南山区', founded: '2006-01-18', capital: '5亿', tags: ['疫苗', '生物制药'] },
      { name: '深圳市翰宇药业股份有限公司', legalRep: '曾少贵', region: '广东省深圳市坪山区', founded: '2003-04-02', capital: '6亿', tags: ['多肽药物', '生物制药', '高新技术企业'] },
      { name: '深圳信立泰药业股份有限公司', legalRep: '叶澄海', region: '广东省深圳市宝安区', founded: '1998-11-03', capital: '8亿', tags: ['心血管药物', '生物制药', '高新技术企业'] },
      { name: '深圳市海普瑞药业集团股份有限公司', legalRep: '李锂', region: '广东省深圳市南山区', founded: '1998-04-21', capital: '12亿', tags: ['肝素钠', '生物制药', '高新技术企业'] },
      { name: '深圳微芯生物科技股份有限公司', legalRep: '鲁先平', region: '广东省深圳市南山区', founded: '2001-03-21', capital: '4亿', tags: ['小分子药物', '创新药', '高新技术企业'] }
    ],
    ageData: [2, 8, 25, 55, 78, 65, 3],
    capitalData: [15, 85, 75, 35, 28, 30],
    trendData: [150, 180, 220, 280, 350],
    growthData: [0.2, 0.25, 0.18, 0.22, 0.25],
    newData: [5, 8, 12, 18, 22, 20],
    newGrowthData: [0.4, 0.33, 0.3, 0.35, 0.18, 0.1],
    riskHigh: 15,
    riskMedium: 45,
    riskLow: 88
  },
  'chain-004': {
    name: '智能终端',
    domains: [
      { value: 95, name: '智能手机制造', color: '#3B82F6' },
      { value: 68, name: '平板电脑', color: '#10B981' },
      { value: 55, name: '智能穿戴', color: '#F59E0B' },
      { value: 42, name: '智能家居', color: '#8B5CF6' },
      { value: 35, name: '智能汽车', color: '#EC4899' },
      { value: 28, name: 'IoT设备', color: '#06B6D4' },
      { value: 22, name: '芯片设计', color: '#F97316' },
      { value: 18, name: '显示面板', color: '#EF4444' }
    ],
    links: ['高端显示面板', '射频前端芯片', '5G通信模块', '触控屏', '电池管理系统'],
    linkData: [55, 48, 42, 52, 38],
    enterprises: [
      { name: '华为技术有限公司', legalRep: '赵明路', region: '广东省深圳市龙岗区', founded: '1987-09-15', capital: '3亿', tags: ['智能手机', '通信设备', '高新技术企业'] },
      { name: '比亚迪股份有限公司', legalRep: '王传福', region: '广东省深圳市坪山区', founded: '1995-02-10', capital: '20亿', tags: ['新能源汽车', '电池', '高新技术企业'] },
      { name: '中兴通讯股份有限公司', legalRep: '李自学', region: '广东省深圳市南山区', founded: '1985-02-01', capital: '15亿', tags: ['通信设备', '智能终端', '高新技术企业'] },
      { name: 'OPPO广东移动通信有限公司', legalRep: '陈明永', region: '广东省东莞市长安镇', founded: '2004-02-10', capital: '6亿', tags: ['智能手机', '智能穿戴', '高新技术企业'] },
      { name: 'vivo广东移动通信有限公司', legalRep: '沈炜', region: '广东省东莞市长安镇', founded: '2009-02-12', capital: '5亿', tags: ['智能手机', '智能穿戴', '高新技术企业'] },
      { name: '深圳市立讯精密工业股份有限公司', legalRep: '王来春', region: '广东省深圳市宝安区', founded: '2004-05-24', capital: '8亿', tags: ['连接器', '精密制造', '高新技术企业'] },
      { name: '深圳市汇顶科技股份有限公司', legalRep: '张帆', region: '广东省深圳市南山区', founded: '2002-05-31', capital: '4亿', tags: ['触控芯片', '指纹识别', '高新技术企业'] },
      { name: '深圳市兆易创新科技股份有限公司', legalRep: '朱一明', region: '广东省深圳市南山区', founded: '2005-04-06', capital: '3亿', tags: ['存储芯片', 'MCU', '高新技术企业'] },
      { name: '深圳传音控股股份有限公司', legalRep: '竺兆江', region: '广东省深圳市南山区', founded: '2013-08-21', capital: '8亿', tags: ['智能手机', '海外市场', '高新技术企业'] },
      { name: '深圳市深天马微电子股份有限公司', legalRep: '彭旭辉', region: '广东省深圳市南山区', founded: '1983-11-08', capital: '10亿', tags: ['显示面板', 'OLED', '高新技术企业'] }
    ],
    ageData: [3, 12, 35, 105, 135, 120, 5],
    capitalData: [28, 165, 125, 52, 42, 38],
    trendData: [450, 520, 580, 650, 720],
    growthData: [0.18, 0.15, 0.12, 0.12, 0.11],
    newData: [10, 15, 18, 22, 25, 28],
    newGrowthData: [0.3, 0.25, 0.18, 0.2, 0.15, 0.1],
    riskHigh: 35,
    riskMedium: 120,
    riskLow: 380
  },
  'chain-005': {
    name: '低空经济',
    domains: [
      { value: 35, name: 'eVTOL整机', color: '#3B82F6' },
      { value: 32, name: '无人机制造', color: '#10B981' },
      { value: 28, name: '低空飞行服务', color: '#F59E0B' },
      { value: 25, name: '空域管理', color: '#8B5CF6' },
      { value: 22, name: '通航机场', color: '#EC4899' },
      { value: 18, name: '飞行培训', color: '#06B6D4' },
      { value: 15, name: '物流配送', color: '#F97316' },
      { value: 12, name: '应急救援', color: '#EF4444' }
    ],
    links: ['eVTOL整机', '低空空域管理', '无人机系统', '通航机场', '飞行服务'],
    linkData: [18, 25, 32, 22, 28],
    enterprises: [
      { name: '亿航智能设备（广州）有限公司', legalRep: '胡华智', region: '广东省广州市天河区', founded: '2014-08-01', capital: '3亿', tags: ['eVTOL', '无人机', '高新技术企业'] },
      { name: '大疆创新科技有限公司', legalRep: '汪滔', region: '广东省深圳市南山区', founded: '2006-01-01', capital: '5亿', tags: ['无人机', '航拍', '高新技术企业'] },
      { name: '深圳顺丰泰森控股（集团）有限公司', legalRep: '王卫', region: '广东省深圳市福田区', founded: '1993-03-26', capital: '10亿', tags: ['物流', '无人机配送', '高新技术企业'] },
      { name: '深圳航天工业技术研究院有限公司', legalRep: '胡梅晓', region: '广东省深圳市南山区', founded: '2007-01-18', capital: '8亿', tags: ['航天技术', '无人机', '高新技术企业'] },
      { name: '深圳市科比特航空科技有限公司', legalRep: '卢致辉', region: '广东省深圳市宝安区', founded: '2015-08-12', capital: '5000万', tags: ['工业无人机', '测绘', '高新技术企业'] },
      { name: '深圳道通智能航空技术股份有限公司', legalRep: '李红京', region: '广东省深圳市宝安区', founded: '2014-05-08', capital: '3亿', tags: ['无人机', '智能硬件', '高新技术企业'] },
      { name: '深圳市飞马机器人科技有限公司', legalRep: '黄勇', region: '广东省深圳市南山区', founded: '2015-06-18', capital: '3000万', tags: ['无人机', '测绘', '专精特新企业'] },
      { name: '深圳天鹰兄弟无人机创新科技有限公司', legalRep: '李才圣', region: '广东省深圳市坪山区', founded: '2015-03-26', capital: '2000万', tags: ['农业无人机', '植保', '高新技术企业'] },
      { name: '深圳市睿铂科技有限公司', legalRep: '杨波', region: '广东省深圳市南山区', founded: '2015-09-10', capital: '1000万', tags: ['无人机载荷', '测绘', '专精特新企业'] },
      { name: '深圳智航无人机有限公司', legalRep: '金良', region: '广东省深圳市宝安区', founded: '2014-05-20', capital: '2000万', tags: ['无人机', '安防', '高新技术企业'] }
    ],
    ageData: [5, 15, 28, 35, 25, 15, 2],
    capitalData: [20, 65, 55, 28, 22, 18],
    trendData: [80, 100, 130, 165, 210],
    growthData: [0.25, 0.25, 0.22, 0.27, 0.27],
    newData: [5, 8, 12, 18, 25, 30],
    newGrowthData: [0.4, 0.35, 0.33, 0.38, 0.35, 0.2],
    riskHigh: 8,
    riskMedium: 28,
    riskLow: 62
  },
  'chain-007': {
    name: '信息服务',
    domains: [
      { value: 75, name: '云计算服务', color: '#3B82F6' },
      { value: 62, name: '大数据', color: '#10B981' },
      { value: 55, name: '软件服务', color: '#F59E0B' },
      { value: 48, name: 'IT咨询', color: '#8B5CF6' },
      { value: 42, name: '数据安全', color: '#EC4899' },
      { value: 35, name: '系统集成', color: '#06B6D4' },
      { value: 30, name: '运维服务', color: '#F97316' },
      { value: 25, name: '培训服务', color: '#EF4444' }
    ],
    links: ['云计算基础设施', '数据安全服务', '软件开发', 'IT咨询', '系统集成'],
    linkData: [68, 52, 75, 45, 58],
    enterprises: [
      { name: '腾讯科技（深圳）有限公司', legalRep: '马化腾', region: '广东省深圳市南山区', founded: '1998-11-11', capital: '6亿', tags: ['互联网', '云计算', '高新技术企业'] },
      { name: '阿里巴巴（中国）有限公司', legalRep: '张勇', region: '浙江省杭州市西湖区', founded: '1999-09-09', capital: '8亿', tags: ['电子商务', '云计算', '高新技术企业'] },
      { name: '百度在线网络技术（北京）有限公司', legalRep: '梁志祥', region: '北京市海淀区', founded: '2000-01-01', capital: '5亿', tags: ['搜索引擎', '人工智能', '高新技术企业'] },
      { name: '京东集团股份有限公司', legalRep: '刘强东', region: '北京市大兴区', founded: '2004-01-01', capital: '10亿', tags: ['电子商务', '物流', '高新技术企业'] },
      { name: '美团', legalRep: '王兴', region: '北京市朝阳区', founded: '2010-03-04', capital: '8亿', tags: ['生活服务', '外卖', '高新技术企业'] },
      { name: '字节跳动有限公司', legalRep: '张一鸣', region: '北京市海淀区', founded: '2012-03-09', capital: '10亿', tags: ['短视频', '人工智能', '高新技术企业'] },
      { name: '网易（杭州）网络有限公司', legalRep: '丁磊', region: '浙江省杭州市滨江区', founded: '1997-06-24', capital: '5亿', tags: ['互联网', '游戏', '高新技术企业'] },
      { name: '深圳市金蝶软件有限公司', legalRep: '徐少春', region: '广东省深圳市南山区', founded: '1993-08-08', capital: '5亿', tags: ['ERP', '企业软件', '高新技术企业'] },
      { name: '用友网络科技股份有限公司', legalRep: '王文京', region: '北京市海淀区', founded: '1988-12-01', capital: '8亿', tags: ['ERP', '企业软件', '高新技术企业'] },
      { name: '神州数码集团股份有限公司', legalRep: '郭为', region: '北京市海淀区', founded: '1982-06-01', capital: '6亿', tags: ['IT分销', '云计算', '高新技术企业'] }
    ],
    ageData: [2, 10, 30, 85, 150, 135, 5],
    capitalData: [45, 180, 140, 60, 45, 42],
    trendData: [520, 580, 650, 720, 820],
    growthData: [0.12, 0.1, 0.12, 0.11, 0.14],
    newData: [15, 22, 28, 35, 42, 45],
    newGrowthData: [0.3, 0.28, 0.25, 0.25, 0.18, 0.1],
    riskHigh: 25,
    riskMedium: 85,
    riskLow: 320
  }
};

Object.assign(MOCK_CATEGORY_TREES, {
  'chain-002': {
    chainId: 'chain-002',
    tree: [{
      id: 'oc-root', name: '海洋产业', level: 1, isLeaf: false,
      children: [
        {
          id: 'oc-equip', name: '涉海设备制造', level: 2, isLeaf: false,
          children: [
            { id: 'oc-fish-equip', name: '海洋渔业和水产品加工设备制造', level: 3, isLeaf: true, nationalCount: 65, localCount: 65, status: 'normal' },
            { id: 'oc-ship-aux', name: '海洋船舶辅助设备及配件制造', level: 3, isLeaf: true, nationalCount: 47, localCount: 47, status: 'normal' },
            { id: 'oc-salt-equip', name: '海盐设备制造', level: 3, isLeaf: true, nationalCount: 74, localCount: 74, status: 'normal' },
            { id: 'oc-chem-equip', name: '海洋化工设备及仪器制造', level: 3, isLeaf: true, nationalCount: 34, localCount: 34, status: 'normal' },
            { id: 'oc-drug-equip', name: '海洋药物和生物制品设备及仪器制造', level: 3, isLeaf: true, nationalCount: 3, localCount: 3, status: 'normal' },
            { id: 'oc-transport-equip', name: '海洋交通运输设备制造', level: 3, isLeaf: true, nationalCount: 515, localCount: 515, status: 'advantage' },
            { id: 'oc-tour-equip', name: '海洋旅游娱乐设备制造', level: 3, isLeaf: true, nationalCount: 120, localCount: 120, status: 'normal' },
            { id: 'oc-eco-equip', name: '海洋生态环境保护修复仪器设备制造', level: 3, isLeaf: true, nationalCount: 7, localCount: 7, status: 'normal' }
          ]
        },
        {
          id: 'oc-material', name: '涉海材料制造', level: 2, isLeaf: false,
          children: [
            { id: 'oc-aqua-feed', name: '海洋水产养殖饲料与药品制造', level: 3, isLeaf: true, nationalCount: 59, localCount: 59, status: 'normal' },
            { id: 'oc-artificial-oil', name: '海洋人造原油加工制造', level: 3, isLeaf: true, nationalCount: 20, localCount: 0, status: 'missing' },
            { id: 'oc-oilfield-chem', name: '海洋油田化学品制造', level: 3, isLeaf: true, nationalCount: 1000, localCount: 2, status: 'normal' },
            { id: 'oc-tour-craft', name: '海洋旅游工艺品制造', level: 3, isLeaf: true, nationalCount: 25, localCount: 25, status: 'normal' },
            { id: 'oc-eco-material', name: '海洋生态环境保护修复材料制造', level: 3, isLeaf: true, nationalCount: 1000, localCount: 9, status: 'normal' },
            { id: 'oc-subsea-material', name: '海底运输材料制造', level: 3, isLeaf: true, nationalCount: 1000, localCount: 2, status: 'normal' },
            { id: 'oc-protect-material', name: '海洋防护材料制造', level: 3, isLeaf: true, nationalCount: 1000, localCount: 10, status: 'normal' },
            { id: 'oc-ship-material', name: '船舶及海洋工程装备材料制造', level: 3, isLeaf: true, nationalCount: 1000, localCount: 2, status: 'normal' }
          ]
        },
        {
          id: 'oc-industry', name: '海洋产业', level: 2, isLeaf: false,
          children: [
            {
              id: 'oc-fishery', name: '海洋渔业', level: 3, isLeaf: false,
              children: [
                { id: 'oc-aquaculture', name: '海水养殖产品', level: 4, isLeaf: true, nationalCount: 83, localCount: 83, status: 'normal' },
                { id: 'oc-catch', name: '海水捕捞产品', level: 4, isLeaf: true, nationalCount: 49, localCount: 49, status: 'normal' },
                { id: 'oc-fry', name: '海洋鱼苗及鱼种场活动', level: 4, isLeaf: true, nationalCount: 1000, localCount: 11, status: 'normal' }
              ]
            },
            {
              id: 'oc-aquatic-process', name: '海洋水产品加工业', level: 3, isLeaf: false,
              children: [
                { id: 'oc-fish-paste', name: '海洋鱼糜制品及水产品干腌制加工', level: 4, isLeaf: true, nationalCount: 66, localCount: 66, status: 'normal' },
                { id: 'oc-frozen', name: '海洋水产品冷冻加工', level: 4, isLeaf: true, nationalCount: 70, localCount: 70, status: 'normal' },
                { id: 'oc-can', name: '海洋水产罐头制造', level: 4, isLeaf: true, nationalCount: 1000, localCount: 4, status: 'normal' },
                { id: 'oc-pearl', name: '海水珍珠加工', level: 4, isLeaf: true, nationalCount: 1, localCount: 1, status: 'normal' },
                { id: 'oc-fish-oil', name: '海洋鱼油提取及制品制造', level: 4, isLeaf: true, nationalCount: 17, localCount: 17, status: 'normal' },
                { id: 'oc-aqua-feed-mfg', name: '海洋水产饲料制造', level: 4, isLeaf: true, nationalCount: 6, localCount: 6, status: 'normal' }
              ]
            },
            {
              id: 'oc-oil-gas', name: '海洋油气业', level: 3, isLeaf: false,
              children: [
                {
                  id: 'oc-oil-gas-extract', name: '海洋石油和天然气开采', level: 4, isLeaf: false,
                  children: [
                    { id: 'oc-oil-extract', name: '海洋石油开采', level: 5, isLeaf: true, nationalCount: 30, localCount: 30, status: 'normal' },
                    { id: 'oc-gas-extract', name: '海洋天然气及可燃冰开采', level: 5, isLeaf: true, nationalCount: 23, localCount: 23, status: 'normal' }
                  ]
                }
              ]
            },
            { id: 'oc-mining', name: '海洋矿业', level: 3, isLeaf: true, nationalCount: 2, localCount: 2, status: 'normal' },
            { id: 'oc-salt', name: '海洋盐业', level: 3, isLeaf: true, nationalCount: 2, localCount: 2, status: 'normal' },
            { id: 'oc-ship-repair', name: '海洋船舶改装拆除与修理', level: 3, isLeaf: true, nationalCount: 10, localCount: 10, status: 'normal' },
            { id: 'oc-ship-equip', name: '海洋船舶配套设备制造', level: 3, isLeaf: true, nationalCount: 50, localCount: 50, status: 'normal' },
            { id: 'oc-nav-aid', name: '海洋航标器材与其他相关装置制造', level: 3, isLeaf: true, nationalCount: 49, localCount: 49, status: 'normal' },
            {
              id: 'oc-marine-equip', name: '海洋工程装备制造', level: 3, isLeaf: false,
              children: [
                { id: 'oc-mineral-equip', name: '海洋矿产资源勘探开发装备制造及修理', level: 4, isLeaf: true, nationalCount: 88, localCount: 88, status: 'advantage' },
                { id: 'oc-oil-equip', name: '海洋油气资源勘探开发装备制造及修理', level: 4, isLeaf: true, nationalCount: 60, localCount: 60, status: 'normal' },
                { id: 'oc-wind-equip', name: '海洋风能与可再生能源开发利用装备制造及修理', level: 4, isLeaf: true, nationalCount: 34, localCount: 34, status: 'normal' },
                { id: 'oc-desal-equip', name: '海水淡化与综合利用装备制造及修理', level: 4, isLeaf: true, nationalCount: 200, localCount: 200, status: 'advantage' },
                { id: 'oc-bio-equip', name: '海洋生物资源利用装备制造及修理', level: 4, isLeaf: true, nationalCount: 33, localCount: 33, status: 'normal' },
                { id: 'oc-info-equip', name: '海洋信息装备制造及修理', level: 4, isLeaf: true, nationalCount: 31, localCount: 31, status: 'normal' },
                { id: 'oc-general-equip', name: '海洋工程通用装备制造及修理', level: 4, isLeaf: true, nationalCount: 66, localCount: 66, status: 'normal' }
              ]
            },
            {
              id: 'oc-chem-industry', name: '海洋化工业', level: 3, isLeaf: false,
              children: [
                { id: 'oc-salt-chem', name: '海盐化工', level: 4, isLeaf: true, nationalCount: 2, localCount: 2, status: 'normal' },
                { id: 'oc-petrol-chem', name: '海洋石油化工', level: 4, isLeaf: true, nationalCount: 33, localCount: 33, status: 'normal' },
                { id: 'oc-algae-chem', name: '海藻化工', level: 4, isLeaf: true, nationalCount: 4, localCount: 4, status: 'normal' }
              ]
            },
            {
              id: 'oc-bio-pharma', name: '海洋生物医药业', level: 3, isLeaf: false,
              children: [
                { id: 'oc-drug-mfg', name: '海洋药品制造', level: 4, isLeaf: true, nationalCount: 412, localCount: 412, status: 'normal' },
                { id: 'oc-functional-food', name: '海洋功能性食品制造', level: 4, isLeaf: true, nationalCount: 36, localCount: 36, status: 'normal' },
                { id: 'oc-bio-products', name: '海洋生物制品制造', level: 4, isLeaf: true, nationalCount: 184, localCount: 184, status: 'normal' }
              ]
            },
            {
              id: 'oc-marine-construction', name: '海洋工程建筑业', level: 3, isLeaf: false,
              children: [
                { id: 'oc-offshore-constr', name: '海上工程建筑', level: 4, isLeaf: true, nationalCount: 58, localCount: 58, status: 'normal' },
                { id: 'oc-subsea-constr', name: '海底工程建筑', level: 4, isLeaf: true, nationalCount: 50, localCount: 0, status: 'missing' },
                { id: 'oc-nearshore-constr', name: '近岸工程建筑', level: 4, isLeaf: true, nationalCount: 45, localCount: 45, status: 'normal' }
              ]
            },
            {
              id: 'oc-marine-power', name: '海洋电力业', level: 3, isLeaf: false,
              children: [
                { id: 'oc-wind-power', name: '海洋风力发电', level: 4, isLeaf: true, nationalCount: 10, localCount: 10, status: 'normal' },
                { id: 'oc-ocean-energy', name: '海洋能发电', level: 4, isLeaf: true, nationalCount: 2, localCount: 2, status: 'normal' }
              ]
            },
            {
              id: 'oc-desal-util', name: '海水淡化与综合利用业', level: 3, isLeaf: false,
              children: [
                { id: 'oc-desalination', name: '海水淡化', level: 4, isLeaf: true, nationalCount: 129, localCount: 129, status: 'normal' },
                { id: 'oc-direct-use', name: '海水直接利用', level: 4, isLeaf: true, nationalCount: 7, localCount: 7, status: 'advantage' },
                { id: 'oc-chem-use', name: '海水化学资源利用', level: 4, isLeaf: true, nationalCount: 3, localCount: 3, status: 'advantage' }
              ]
            },
            {
              id: 'oc-marine-transport', name: '海洋交通运输业', level: 3, isLeaf: false,
              children: [
                { id: 'oc-passenger', name: '海上旅客运输', level: 4, isLeaf: true, nationalCount: 51, localCount: 51, status: 'normal' },
                {
                  id: 'oc-cargo', name: '海洋货物运输', level: 4, isLeaf: false,
                  children: [
                    { id: 'oc-ocean-cargo', name: '远洋货物运输', level: 5, isLeaf: true, nationalCount: 769, localCount: 769, status: 'normal' },
                    { id: 'oc-coastal-cargo', name: '沿海货物运输服务', level: 5, isLeaf: true, nationalCount: 174, localCount: 174, status: 'normal' }
                  ]
                },
                { id: 'oc-port', name: '沿海港口', level: 4, isLeaf: true, nationalCount: 8, localCount: 8, status: 'normal' },
                { id: 'oc-pipeline', name: '海底管道运输', level: 4, isLeaf: true, nationalCount: 74, localCount: 74, status: 'normal' },
                { id: 'oc-transport-aux', name: '海洋运输辅助活动', level: 4, isLeaf: true, nationalCount: 13, localCount: 13, status: 'normal' }
              ]
            },
            { id: 'oc-tour-service', name: '海洋旅游经营服务', level: 3, isLeaf: true, nationalCount: 61, localCount: 61, status: 'normal' },
            {
              id: 'oc-public-mgmt', name: '海洋公共管理服务', level: 3, isLeaf: false,
              children: [
                {
                  id: 'oc-info-service', name: '海洋信息服务', level: 4, isLeaf: false,
                  children: [
                    { id: 'oc-info-collection', name: '海洋信息采集服务', level: 5, isLeaf: true, nationalCount: 8, localCount: 8, status: 'normal' },
                    { id: 'oc-info-comm', name: '海洋通信传输服务', level: 5, isLeaf: true, nationalCount: 19, localCount: 19, status: 'normal' },
                    { id: 'oc-info-storage', name: '海洋信息处理与存储', level: 5, isLeaf: true, nationalCount: 2, localCount: 2, status: 'normal' },
                    { id: 'oc-info-integration', name: '海洋信息系统开发集成', level: 5, isLeaf: true, nationalCount: 59, localCount: 59, status: 'normal' },
                    { id: 'oc-info-sharing', name: '海洋信息共享应用服务', level: 5, isLeaf: true, nationalCount: 107, localCount: 107, status: 'normal' }
                  ]
                },
                {
                  id: 'oc-eco-restoration', name: '海洋生态环境保护修复', level: 4, isLeaf: false,
                  children: [
                    { id: 'oc-env-protection', name: '海洋环境保护服务', level: 5, isLeaf: true, nationalCount: 28, localCount: 28, status: 'normal' },
                    { id: 'oc-eco-repair', name: '海洋生态修复', level: 5, isLeaf: true, nationalCount: 7, localCount: 7, status: 'normal' },
                    { id: 'oc-env-governance', name: '海洋环境治理', level: 5, isLeaf: true, nationalCount: 23, localCount: 23, status: 'normal' }
                  ]
                },
                {
                  id: 'oc-geological', name: '海洋地质勘查', level: 4, isLeaf: false,
                  children: [
                    { id: 'oc-mineral-geo', name: '海洋矿产地质勘查', level: 5, isLeaf: true, nationalCount: 14, localCount: 14, status: 'normal' },
                    { id: 'oc-basic-geo', name: '海洋基础地质勘查', level: 5, isLeaf: true, nationalCount: 5, localCount: 5, status: 'normal' },
                    { id: 'oc-geo-tech', name: '海洋地质勘查技术服务', level: 5, isLeaf: true, nationalCount: 1, localCount: 1, status: 'normal' }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 'oc-edu', name: '海洋科研教育', level: 2, isLeaf: false,
          children: [
            { id: 'oc-science', name: '海洋科学研究', level: 3, isLeaf: true, nationalCount: 17, localCount: 17, status: 'normal' },
            { id: 'oc-education', name: '海洋教育', level: 3, isLeaf: true, nationalCount: 6, localCount: 6, status: 'normal' }
          ]
        },
        {
          id: 'oc-reprocess', name: '涉海产品再加工', level: 2, isLeaf: false,
          children: [
            { id: 'oc-aqua-deep', name: '海洋水产品深加工', level: 3, isLeaf: true, nationalCount: 168, localCount: 168, status: 'normal' },
            { id: 'oc-chem-product', name: '海洋化工产品制造', level: 3, isLeaf: true, nationalCount: 2, localCount: 2, status: 'normal' }
          ]
        },
        { id: 'oc-retail', name: '海洋产品批发与零售', level: 2, isLeaf: true, nationalCount: 297, localCount: 297, status: 'normal' },
        {
          id: 'oc-service', name: '涉海经营服务', level: 2, isLeaf: false,
          children: [
            { id: 'oc-finance', name: '涉海金融服务', level: 3, isLeaf: true, nationalCount: 17, localCount: 17, status: 'normal' },
            { id: 'oc-catering', name: '海洋餐饮服务', level: 3, isLeaf: true, nationalCount: 77, localCount: 77, status: 'normal' },
            { id: 'oc-business', name: '涉海商务服务', level: 3, isLeaf: true, nationalCount: 1000, localCount: 3, status: 'normal' },
            { id: 'oc-special', name: '涉海特色服务', level: 3, isLeaf: true, nationalCount: 1, localCount: 1, status: 'normal' }
          ]
        }
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
      id: 'la-root', name: '低空经济', level: 1, isLeaf: false,
      children: [
        {
          id: 'la-manu', name: '低空制造', level: 2, isLeaf: false,
          children: [
            {
              id: 'la-raw', name: '关键原材料', level: 3, isLeaf: false,
              children: [
                { id: 'la-plastic', name: '航空工程塑料', level: 4, isLeaf: true, nationalCount: 24, localCount: 24, status: 'normal' },
                { id: 'la-alloy', name: '航空铝合金', level: 4, isLeaf: true, nationalCount: 11, localCount: 11, status: 'normal' },
                { id: 'la-glass', name: '航空玻纤', level: 4, isLeaf: true, nationalCount: 3, localCount: 3, status: 'normal' },
                { id: 'la-carbon', name: '航空碳纤维', level: 4, isLeaf: true, nationalCount: 7, localCount: 7, status: 'normal' },
                { id: 'la-superalloy', name: '高温合金', level: 4, isLeaf: true, nationalCount: 55, localCount: 55, status: 'normal' }
              ]
            },
            {
              id: 'la-uav-parts', name: '无人机/eVTOL关键零部件', level: 3, isLeaf: false,
              children: [
                { id: 'la-airframe', name: '无人机机身', level: 4, isLeaf: true, nationalCount: 13, localCount: 13, status: 'normal' },
                { id: 'la-power', name: '动力系统', level: 4, isLeaf: true, nationalCount: 150, localCount: 150, status: 'normal' },
                { id: 'la-fcs', name: '飞行控制系统', level: 4, isLeaf: true, nationalCount: 160, localCount: 160, status: 'normal' },
                { id: 'la-nav', name: '无人机导航系统', level: 4, isLeaf: true, nationalCount: 150, localCount: 150, status: 'normal' },
                { id: 'la-comm', name: '通信系统', level: 4, isLeaf: true, nationalCount: 25, localCount: 25, status: 'normal' },
                { id: 'la-ground', name: '地面系统', level: 4, isLeaf: true, nationalCount: 20, localCount: 20, status: 'normal' },
                { id: 'la-otherparts', name: '其他零部件', level: 4, isLeaf: true, nationalCount: 4, localCount: 4, status: 'normal' }
              ]
            },
            {
              id: 'la-uav-key', name: '无人机关键零部件', level: 3, isLeaf: false,
              children: [
                { id: 'la-payload', name: '载荷系统', level: 4, isLeaf: true, nationalCount: 98, localCount: 98, status: 'normal' }
              ]
            },
            {
              id: 'la-evtol-parts', name: 'eVTOL关键零部件', level: 3, isLeaf: false,
              children: [
                { id: 'la-evtol-cabin', name: 'eVTOL座舱系统', level: 4, isLeaf: true, nationalCount: 1, localCount: 1, status: 'normal' }
              ]
            },
            {
              id: 'la-ga-parts', name: '通用航空飞行器关键零部件', level: 3, isLeaf: false,
              children: [
                {
                  id: 'la-engine', name: '航空发动机', level: 4, isLeaf: false,
                  children: [
                    { id: 'la-piston', name: '活塞式发动机', level: 5, isLeaf: true, nationalCount: 1, localCount: 1, status: 'normal' },
                    { id: 'la-turbine', name: '涡轮发动机', level: 5, isLeaf: true, nationalCount: 6, localCount: 6, status: 'normal' }
                  ]
                },
                { id: 'la-airframe-ga', name: '通航飞行器机体', level: 4, isLeaf: true, nationalCount: 60, localCount: 0, status: 'missing' },
                { id: 'la-avionics', name: '航电系统', level: 4, isLeaf: true, nationalCount: 2, localCount: 2, status: 'normal' },
                { id: 'la-electromechanical', name: '机电系统', level: 4, isLeaf: true, nationalCount: 2, localCount: 2, status: 'normal' }
              ]
            },
            {
              id: 'la-uav-whole', name: '无人机整机制造', level: 3, isLeaf: false,
              children: [
                { id: 'la-military-uav', name: '军用无人机', level: 4, isLeaf: true, nationalCount: 2, localCount: 2, status: 'normal' },
                {
                  id: 'la-civil-uav', name: '民用无人机', level: 4, isLeaf: false,
                  children: [
                    { id: 'la-industrial-uav', name: '工业无人机', level: 5, isLeaf: true, nationalCount: 70, localCount: 70, status: 'advantage' },
                    { id: 'la-consumer-uav', name: '消费级无人机', level: 5, isLeaf: true, nationalCount: 804, localCount: 804, status: 'advantage' }
                  ]
                }
              ]
            },
            { id: 'la-evtol-manu', name: '电动垂直起降飞行器（eVTOL）制造', level: 3, isLeaf: true, nationalCount: 9, localCount: 9, status: 'advantage' },
            {
              id: 'la-ga-manu', name: '低空通航飞行器制造', level: 3, isLeaf: false,
              children: [
                { id: 'la-civil-heli', name: '民用直升机', level: 4, isLeaf: true, nationalCount: 15, localCount: 15, status: 'advantage' },
                { id: 'la-light-ga', name: '轻型通用飞机', level: 4, isLeaf: true, nationalCount: 12, localCount: 12, status: 'normal' }
              ]
            }
          ]
        },
        {
          id: 'la-support', name: '低空保障', level: 2, isLeaf: false,
          children: [
            { id: 'la-airspace', name: '空域管理', level: 3, isLeaf: true, nationalCount: 2, localCount: 2, status: 'advantage' },
            { id: 'la-airport', name: '通航机场建设与运营', level: 3, isLeaf: true, nationalCount: 29, localCount: 29, status: 'advantage' },
            { id: 'la-takeoff', name: '起降平台建设与运营', level: 3, isLeaf: true, nationalCount: 120, localCount: 0, status: 'missing' },
            { id: 'la-comm-infra', name: '通信基础设施建设与运营', level: 3, isLeaf: true, nationalCount: 2, localCount: 2, status: 'advantage' },
            { id: 'la-fss', name: '飞行服务站建设与运营', level: 3, isLeaf: true, nationalCount: 80, localCount: 0, status: 'missing' },
            { id: 'la-dispatch', name: '无人机调度与监管平台建设与运营', level: 3, isLeaf: true, nationalCount: 1000, localCount: 2, status: 'normal' },
            {
              id: 'la-maintenance', name: '低空飞行器检修', level: 3, isLeaf: false,
              children: [
                { id: 'la-ga-maint', name: '通航飞行器检修', level: 4, isLeaf: true, nationalCount: 26, localCount: 26, status: 'normal' },
                { id: 'la-uav-maint', name: '无人机检修', level: 4, isLeaf: true, nationalCount: 9, localCount: 9, status: 'advantage' },
                { id: 'la-evtol-maint', name: '电动垂直起降飞行器（eVTOL）检修', level: 4, isLeaf: true, nationalCount: 45, localCount: 0, status: 'missing' }
              ]
            }
          ]
        },
        {
          id: 'la-activity', name: '低空飞行活动', level: 2, isLeaf: false,
          children: [
            {
              id: 'la-ga-ops', name: '通航运营与飞行活动', level: 3, isLeaf: false,
              children: [
                { id: 'la-commercial', name: '商业运输', level: 4, isLeaf: true, nationalCount: 10, localCount: 10, status: 'normal' },
                { id: 'la-special', name: '特种作业', level: 4, isLeaf: true, nationalCount: 25, localCount: 25, status: 'normal' },
                { id: 'la-tourism', name: '通航文旅活动', level: 4, isLeaf: true, nationalCount: 15, localCount: 15, status: 'advantage' }
              ]
            },
            {
              id: 'la-uav-ops', name: '无人机运营及飞行活动', level: 3, isLeaf: false,
              children: [
                { id: 'la-military-ops', name: '军用无人机', level: 4, isLeaf: true, nationalCount: 4, localCount: 4, status: 'normal' },
                { id: 'la-industrial-ops', name: '工业级无人机', level: 4, isLeaf: true, nationalCount: 82, localCount: 82, status: 'normal' },
                { id: 'la-consumer-ops', name: '消费级无人机', level: 4, isLeaf: true, nationalCount: 102, localCount: 102, status: 'normal' }
              ]
            },
            {
              id: 'la-evtol-ops', name: '电动垂直起降飞行器（eVTOL）运营及飞行活动', level: 3, isLeaf: false,
              children: [
                { id: 'la-uam', name: '城市空中交通（UAM）', level: 4, isLeaf: true, nationalCount: 16, localCount: 16, status: 'advantage' },
                { id: 'la-evtol-cargo', name: '电动垂直起降飞行器（eVTOL）载货', level: 4, isLeaf: true, nationalCount: 25, localCount: 0, status: 'missing' }
              ]
            }
          ]
        },
        {
          id: 'la-service', name: '低空综合服务', level: 2, isLeaf: false,
          children: [
            {
              id: 'la-training', name: '飞行员培训', level: 3, isLeaf: false,
              children: [
                { id: 'la-uav-pilot', name: '无人机飞手培训', level: 4, isLeaf: true, nationalCount: 161, localCount: 161, status: 'normal' },
                { id: 'la-ga-pilot', name: '通航飞行员培训', level: 4, isLeaf: true, nationalCount: 16, localCount: 16, status: 'normal' },
                { id: 'la-evtol-pilot', name: 'eVTOL驾驶员培训', level: 4, isLeaf: true, nationalCount: 30, localCount: 0, status: 'missing' }
              ]
            },
            { id: 'la-finance', name: '通用航空金融与保险', level: 3, isLeaf: true, nationalCount: 2, localCount: 2, status: 'normal' }
          ]
        }
      ]
    }]
  },

  'chain-007': {
    chainId: 'chain-007',
    tree: [{
      id: 'is-root', name: '信息服务', level: 1, isLeaf: false,
      children: [
        { id: 'is-upstream', name: '上游基础设施', level: 2, isLeaf: false, children: [
          { id: 'is-cloud', name: '云计算基础设施', level: 3, isLeaf: true, nationalCount: 300, localCount: 30, status: 'advantage' },
          { id: 'is-dc', name: '数据中心与网络', level: 3, isLeaf: true, nationalCount: 180, localCount: 18, status: 'normal' }
        ]},
        { id: 'is-midstream', name: '中游平台与技术', level: 2, isLeaf: false, children: [
          { id: 'is-bigdata', name: '大数据服务', level: 3, isLeaf: true, nationalCount: 260, localCount: 28, status: 'advantage' },
          { id: 'is-ai', name: '人工智能平台', level: 3, isLeaf: true, nationalCount: 150, localCount: 15, status: 'normal' },
          { id: 'is-software', name: '软件开发与集成', level: 3, isLeaf: true, nationalCount: 480, localCount: 45, status: 'advantage' }
        ]},
        { id: 'is-downstream', name: '下游应用场景', level: 2, isLeaf: false, children: [
          { id: 'is-smartcity', name: '智慧城市', level: 3, isLeaf: true, nationalCount: 220, localCount: 22, status: 'advantage' },
          { id: 'is-iiot', name: '工业互联网', level: 3, isLeaf: true, nationalCount: 140, localCount: 14, status: 'normal' },
          { id: 'is-gov', name: '数字政务', level: 3, isLeaf: true, nationalCount: 90, localCount: 9, status: 'normal' }
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
      { nodeId: 'la-takeoff', name: '起降平台建设与运营', nationalCount: 120, localCount: 0, gapType: '严重缺失', affectedDownstream: ['无人机物流', '城市空中交通'], affectedAmount: 6.5, recommended: ['峰飞航空', '亿航智能', '中信海直'], policy: '规划建设低空起降场网络，引入专业化运营企业。' },
      { nodeId: 'la-fss', name: '飞行服务站建设与运营', nationalCount: 80, localCount: 0, gapType: '严重缺失', affectedDownstream: ['通航运营', '低空飞行活动'], affectedAmount: 4.2, recommended: ['中国航信', '中国飞龙', '华夏通航'], policy: '布局低空飞行服务站，提供航行情报与气象服务。' },
      { nodeId: 'la-airframe-ga', name: '通航飞行器机体', nationalCount: 60, localCount: 0, gapType: '严重缺失', affectedDownstream: ['低空通航飞行器制造'], affectedAmount: 3.8, recommended: ['中航通飞', '钻石飞机', '西锐飞机'], policy: '引进通航整机制造及机体结构件企业。' },
      { nodeId: 'la-evtol-maint', name: '电动垂直起降飞行器（eVTOL）检修', nationalCount: 45, localCount: 0, gapType: '轻度缺失', affectedDownstream: ['eVTOL制造', 'eVTOL运营'], affectedAmount: 2.1, recommended: ['亿航智能', '峰飞航空', '小鹏汇天'], policy: '培育eVTOL运维与检测认证能力。' },
      { nodeId: 'la-evtol-pilot', name: 'eVTOL驾驶员培训', nationalCount: 30, localCount: 0, gapType: '轻度缺失', affectedDownstream: ['城市空中交通'], affectedAmount: 1.5, recommended: ['中国民航飞行学院', '亿航智能'], policy: '推动eVTOL驾驶员培训资质认证。' },
      { nodeId: 'la-evtol-cargo', name: '电动垂直起降飞行器（eVTOL）载货', nationalCount: 25, localCount: 0, gapType: '轻度缺失', affectedDownstream: ['低空物流'], affectedAmount: 1.2, recommended: ['顺丰无人机', '美团无人机'], policy: '开放低空物流试点场景。' }
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
      { id: 'la-sc-1', name: '城市空中交通（UAM）', nationalCount: 580, localCount: 48, components: [
        { name: '电动垂直起降飞行器（eVTOL）制造', localCount: 9, nationalCount: 9, status: 'local', impact: '本地eVTOL整机制造可部分覆盖' },
        { name: '起降平台建设与运营', localCount: 0, nationalCount: 120, status: 'missing', impact: '城市起降网络尚未形成' },
        { name: '飞行服务站建设与运营', localCount: 0, nationalCount: 80, status: 'missing', impact: 'UAM运行服务保障能力不足' },
        { name: '城市空中交通（UAM）', localCount: 16, nationalCount: 16, status: 'local', impact: '本地UAM运营企业已有布局' }
      ]},
      { id: 'la-sc-2', name: '低空物流配送', nationalCount: 720, localCount: 120, components: [
        { name: '无人机整机制造', localCount: 876, nationalCount: 876, status: 'local', impact: '本地无人机整机制造能力强' },
        { name: '无人机运营及飞行活动', localCount: 193, nationalCount: 193, status: 'local', impact: '本地无人机运营企业可覆盖' },
        { name: '通信基础设施建设与运营', localCount: 2, nationalCount: 2, status: 'local', impact: '通信链路具备基础保障' },
        { name: '电动垂直起降飞行器（eVTOL）载货', localCount: 0, nationalCount: 25, status: 'missing', impact: '重型低空物流载具缺失' }
      ]},
      { id: 'la-sc-3', name: '低空文旅', nationalCount: 220, localCount: 48, components: [
        { name: '通航运营与飞行活动', localCount: 50, nationalCount: 50, status: 'local', impact: '本地通航运营可支撑文旅航线' },
        { name: '通航飞行员培训', localCount: 16, nationalCount: 16, status: 'local', impact: '本地飞行员培训可保障运营人才' },
        { name: '通用航空金融与保险', localCount: 2, nationalCount: 2, status: 'local', impact: '金融保险服务初步具备' }
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

// 招商库（招商引资模拟推演）数据
const MOCK_INVESTMENT_POOL = {
  chainId: 'chain-robot',
  chainName: '人工智能与具身智能机器人',
  baseline: {
    completeness: 42.8,           // 产业链完备度
    leaderOutput: 1286.5,         // 龙头/链主合计产值（亿元）
    localSupportingRate: 32.6     // 产业链本地配套率
  },
  // 默认选中前 10 家企业（与原型“已勾选 10 家”对齐）
  defaultSelectedIds: [
    'inv-001', 'inv-002', 'inv-003', 'inv-004', 'inv-005',
    'inv-006', 'inv-007', 'inv-008', 'inv-009', 'inv-010'
  ],
  enterprises: [
    {
      id: 'inv-001',
      name: '大疆创新科技股份有限公司',
      relationSystem: '华为技术有限公司 / AI驱动控制系统',
      province: '广东省',
      provinceCode: 'gd',
      productCategory: '电解液',
      estimatedOutput: 38.5,
      completenessImprovement: 6.2,
      localRateImprovement: 5.2
    },
    {
      id: 'inv-002',
      name: '杉杉锂电材料科技有限公司',
      relationSystem: '华为技术有限公司 / AI驱动控制系统',
      province: '浙江省',
      provinceCode: 'zj',
      productCategory: '正极材料',
      estimatedOutput: 46.8,
      completenessImprovement: 7.8,
      localRateImprovement: 6.8
    },
    {
      id: 'inv-003',
      name: '上海恩捷新能源科技有限公司',
      relationSystem: '大疆创新科技有限公司 / 飞控云台系统',
      province: '上海市',
      provinceCode: 'sh',
      productCategory: '隔膜',
      estimatedOutput: 31.2,
      completenessImprovement: 5.0,
      localRateImprovement: 4.1
    },
    {
      id: 'inv-004',
      name: '璞泰来新能源技术有限公司',
      relationSystem: '华为技术有限公司 / AI驱动控制系统',
      province: '上海市',
      provinceCode: 'sh',
      productCategory: '负极材料',
      estimatedOutput: 35.0,
      completenessImprovement: 5.6,
      localRateImprovement: 4.9
    },
    {
      id: 'inv-005',
      name: '当升科技材料有限公司',
      relationSystem: '迈瑞生物医疗电子 / 手术机器人系统',
      province: '北京市',
      provinceCode: 'bj',
      productCategory: '正极材料',
      estimatedOutput: 28.9,
      completenessImprovement: 4.3,
      localRateImprovement: 3.5
    },
    {
      id: 'inv-006',
      name: '苏州汇川技术有限公司',
      relationSystem: '本体厂C / 伺服驱动系统',
      province: '江苏省',
      provinceCode: 'js',
      productCategory: '伺服电机',
      estimatedOutput: 25.0,
      completenessImprovement: 3.7,
      localRateImprovement: 3.2
    },
    {
      id: 'inv-007',
      name: '南京埃斯顿自动化股份有限公司',
      relationSystem: '汽车厂A / 工业机器人集成',
      province: '江苏省',
      provinceCode: 'js',
      productCategory: '机器人本体',
      estimatedOutput: 21.5,
      completenessImprovement: 3.1,
      localRateImprovement: 2.7
    },
    {
      id: 'inv-008',
      name: '宁波慈星股份有限公司',
      relationSystem: '机器人集成商B / 针织机械系统',
      province: '浙江省',
      provinceCode: 'zj',
      productCategory: '智能装备',
      estimatedOutput: 15.6,
      completenessImprovement: 2.3,
      localRateImprovement: 2.0
    },
    {
      id: 'inv-009',
      name: '青岛海信电子元件厂',
      relationSystem: '传感器厂G / 视觉传感模组',
      province: '山东省',
      provinceCode: 'sd',
      productCategory: '电子元件',
      estimatedOutput: 12.8,
      completenessImprovement: 1.9,
      localRateImprovement: 1.7
    },
    {
      id: 'inv-010',
      name: '无锡碳纤维复合材料有限公司',
      relationSystem: '本体厂C / 机械臂结构件',
      province: '江苏省',
      provinceCode: 'js',
      productCategory: '复合材料',
      estimatedOutput: 14.2,
      completenessImprovement: 2.0,
      localRateImprovement: 3.9
    },
    {
      id: 'inv-011',
      name: '深圳奥比中光科技有限公司',
      relationSystem: '集成商B / 3D视觉系统',
      province: '广东省',
      provinceCode: 'gd',
      productCategory: '视觉传感器',
      estimatedOutput: 8.5,
      completenessImprovement: 1.2,
      localRateImprovement: 0.9
    },
    {
      id: 'inv-012',
      name: '杭州海康机器人技术有限公司',
      relationSystem: '汽车厂A / 移动机器人系统',
      province: '浙江省',
      provinceCode: 'zj',
      productCategory: '移动机器人',
      estimatedOutput: 7.3,
      completenessImprovement: 1.0,
      localRateImprovement: 0.8
    }
  ],
  prediction: {
    // 估算参数：每亿元新增产值约带动 0.0768 亿元税收、约 33.21 个岗位
    taxPerOutput: 0.0768,
    jobsPerOutput: 33.21
  }
};
