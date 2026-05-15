# Changelog

本项目遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/) 格式，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/) 规范。

## [0.5.0] - 2026-05-15

### 新增
- 系统托盘图标与右键菜单（显示/退出）
- 全局快捷键 Alt+Shift+V 切换窗口显隐
- 窗口失焦自动隐藏
- 关闭按钮拦截为隐藏（最小化到托盘）
- 开机自启动（tauri-plugin-autostart）
- macOS 原生菜单栏（应用菜单 + 编辑菜单）
- IPC 命令：get_config、set_config 读写应用配置
- 托盘图标左键点击切换窗口

## [0.4.0] - 2026-05-15

### 新增
- 搜索栏 UI（搜索输入框 + 类型过滤按钮）
- 文本内容模糊搜索（200ms 防抖）
- 按类型过滤（全部/文本/图片）
- 搜索关键词高亮显示

## [0.3.0] - 2026-05-15

### 新增
- 图片剪贴板内容读取
- 图片压缩与缩略图生成（PNG 格式存储）
- 前端图片缩略图展示
- 图片预览弹窗（查看原图）

## [0.2.0] - 2026-05-15

### 新增
- Rust 剪贴板监听器（后台线程 200ms 轮询）
- 内容去重（SHA256 hash 对比）
- 数据库写入与读取
- 前端历史记录列表展示（HistoryList/HistoryItem 组件）
- 点击记录复制回剪贴板
- 前后端事件通信（clipboard-new 事件）
- Zustand store 支持事件驱动更新

### 修复
- macOS 剪贴板实例冲突（skip_next 标志位）
- Rust/TypeScript 序列化字段名不匹配（serde rename_all camelCase）

## [0.1.0] - 2025-05-14

### 新增
- Tauri 2 + React 18 + TypeScript + Vite 项目脚手架搭建
- Tailwind CSS v4 配置（亮色/暗色主题变量）
- SQLite 数据库层（rusqlite + r2d2 连接池）：建表、迁移、基础 CRUD
- Tauri IPC 命令：get_history、search_history、copy_to_clipboard、delete_history_item、clear_history、toggle_pin
- Zustand 状态管理：historyStore（前端状态框架）
- 前端 IPC 封装（src/lib/tauri.ts）
- TypeScript 类型定义（ClipItem、AppSettings）
- 应用图标资源生成
- Cargo 中科大镜像配置
- 文档体系：CLAUDE.md、README.md、架构设计、数据库设计、路线图

## [Unreleased]
