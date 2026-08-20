// 挂载到window全局，所有页面脚本都能直接读取
window.menuList = [
  {
    name: "产业全景看板",
    pagePath: "index.html",
    icon: "🖥️"
  },
  {
    name: "招商库",
    pagePath: "investment-pool.html",
    icon: "🏢"
  },
  {
    name: "集团系挖潜",
    pagePath: "indexGroup.html",
    icon: "🤝"
  },
  {
    name: "政策分析",
    icon: "<svg class=\"nav-icon\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\" fill=\"currentColor\" aria-hidden=\"true\"><path d=\"M240.1 4.2c9.8-5.6 21.9-5.6 31.8 0l171.8 98.1L448 104l0 .9 47.9 27.4c12.6 7.2 18.8 22 15.1 36s-16.4 23.8-30.9 23.8H32c-14.5 0-27.2-9.8-30.9-23.8s2.5-28.8 15.1-36L64 104.9V104l4.4-1.6L240.1 4.2zM64 224h64V416h40V224h64V416h48V224h64V416h40V224h64V420.3c.6 .3 1.2 .7 1.8 1.1l48 32c11.7 7.8 17 22.4 12.9 35.9S494.1 512 480 512H32c-14.1 0-26.5-9.2-30.6-22.7s1.1-28.1 12.9-35.9l48-32c.6-.4 1.2-.7 1.8-1.1V224z\"/></svg>",
    type: "group",
    children: [
      {
        name: "政策筛选与匹配",
        pagePath: "policy-stage1.html",
        icon: "<svg class=\"nav-icon\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\" fill=\"currentColor\" aria-hidden=\"true\"><path d=\"M3.9 54.9C10.5 40.9 24.5 32 40 32H472c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9V448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6V320.9L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z\"/></svg>"
      },
      {
        name: "获补履历回测",
        pagePath: "policy-stage2.html",
        icon: "<svg class=\"nav-icon\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\" fill=\"currentColor\" aria-hidden=\"true\"><path d=\"M75 75L41 41C25.9 25.9 0 36.6 0 57.9V168c0 13.3 10.7 24 24 24H134.1c21.4 0 32.1-25.9 17-41l-30.8-30.8C155 85.5 203 64 256 64c106 0 192 86 192 192s-86 192-192 192c-40.8 0-78.6-12.7-109.7-34.4c-14.5-10.1-34.4-6.6-44.6 7.9s-6.6 34.4 7.9 44.6C151.2 495 201.7 512 256 512c141.4 0 256-114.6 256-256S397.4 0 256 0C185.3 0 121.3 28.7 75 75zm181 53c-13.3 0-24 10.7-24 24V256c0 6.4 2.5 12.5 7 17l72 72c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-65-65V152c0-13.3-10.7-24-24-24z\"/></svg>"
      },
      {
        name: "资金风控监管",
        pagePath: "policy-stage3.html",
        icon: "<svg class=\"nav-icon\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\" fill=\"currentColor\" aria-hidden=\"true\"><path d=\"M256 0c4.6 0 9.2 1 13.4 2.9L457.7 82.8c22 9.3 38.4 31 38.3 57.2c-.5 99.2-41.3 280.7-213.7 363.2c-16.7 8-36.1 8-52.8 0C57.3 420.7 16.5 239.2 16 140c-.1-26.2 16.3-47.9 38.3-57.2L242.7 2.9C246.8 1 251.4 0 256 0zm0 66.8V444.8C394 378 431.1 230.1 432 141.4L256 66.8l0 0z\"/></svg>"
      },
      {
        name: "成效绩效评估",
        pagePath: "policy-stage4.html",
        icon: "<svg class=\"nav-icon\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\" fill=\"currentColor\" aria-hidden=\"true\"><path d=\"M64 64c0-17.7-14.3-32-32-32S0 46.3 0 64V400c0 44.2 35.8 80 80 80H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H80c-8.8 0-16-7.2-16-16V64zm406.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L320 210.7l-57.4-57.4c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L240 221.3l57.4 57.4c12.5 12.5 32.8 12.5 45.3 0l128-128z\"/></svg>"
      }
    ]
  }
];

window.headerConfig = {
  systemName: "产业链/供应链图谱系统",
  subTitle: "产业治理智能中枢",
  userText: "区发改局 管理员",
  weather: "晴 28℃"
};