/**
 * 政策分析第一阶段 - 多维政策筛选器
 * 基于参考页面 "政策分析第一阶段V3.0.html" 复刻
 *
 * 模块职责：
 * 1. 管理左侧维度标签/产业链节点/数值条件的选中状态
 * 2. 实时计算并渲染右侧递减漏斗与企业匹配数
 * 3. 维护顶部生效规则 Tag 栏
 * 4. 提供方案保存、导出等交互
 *
 * 后续迭代建议：
 * - 将硬编码的企业表格数据替换为 API 分页请求
 * - 将漏斗计算逻辑对接真实后台碰撞服务
 * - 使用 localStorage 持久化常用方案
 */

(function () {
  'use strict';

  // ============================================================
  // 1. 常量与配置
  // ============================================================

  /** 辖区企业总基数，用于计算匹配率 */
  const TOTAL_ENTERPRISE_BASE = 210482;

  /** 各维度区块的最多可选项数，用于展示 "已选 x/N" */
  const SECTION_MAX_COUNTS = {
    1: 4,
    2: 4,
    3: 4,
    4: 2,
    5: 1,
  };

  /** 默认初始化时选中的标签名称 */
  const DEFAULT_SELECTED_TAG = '低空无人机及航线证明';

  /** 默认初始数值：第 1 个数值输入框（上年产值规模） */
  const DEFAULT_VALUE_PRODUCTION = 500;

  /** 默认初始数值：第 5 个数值输入框（发明专利持有量） */
  const DEFAULT_VALUE_PATENT = 10;

  /** 产业链下拉框空值文案 */
  const CHAIN_SELECT_PLACEHOLDER = '-- 不限产业链 (全域) --';

  /** 产业链节点为空时的提示文案 */
  const CHAIN_NODE_EMPTY_TEXT = '该产业链暂无下设细分环节';

  // ============================================================
  // 2. DOM 元素引用缓存
  // ============================================================

  const dom = {
    activeTagsContainer: document.getElementById('activeTagsContainer'),
    presetSelect: document.getElementById('presetSelect'),
    keywordSearch: document.getElementById('keywordSearch'),
    savePresetModal: document.getElementById('savePresetModal'),
    presetNameInput: document.getElementById('presetNameInput'),
    finalMatchedCount: document.getElementById('finalMatchedCount'),
    funnelPathContainer: document.getElementById('funnelPathContainer'),
    matchRatio: document.getElementById('matchRatio'),
    secCountElements: {
      1: document.getElementById('sec1-count'),
      2: document.getElementById('sec2-count'),
      3: document.getElementById('sec3-count'),
      4: document.getElementById('sec4-count'),
      5: document.getElementById('sec5-count'),
    },
    chainSelect: document.getElementById('chainSelect'),
    chainNodeContainer: document.getElementById('chainNodeContainer'),
  };

  // ============================================================
  // 3. 初始化入口
  // ============================================================

  /**
   * 页面初始化：绑定事件、设置默认值、触发首次计算
   */
  function init() {
    initChainSelector();
    bindGlobalEvents();
    applyInitialState();
    handleInputChange();
  }

  /**
   * 产业链选择器初始化：渲染下拉选项、绑定联动事件、默认显示空提示
   */
  function initChainSelector() {
    renderChainOptions();
    bindChainSelectEvent();
    renderChainNodes('');
  }

  /**
   * 绑定全局键盘与搜索事件
   */
  function bindGlobalEvents() {
    // 全局 Enter 快捷触发重新计算
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        handleInputChange();
      }
    });

    // 关键字搜索框回车触发重新计算
    if (dom.keywordSearch) {
      dom.keywordSearch.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
          handleInputChange();
        }
      });
    }
  }

  /**
   * 应用默认初始状态
   */
  function applyInitialState() {
    // 默认勾选指定标签
    const initialTag = document.querySelector('[data-name="' + DEFAULT_SELECTED_TAG + '"]');
    if (initialTag) {
      setTagSelected(initialTag, true);
    }

    // 给第 1 个和第 5 个数值输入框赋初始推荐值
    const numInputs = document.querySelectorAll('.ps1-num-input');
    if (numInputs[0]) numInputs[0].value = DEFAULT_VALUE_PRODUCTION;
    if (numInputs[4]) numInputs[4].value = DEFAULT_VALUE_PATENT;
  }

  // ============================================================
  // 3.5 产业链选择器（新增模块）
  // ============================================================

  /**
   * 渲染产业链下拉选项
   * 数据来源：MOCK_INDUSTRY_CHAINS（js/data.js 全局变量）
   */
  function renderChainOptions() {
    if (!dom.chainSelect) return;

    const chains = (typeof MOCK_INDUSTRY_CHAINS !== 'undefined') ? MOCK_INDUSTRY_CHAINS : [];
    if (!Array.isArray(chains) || chains.length === 0) {
      console.warn('[ChainSelector] MOCK_INDUSTRY_CHAINS 未定义或为空');
      return;
    }

    // 保留首项占位，追加真实产业链选项
    chains.forEach(function (chain) {
      if (!chain || !chain.id || !chain.name) return;
      const option = document.createElement('option');
      option.value = chain.id;
      option.innerText = chain.name;
      dom.chainSelect.appendChild(option);
    });
  }

  /**
   * 根据 chainId 渲染产业链一级节点按钮
   * @param {string} chainId 产业链 ID，为空时显示空提示
   */
  function renderChainNodes(chainId) {
    if (!dom.chainNodeContainer) return;

    dom.chainNodeContainer.innerHTML = '';

    if (!chainId) {
      renderChainEmptyState();
      return;
    }

    getCategoryTree(chainId).then(function (treeData) {
      const rootNode = treeData && treeData.tree && treeData.tree[0];
      const children = rootNode && rootNode.children;

      if (!Array.isArray(children) || children.length === 0) {
        renderChainEmptyState();
        return;
      }

      children.forEach(function (child) {
        if (!child || !child.name) return;
        const btn = document.createElement('button');
        btn.className = 'ps1-chain-node-btn';
        btn.setAttribute('data-selected', 'false');
        btn.setAttribute('data-name', child.name);
        btn.setAttribute('type', 'button');
        btn.innerHTML = '<span>' + escapeHtml(child.name) + '</span>';
        btn.onclick = function () { toggleChainNode(btn); };
        dom.chainNodeContainer.appendChild(btn);
      });
    }).catch(function (err) {
      console.error('[ChainSelector] 加载产业链节点失败:', err);
      renderChainEmptyState();
    });
  }

  /**
   * 获取产业链拓扑树
   * 优先读取同步全局变量 MOCK_CATEGORY_TREES（js/data.js），缺失时 fallback 到 MockAPI.getCategoryTree
   * @param {string} chainId 产业链 ID
   * @returns {Promise<Object>} 拓扑树数据
   */
  function getCategoryTree(chainId) {
    return new Promise(function (resolve) {
      if (typeof MOCK_CATEGORY_TREES !== 'undefined' && MOCK_CATEGORY_TREES[chainId]) {
        resolve(MOCK_CATEGORY_TREES[chainId]);
        return;
      }

      if (typeof MockAPI !== 'undefined' && typeof MockAPI.getCategoryTree === 'function') {
        MockAPI.getCategoryTree(chainId).then(resolve).catch(function () {
          resolve({ tree: [] });
        });
        return;
      }

      resolve({ tree: [] });
    });
  }

  /**
   * 渲染产业链节点空状态提示
   */
  function renderChainEmptyState() {
    if (!dom.chainNodeContainer) return;
    dom.chainNodeContainer.innerHTML =
      '<span class="ps1-text-muted ps1-text-2xs">' + escapeHtml(CHAIN_NODE_EMPTY_TEXT) + '</span>';
  }

  /**
   * 绑定产业链下拉框 change 事件
   */
  function bindChainSelectEvent() {
    if (!dom.chainSelect) return;

    dom.chainSelect.addEventListener('change', function () {
      const selectedChainId = dom.chainSelect.value;
      renderChainNodes(selectedChainId);
      handleInputChange();
    });
  }

  // ============================================================
  // 4. 交互事件处理（供 HTML 内联 onclick 调用）
  // ============================================================

  /**
   * 切换产业链节点按钮的选中状态
   * @param {HTMLElement} btn 被点击的产业链节点按钮
   */
  window.toggleChainNode = function (btn) {
    const isSelected = btn.getAttribute('data-selected') === 'true';
    setChainNodeSelected(btn, !isSelected);
    handleInputChange();
  };

  /**
   * 切换维度标签按钮的选中状态
   * @param {HTMLElement} btn 被点击的标签按钮
   */
  window.toggleTag = function (btn) {
    const isSelected = btn.getAttribute('data-selected') === 'true';
    setTagSelected(btn, !isSelected);
    handleInputChange();
  };

  /**
   * 切换复选框条件卡片的选中状态
   * @param {HTMLElement} card 被点击的卡片容器
   */
  window.toggleCheckboxCard = function (card) {
    const checkbox = card.querySelector('.ps1-card-checkbox');
    // 若直接点击 checkbox，避免重复翻转
    if (event.target !== checkbox) {
      checkbox.checked = !checkbox.checked;
    }
    handleInputChange();
  };

  /**
   * 快捷填充“建议选择值”到对应条件卡片
   * @param {HTMLElement} btn 快捷按钮
   * @param {string} op 运算符，如 gte / gt / lte 等
   * @param {number} val 数值
   */
  window.setQuickVal = function (btn, op, val) {
    const card = btn.closest('.ps1-condition-card');
    if (!card) return;

    const select = card.querySelector('.ps1-op-select');
    const input = card.querySelector('.ps1-num-input');

    if (select) select.value = op;
    if (input) input.value = val;

    handleInputChange();
  };

  /**
   * 核心联动函数：收集所有条件、更新计数、渲染 Tags 与漏斗
   */
  window.handleInputChange = function () {
    const activeConditions = collectActiveConditions();

    renderSectionCounts(activeConditions);
    renderActiveTags(activeConditions);
    updateFunnelAndCount(activeConditions);
  };

  /**
   * 清空所有筛选条件
   */
  window.resetAll = function () {
    // 重置产业链节点与维度标签按钮
    document.querySelectorAll('.ps1-chain-node-btn, .ps1-tag-btn').forEach(function (btn) {
      setButtonSelectedState(btn, false);
    });

    // 重置所有输入控件
    document.querySelectorAll('input').forEach(function (input) {
      if (input.type === 'checkbox') {
        input.checked = false;
      } else if (input.type === 'number') {
        input.value = '';
      }
    });

    // 重置下拉框
    document.querySelectorAll('.ps1-op-select').forEach(function (select) {
      select.selectedIndex = 0;
    });

    // 重置方案下拉
    if (dom.presetSelect) {
      dom.presetSelect.value = '';
    }

    handleInputChange();
  };

  // ============================================================
  // 5. 状态收集与渲染
  // ============================================================

  /**
   * 收集当前所有生效的筛选条件
   * @returns {Array<{text: string, type: string}>} 条件列表
   */
  function collectActiveConditions() {
    const conditions = [];

    // 1. 产业链节点
    document.querySelectorAll('.ps1-chain-node-btn[data-selected="true"]').forEach(function (btn) {
      const name = btn.getAttribute('data-name');
      conditions.push({ text: '环节: ' + name, type: 'chain' });
    });

    // 2. 企业基本属性标签（维度一）
    document.querySelectorAll('#section-1 .ps1-tag-btn[data-selected="true"]').forEach(function (btn) {
      const name = btn.getAttribute('data-name');
      conditions.push({ text: name, type: 'tag' });
    });

    // 3. 数值条件与布尔条件（维度二~五）
    document.querySelectorAll('.ps1-condition-card, .ps1-checkbox-row').forEach(function (card) {
      processConditionCard(card, conditions);
    });

    return conditions;
  }

  /**
   * 处理单个条件卡片，提取数值条件或布尔条件
   * @param {HTMLElement} card 条件卡片或复选行
   * @param {Array} conditions 收集结果数组
   */
  function processConditionCard(card, conditions) {
    const opSelect = card.querySelector('.ps1-op-select');
    const numInput = card.querySelector('.ps1-num-input');
    const numInputMax = card.querySelector('.ps1-num-input-max');
    const betweenInputs = card.querySelectorAll('.ps1-between-input');
    const checkbox = card.querySelector('.ps1-card-checkbox');
    const labelEl = card.querySelector('.ps1-condition-card__label') ||
                    card.querySelector('.ps1-checkbox-row__label span');
    const label = labelEl ? labelEl.innerText : '';

    // 区间输入框显示/隐藏
    if (opSelect) {
      betweenInputs.forEach(function (el) {
        el.classList.toggle('is-visible', opSelect.value === 'between');
      });
    }

    // 数值条件激活判定
    if (numInput && numInput.value !== '') {
      card.classList.add('is-active');

      const opSymbol = opSelect ? opSelect.options[opSelect.selectedIndex].text.split(' ')[0] : '=';
      if (opSelect && opSelect.value === 'between') {
        conditions.push({ text: label + ' ' + numInput.value + ' ~ ' + (numInputMax ? numInputMax.value : '∞'), type: 'num' });
      } else {
        conditions.push({ text: label + ' ' + opSymbol + ' ' + numInput.value, type: 'num' });
      }
    } else if (!checkbox) {
      card.classList.remove('is-active');
    }

    // 布尔条件激活判定
    if (checkbox) {
      if (checkbox.checked) {
        card.classList.add('is-active');
        conditions.push({ text: label, type: 'bool' });
      } else {
        card.classList.remove('is-active');
      }
    }
  }

  /**
   * 渲染各维度区块的已选计数
   * @param {Array} conditions 生效条件列表（仅用于计数逻辑补充，实际从 DOM 统计）
   */
  function renderSectionCounts(conditions) {
    // 维度一：标签计数
    const sec1Count = document.querySelectorAll('#section-1 .ps1-tag-btn[data-selected="true"]').length;
    setSecCount(1, sec1Count);

    // 维度二~五：按卡片统计
    const secCounts = { 2: 0, 3: 0, 4: 0, 5: 0 };

    document.querySelectorAll('.ps1-condition-card, .ps1-checkbox-row').forEach(function (card) {
      const secNum = getSectionNumber(card);
      if (!secNum || !secCounts.hasOwnProperty(secNum)) return;

      const numInput = card.querySelector('.ps1-num-input');
      const checkbox = card.querySelector('.ps1-card-checkbox');
      const hasValue = numInput && numInput.value !== '';
      const isChecked = checkbox && checkbox.checked;

      if (hasValue || isChecked) {
        secCounts[secNum]++;
      }
    });

    Object.keys(secCounts).forEach(function (secNum) {
      setSecCount(secNum, secCounts[secNum]);
    });
  }

  /**
   * 设置指定维度区块的计数文本
   * @param {number|string} secNum 区块编号
   * @param {number} count 已选数量
   */
  function setSecCount(secNum, count) {
    const el = dom.secCountElements[secNum];
    if (el) {
      el.innerText = '已选 ' + count + '/' + SECTION_MAX_COUNTS[secNum];
    }
  }

  /**
   * 根据 DOM 层级获取条件卡片所属维度编号
   * @param {HTMLElement} card 条件卡片
   * @returns {number|null} 维度编号
   */
  function getSectionNumber(card) {
    if (card.closest('#section-2')) return 2;
    if (card.closest('#section-3')) return 3;
    if (card.closest('#section-4')) return 4;
    if (card.closest('#section-5')) return 5;
    return null;
  }

  /**
   * 渲染顶部生效规则 Tag 栏
   * @param {Array} conditions 生效条件列表
   */
  function renderActiveTags(conditions) {
    if (!dom.activeTagsContainer) return;

    dom.activeTagsContainer.innerHTML = '';

    if (conditions.length === 0) {
      dom.activeTagsContainer.innerHTML = '<span class="ps1-italic ps1-text-muted">暂无勾选的硬性门槛条件</span>';
      return;
    }

    conditions.forEach(function (cond) {
      const tagEl = document.createElement('span');
      tagEl.className = 'ps1-active-tag';
      tagEl.innerHTML =
        '<span>' + escapeHtml(cond.text) + '</span>' +
        '<i class="fa-solid fa-xmark ps1-icon-remove" onclick="resetAll()" title="清空规则"></i>';
      dom.activeTagsContainer.appendChild(tagEl);
    });
  }

  // ============================================================
  // 6. 漏斗与企业匹配计算
  // ============================================================

  /**
   * 根据生效条件渲染递减漏斗路径与最终匹配数
   * @param {Array} conditions 生效条件列表
   */
  window.updateFunnelAndCount = function (conditions) {
    if (!dom.funnelPathContainer || !dom.finalMatchedCount || !dom.matchRatio) return;

    let current = TOTAL_ENTERPRISE_BASE;
    let html = renderFunnelNode('全量', TOTAL_ENTERPRISE_BASE, false);

    conditions.forEach(function (cond, idx) {
      // 模拟递减碰撞：每增加一个条件，按系数衰减
      current = Math.max(12, Math.round(current * (0.45 - idx * 0.05)));
      html += renderFunnelArrow();
      html += renderFunnelNode(cond.text, current, false);
    });

    if (conditions.length === 0) {
      current = TOTAL_ENTERPRISE_BASE;
    } else {
      html += renderFunnelArrow();
      html += renderFunnelNode('最终匹配', current, true);
    }

    dom.funnelPathContainer.innerHTML = html;
    dom.finalMatchedCount.innerText = current;
    dom.matchRatio.innerText = ((current / TOTAL_ENTERPRISE_BASE) * 100).toFixed(2) + '%';
  };

  /**
   * 渲染单个漏斗节点
   * @param {string} label 节点标签
   * @param {number} value 节点数值
   * @param {boolean} isFinal 是否为最终节点
   * @returns {string} HTML 字符串
   */
  function renderFunnelNode(label, value, isFinal) {
    const cls = isFinal ? 'ps1-funnel-node ps1-funnel-node--final' : 'ps1-funnel-node';
    const valueText = isFinal ? value + '家' : value.toLocaleString() + '家';
    return '<span class="' + cls + '">' + escapeHtml(label) + ': <strong>' + valueText + '</strong></span>';
  }

  /**
   * 渲染漏斗箭头
   * @returns {string} HTML 字符串
   */
  function renderFunnelArrow() {
    return '<i class="fa-solid fa-arrow-right ps1-funnel-arrow"></i>';
  }

  // ============================================================
  // 7. 方案保存 Modal
  // ============================================================

  /**
   * 打开保存方案弹窗
   */
  window.openSaveModal = function () {
    if (dom.savePresetModal) {
      dom.savePresetModal.classList.remove('is-hidden');
    }
  };

  /**
   * 关闭保存方案弹窗
   */
  window.closeSaveModal = function () {
    if (dom.savePresetModal) {
      dom.savePresetModal.classList.add('is-hidden');
    }
  };

  /**
   * 确认保存方案：将方案追加到常用方案下拉并关闭弹窗
   */
  window.confirmSavePreset = function () {
    const name = dom.presetNameInput ? (dom.presetNameInput.value || '未命名筛选方案') : '未命名筛选方案';
    const select = dom.presetSelect;

    if (select) {
      const newOption = document.createElement('option');
      newOption.value = 'custom_' + Date.now();
      newOption.innerText = name + ' (已保存)';
      select.appendChild(newOption);
      select.value = newOption.value;
    }

    closeSaveModal();
    alert('快捷方案 “' + name + '” 已成功沉淀保存！');
  };

  // ============================================================
  // 8. 导出功能
  // ============================================================

  /**
   * 导出受惠企业名单（模拟）
   */
  window.exportData = function () {
    alert('已触发数据导出，即将下载 53 家受惠企业 Excel 数据报表。');
  };

  /**
   * 导出政策规则 Model（模拟）
   */
  window.exportRuleModel = function () {
    alert('正在将当前构筑的组合门槛规则解析导出为 JSON/SQL 规则 Model。');
  };

  // ============================================================
  // 9. 工具函数
  // ============================================================

  /**
   * 设置产业链节点按钮的选中样式
   * @param {HTMLElement} btn 按钮元素
   * @param {boolean} selected 是否选中
   */
  function setChainNodeSelected(btn, selected) {
    btn.setAttribute('data-selected', selected ? 'true' : 'false');
    btn.classList.toggle('is-selected', selected);
  }

  /**
   * 设置维度标签按钮的选中样式
   * @param {HTMLElement} btn 按钮元素
   * @param {boolean} selected 是否选中
   */
  function setTagSelected(btn, selected) {
    btn.setAttribute('data-selected', selected ? 'true' : 'false');
    btn.classList.toggle('is-selected', selected);

    const icon = btn.querySelector('.ps1-icon-check');
    if (icon) {
      if (selected) {
        icon.classList.remove('fa-regular', 'fa-square');
        icon.classList.add('fa-solid', 'fa-square-check');
      } else {
        icon.classList.remove('fa-solid', 'fa-square-check');
        icon.classList.add('fa-regular', 'fa-square');
      }
    }
  }

  /**
   * 通用按钮选中状态重置（用于清空）
   * @param {HTMLElement} btn 按钮元素
   * @param {boolean} selected 是否选中
   */
  function setButtonSelectedState(btn, selected) {
    const isTag = btn.classList.contains('ps1-tag-btn');
    if (isTag) {
      setTagSelected(btn, selected);
    } else {
      setChainNodeSelected(btn, selected);
    }
  }

  /**
   * 简单的 HTML 转义，防止 XSS
   * @param {string} text 原始文本
   * @returns {string} 转义后文本
   */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
  }

  // ============================================================
  // 10. 启动
  // ============================================================

  // DOM 就绪后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
