class SideNav extends HTMLElement {
  connectedCallback() {
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
      const isActive = currentPage === item.pagePath ? "active" : "";
      menuHtml += `
        <div class="sidebar-item ${isActive}" onclick="location.href='${item.pagePath}'">
          <span class="sidebar-icon">${item.icon}</span>
          <span>${item.name}</span>
        </div>
      `
    })
    this.innerHTML = `
      <aside class="sidebar">
        <div class="sidebar-title">功能导航</div>
        <nav class="sidebar-menu">
          ${menuHtml}
        </nav>
      </aside>
    `
  }
}
customElements.define("side-nav", SideNav);