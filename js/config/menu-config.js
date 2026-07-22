// 挂载到window全局，所有页面脚本都能直接读取
window.menuList = [
  {
    name: "产业全景看板",
    pagePath: "index.html",
    icon: "🖥️"
  },
  {
    name: "企业关系网络",
    pagePath: "enterprise-network.html",
    icon: "🏢"
  },
  {
    name: "风险预警",
    pagePath: "risk-warning.html",
    icon: "⚠️"
  },
  {
    name: "强链补链",
    pagePath: "chain-gap.html",
    icon: "🔧"
  }
  /** 
  {
    name: "供需对接",
    pagePath: "supply-demand.html",
    icon: "🤝"
  }
   */,
];

window.headerConfig = {
  systemName: "产业链/供应链图谱系统",
  subTitle: "产业治理智能中枢",
  userText: "区发改局 管理员",
  weather: "晴 28℃"
};