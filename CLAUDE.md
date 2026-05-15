# CLAUDE.md — clip-history 开发规范与决策记录

> 本文件是 AI 助手（Claude）参与本项目开发时的核心参考文档。
> 每次对话开始时请先阅读此文件，了解项目状态和开发规范。

---

## 项目概述

**clip-history** 是一个跨平台（Windows + macOS）剪贴板历史记录管理工具，基于 Tauri 2 构建。
目标是提供轻量、美观、实用的剪贴板管理体验，支持文本和图片两种主要类型。

---

## 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 桌面框架 | Tauri 2 | Rust 后端 + WebView 前端，体积小性能好 |
| 前端框架 | React 18 + TypeScript | 类型安全，组件化开发 |
| 样式方案 | Tailwind CSS + shadcn/ui | 原子化 CSS + 高质量 UI 组件 |
| 构建工具 | Vite | 快速 HMR，Tauri 官方推荐 |
| 后端核心 | Rust | 剪贴板监听、数据库操作、系统交互 |
| 数据库 | SQLite (via rusqlite) | 轻量嵌入式，适合本地工具 |
| 状态管理 | Zustand | 轻量，适合中小型应用 |
| 图标 | Lucide React | shadcn/ui 默认图标库 |

---

## 开发规范

### 代码风格
- TypeScript strict mode，所有代码必须有类型注解
- Rust 代码遵循 `cargo clippy` 规范
- 组件使用函数式组件 + Hooks
- CSS 使用 Tailwind 工具类，避免自定义 CSS（除非必要）
- 文件命名：React 组件用 PascalCase，工具/钩子用 camelCase，Rust 模块用 snake_case

### 目录结构

```
clip-history/
├── CLAUDE.md                 # 本文件 - 开发规范与决策
├── README.md                 # 项目说明
├── CHANGELOG.md              # 版本变更记录
├── package.json              # Node 依赖
├── tsconfig.json             # TypeScript 配置
├── vite.config.ts            # Vite 构建配置
├── tailwind.config.js        # Tailwind 配置
├── index.html                # 入口 HTML
├── docs/                     # 项目文档
│   ├── architecture.md       # 架构设计
│   ├── database-design.md    # 数据库设计
│   └── roadmap.md            # 版本规划
├── src-tauri/                # Tauri/Rust 后端
│   ├── Cargo.toml            # Rust 依赖
│   ├── src/
│   │   ├── main.rs           # 应用入口
│   │   ├── lib.rs            # 库入口（Tauri 2 规范）
│   │   ├── clipboard/        # 剪贴板监听与操作
│   │   │   ├── mod.rs
│   │   │   ├── listener.rs   # 剪贴板变化监听
│   │   │   └── types.rs      # 剪贴板数据类型
│   │   ├── db/               # 数据库层
│   │   │   ├── mod.rs        # 连接池、迁移、CRUD 操作
│   │   │   └── models.rs     # 数据模型
│   │   ├── commands/         # Tauri IPC 命令
│   │   │   ├── mod.rs
│   │   │   ├── history.rs    # 历史记录 CRUD
│   │   │   └── clipboard.rs  # 剪贴板操作命令
│   │   ├── tray.rs           # 系统托盘
│   │   ├── shortcut.rs       # 全局快捷键
│   │   └── config.rs         # 应用配置
│   ├── icons/                # 应用图标资源
│   └── tauri.conf.json       # Tauri 配置
├── src/                      # React 前端
│   ├── main.tsx              # React 入口
│   ├── App.tsx               # 根组件
│   ├── components/           # UI 组件
│   │   ├── ui/               # shadcn/ui 基础组件
│   │   ├── HistoryList.tsx   # 历史记录列表
│   │   ├── HistoryItem.tsx   # 单条记录卡片
│   │   ├── SearchBar.tsx     # 搜索栏 + 设置按钮入口
│   │   ├── ImagePreview.tsx  # 图片预览
│   │   ├── Settings.tsx      # 设置面板
│   │   └── Toast.tsx         # Toast 提示
│   ├── i18n/                 # 国际化
│   │   ├── index.tsx         # I18nProvider + useTranslation hook
│   │   └── locales/          # 翻译文件
│   │       ├── zh.ts         # 中文
│   │       └── en.ts         # 英文
│   ├── hooks/                # 自定义 Hooks
│   ├── stores/               # Zustand 状态管理
│   │   ├── historyStore.ts   # 历史记录状态
│   │   └── settingsStore.ts  # 设置状态
│   ├── lib/                  # 工具函数
│   │   ├── tauri.ts          # Tauri IPC 封装
│   │   └── utils.ts          # 通用工具
│   ├── types/                # TypeScript 类型定义
│   │   └── index.ts          # 共享类型
│   └── styles/               # 全局样式
│       └── globals.css       # Tailwind 入口 + 自定义样式
└── public/                   # 静态资源
```

### Git 规范
- 分支策略：`master` 为主分支，功能开发使用 `feat/xxx` 分支
- Commit 格式：`type: description`
  - `feat: add image clipboard support`
  - `fix: resolve fuzzy search crash`
  - `docs: update installation guide`
  - `refactor: optimize query performance`
- 不在 commit message 中添加 AI 签名

### 构建说明
- 前端构建脚本为 `vite build`（不经过 tsc，避免 @types/react 版本兼容问题）
- CI 仅构建 macOS + Windows，不构建 Linux
- Release 构建 macOS ARM/Intel + Windows 三个目标

### 文档优先原则
- 新功能开发前，先更新 `docs/` 下对应文档
- 重大决策记录在 CLAUDE.md
- 版本完成必须更新 CHANGELOG.md

---

## 架构决策

### AD-001: 选择 Tauri 2 而非 Electron
- **原因**：安装包体积小（~5MB vs ~100MB+）、内存占用低、原生性能好
- **权衡**：WebView 渲染在不同平台有细微差异，但对本项目影响极小

### AD-002: 选择 SQLite 作为本地存储
- **原因**：嵌入式、零配置、查询能力强、适合本地工具场景
- **方案**：通过 Rust 的 rusqlite crate 操作，前端通过 Tauri IPC 通信

### AD-003: 前端使用 Zustand 而非 Redux
- **原因**：API 更简洁，样板代码少，适合本项目中等复杂度的状态管理需求

### AD-004: 图片存储策略
- **方案**：图片以 Blob 形式存入 SQLite，缩略图按需生成并缓存
- **原因**：简化备份和迁移，避免文件系统路径管理

### AD-005: 轻量级 i18n 方案
- **方案**：React Context + useTranslation Hook，翻译文件按语言拆分
- **原因**：项目字符串约 45 个，无需引入 i18next 等重型库
- **存储**：语言偏好存入 SQLite app_config 表，通过 settingsStore 同步

### AD-006: 托盘菜单动态构建
- **方案**：TrayIcon 存入 Tauri managed state，每次剪贴板变化时重建菜单
- **原因**：muda 的 Menu 构建后不可变，只能整体替换

---

## 已发布版本

### v0.1.0 — 首个正式版本（2026-05-15）
- 项目脚手架：Tauri 2 + React 18 + TypeScript + Vite + Tailwind CSS + SQLite
- 剪贴板核心：文本/图片监听、去重、历史列表、事件通信
- 图片支持：读取、压缩缩略图、预览
- 搜索与过滤：模糊搜索、类型过滤、关键词高亮
- 系统集成：托盘、全局快捷键、窗口自动隐藏、开机自启动
- 设置面板：主题切换、历史数量配置、数据清理
- 体验打磨：虚拟滚动、置顶收藏、批量删除、键盘导航、动画反馈
- 托盘历史菜单：最近 10 条，点击复制
- 中英文切换：轻量 i18n，默认中文
- UI 优化：无标题栏，设置按钮移至搜索栏
- 官方网站（Next.js）+ GitHub Actions CI/CD

---

## 待办事项

> 参见 docs/roadmap.md

---

## 开发环境要求

- Node.js >= 18
- Rust >= 1.75
- Tauri CLI 2.x
- macOS: Xcode Command Line Tools
- Windows: Visual Studio Build Tools + WebView2
