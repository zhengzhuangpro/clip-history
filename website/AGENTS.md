<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

### Git 规范
- 分支策略：`master` 为主分支，功能开发使用 `feat/xxx` 分支
- Commit 格式：`type: description`
  - `feat: add image clipboard support`
  - `fix: resolve fuzzy search crash`
  - `docs: update installation guide`
  - `refactor: optimize query performance`
- 不在 commit message 中添加 AI 签名