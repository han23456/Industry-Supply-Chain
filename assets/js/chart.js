/**
 * ============================================================
 * chart.js - ECharts 图表初始化与渲染
 * 包含：上游条形图、下游条形图、协同趋势折线图、产品结构饼图
 * 所有图表配色贴合政务系统视觉规范
 * ============================================================
 */

var ChartRenderer = (function () {

  // 图表实例缓存
  var chartInstances = {};

  // 政务配色方案
  var COLOR_PALETTE = [
    '#165DFF', '#00B42A', '#FF7D00', '#F53F3F',
    '#722ED1', '#0FC6C2', '#EB2F96', '#FAAD14'
  ];

  // ECharts 通用样式配置
  var BASE_TEXT_STYLE = {
    color: '#1D2129',
    fontSize: 12,
    fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif'
  };

  var SECONDARY_TEXT_STYLE = {
    color: '#6B7785',
    fontSize: 12
  };

  /* ===== 初始化单个图表 ===== */
  function initChart(domId) {
    var dom = document.getElementById(domId);
    if (!dom) return null;
    // 销毁已有实例
    if (chartInstances[domId]) {
      chartInstances[domId].dispose();
    }
    var chart = echarts.init(dom, null, { renderer: 'canvas' });
    chartInstances[domId] = chart;
    return chart;
  }

  /* ===== 图表1：上游采购金额省份分布 TOP5（横向条形图） ===== */
  function renderUpstreamChart(data) {
    var chart = initChart('chart-upstream');
    if (!chart) return;

    var provinces = data.map(function (item) { return item.name; });
    var values = data.map(function (item) { return item.value; });

    var option = {
      grid: {
        left: 80,
        right: 50,
        top: 20,
        bottom: 30
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        textStyle: { fontSize: 13 },
        formatter: function (params) {
          var p = params[0];
          return p.name + '<br/>采购金额: <strong>' + p.value + '</strong> 亿元';
        }
      },
      xAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: Object.assign({}, SECONDARY_TEXT_STYLE, { formatter: '{value}' }),
        splitLine: { lineStyle: { color: '#F2F3F5', type: 'dashed' } }
      },
      yAxis: {
        type: 'category',
        data: provinces,
        axisLine: { lineStyle: { color: '#E5E6EB' } },
        axisTick: { show: false },
        axisLabel: Object.assign({}, BASE_TEXT_STYLE, { fontSize: 13 })
      },
      series: [{
        type: 'bar',
        data: values,
        barWidth: 18,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#165DFF' },
            { offset: 1, color: '#4080FF' }
          ]),
          borderRadius: [0, 4, 4, 0]
        },
        label: {
          show: true,
          position: 'right',
          formatter: '{c} 亿元',
          color: '#1D2129',
          fontSize: 12,
          fontWeight: 600
        }
      }]
    };

    chart.setOption(option);
  }

  /* ===== 图表2：对外销售营收省份分布 TOP5（横向条形图） ===== */
  function renderDownstreamChart(data) {
    var chart = initChart('chart-downstream');
    if (!chart) return;

    var provinces = data.map(function (item) { return item.name; });
    var values = data.map(function (item) { return item.value; });

    var option = {
      grid: {
        left: 80,
        right: 50,
        top: 20,
        bottom: 30
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        textStyle: { fontSize: 13 },
        formatter: function (params) {
          var p = params[0];
          return p.name + '<br/>销售营收: <strong>' + p.value + '</strong> 亿元';
        }
      },
      xAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: Object.assign({}, SECONDARY_TEXT_STYLE, { formatter: '{value}' }),
        splitLine: { lineStyle: { color: '#F2F3F5', type: 'dashed' } }
      },
      yAxis: {
        type: 'category',
        data: provinces,
        axisLine: { lineStyle: { color: '#E5E6EB' } },
        axisTick: { show: false },
        axisLabel: Object.assign({}, BASE_TEXT_STYLE, { fontSize: 13 })
      },
      series: [{
        type: 'bar',
        data: values,
        barWidth: 18,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#00B42A' },
            { offset: 1, color: '#23C343' }
          ]),
          borderRadius: [0, 4, 4, 0]
        },
        label: {
          show: true,
          position: 'right',
          formatter: '{c} 亿元',
          color: '#1D2129',
          fontSize: 12,
          fontWeight: 600
        }
      }]
    };

    chart.setOption(option);
  }

  /* ===== 图表3：本地协同粘性多年趋势（折线图） ===== */
  function renderCollaborationChart(data) {
    var chart = initChart('chart-collaboration');
    if (!chart) return;

    var years = data.map(function (item) { return item.year; });
    var values = data.map(function (item) { return item.value; });

    var option = {
      grid: {
        left: 55,
        right: 30,
        top: 30,
        bottom: 35
      },
      tooltip: {
        trigger: 'axis',
        textStyle: { fontSize: 13 },
        formatter: function (params) {
          var p = params[0];
          return p.name + '<br/>协同粘性: <strong>' + p.value + '%</strong>';
        }
      },
      xAxis: {
        type: 'category',
        data: years,
        boundaryGap: false,
        axisLine: { lineStyle: { color: '#E5E6EB' } },
        axisTick: { show: false },
        axisLabel: Object.assign({}, BASE_TEXT_STYLE, { fontSize: 13 })
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: Object.assign({}, SECONDARY_TEXT_STYLE, { formatter: '{value}%' }),
        splitLine: { lineStyle: { color: '#F2F3F5', type: 'dashed' } }
      },
      series: [{
        type: 'line',
        data: values,
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          width: 3,
          color: '#165DFF'
        },
        itemStyle: {
          color: '#165DFF',
          borderColor: '#FFFFFF',
          borderWidth: 2
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(22, 93, 255, 0.15)' },
            { offset: 1, color: 'rgba(22, 93, 255, 0.01)' }
          ])
        },
        label: {
          show: true,
          position: 'top',
          formatter: '{c}%',
          color: '#165DFF',
          fontSize: 13,
          fontWeight: 600
        }
      }]
    };

    chart.setOption(option);
  }

  /* ===== 图表4：各类产品营收占比（饼图） ===== */
  function renderProductChart(data) {
    var chart = initChart('chart-product');
    if (!chart) return;

    var pieData = data.map(function (item) {
      return { name: item.name, value: item.value };
    });

    var option = {
      tooltip: {
        trigger: 'item',
        textStyle: { fontSize: 13 },
        formatter: '{b}: <strong>{c}%</strong> ({d}%)'
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center',
        itemWidth: 10,
        itemHeight: 10,
        textStyle: Object.assign({}, BASE_TEXT_STYLE, { fontSize: 12 }),
        formatter: function (name) {
          var item = data.find(function (d) { return d.name === name; });
          return item ? name + ' ' + item.value + '%' : name;
        }
      },
      series: [{
        type: 'pie',
        radius: ['38%', '62%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderColor: '#FFFFFF',
          borderWidth: 2
        },
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
            formatter: '{b}\n{c}%'
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.2)'
          }
        },
        data: pieData,
        color: COLOR_PALETTE
      }]
    };

    chart.setOption(option);
  }

  /* ===== 渲染所有图表 ===== */
  function renderAll(data) {
    // 等待 DOM 就绪
    if (!document.getElementById('chart-upstream')) {
      setTimeout(function () { renderAll(data); }, 100);
      return;
    }

    renderUpstreamChart(data.upstream.provinceDistribution);
    renderDownstreamChart(data.downstream.provinceDistribution);
    renderCollaborationChart(data.collaboration.trend);
    renderProductChart(data.productStructure.products);
  }

  /* ===== 窗口 resize 时重绘 ===== */
  function handleResize() {
    for (var key in chartInstances) {
      if (chartInstances[key]) {
        chartInstances[key].resize();
      }
    }
  }

  // 监听窗口变化
  window.addEventListener('resize', handleResize);

  /* ===== 公开接口 ===== */
  return {
    renderAll: renderAll,
    renderUpstream: renderUpstreamChart,
    renderDownstream: renderDownstreamChart,
    renderCollaboration: renderCollaborationChart,
    renderProduct: renderProductChart,
    resize: handleResize
  };

})();
