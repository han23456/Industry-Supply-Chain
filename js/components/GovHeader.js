// 移除import导入
class GovHeader extends HTMLElement {
  connectedCallback() {
    // 读取全局头部配置
    const headerConfig = window.headerConfig;
    const today = new Date();
    const dateStr = `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日`
    this.innerHTML = `
      <header class="gov-header">
        <div class="gov-header-left">
          <div class="gov-logo">🏭</div>
          <div class="gov-title">${headerConfig.systemName}</div>
          <div class="gov-subtitle">${headerConfig.subTitle}</div>
        </div>
        <div class="gov-header-right">
          <span>🗓️ ${dateStr}</span>
          <span>🌤️ ${headerConfig.weather}</span>
          <div class="gov-user">
            <div class="gov-avatar">政</div>
            <span>${headerConfig.userText}</span>
          </div>
        </div>
      </header>
    `
  }
}
customElements.define("gov-header", GovHeader);