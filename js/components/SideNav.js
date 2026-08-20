class SideNav extends HTMLElement {
  connectedCallback() {
    this.render();
    // 对依赖外部字体/图标库的菜单项，在相关资源就绪后强制重绘，
    // 确保图标在导航初始加载阶段即可正确显示，无需用户交互。
    this.ensureIconsVisible();
  }

  render() {
    // 从全局window获取菜单配置
    const menuList = window.menuList;
    // 子页面到父菜单的激活映射
    const activePageMap = window.menuActivePageMap || {
      'investment-pool.html': 'chain-gap.html'
    };
    const rawPage = window.location.pathname.split("/").pop();
    const currentPage = activePageMap[rawPage] || rawPage;

    let menuHtml = "";
    menuList.forEach(item => {
      const hasChildren = Array.isArray(item.children) && item.children.length > 0;

      if (hasChildren) {
        const isGroupActive = item.children.some(child => child.pagePath === currentPage);
        const expandedClass = isGroupActive ? "expanded" : "";
        const groupTitleActive = isGroupActive ? "active" : "";

        const subItemsHtml = item.children.map(child => {
          const isChildActive = currentPage === child.pagePath ? "active" : "";
          return `
            <div class="sidebar-item sidebar-subitem ${isChildActive}" onclick="location.href='${child.pagePath}'">
              <span class="sidebar-icon">${child.icon || ""}</span>
              <span>${child.name}</span>
            </div>
          `;
        }).join("");

        menuHtml += `
          <div class="sidebar-group ${expandedClass}">
            <div class="sidebar-item sidebar-group-title ${groupTitleActive}" onclick="this.parentElement.classList.toggle('expanded')">
              <span class="sidebar-icon">${item.icon || ""}</span>
              <span>${item.name}</span>
              <span class="sidebar-chevron">▸</span>
            </div>
            <div class="sidebar-submenu">
              ${subItemsHtml}
            </div>
          </div>
        `;
      } else {
        const isActive = currentPage === item.pagePath ? "active" : "";
        menuHtml += `
          <div class="sidebar-item ${isActive}" onclick="location.href='${item.pagePath}'">
            <span class="sidebar-icon">${item.icon || ""}</span>
            <span>${item.name}</span>
          </div>
        `;
      }
    });

    this.innerHTML = `
      <aside class="sidebar">
        <div class="sidebar-title">功能导航</div>
        <nav class="sidebar-menu">
          ${menuHtml}
        </nav>
      </aside>
    `;
  }

  /**
   * 确保侧边栏图标在初始加载阶段即可见。
   *
   * 问题背景：
   * 当菜单 icon 使用 FontAwesome 等外部字体图标库时，<i> 标签的显示依赖
   * 1) FontAwesome CSS 文件加载完成，以及 2) 其 @font-face 字体文件加载完成。
   * SideNav 作为 Custom Element，其 connectedCallback 在 HTML 解析到 <side-nav>
   * 标签时即被调用，此时外部 CSS/字体很可能尚未就绪，导致图标空白。
   * 用户点击导航触发页面跳转/重绘后，资源已缓存，图标才显示。
   *
   * 关键修复点：
   * 1. 必须等待 FontAwesome CSS 加载完成后再等待字体加载；
   * 2. 在 CSS 加载前不能提前触发重绘（否则 triggered 标志会导致真正的
   *    资源就绪后不再重绘）；
   * 3. 使用强力重绘（重新生成菜单 innerHTML）确保浏览器重新应用图标样式。
   */
  ensureIconsVisible() {
    const menu = this.querySelector('.sidebar-menu');
    if (!menu) return;

    const forceReflow = () => {
      // 强力重绘：临时清空并恢复菜单内容，强制浏览器重新解析并应用
      // 此时 CSS 和字体均已就绪，图标会正确渲染。
      const html = menu.innerHTML;
      menu.innerHTML = '';
      void menu.offsetHeight;
      menu.innerHTML = html;

      if (typeof console !== 'undefined' && console.log) {
        console.log('[SideNav] icons reflowed');
      }
    };

    const waitForFontAwesomeFont = (callback) => {
      if (document.fonts && document.fonts.load) {
        document.fonts.load('1em "Font Awesome 6 Free"')
          .then(() => callback())
          .catch(() => this.runFallbackReflow(callback));
      } else {
        this.runFallbackReflow(callback);
      }
    };

    // 核心逻辑：等待 FontAwesome CSS 加载完成 → 等待字体加载完成 → 重绘
    const faLink = document.querySelector('link[href*="font-awesome"]');
    if (faLink && !faLink.sheet) {
      faLink.addEventListener('load', () => {
        waitForFontAwesomeFont(forceReflow);
      }, { once: true });
      faLink.addEventListener('error', () => {
        console.warn('[SideNav] FontAwesome CSS 加载失败');
        this.runFallbackReflow(forceReflow);
      }, { once: true });
    } else {
      // CSS 已存在或页面未引入 FontAwesome，直接等待字体
      waitForFontAwesomeFont(forceReflow);
    }

    // 兜底：页面完全加载后重绘
    this.runFallbackReflow(forceReflow);

    // 最终兜底：最多等待 2 秒，避免弱网无限等待
    setTimeout(forceReflow, 2000);
  }

  /**
   * 回退方案：在页面所有资源加载完成后执行回调。
   */
  runFallbackReflow(callback) {
    if (document.readyState === 'complete') {
      callback();
    } else {
      window.addEventListener('load', callback, { once: true });
    }
  }
}
customElements.define("side-nav", SideNav);
