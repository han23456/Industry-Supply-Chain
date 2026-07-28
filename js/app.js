/* ===================== 颜色配置（单一来源） ===================== */
const C = {
  bgMain:       '#FFFFFF',
  primary:      '#2563EB',
  primaryDark:  '#1D4ED8',
  primaryLight: '#EEF4FF',
  cyan:         '#2563EB',
  cyanAlt:      '#3B82F6',
  blue:         '#60A5FA',
  blueMid:      '#2563EB',
  blueDeep:     '#1D4ED8',
  cyanDark:     '#1E40AF',
  sky:          '#93C5FD',
  indigo:       '#4F46E5',
  cyanLight:    '#BFDBFE',
  gold:         '#F59E0B',
  textMain:     '#1E293B',
  textSubtitle: '#64748B',
  textLabel:    '#64748B',
  textMuted:    '#94A3B8',
  textTooltip:  '#1E293B',
  border:       '#E2E8F0',
  borderStrong: '#CBD5E1',
  glow:         'rgba(37, 99, 235, 0.25)',
  glowDim:      'rgba(37, 99, 235, 0.2)',
  tooltipBg:    '#FFFFFF',
  tooltipBorder:'#E2E8F0'
};
const PALETTE = [C.primary, C.cyanAlt, C.blue, C.indigo, C.gold, C.sky, C.blueDeep, C.cyanDark, C.cyanLight, '#10B981'];

const CHART_THEME = {
  textStyle: { fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Microsoft YaHei, sans-serif' },
  title: { textStyle: { color: C.textMain } },
  legend: { textStyle: { color: C.textLabel } },
  tooltip: {
    backgroundColor: C.tooltipBg,
    borderColor: C.tooltipBorder,
    textStyle: { color: C.textTooltip },
    extraCssText: 'border-radius: 6px; padding: 12px; box-shadow: 0 8px 16px rgba(0,0,0,0.08);'
  }
};

/* ===================== 模块名称映射 ===================== */
const MODULE_SHORT_NAMES = {
  '全国产值统筹归集': '全国产值统筹',
  '在地企业产贸一体化': '产贸一体化',
  '在地未纳统企业筛查': '在地未纳统',
  '未在前海投资的500强': '500强未投资'
};

function shortName(name) {
  return MODULE_SHORT_NAMES[name] || name;
}



const MODULE_CARDS = [
  {
    key: 'weinadong',
    name: '在地未纳统企业筛查',
    metric: 504,
    metricSuffix: '家',
    unit: '涉及186个集团',
    desc: '已在前海的集团成员企业，但尚未纳入统计，纳入可提升统计产值'
  },
  {
    key: 'chanmao',
    name: '在地企业产贸一体化',
    metric: 822,
    metricSuffix: '家',
    unit: '涉及54个集团',
    desc: '尚未在前海设立商贸公司的四上制造业企业，推动设立可留存产值'
  },
  {
    key: 'gongchan',
    name: '全国产值统筹归集',
    metric: 94,
    metricSuffix: '家',
    unit: '涉及47个集团',
    desc: '四上制造业企业所属集团旗下的异地制造业企业，可争取统筹至前海扩大产业规模'
  },
  {
    key: 'top500',
    name: '未在前海投资双500强',
    metric: 367,
    metricSuffix: '家',
    unit: '&nbsp;',
    desc: '尚未在前海投资的中国500强、中国民营500强企业，可招商引资'
  }
];

/* ===================== 工具函数 ===================== */
function fmtNum(n) {
  if (typeof n !== 'number') return n;
  if (n >= 10000) return (n / 10000).toFixed(1) + '万';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return n.toLocaleString();
}

function fmtLarge(n) {
  if (typeof n !== 'number') return n;
  if (n >= 100000000) return (n / 100000000).toFixed(2) + '亿';
  if (n >= 10000) return (n / 10000).toFixed(0) + '万';
  return n.toLocaleString();
}

function fmtInt(n) {
  if (typeof n !== 'number') return n;
  return Math.round(n).toLocaleString('zh-CN');
}

function countByField(sheets, sheetNames, field, defaultLabel) {
  const result = {};
  sheetNames.forEach(s => {
    (sheets[s] || []).forEach(row => {
      const key = row[field] || (defaultLabel || '未知');
      result[key] = (result[key] || 0) + 1;
    });
  });
  return result;
}

function animateValue(el, target, duration, formatter) {
  duration = duration || 800;
  formatter = formatter || (v => v);
  const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    const val = Math.floor(target * ease);
    el.textContent = formatter(val);
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const nocacheUrl = url + (url.includes('?') ? '&' : '?') + '_t=' + Date.now();
    $.getJSON(nocacheUrl).done(resolve).fail((jqxhr, status, err) => {
      reject(new Error(status + ': ' + (err || '加载失败')));
    });
  });
}

/* ===================== KPI 渲染 ===================== */
function renderKpis(containerSelector, statMap) {
  Object.entries(statMap).forEach(([key, item]) => {
    const el = document.querySelector(`${containerSelector} [data-kpi="${key}"]`);
    if (!el) return;

    // 支持纯字符串/数字，或 { value, trend, trendUp } 对象
    const cfg = typeof item === 'object' && item !== null && item.value !== undefined
      ? item
      : { value: item, trend: null, trendUp: null };

    const valueStr = cfg.value === undefined || cfg.value === null ? '-' : String(cfg.value);
    const num = parseFloat(valueStr.replace(/[^0-9.-]/g, ''));

    // 为详情页 KPI 卡片添加顶部指示点
    const card = el.closest('.detail-kpi-item');
    if (card && !card.querySelector('.kpi-dot')) {
      el.insertAdjacentHTML('beforebegin', '<div class="kpi-dot"></div>');
    }

    if (!isNaN(num) && num > 0) {
      animateValue(el, num, 900, v => {
        return valueStr.replace(String(num), v.toLocaleString());
      });
    } else {
      el.textContent = valueStr;
    }

    // 渲染趋势标签
    const existingTrend = el.parentElement.querySelector('.kpi-trend');
    if (existingTrend) existingTrend.remove();
    if (cfg.trend !== null && cfg.trend !== undefined && cfg.trend !== '') {
      const isUp = cfg.trendUp === true;
      const trendClass = isUp ? 'up' : (cfg.trendUp === false ? 'down' : 'flat');
      const icon = isUp ? '▲' : (cfg.trendUp === false ? '▼' : '—');
      el.insertAdjacentHTML('afterend',
        `<div class="kpi-trend ${trendClass}">${icon} ${cfg.trend}</div>`
      );
    }
  });
}

/* ===================== Loading / Error 状态 ===================== */
function showLoading(container) {
  const el = typeof container === 'string' ? document.querySelector(container) : container;
  if (!el) return;
  const existing = el.querySelector('.page-loading');
  if (existing) return;
  el.insertAdjacentHTML('afterbegin',
    '<div class="page-loading"><div class="spinner"></div>数据加载中...</div>'
  );
}

function hideLoading(container) {
  const el = typeof container === 'string' ? document.querySelector(container) : container;
  if (!el) return;
  const loader = el.querySelector('.page-loading');
  if (loader) loader.remove();
}

function showError(container, msg) {
  const el = typeof container === 'string' ? document.querySelector(container) : container;
  if (!el) return;
  hideLoading(el);
  const existing = el.querySelector('.page-error');
  if (existing) existing.remove();
  el.insertAdjacentHTML('afterbegin',
    `<div class="page-error">
      <div class="page-error-icon">⚠</div>
      <div>${msg || '数据加载失败，请稍后重试'}</div>
      <button class="page-error-retry" data-retry-container="${typeof container === 'string' ? container : ''}">重新加载</button>
    </div>`
  );
}

/* ===================== 图表工厂 ===================== */
const chartInstances = {};

function makeChart(domId, option) {
  const dom = document.getElementById(domId);
  if (!dom) return null;
  let chart = echarts.getInstanceByDom(dom);
  if (chart) {
    chart.setOption({ ...CHART_THEME, ...option }, true);
    chartInstances[domId] = chart;
    return chart;
  }
  chart = echarts.init(dom);
  chart.setOption({ ...CHART_THEME, ...option }, true);
  chartInstances[domId] = chart;
  return chart;
}

let _resizeBound = false;
function resizeAllCharts() {
  Object.values(chartInstances).forEach(c => c && !c.isDisposed() && c.resize());
}

const ChartFactory = {
  pie(id, data, opts) {
    opts = opts || {};
    const chartData = Array.isArray(data)
      ? data
      : Object.entries(data).map(([k, v]) => ({ name: k, value: v }));
    return makeChart(id, {
      color: PALETTE,
      animationDuration: 800,
      animationEasing: 'cubicOut',
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      legend: { bottom: 0, textStyle: { color: C.textLabel, fontSize: 11 }, itemWidth: 10, itemHeight: 10, itemGap: 14, ...opts.legend },
      series: [{
        type: 'pie',
        radius: opts.radius || ['42%', '70%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: true,
        padAngle: 1.5,
        itemStyle: { borderRadius: 4, borderColor: C.bgMain, borderWidth: 3 },
        label: { show: true, color: C.textMuted, formatter: '{b}\n{c}', fontSize: 11 },
        emphasis: {
          scale: true,
          scaleSize: 8,
          itemStyle: { shadowBlur: 8, shadowColor: C.glow }
        },
        data: chartData
      }]
    });
  },

  barH(id, data, opts) {
    opts = opts || {};
    const entries = Array.isArray(data) ? data : Object.entries(data);
    return makeChart(id, {
      color: [opts.color || PALETTE[0]],
      animationDuration: 600,
      animationEasing: 'cubicOut',
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: opts.formatter },
      grid: { left: '3%', right: '4%', bottom: '3%', top: '3%', containLabel: true },
      xAxis: {
        type: 'value',
        axisLabel: { color: C.textLabel, formatter: opts.xFormatter },
        splitLine: { lineStyle: { color: C.border } },
        axisLine: { show: false }
      },
      yAxis: {
        type: 'category',
        data: entries.map(e => e[0]).reverse(),
        axisLabel: { color: C.textLabel, fontSize: 11 },
        axisLine: { lineStyle: { color: C.borderStrong } },
        axisTick: { show: false }
      },
      series: [{
        type: 'bar',
        barWidth: 18,
        barCategoryGap: '30%',
        data: entries.map(e => e[1]).reverse(),
        itemStyle: {
          borderRadius: [0, 4, 4, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: C.primaryDark }, { offset: 1, color: opts.color || C.primary }
          ])
        },
        emphasis: { itemStyle: { shadowBlur: 6, shadowColor: C.glowDim } }
      }]
    });
  },

  barV(id, data, opts) {
    opts = opts || {};
    const entries = Array.isArray(data) ? data : Object.entries(data);
    return makeChart(id, {
      color: [opts.color || PALETTE[0]],
      animationDuration: 600,
      animationEasing: 'cubicOut',
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: opts.bottom || '15%', top: '10%', containLabel: true },
      xAxis: {
        type: 'category',
        data: entries.map(e => e.name || e[0]),
        axisLabel: { color: C.textLabel, fontSize: opts.fontSize || 12, interval: 0, rotate: opts.rotate || 0 },
        axisLine: { lineStyle: { color: C.borderStrong } },
        axisTick: { show: false }
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: C.textLabel },
        splitLine: { lineStyle: { color: C.border } },
        axisLine: { show: false }
      },
      series: [{
        type: 'bar',
        barWidth: 28,
        barCategoryGap: '35%',
        data: entries.map(e => e.value !== undefined ? e.value : e[1]),
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: opts.gradient
            ? new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: C.primary }, { offset: 1, color: C.primaryDark }])
            : new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: C.cyanAlt }, { offset: 1, color: C.blueMid }])
        },
        emphasis: { itemStyle: { shadowBlur: 6, shadowColor: C.glowDim } }
      }]
    });
  }
};

/* ===================== DataTable 工厂 ===================== */
const dtInstances = {};

function makeDataTable(tableSelector, data, columns, opts) {
  opts = opts || {};
  const $el = $(tableSelector);
  if ($.fn.DataTable.isDataTable($el)) {
    $el.DataTable().destroy();
    $el.empty();
  }
  if (!data || !data.length) {
    $el.html('<p style="color:' + C.textLabel + ';padding:20px;text-align:center;">暂无数据</p>');
    return null;
  }
  const dt = $el.DataTable({
    data: data,
    columns: columns.map(c => ({ title: c, data: c })),
    pageLength: opts.pageLength || 10,
    language: {
      search: '',
      lengthMenu: '每页 _MENU_ 条',
      info: '共 _TOTAL_ 条',
      infoEmpty: '共 0 条',
      infoFiltered: '(从 _MAX_ 条中筛选)',
      paginate: { first: '首页', previous: '‹', next: '›', last: '末页' },
      emptyTable: '暂无数据',
      zeroRecords: '未找到匹配记录',
      buttons: { excel: '导出Excel' }
    },
    dom: opts.dom || 'frtip',
    buttons: [],
    autoWidth: false,
    scrollX: true,
    scrollY: '380px',
    scrollCollapse: true,
    deferRender: true,
    initComplete: function() {
      const $wrap = $(this).closest('.dataTables_wrapper');
      const $filter = $wrap.find('.dataTables_filter');
      $filter.find('input').attr('placeholder', '搜索企业名称/关键字...').css('background-color', 'transparent');

      // 把搜索框移到 .card-title 同一行
      const $title = $wrap.closest('.table-section, .card').find('.card-title').first();
      if ($title.length) {
        let $actions = $title.find('.title-actions');
        if (!$actions.length) {
          $actions = $('<div class="title-actions"></div>');
          $title.append($actions);
        }
        const sheetIdx = $wrap.closest('[data-sheet-idx]').attr('data-sheet-idx') || '0';
        $filter.attr('data-sheet-idx', sheetIdx);
        $filter.css({ position: 'static', float: 'none', margin: 0 });
        $actions.append($filter);
        // 默认只显示第一个
        const allFilters = $actions.find('.dataTables_filter');
        allFilters.hide();
        allFilters.first().show();
      }
    }
  });
  dtInstances[tableSelector] = dt;
  return dt;
}

/* ===================== 多工作表 Tab 渲染 ===================== */
function renderSheetTabs(tabsSelector, containerSelector, sheets, sheetNames, prefix) {
  const $tabs = $(tabsSelector);
  const $container = $(containerSelector);
  $tabs.empty();
  $container.empty();

  sheetNames.forEach((sheet, idx) => {
    const tableId = `${prefix}-table-${idx}`;
    $tabs.append(`<div class="sheet-tab ${idx === 0 ? 'active' : ''}" data-target="${tableId}">${sheet}</div>`);

    const rows = sheets[sheet];
    if (!rows || rows.length === 0) {
      $container.append(`<div id="${tableId}" class="${prefix}-wrapper" style="display:${idx === 0 ? 'block' : 'none'}"><p style="color:${C.textLabel};padding:20px;text-align:center;">暂无数据</p></div>`);
      return;
    }
    const cols = Object.keys(rows[0]);
    $container.append(`<div id="${tableId}" class="${prefix}-wrapper" data-sheet-idx="${idx}" style="display:${idx === 0 ? 'block' : 'none'}"><table id="${tableId}-inner" class="display" style="width:100%"></table></div>`);

    setTimeout(() => {
      makeDataTable(`#${tableId}-inner`, rows, cols);
    }, 30);
  });

  $tabs.off('click.sheet').on('click.sheet', '.sheet-tab', function() {
    $tabs.find('.sheet-tab').removeClass('active');
    $(this).addClass('active');
    $(containerSelector + ' > div').hide();
    const $target = $('#' + $(this).data('target'));
    $target.show();
    const $table = $target.find('table');
    if ($table.length && $.fn.DataTable.isDataTable($table)) {
      $table.DataTable().columns.adjust().draw(false);
    }
    // 切换对应搜索框
    const tabIdx = $(this).index();
    const $section = $tabs.closest('.page-section');
    const $actions = $section.find('.card-title .title-actions');
    if ($actions.length) {
      $actions.find('.dataTables_filter').each(function() {
        $(this).toggle($(this).attr('data-sheet-idx') == tabIdx);
      });
    }
  });
}

/* ===================== 各页面加载器 ===================== */
const PageLoaders = {
  overview() {
    const page = '#page-overview';
    showLoading(page);
    fetchJSON('data/overview.json').then(data => {
      hideLoading(page);

      const modMap = {};
      data.modules.forEach(m => { modMap[m.key] = m; });

      const TECH_ICONS = {
        weinadong: '<div class="tech-icon"><div class="icon-scan"></div></div>',
        chanmao:   '<div class="tech-icon"><div class="icon-link"></div></div>',
        gongchan:  '<div class="tech-icon"><div class="icon-chart"><span></span><span></span><span></span></div></div>',
        top500:    '<div class="tech-icon"><div class="icon-star"></div></div>'
      };
      const ACCENT_MAP = {
        weinadong: 'accent-primary',
        chanmao:   'accent-success',
        gongchan:  'accent-warning',
        top500:    'accent-purple'
      };

      $('#overview-modules').html(MODULE_CARDS.map(card => {
        const mod = modMap[card.key] || {};
        const metric = card.key === 'gongchan'
          ? (typeof mod.yidi_count === 'number' ? mod.yidi_count : card.metric)
          : (typeof mod.enterprise_count === 'number' ? mod.enterprise_count : card.metric);
        let unit = card.unit;
        if (mod.group_count !== undefined && card.key !== 'top500') {
          unit = `涉及 ${mod.group_count} 个集团`;
        } else if (card.key === 'top500' && mod.total_revenue) {
          unit = `总营收 ${(mod.total_revenue / 10000).toFixed(0)} 亿元`;
        }
        return `<div class="card overview-card ${ACCENT_MAP[card.key] || 'accent-primary'}" data-key="${card.key}">
          <div class="overview-card-head">
            ${TECH_ICONS[card.key] || ''}
            <div class="overview-card-name">${card.name}</div>
          </div>
          <div class="overview-card-metric">${metric}${card.metricSuffix ? `<span class="metric-suffix">${card.metricSuffix}</span>` : ''}</div>
          <div class="overview-card-unit">${unit}</div>
          <div class="overview-card-desc">${card.desc}</div>
          <div class="overview-card-footer">
            <span class="overview-card-enter">进入</span>
            <span class="overview-card-arrow">›</span>
          </div>
        </div>`;
      }).join(''));
    }).catch(err => {
      showError(page, err.message);
    });
  },

  gongchan() {
    const page = '#page-gongchan';
    showLoading(page);
    fetchJSON('data/gongchan.json').then(data => {
      hideLoading(page);

      renderKpis(page, {
        'group-count': data.stats.group_count,
        'ent-count': data.stats.yidi_count,
        'qianhai': data.stats.qianhai_count,
        'revenue': Math.round(data.stats.total_revenue).toLocaleString('zh-CN')
      });

      ChartFactory.barH('chart-gc-province', data.province_chart);
      if (data.capital_chart && Object.keys(data.capital_chart).length) {
        const order = ['1000万以下', '1000-5000万', '5000万-1亿', '1-5亿', '5亿以上'];
        const capData = order.filter(k => data.capital_chart[k] !== undefined).map(k => ({ name: k, value: data.capital_chart[k] }));
        ChartFactory.pie('chart-gc-industry', capData, { radius: ['42%', '70%'] });
      }
      if (data.table && data.table.length) {
        const cols = Object.keys(data.table[0]);
        makeDataTable('#table-gongchan', data.table, cols);
      }
    }).catch(err => {
      showError(page, err.message);
    });
  },

  chanmao() {
    const page = '#page-chanmao';
    showLoading(page);
    fetchJSON('data/chanmao.json').then(data => {
      hideLoading(page);

      renderKpis(page, {
        'total-enterprises': data.stats.total_enterprises,
        'group-count': data.stats.group_count,
        'qianhai-no': data.stats.qianhai_no_commerce,
        'has-commerce': data.stats.has_commerce
      });

      const catData = data.category_chart || data.sheet_names.map(s => ({
        name: s.replace('四上制造业', '').replace('所属集团', '集团').replace('（非集团）', '非集团'),
        value: data.sheets[s].length
      }));
      ChartFactory.barV('chart-cm-category', catData, { rotate: 0, fontSize: 11, bottom: '12%' });

      if (data.capital_chart && Object.keys(data.capital_chart).length) {
        const order = ['1000万以下', '1000-5000万', '5000万-1亿', '1-5亿', '5亿以上'];
        const capData = order.filter(k => data.capital_chart[k] !== undefined).map(k => ({ name: k, value: data.capital_chart[k] }));
        ChartFactory.pie('chart-cm-industry', capData, { radius: ['42%', '70%'] });
      }

      renderSheetTabs('#cm-sheet-tabs', '#cm-tables-container', data.sheets, data.sheet_names, 'cm');
    }).catch(err => {
      showError(page, err.message);
    });
  },

  weinadong() {
    const page = '#page-weinadong';
    showLoading(page);
    fetchJSON('data/weinadong.json').then(data => {
      hideLoading(page);

      renderKpis(page, {
        'total-enterprises': data.stats.total_enterprises,
        'non-nation': data.stats.non_nation_groups,
        'nation-groups': data.stats.nation_groups,
        'non-nation-revenue': fmtInt(data.stats.non_nation_revenue || 0)
      });

      const sheetLabels = {
        '在前海没有纳统企业的集团': '0家纳统集团',
        '在前海有1家纳统企业的集团': '1家纳统集团',
        '在前海有2家纳统企业的集团': '2家纳统集团',
        '在前海有3家纳统企业的集团': '3家纳统集团',
        '在前海有4家以上纳统企业的集团': '4家及以上纳统集团'
      };
      const catData = data.sheet_names.map(s => ({
        name: sheetLabels[s] || s,
        value: data.sheets[s].length
      }));
      ChartFactory.barV('chart-wnd-category', catData, { gradient: true, rotate: 0, fontSize: 11, bottom: '12%' });

      if (data.capital_chart && Object.keys(data.capital_chart).length) {
        const order = ['1000万以下', '1000-5000万', '5000万-1亿', '1-5亿', '5亿以上'];
        const capData = order.filter(k => data.capital_chart[k] !== undefined).map(k => ({ name: k, value: data.capital_chart[k] }));
        ChartFactory.pie('chart-wnd-industry', capData, { radius: ['42%', '70%'] });
      }

      renderSheetTabs('#wnd-sheet-tabs', '#wnd-tables-container', data.sheets, data.sheet_names, 'wnd');
    }).catch(err => {
      showError(page, err.message);
    });
  },

  top500() {
    const page = '#page-top500';
    showLoading(page);
    fetchJSON('data/top500.json').then(data => {
      hideLoading(page);

      renderKpis(page, {
        'total': data.stats.total_count,
        'china-500': data.stats.china_500_count,
        'private-500': data.stats.private_500_count,
        'revenue': Math.round(data.stats.total_revenue).toLocaleString('zh-CN')
      });

      ChartFactory.barH('chart-t5-province', data.province_chart);
      ChartFactory.barH('chart-t5-top10', data.top10_chart, {
        formatter: p => p[0].name + '<br/>营收: ' + fmtLarge(p[0].value) + ' 万元',
        xFormatter: v => fmtLarge(v),
        color: C.cyanAlt
      });

      if (data.table && data.table.length) {
        const cols = Object.keys(data.table[0]);
        makeDataTable('#table-top500', data.table, cols);
      }
    }).catch(err => {
      showError(page, err.message);
    });
  }
};

/* ===================== 页面切换控制器 ===================== */
const loadedPages = new Set();
let currentPage = 'overview';

function switchPage(page) {
  currentPage = page;
  $('.nav-tab').removeClass('active');
  $(`.nav-tab[data-page="${page}"]`).addClass('active');

  const $current = $('.page-section.active');
  const $target = $(`#page-${page}`);

  if ($current.is($target)) return;

  $current.css({ display: 'none' }).removeClass('active');
  $target.css({ display: 'block', opacity: 0, transform: 'translateY(12px)' });

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      $target.css({ opacity: 1, transform: 'translateY(0)' });
      $target.addClass('active');
    });
  });

  if (!loadedPages.has(page) && PageLoaders[page]) {
    loadedPages.add(page);
    PageLoaders[page]();
  }

  setTimeout(resizeAllCharts, 400);
}

/* ===================== 初始化 ===================== */
$(function() {
  $('.nav-tab')
    .attr({ role: 'button', tabindex: '0' })
    .on('click', function() {
      switchPage($(this).data('page'));
    })
    .on('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        switchPage($(this).data('page'));
      }
    });

  $(document)
    .on('click', '.overview-card', function() {
      switchPage($(this).data('key'));
    })
    .on('keydown', '.overview-card', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        switchPage($(this).data('key'));
      }
    });

  $(document).on('click', '.page-error-retry', function() {
    const page = currentPage;
    if (!loadedPages.has(page)) loadedPages.add(page);
    $(`#page-${page} .page-error`).remove();
    if (PageLoaders[page]) PageLoaders[page]();
  });

  // 阻止搜索框 focus 时页面自动滚动
  $(document).on('focus', '.dataTables_filter input', function() {
    const st = $(window).scrollTop();
    requestAnimationFrame(() => {
      if ($(window).scrollTop() !== st) {
        $(window).scrollTop(st);
      }
    });
  });

  loadedPages.add('overview');
  PageLoaders.overview();

  if (!_resizeBound) {
    _resizeBound = true;
    window.addEventListener('resize', resizeAllCharts);
  }
});
