<script setup lang="ts">
import type { Track } from '@/types/music'
defineProps<{
  track: Track
  index: number
  lang: 'zh' | 'en'
}>()

const emit = defineEmits<{
  play: []
}>()

function sourceLabel(source: string, lang: 'zh' | 'en'): string {
  const map: Record<string, [string, string]> = {
    kuwo: ['酷我', 'Kuwo'],
    netease: ['网易云', 'Netease'],
    tencent: ['QQ音乐', 'QQ Music'],
    migu: ['咪咕', 'Migu'],
    kugou: ['酷狗', 'Kugou'],
    spotify: ['Spotify', 'Spotify'],
    ytmusic: ['YT Music', 'YT Music'],
    apple: ['Apple Music', 'Apple Music'],
    tidal: ['Tidal', 'Tidal'],
    qobuz: ['Qobuz', 'Qobuz'],
    joox: ['JOOX', 'JOOX'],
    deezer: ['Deezer', 'Deezer'],
    ximalaya: ['喜马拉雅', 'Ximalaya'],
  }
  return (map[source] || [source, source])[lang === 'zh' ? 0 : 1]
}
</script>

<template>
  <div class="search-mini-item" @click="emit('play')">
    <div class="mini-meta-main">
      <div class="mini-title">{{ track.name || 'Unknown' }}</div>
      <div class="mini-artist">{{ track.artist?.join(', ') || '' }}</div>
    </div>
    <div class="mini-right">
      <div class="mini-badge">#{{ index + 1 }}</div>
      <div class="mini-source">
        <span
          class="source-dot"
          :style="{ background: `var(--src-${track.source})`, color: `var(--src-${track.source})` }"
        />
        <span>{{ sourceLabel(track.source, lang) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-mini-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 8px;
  margin-bottom: 4px;
  border-radius: 10px;
  background: rgba(8, 10, 32, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 11px;
  cursor: pointer;
  transition: background 0.15s, transform 0.1s, box-shadow 0.1s;
}
.search-mini-item:hover {
  background: rgba(26, 32, 80, 0.9);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.85);
  transform: translateY(-1px);
}
.mini-meta-main {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
  min-width: 0;
}
.mini-title {
  font-size: 11px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.mini-artist {
  font-size: 10px;
  color: var(--text-sub, #a1a6d0);
}
.mini-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  flex-shrink: 0;
  margin-left: 8px;
}
.mini-badge {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.18);
}
.mini-source {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 9px;
  color: var(--text-sub, #a1a6d0);
}
.source-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  box-shadow: 0 0 6px currentColor;
}
</style>
