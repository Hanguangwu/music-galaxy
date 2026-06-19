# Music Galaxy 🎵

一个基于 Vue 3 + TypeScript + Vite 的在线音乐静态播放网站。

## 特性

- 🔍 **多平台搜索** — 支持酷我、网易云、QQ音乐、Spotify、Apple Music 等 13 个音乐源
- 🎵 **在线播放** — 流畅的音频播放体验，支持进度拖动
- 📝 **歌词同步** — 实时滚动高亮，动态霓虹灯效果
- 💾 **音乐下载** — 一键下载到本地
- 🖼️ **专辑封面** — 高清封面 + 光盘旋转动画
- 📜 **播放列表** — 搜索结果、收藏、自定义歌单
- ⌨️ **快捷键** — Space 播放/暂停，←/→ 跳转，↑/↓ 音量
- 🌐 **多语言** — 中文 / English
- ✨ **炫酷 UI** — 暗色霓虹玻璃拟态 + Canvas 粒子背景

## 技术栈

| 技术 | 用途 |
|------|------|
| Vue 3 + Composition API | 前端框架 |
| TypeScript | 类型安全 |
| Vite | 构建工具 |
| Pinia | 状态管理 |
| pnpm | 包管理 |

## 快速开始

```bash
pnpm install
pnpm dev
```

开发服务器默认运行在 `http://localhost:5173`。

## 构建

```bash
pnpm build
```

产物输出至 `dist/` 目录，可部署至任意静态托管服务（GitHub Pages、Vercel、Netlify 等）。

## API 说明

本项目使用 [GDStudio Music API](https://music-api.gdstudio.xyz) 作为数据源，支持以下平台：

酷我音乐 · 网易云音乐 · QQ音乐 · Tidal · Spotify · YouTube Music · Qobuz · JOOX · Deezer · 咪咕音乐 · 酷狗音乐 · 喜马拉雅 · Apple Music

> 感谢 GDStudio 团队提供的免费音乐 API 服务。

## 代理说明

部分音乐平台（如酷我）返回 HTTP 协议的音频链接，浏览器在 HTTPS 页面下会阻止加载。解决方案：
- **开发环境**：Vite proxy 自动转发
- **生产环境**：建议部署在支持代理的服务器上，或使用纯前端 HTTPS 升级方案

## 项目结构

```
music-galaxy/
├── src/
│   ├── api/          # API 封装
│   ├── stores/       # Pinia stores
│   ├── composables/  # 组合式函数
│   ├── components/   # Vue 组件
│   ├── utils/        # 工具函数
│   ├── types/        # TypeScript 类型
│   └── assets/       # 静态资源
├── public/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── pnpm-lock.yaml
```

## 免责声明

本站仅作为学习演示，音乐版权归各平台与原作者所有。

## License

MIT
