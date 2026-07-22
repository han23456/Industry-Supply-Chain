/**
 * ============================================================
 * common.js - 公共工具函数
 * 包含：弹窗管理、Toast 提示、通用 DOM 操作、格式化方法
 * ============================================================
 */

var CommonUtil = (function () {

  /* ===== DOM 查询快捷方法 ===== */
  function $(selector, parent) {
    return (parent || document).querySelector(selector);
  }

  function $$(selector, parent) {
    return Array.prototype.slice.call((parent || document).querySelectorAll(selector));
  }

  /**
   * 创建 DOM 元素
   * @param {string} tag - 标签名
   * @param {object} attrs - 属性对象 { class, id, text, html, style, dataset, ... }
   * @param {Array} children - 子元素数组
   */
  function createElement(tag, attrs, children) {
    var el = document.createElement(tag);
    attrs = attrs || {};
    children = children || [];

    for (var key in attrs) {
      if (!attrs.hasOwnProperty(key)) continue;
      var val = attrs[key];
      if (val == null) continue;

      if (key === 'class') {
        el.className = val;
      } else if (key === 'text') {
        el.textContent = val;
      } else if (key === 'html') {
        el.innerHTML = val;
      } else if (key === 'style' && typeof val === 'object') {
        for (var sk in val) {
          el.style[sk] = val[sk];
        }
      } else if (key === 'dataset' && typeof val === 'object') {
        for (var dk in val) {
          el.dataset[dk] = val[dk];
        }
      } else if (key === 'onclick') {
        el.onclick = val;
      } else if (key.indexOf('on') === 0 && typeof val === 'function') {
        el.addEventListener(key.substring(2).toLowerCase(), val);
      } else {
        el.setAttribute(key, val);
      }
    }

    children.forEach(function (child) {
      if (child == null) return;
      if (typeof child === 'string') {
        el.appendChild(document.createTextNode(child));
      } else {
        el.appendChild(child);
      }
    });

    return el;
  }

  /* ===== Toast 提示 ===== */
  var toastTimer = null;

  function toast(message, type) {
    type = type || 'info';

    // 移除已有 toast
    var existing = $('.toast');
    if (existing) {
      existing.remove();
    }
    if (toastTimer) {
      clearTimeout(toastTimer);
    }

    var toastEl = createElement('div', {
      class: 'toast toast--' + type,
      text: message
    });
    document.body.appendChild(toastEl);

    // 触发动画
    requestAnimationFrame(function () {
      toastEl.classList.add('is-show');
    });

    toastTimer = setTimeout(function () {
      toastEl.classList.remove('is-show');
      setTimeout(function () {
        toastEl.remove();
      }, 300);
    }, 2500);
  }

  /* ===== 弹窗管理 ===== */

  /**
   * 打开弹窗
   * @param {object} config - { title, subtitle, size, bodyHTML, onMount, footerHTML }
   */
  function openModal(config) {
    // 先关闭已有弹窗
    closeModal();

    var overlay = createElement('div', { class: 'modal-overlay' });
    var sizeClass = config.size === 'large' ? ' modal--large' : (config.size === 'small' ? ' modal--small' : '');

    var modal = createElement('div', { class: 'modal' + sizeClass });

    // Header
    var header = createElement('div', { class: 'modal__header' });
    var titleWrap = createElement('div');
    titleWrap.appendChild(createElement('div', { class: 'modal__title', text: config.title }));
    if (config.subtitle) {
      titleWrap.appendChild(createElement('div', { class: 'modal__subtitle', text: config.subtitle }));
    }
    header.appendChild(titleWrap);
    header.appendChild(createElement('button', {
      class: 'modal__close',
      html: '&times;',
      onclick: function () { closeModal(); }
    }));
    modal.appendChild(header);

    // Body
    var body = createElement('div', { class: 'modal__body' });
    if (typeof config.bodyHTML === 'string') {
      body.innerHTML = config.bodyHTML;
    }
    modal.appendChild(body);

    // Footer
    if (config.footerHTML) {
      var footer = createElement('div', { class: 'modal__footer' });
      footer.innerHTML = config.footerHTML;
      modal.appendChild(footer);
    }

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // 点击遮罩关闭
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        closeModal();
      }
    });

    // ESC 关闭
    document.addEventListener('keydown', handleEsc);

    // 触发显示动画
    requestAnimationFrame(function () {
      overlay.classList.add('is-active');
    });

    // 执行挂载回调
    if (typeof config.onMount === 'function') {
      config.onMount(body, footer, overlay);
    }

    return { overlay: overlay, modal: modal, body: body };
  }

  function closeModal() {
    var overlay = $('.modal-overlay');
    if (overlay) {
      overlay.classList.remove('is-active');
      setTimeout(function () {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      }, 300);
    }
    document.removeEventListener('keydown', handleEsc);
  }

  function handleEsc(e) {
    if (e.key === 'Escape' || e.keyCode === 27) {
      closeModal();
    }
  }

  /* ===== 格式化方法 ===== */

  /**
   * 数字千分位格式化
   */
  function formatNumber(num) {
    if (num == null || isNaN(num)) return '--';
    return parseFloat(num).toLocaleString('zh-CN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  }

  /**
   * 格式化金额（万元 -> 亿元）
   */
  function formatWanToYi(wan) {
    if (wan == null) return '--';
    return (wan / 10000).toFixed(2);
  }

  /**
   * 获取附加值等级标签 class
   */
  function getLevelTagClass(level) {
    switch (level) {
      case '高附加值': return 'level-tag--high';
      case '中高附加值': return 'level-tag--mid-high';
      case '中附加值': return 'level-tag--mid';
      case '低附加值': return 'level-tag--low';
      default: return 'level-tag--low';
    }
  }

  /* ===== 公开接口 ===== */
  return {
    $: $,
    $$: $$,
    createElement: createElement,
    toast: toast,
    openModal: openModal,
    closeModal: closeModal,
    formatNumber: formatNumber,
    formatWanToYi: formatWanToYi,
    getLevelTagClass: getLevelTagClass
  };

})();
