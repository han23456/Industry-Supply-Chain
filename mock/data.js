/**
 * ============================================================
 * 强链补链深度分析 - 模拟数据层
 * 所有业务数据独立存放，与渲染逻辑完全解耦
 * 修改数据仅需改动本文件，不影响图表/页面逻辑
 * ============================================================
 */

var MockData = {

  /* -------- 产业链基础信息 -------- */
  industryChain: {
    mainName: '人工智能与具身智能机器人产业链',
    subName: '核心零部件',
    disclaimer: '【数据说明】进销项发票为增值采购数据；基于本地营收龙头企业抽样分析；'
  },

  /* -------- 顶部指标卡片（4张） -------- */
  metrics: {
    // TOP5龙头合计年产值（亿元）
    totalOutput: {
      label: 'TOP10龙头合计年产值',
      value: 1286.5,
      unit: '亿元',
      trend: '+12.3%',
      trendType: 'up'
    },
    // 上游整体外地采购依赖度
    externalDependency: {
      label: '上游整体外地采购依赖度',
      value: 67.3,
      unit: '%',
      trend: '-3.2%',
      trendType: 'down'
    },
    // 本地产业协同粘性
    collaborationIndex: {
      label: '本地产业协同粘性',
      value: 42.8,
      unit: '%',
      trend: '+5.6%',
      trendType: 'up'
    },
    // 产业链平均产品毛利率
    avgGrossMargin: {
      label: '产业链平均产品毛利率',
      value: 18.6,
      unit: '%',
      trend: '+1.8%',
      trendType: 'up'
    }
  },

  /* -------- 板块一：上游供应链 -------- */
  upstream: {
    // 上游采购金额省份分布 TOP5
    provinceDistribution: [
      { name: '广东省', value: 186.2 },
      { name: '江苏省', value: 152.8 },
      { name: '浙江省', value: 98.5 },
      { name: '上海市', value: 76.3 },
      { name: '山东省', value: 54.1 }
    ],
    // 外地采购依赖度
    externalDependency: 67.3,
    // 风险提示
    risk: {
      level: 'high',
      text: '上游采购高度集中广东省（占比28.7%），存在供应链断供潜在风险，建议优先招引正极材料、隔膜等关键环节企业落地。'
    },
    // 供应商清单（下钻弹窗数据）
    suppliers: [
      { id: 'sup-catl', name: '宁德时代新能源科技股份有限公司', province: '广东省', category: '动力电池电芯', amount: 58600, selected: false },
      { id: 'sup-byd', name: '比亚迪弗迪电池有限公司', province: '广东省', category: '动力电池电芯', amount: 42300, selected: false },
      { id: 'sup-tinci', name: '天赐高新材料股份有限公司', province: '广东省', category: '电解液', amount: 31200, selected: false },
      { id: 'sup-guotai', name: '江苏国泰超威新材料有限公司', province: '江苏省', category: '电解液', amount: 28500, selected: false },
      { id: 'sup-shanshan', name: '杉杉锂电材料科技有限公司', province: '浙江省', category: '正极材料', amount: 24800, selected: false },
      { id: 'sup-enjie', name: '上海恩捷新能源科技有限公司', province: '上海市', category: '隔膜', amount: 21300, selected: false },
      { id: 'sup-putailai', name: '璞泰来新能源技术有限公司', province: '上海市', category: '负极材料', amount: 18600, selected: false },
      { id: 'sup-guangwei', name: '威海光威复合材料股份有限公司', province: '山东省', category: '结构件', amount: 14200, selected: false },
      { id: 'sup-kedali', name: '科达利新能源精密制造有限公司', province: '广东省', category: '结构件', amount: 12800, selected: false },
      { id: 'sup-dangsheng', name: '当升科技材料有限公司', province: '北京市', category: '正极材料', amount: 10500, selected: false },
      { id: 'sup-capchem', name: '新宙邦电子材料科技有限公司', province: '广东省', category: '电解液', amount: 9200, selected: false },
      { id: 'sup-xydm', name: '星源材质新材料有限公司', province: '广东省', category: '隔膜', amount: 8600, selected: false }
    ],
    // 招商模拟推演 - 可选招商企业
    investmentTargets: [
      { name: '天赐高新材料股份有限公司', province: '广东省', category: '电解液', estOutput: 35.2, estCompleteness: 5.8 },
      { name: '杉杉锂电材料科技有限公司', province: '浙江省', category: '正极材料', estOutput: 42.6, estCompleteness: 7.2 },
      { name: '上海恩捷新能源科技有限公司', province: '上海市', category: '隔膜', estOutput: 28.4, estCompleteness: 4.5 },
      { name: '璞泰来新能源技术有限公司', province: '上海市', category: '负极材料', estOutput: 31.8, estCompleteness: 5.1 },
      { name: '当升科技材料有限公司', province: '北京市', category: '正极材料', estOutput: 26.3, estCompleteness: 3.9 }
    ],
    // 推演前基线
    baseline: {
      completeness: 42.8,
      totalOutput: 1286.5,
      externalDependency: 67.3
    }
  },

  /* -------- 板块二：下游市场 -------- */
  downstream: {
    // 对外销售营收省份分布 TOP5
    provinceDistribution: [
      { name: '广东省', value: 285.6 },
      { name: '江苏省', value: 198.3 },
      { name: '浙江省', value: 156.7 },
      { name: '北京市', value: 112.4 },
      { name: '上海市', value: 89.2 }
    ],
    // 省内/省外营收占比
    intraProvinceRatio: 28.5,
    extraProvinceRatio: 71.5,
    // 市场解读
    interpretation: '产业核心市场辐射珠三角、长三角区域，省外营收占比71.5%，产品外向型特征显著，市场辐射半径覆盖全国主要汽车产业集群。',
    // 下游客户清单（下钻弹窗数据）
    customers: [
      { name: '广汽埃安新能源汽车有限公司', province: '广东省', category: '动力电池总成', amount: 86500 },
      { name: '小鹏汽车科技有限公司', province: '广东省', category: '动力电池总成', amount: 72300 },
      { name: '蔚来汽车科技有限公司', province: '上海市', category: '动力电池总成', amount: 68200 },
      { name: '理想汽车有限公司', province: '北京市', category: '动力电池总成', amount: 59600 },
      { name: '吉利汽车集团有限公司', province: '浙江省', category: '动力电池总成', amount: 54800 },
      { name: '长安新能源科技有限公司', province: '重庆市', category: '动力电池总成', amount: 42100 },
      { name: '奇瑞新能源汽车有限公司', province: '安徽省', category: '动力电池总成', amount: 38500 },
      { name: '上汽通用五菱汽车有限公司', province: '广西壮族自治区', category: '动力电池总成', amount: 31200 },
      { name: '比亚迪汽车工业有限公司', province: '广东省', category: '动力电池模组', amount: 28600 },
      { name: '长城汽车股份有限公司', province: '河北省', category: '动力电池模组', amount: 24300 }
    ]
  },

  /* -------- 板块三：本地产业链协同 -------- */
  collaboration: {
    // 近3年协同粘性趋势
    trend: [
      { year: '2023年', value: 31.2 },
      { year: '2024年', value: 37.5 },
      { year: '2025年', value: 42.8 }
    ],
    // 自动解读文案
    interpretation: '近三年协同粘性持续提升（31.2%→42.8%），本地龙头供需联动增强，正极材料-电芯-模组环节初步形成闭环，产业生态日趋成熟。建议进一步补强隔膜和电解液环节，提升完备度至50%以上。',
    // 龙头内部交易明细（下钻弹窗数据）
    internalTransactions: [
      { buyer: '中创新航科技', supplier: '本地正极材料A企', category: '正极材料', amount: 18600 },
      { buyer: '中创新航科技', supplier: '本地电解液B企', category: '电解液', amount: 12300 },
      { buyer: '本地模组C企', supplier: '中创新航科技', category: '电芯', amount: 24500 },
      { buyer: '本地PACK D企', supplier: '本地模组C企', category: '电池模组', amount: 16800 },
      { buyer: '本地正极材料A企', supplier: '本地前驱体E企', category: '前驱体', amount: 9200 },
      { buyer: '中创新航科技', supplier: '本地隔膜F企', category: '隔膜', amount: 7800 },
      { buyer: '本地模组C企', supplier: '本地结构件G企', category: '结构件', amount: 6500 },
      { buyer: '本地PACK D企', supplier: '中创新航科技', category: '电芯', amount: 11200 }
    ]
  },

  /* -------- 板块四：产业链产品结构 -------- */
  productStructure: {
    // 各类产品营收占比
    products: [
      { name: '动力电池电芯', value: 42.5, margin: 21.3, level: '高附加值' },
      { name: '正极材料', value: 18.8, margin: 16.5, level: '中高附加值' },
      { name: '电解液', value: 12.3, margin: 15.2, level: '中附加值' },
      { name: '隔膜', value: 9.6, margin: 19.8, level: '高附加值' },
      { name: '负极材料', value: 8.2, margin: 14.6, level: '中附加值' },
      { name: '结构件', value: 5.1, margin: 9.3, level: '低附加值' },
      { name: '其他', value: 3.5, margin: 7.8, level: '低附加值' }
    ],
    // 核心高附加值赛道
    topTrack: '动力电池电芯',
    // 产品完整明细（下钻弹窗数据 = products本身，弹窗展示完整表格）
    detail: null  // 直接引用 products
  },

  /* -------- 龙头样本筛选配置 -------- */
  sampleConfig: {
    levels: ['TOP3', 'TOP5', 'TOP10'],
    defaultLevel: 'TOP5',
    // 不同筛选级别下的指标数据（模拟切换效果）
    levelData: {
      TOP3: {
        totalOutput: { value: 986.2, trend: '+10.8%' },
        externalDependency: { value: 71.5, trend: '-2.1%' },
        collaborationIndex: { value: 38.2, trend: '+4.3%' },
        avgGrossMargin: { value: 20.1, trend: '+2.2%' }
      },
      TOP5: {
        totalOutput: { value: 1286.5, trend: '+12.3%' },
        externalDependency: { value: 67.3, trend: '-3.2%' },
        collaborationIndex: { value: 42.8, trend: '+5.6%' },
        avgGrossMargin: { value: 18.6, trend: '+1.8%' }
      },
      TOP10: {
        totalOutput: { value: 1856.8, trend: '+14.6%' },
        externalDependency: { value: 62.1, trend: '-4.5%' },
        collaborationIndex: { value: 48.5, trend: '+7.2%' },
        avgGrossMargin: { value: 16.2, trend: '+0.9%' }
      }
    }
  }

};
