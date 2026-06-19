<script setup lang="ts">
import type { Track } from '@/types/music'
import { t } from '@/utils/i18n'

const props = defineProps<{
  track: Track | null
  lang: 'zh' | 'en'
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
  return (map[source] || [source, source])[props.lang === 'zh' ? 0 : 1]
}
</script>

<template>
  <div class="track-text">
    <div class="track-title">
      {{ track ? track.name : t("coverHint", lang) }}
    </div>
    <div class="track-artist">
      {{ track ? track.artist?.join(", ") : "" }}
    </div>
    <div v-if="track" class="track-tags">
      <span
        class="source-pill"
        :style="{
          borderColor: `var(--src-${track.source})`,
          color: `var(--src-${track.source})`,
          background: `var(--src-${track.source})1A`,
        }"
      >
        <span
          class="source-pill-dot"
          :style="{ background: `var(--src-${track.source})` }"
        />
        {{ sourceLabel(track.source) }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.track-text {
  overflow: hidden;
}
.track-title {
  font-size: 18px;
  font-weight: 600;
  max-height: 48px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.track-artist {
  font-size: 12px;
  color: var(--text-sub, #a1a6d0);
  margin-top: 2px;
}
.track-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 4px;
  font-size: 10px;
}
.source-pill {
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(0, 0, 0, 0.35);
}
.source-pill-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}
</style>
