export const siteConfig = {
  name: "Clip History",
  description:
    "轻量、美观、跨平台的剪贴板历史管理工具。基于 Tauri + Rust，安装包仅 ~5MB。",
  tagline: "你的剪贴板，该有个好记性。",
  url: "https://cliphistory.dev",
  github: "https://github.com/zhengzhuangpro/clip-history",
  why: {
    quote: "大多数复制操作是即用即丢。\nClip History 让每一次复制都有迹可循。",
    description:
      "复制了一段代码，切个窗口就被覆盖了。想找昨天复制的地址，翻遍聊天记录。Clip History 静默记录每一次复制，随时搜索、一键回填。你只管复制，它帮你记住。",
    evidence: {
      cmd: "clip-history status",
      output: "listening · records 1,247 · images 89",
    },
  },
  pillars: [
    {
      number: "01",
      tag: "record",
      title: "复制一次，永远记住。",
      description:
        "每次复制的内容自动入库——文本、图片、代码片段，无一遗漏。无需手动保存，无需担心丢失。后台静默运行，对性能几乎零影响。",
      points: [
        "→ 自动监听剪贴板变化",
        "→ 文本与图片双类型支持",
        "→ 智能去重，不存冗余",
        "→ SQLite 本地持久化",
      ],
    },
    {
      number: "02",
      tag: "recall",
      title: "找回来，只需一秒。",
      description:
        "模糊搜索 + 类型过滤 + 关键词高亮，毫秒级响应。不管是上周的代码片段还是昨天的地址，输入几个字就能找到。",
      points: [
        "→ 模糊匹配，容错搜索",
        "→ 按文本/图片类型筛选",
        "→ 关键词高亮定位",
        "→ 虚拟滚动，千条不卡",
      ],
    },
    {
      number: "03",
      tag: "integrate",
      title: "系统级集成，随手可用。",
      description:
        "全局快捷键一键唤起，系统托盘常驻后台，托盘菜单快速访问最近记录。它就像系统原生功能一样自然。",
      points: [
        "→ 自定义全局快捷键",
        "→ 系统托盘常驻",
        "→ 托盘菜单快速复制",
        "→ 开机自启动",
      ],
    },
  ],
  techStack: [
    { name: "Tauri 2", description: "桌面应用框架" },
    { name: "Rust", description: "后端核心逻辑" },
    { name: "React 18", description: "前端 UI 框架" },
    { name: "SQLite", description: "本地数据存储" },
  ],
  stats: [
    { value: "~5MB", label: "安装包体积" },
    { value: "<30MB", label: "内存占用" },
    { value: "<100ms", label: "搜索响应" },
  ],
  privacy: [
    {
      title: "纯本地存储",
      description: "所有数据保存在本地 SQLite，不依赖云服务",
    },
    {
      title: "无网络请求",
      description: "运行时不发送任何数据，无遥测、无追踪",
    },
    {
      title: "完全离线",
      description: "无需联网即可使用全部功能",
    },
  ],
  downloadLinks: {
    macOSArm:
      "https://github.com/zhengzhuangpro/clip-history/releases/latest/download/Clip.History_aarch64.dmg",
    macOSIntel:
      "https://github.com/zhengzhuangpro/clip-history/releases/latest/download/Clip.History_x64.dmg",
    windows:
      "https://github.com/zhengzhuangpro/clip-history/releases/latest/download/Clip.History_x64-setup.exe",
  },
} as const;
