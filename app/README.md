# SCL-90 心理健康症状自评量表

这是一个基于 Next.js 和 Tailwind CSS 构建的 SCL-90 心理测评网站。

## 功能特点

- **完整量表**：包含 SCL-90 标准版的 90 道题目。
- **专业分析**：自动计算 10 个因子的得分（躯体化、强迫症状、人际关系敏感等）。
- **实时进度**：显示测评进度条。
- **数据保存**：答题过程中自动保存进度，刷新不丢失。
- **移动端友好**：响应式设计，适配手机和桌面。

## 技术栈

- Next.js 15 (App Router)
- React
- TypeScript
- Tailwind CSS

## 如何运行

1. 安装依赖：
   ```bash
   npm install
   ```

2. 启动开发服务器：
   ```bash
   npm run dev
   ```

3. 打开浏览器访问 `http://localhost:3000`

## 目录结构

- `app/components`: UI 组件 (进度条, 题目卡片)
- `app/test`: 测评页面逻辑
- `app/result`: 结果分析页面
- `lib/scl90.ts`: 题目数据和因子定义
