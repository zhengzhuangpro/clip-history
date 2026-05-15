export const siteConfig = {
  name: "Clip History",
  description: "轻量、美观、跨平台的剪贴板历史管理工具",
  tagline: "你的每一次复制，都值得被记住",
  url: "https://cliphistory.dev",
  github: "https://github.com/zhengzhuangpro/clip-history",
  features: [
    {
      icon: "clipboard-list",
      title: "自动记录",
      description: "后台静默监听剪贴板变化，自动保存每一次复制操作",
    },
    {
      icon: "file-text",
      title: "文本 + 图片",
      description: "完整支持纯文本和图片两种剪贴板内容类型",
    },
    {
      icon: "search",
      title: "即时搜索",
      description: "输入关键词实时过滤，毫秒级找到目标内容",
    },
    {
      icon: "eye",
      title: "内容预览",
      description: "图片缩略图预览、文本全文预览，一目了然",
    },
    {
      icon: "copy",
      title: "一键复制",
      description: "点击即可将历史内容重新写入剪贴板",
    },
    {
      icon: "keyboard",
      title: "全局快捷键",
      description: "任何应用中按下快捷键即可唤起历史窗口",
    },
    {
      icon: "tray",
      title: "系统托盘",
      description: "最小化到托盘常驻后台，不占任务栏空间",
    },
    {
      icon: "feather",
      title: "轻量高效",
      description: "基于 Tauri + Rust，安装包仅 ~5MB，内存占用极低",
    },
  ],
  techStack: [
    { name: "Tauri 2", description: "桌面应用框架" },
    { name: "Rust", description: "后端核心逻辑" },
    { name: "React", description: "前端 UI 框架" },
    { name: "SQLite", description: "本地数据存储" },
  ],
  downloadLinks: {
    macOSArm: "https://github.com/zhengzhuangpro/clip-history/releases/latest/download/Clip.History_aarch64.dmg",
    macOSIntel: "https://github.com/zhengzhuangpro/clip-history/releases/latest/download/Clip.History_x64.dmg",
    windows: "https://github.com/zhengzhuangpro/clip-history/releases/latest/download/Clip.History_x64-setup.exe",
  },
} as const;
