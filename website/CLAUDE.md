# CLAUDE.md — 官网设计系统

> 基于 Next.js 16 + Tailwind CSS v4，设计风格参考 helmagent.dev。

## 设计风格

- **暗色优先**：`<html className="dark" defaultTheme="dark" enableSystem />`
- **开发者/终端美学**：monospace 字体、终端窗口、编号段落标记、网格背景
- **蓝色主题色**：`#3b82f6`（blue）、`#60a5fa`（blue-soft）
- **所有元素主题感知**：通过 CSS 自定义属性 + `:root` / `.dark` 双重定义

## 色彩体系

| Token | 用途 | Light | Dark |
|-------|------|-------|------|
| `--background` | 页面背景 | `#ffffff` | `#0a0b0d` |
| `--foreground` | 主文字 | `#0a0b0d` | `#dddee3` |
| `--surface-code` | 代码/终端背景 | `#f4f4f5` | `#111214` |
| `--surface-paper` | 次级背景 | `#e4e4e7` | `#191a1e` |
| `--surface-card` | 卡片背景 | `#ffffff` | `#111214` |
| `--surface-2` | 辅助表面 | `#f4f4f5` | `#191a1e` |
| `--border-hair` | 细边框 | `rgba(0,0,0,0.08)` | `rgba(255,255,255,0.06)` |
| `--border-hair-strong` | 强边框 | `rgba(0,0,0,0.12)` | `rgba(255,255,255,0.1)` |
| `--grid-line` | 网格线 | `rgba(0,0,0,0.04)` | `rgba(255,255,255,0.03)` |

## Ink 灰度色板

`ink-950`(#0a0b0d) → `ink-900`(#111214) → `ink-800`(#191a1e) → `ink-700`(#222327) → `ink-600`(#2e2f34) → `ink-500`(#3e3f44) → `ink-400`(#5a5b60) → `ink-300`(#8b8c91) → `ink-200`(#b4b5ba) → `ink-100`(#dddee3)

## CSS 工具类

| 类名 | 用途 |
|------|------|
| `.hair` / `.hair-strong` | 主题感知细边框 |
| `.code-bg` / `.paper-bg` / `.card-bg` / `.surface-2` | 主题感知背景 |
| `.grid-bg` + `.grid-fade` | 64px 网格背景 + 径向渐隐 |
| `.hero-glow` | Hero 区蓝色光晕 |
| `.term-shadow` | 终端窗口阴影 |
| `.sec-tag` | 段落编号标记 `[ 01 ]` 样式 |
| `.pull-quote` | 大号引用文字 |
| `.pulse` | 蓝色呼吸指示灯 |
| `.caret` | 终端光标闪烁 |
| `.split-window` | 终端面板（圆角 + 边框） |
| `.bg-blue` / `.text-blue` | 蓝色强调色 |
| `.bg-blue-soft` / `.text-blue-soft` | 柔和蓝色 |
| `.tk-bin` / `.tk-str` / `.tk-com` | 终端语法高亮 |

## 动画

- **SSE Wire（水平）**：`.sse-wire` + `.sse-pulse.go-right` / `.go-left`，2.5s 来回脉冲
- **SSE Wire（垂直）**：`.sse-wire-v` + `.sse-pulse.go-down` / `.go-up`，用于架构层级连接
- **Pulse Glow**：`.pulse` 蓝色呼吸灯，2s 循环
- **Caret Blink**：`.caret` 终端光标，1s 闪烁

## 页面结构

```
Navbar (sticky, backdrop-blur)
├── Hero (split: 文案左 + 终端演示右, grid-bg, hero-glow)
├── Why (pull-quote, 证据标签)
├── Features (3列 pillar cards, bg-border 间隔线)
├── TechStack (架构层饼: Frontend → Core → Storage, SSE wire)
├── Screenshots (图片画廊, ImageLightbox)
├── Privacy (3列卡片)
├── Download (终端风格 CTA, macOS + Windows)
└── Footer (4列 grid)
```

## 组件规范

- **Button**：使用 `@base-ui/react/button`，`render={<a />}` 时必须加 `nativeButton={false}`
- **蓝色按钮**：`className="bg-blue text-white hover:bg-blue-soft"`
- **ImageLightbox**：原生 `<dialog>` + `showModal()`，不用 React 条件渲染
- **ThemeToggle**：`border hair hover:bg-muted text-ink-300`
- **所有文字颜色**：用 `text-foreground`（主题感知），不用硬编码 `text-white` 或 `text-black`

## 关键文件

| 文件 | 用途 |
|------|------|
| `src/app/globals.css` | 完整设计系统（CSS 变量 + 工具类 + 动画） |
| `src/config/site.ts` | 站点配置（文案、链接、数据） |
| `src/components/*.tsx` | 页面各区块组件 |
| `src/components/ImageLightbox.tsx` | 图片灯箱（dialog 方案） |
| `src/components/ui/button.tsx` | shadcn Button 组件 |
| `src/hooks/useMacOSDownloadLink.ts` | macOS 下载链接动态获取 |

---

# 以下是 Next.js 16 开发规范

@AGENTS.md
