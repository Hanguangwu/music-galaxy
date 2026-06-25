<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { usePlaylistStore } from '@/stores/playlist'
import { useAudio } from '@/composables/useAudio'
import { t } from '@/utils/i18n'
import AlbumCover from './AlbumCover.vue'
import TrackInfo from './TrackInfo.vue'
import PlayerControls from './PlayerControls.vue'
import LyricsDisplay from './LyricsDisplay.vue'

const props = defineProps<{
  lang: 'zh' | 'en'
}>()

const playerStore = usePlayerStore()
const playlistStore = usePlaylistStore()

const audioRef = ref<HTMLAudioElement | null>(null)
const { togglePlay, seek, setVolume, playNext, bindEvents, unbindEvents } = useAudio(audioRef)

onMounted(() => {
  bindEvents()
  audioRef.value = document.getElementById('main-audio') as HTMLAudioElement
})

onUnmounted(() => {
  unbindEvents()
})

function onTogglePlay() {
  togglePlay()
}

function onSeekTo(time: number) {
  seek(time)
}

function onSetVolume(v: number) {
  setVolume(v)
}

function onToggleFav() {
  const track = playerStore.currentTrack
  if (!track) return
  playlistStore.toggleFavorite(track)
}

function onDownload() {
  const track = playerStore.currentTrack
  if (track?.audioUrl) {
    window.open(track.audioUrl, '_blank')
  }
}

function statusText(): string {
  if (playerStore.isLoading) return t('playerStatusLoading', props.lang)
  if (playerStore.isPlaying) return t('playerStatusPlaying', props.lang)
  if (playerStore.currentTrack) return t('playerStatusPaused', props.lang)
  return t('playerStatusIdle', props.lang)
}
</script>

<template>
  <section class="panel player-panel">
    <div class="panel-header">
      <div class="panel-title">
        <span class="icon">🎧</span>
        <span>{{ t("playerTitle", lang) }}</span>
      </div>
      <span class="chip">{{ t("playerSubtitle", lang) }}</span>
    </div>

    <div class="player-top">
      <AlbumCover
        :cover-url="playerStore.currentTrack?.coverUrl ?? ''"
        :is-playing="playerStore.isPlaying"
      />
      <div class="player-main">
        <div class="track-title-row">
          <TrackInfo
            :track="playerStore.currentTrack"
            :lang="lang"
          />
          <div class="player-actions">
            <div class="player-btn-row">
              <button
                class="btn btn-secondary btn-icon"
                :class="{ 'btn-fav-active': playerStore.currentTrack && playlistStore.isFavorite(playerStore.currentTrack) }"
                :title="t('favorite', lang)"
                @click="onToggleFav"
              >❤</button>
              <button
                class="btn btn-secondary btn-icon"
                :title="t('download', lang)"
                @click="onDownload"
              >⬇</button>
            </div>
            <div class="status-pill">{{ statusText() }}</div>
          </div>
        </div>

        <PlayerControls
          :current-time="playerStore.currentTime"
          :duration="playerStore.duration"
          :volume="playerStore.volume"
          :is-playing="playerStore.isPlaying"
          @toggle-play="onTogglePlay"
          @seek-to="onSeekTo"
          @set-volume="onSetVolume"
          @prev-track="playNext('prev')"
          @next-track="playNext('next')"
        />
      </div>
    </div>

    <LyricsDisplay
      :lyrics="playerStore.lyrics"
      :current-index="playerStore.currentLyricIndex"
      :alt-style="false"
      :is-playing="playerStore.isPlaying"
      :track-title="playerStore.currentTrack?.name ?? ''"
      :track-artist="playerStore.currentTrack?.artist?.join(', ') ?? ''"
      :lang="lang"
    />

    <audio id="main-audio" ref="audioRef" preload="metadata"></audio>
  </section>
</template>

<style scoped>
.player-panel {
  display: flex;
  flex-direction: column;
  min-height: 0;
  background:
    radial-gradient(circle at 50% -40%, rgba(255, 218, 120, 0.2), transparent 60%),
    var(--panel-glass, rgba(8, 10, 26, 0.26));
}
.chip {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.25);
  color: var(--text-sub, #a1a6d0);
  border: 1px solid rgba(255, 255, 255, 0.12);
}
.player-top {
  display: flex;
  gap: 10px;
  min-height: 165px;
  flex-shrink: 0;
}
.player-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}
.track-title-row {
  display: flex;
  justify-content: space-between;
  gap: 6px;
}
.player-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  font-size: 11px;
  flex-shrink: 0;
}
.player-btn-row {
  display: flex;
  gap: 5px;
}
.btn-secondary {
  background: radial-gradient(circle at 30% 0, rgba(255, 255, 255, 0.05), rgba(80, 100, 180, 0.95));
  color: var(--text-main, #f5f6ff);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.8);
}
.btn-icon {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  font-size: 13px;
  cursor: pointer;
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
.status-pill {
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(0, 0, 0, 0.35);
  color: var(--text-sub, #a1a6d0);
  font-size: 11px;
}

@media (max-width: 768px) {
  .player-top { gap: 8px; min-height: auto; }
}
@media (max-width: 480px) {
  .player-top { flex-direction: column; align-items: center; gap: 6px; }
  .track-title-row { flex-direction: column; gap: 4px; }
  .player-actions { flex-direction: row; }
  .btn-icon { width: 26px; height: 26px; font-size: 12px; }
  .chip { font-size: 9px; padding: 1px 6px; }
}
</style>
