# Music Galaxy — AGENTS.md

## 项目概述

Music Galaxy 是一个基于 Vue 3 + TypeScript + Vite 的在线音乐静态播放网站。
UI 风格继承自 music-square（暗色霓虹玻璃拟态），API 使用 GDStudio（来自 cozy_music-main）多平台聚合接口。

## 架构

```
src/
├── api/          # GDStudio API 封装（search / url / pic / lyric）
├── stores/       # Pinia 状态管理（player / search / playlist）
├── composables/  # 逻辑复用（useAudio / useLyrics / useKeyboard）
├── components/
│   ├── layout/   # AppHeader, AppFooter
│   ├── search/   # SearchPanel, SearchInput, SourceSelector, SearchResultItem
│   ├── player/   # PlayerPanel, AlbumCover, TrackInfo, PlayerControls, LyricsDisplay
│   ├── playlist/ # PlaylistPanel, PlaylistTabs, TrackItem
│   └── common/   # ParticleBg, Modal, Toast, RippleBtn
├── utils/        # lrc.ts, format.ts, i18n.ts
├── types/        # music.ts 核心类型
└── assets/styles/ # variables.css, global.css, animations.css
```

## 技术栈

- Vue 3 (Composition API, `<script setup>`)
- TypeScript (strict, no `any`)
- Vite (with proxy for audio CORS)
- Pinia (状态管理)
- pnpm (包管理)

## API 参考

**Base URL**: `https://music-api.gdstudio.xyz/api.php`

| 类型 | 参数 | 返回 |
|------|------|------|
| 搜索 | `types=search&source={src}&name={kw}&count={n}&pages=1` | `Array<{name, artist[], album, id, pic_id, lyric_id, source}>` |
| 音频URL | `types=url&source={src}&id={id}&br=128` | `{url: string}` |
| 封面 | `types=pic&source={src}&id={picId}&size=300` | `{url: string}` |
| 歌词 | `types=lyric&source={src}&id={lycId}` | `{lyric: string}` |

**支持源**: kuwo, netease, tencent, tidal, spotify, ytmusic, qobuz, joox, deezer, migu, kugou, ximalaya, apple

## 代理策略

部分源返回 HTTP 音频 URL，需代理转发：
1. Vite dev server proxy → 开发环境用
2. production 可用 GitHub Pages + 前端 HTTPS 升级 + 可选部署 proxy 服务

## 数据流

```
SearchPanel → search store.search(keyword, sources)
  → api/search() → 返回 Track[]
  → 写入 search store.results

PlayerPanel.play(track)
  → player store.play(track)
  → api.getAudioUrl(track) → 写入 track.audioUrl
  → api.getCover(track) → 写入 track.cover
  → api.getLyric(track) → 写入 track.lyric
  → useAudio.setSrc(url) → 播放
  → useLyrics.parse(lyric) → 驱动 highlight
```

## 样式约定

- 全部使用 scoped `<style>` 或 CSS Modules
- 全局变量在 `variables.css` 中
- 主题色：--accent: #f5c84c (金色), 各源有对应的色值
- 暗色背景 + 玻璃拟态 (backdrop-filter: blur + rgba)

## 构建与部署

```bash
pnpm install
pnpm dev     # 开发
pnpm build   # 静态导出 → dist/
```
