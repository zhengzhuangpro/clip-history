# Changelog

本项目遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/) 格式，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/) 规范。

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

### 新增
- 项目初始化：文档体系搭建
