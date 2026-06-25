<script setup lang="ts">
import type { Track } from '@/types/music'
import { t } from '@/utils/i18n'

defineProps<{
  track: Track
  index: number
  isPlaying: boolean
  isFavorite: boolean
  lang: 'zh' | 'en'
}>()

const emit = defineEmits<{
  play: []
  'toggle-favorite': []
  'add-to-playlist': []
}>()

function sourceLabel(source: string): string {
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
  return (map[source] || [source, source])[0]
}
</script>

<template>
  <div
    class="track-item"
    :class="{ playing: isPlaying }"
  >
    <div class="track-index">{{ index + 1 }}</div>
    <div class="track-meta" @click="emit('play')">
      <div class="track-meta-title">{{ track.name || 'Unknown' }}</div>
      <div class="track-meta-sub">
        <span>{{ track.artist?.join(', ') }}</span>
        <span class="track-source">
          <span
            class="source-dot"
            :style="{ background: `var(--src-${track.source})` }"
          />
          {{ sourceLabel(track.source) }}
        </span>
      </div>
    </div>
    <div class="track-actions">
      <button class="btn-icon" title="Play" @click="emit('play')">▶</button>
      <button
        class="btn-icon"
        :class="{ 'btn-fav-active': isFavorite }"
        :title="t('favorite', 'zh')"
        @click="emit('toggle-favorite')"
      >❤</button>
      <button
        class="btn-icon btn-add-playlist"
        :title="lang === 'zh' ? '加入歌单' : 'Add to playlist'"
        @click="emit('add-to-playlist')"
      >+</button>
    </div>
  </div>
</template>

<style scoped>
.track-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 6px;
  align-items: center;
  padding: 6px 8px;
  margin-bottom: 4px;
  border-radius: 10px;
  background: rgba(7, 11, 34, 0.86);
  border: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 11px;
  cursor: pointer;
  transition: background 0.15s, transform 0.1s, box-shadow 0.1s;
}
.track-item:hover {
  background: rgba(26, 32, 80, 0.95);
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.9);
}
.track-item.playing {
  border-color: var(--accent, #f5c84c);
  box-shadow: 0 0 14px rgba(245, 200, 76, 0.9);
}
.track-index {
  width: 22px;
  text-align: right;
  color: var(--text-sub, #a1a6d0);
}
.track-meta {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}
.track-meta-title {
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.track-meta-sub {
  display: flex;
  justify-content: space-between;
  gap: 4px;
  font-size: 10px;
  color: var(--text-sub, #a1a6d0);
  margin-top: 2px;
}
.track-source {
  display: flex;
  align-items: center;
  gap: 3px;
}
.source-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  box-shadow: 0 0 6px currentColor;
}
.track-actions {
  display: flex;
  gap: 4px;
  justify-content: flex-end;
}
.btn-icon {
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  background: radial-gradient(circle at 30% 0, rgba(255, 255, 255, 0.05), rgba(80, 100, 180, 0.95));
  color: var(--text-main, #f5f6ff);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.8);
  cursor: pointer;
  padding: 0;
  transition: transform 0.12s ease;
}
.btn-icon:active {
  transform: scale(0.93);
}
.btn-fav-active {
  background: radial-gradient(circle at 30% 0, rgba(255, 255, 255, 0.2), var(--accent-red, #ff5c7a));
  color: #fff5f7;
  box-shadow: 0 0 12px rgba(255, 92, 122, 0.95);
}
.btn-add-playlist {
  background: radial-gradient(circle at 30% 0, rgba(255, 255, 255, 0.05), rgba(80, 180, 130, 0.85));
}
.btn-add-playlist:hover {
  background: radial-gradient(circle at 30% 0, rgba(255, 255, 255, 0.15), rgba(80, 180, 130, 0.95));
  box-shadow: 0 0 10px rgba(80, 180, 130, 0.8);
}

@media (max-width: 480px) {
  .track-item { padding: 4px 6px; gap: 4px; }
  .track-index { width: 18px; font-size: 10px; }
  .track-meta-title { font-size: 11px; }
  .track-meta-sub { font-size: 9px; }
  .btn-icon { width: 22px; height: 22px; font-size: 11px; }
  .track-actions { gap: 3px; }
}
</style>
