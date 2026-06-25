<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { usePlaylistStore } from '@/stores/playlist'
import { useKeyboard } from '@/composables/useKeyboard'
import { t } from '@/utils/i18n'

import ParticleBg from '@/components/common/ParticleBg.vue'
import Toast from '@/components/common/Toast.vue'
import Modal from '@/components/common/Modal.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import SearchPanel from '@/components/search/SearchPanel.vue'
import PlayerPanel from '@/components/player/PlayerPanel.vue'
import PlaylistPanel from '@/components/playlist/PlaylistPanel.vue'

const lang = ref<'zh' | 'en'>('zh')
const toastMessage = ref('')
const toastVisible = ref(false)
let toastTimer = 0
const showShortcutModal = ref(false)
const searchInputRef = ref<HTMLInputElement | null>(null)

const playerStore = usePlayerStore()
const playlistStore = usePlaylistStore()

function setLang(l: 'zh' | 'en') {
  lang.value = l
  try { localStorage.setItem('music-galaxy-lang', l) } catch { /* noop */ }
}

function showToast(msg: string) {
  toastMessage.value = msg
  toastVisible.value = true
  clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => {
    toastVisible.value = false
  }, 2500)
}

function toggleShortcuts() {
  showShortcutModal.value = !showShortcutModal.value
}

function toggleFavorite() {
  const track = playerStore.currentTrack
  if (!track) {
    showToast(t('toastNoCurrentTrack', lang.value))
    return
  }
  const added = playlistStore.toggleFavorite(track)
  showToast(added ? t('toastAddedFavorite', lang.value) : t('toastRemovedFavorite', lang.value))
}

function toggleLyricsAlt() {
  // handled by LyricsDisplay if needed
}

useKeyboard({
  togglePlay: () => {
    const audio = document.getElementById('main-audio') as HTMLAudioElement | null
    if (!audio || !playerStore.currentTrack) return
    if (playerStore.isPlaying) audio.pause()
    else audio.play().catch(() => {})
  },
  seek: (delta: number) => {
    const audio = document.getElementById('main-audio') as HTMLAudioElement | null
    if (!audio) return
    audio.currentTime = Math.max(0, Math.min(audio.duration || 0, (audio.currentTime || 0) + delta))
  },
  setVolume: (delta: number) => {
    const audio = document.getElementById('main-audio') as HTMLAudioElement | null
    if (!audio) return
    const newVol = Math.max(0, Math.min(1, audio.volume + delta))
    audio.volume = newVol
    playerStore.setVolume(newVol)
  },
  playNext: (dir) => {
    // emit custom event for useAudio to handle
    window.dispatchEvent(new CustomEvent(dir === 'next' ? 'play-next' : 'play-prev'))
  },
  toggleFavorite,
  toggleLyricsAlt,
  toggleMuted: () => {
    const audio = document.getElementById('main-audio') as HTMLAudioElement | null
    if (!audio) return
    audio.muted = !audio.muted
    playerStore.toggleMuted()
  },
  searchInputRef,
})

onMounted(() => {
  try {
    const saved = localStorage.getItem('music-galaxy-lang')
    if (saved === 'en' || saved === 'zh') lang.value = saved
  } catch { /* noop */ }

  // Listen for toast events from child components
  window.addEventListener('show-toast', ((e: CustomEvent) => {
    showToast(e.detail)
  }) as EventListener)
})
</script>

<template>
  <ParticleBg />

  <div class="app">
    <AppHeader
      :lang="lang"
      @lang-change="setLang"
      @toggle-shortcuts="toggleShortcuts"
    />

    <main class="layout">
      <SearchPanel :lang="lang" />
      <PlayerPanel :lang="lang" />
      <PlaylistPanel :lang="lang" />
    </main>

    <AppFooter :lang="lang" />
  </div>

  <Toast :message="toastMessage" :visible="toastVisible" />

  <Modal
    :show="showShortcutModal"
    :title="lang === 'zh' ? '快捷键说明' : 'Keyboard Shortcuts'"
    @close="showShortcutModal = false"
  >
    <p class="shortcut-desc">
      {{ lang === 'zh' ? '使用键盘更加方便地控制播放：' : 'Control playback with your keyboard:' }}
    </p>
    <div class="shortcut-grid">
      <div class="shortcut-card">
        <span class="shortcut-label">{{ lang === 'zh' ? '播放 / 暂停' : 'Play / Pause' }}</span>
        <span class="shortcut-key"><kbd>Space</kbd></span>
      </div>
      <div class="shortcut-card">
        <span class="shortcut-label">{{ lang === 'zh' ? '快退 / 快进 5 秒' : 'Seek -5s / +5s' }}</span>
        <span class="shortcut-key"><kbd>←</kbd> <kbd>→</kbd></span>
      </div>
      <div class="shortcut-card">
        <span class="shortcut-label">{{ lang === 'zh' ? '音量加 / 减' : 'Volume +/-' }}</span>
        <span class="shortcut-key"><kbd>↑</kbd> <kbd>↓</kbd></span>
      </div>
      <div class="shortcut-card">
        <span class="shortcut-label">{{ lang === 'zh' ? '上一首 / 下一首' : 'Prev / Next' }}</span>
        <span class="shortcut-key"><kbd>P</kbd> <kbd>N</kbd></span>
      </div>
      <div class="shortcut-card">
        <span class="shortcut-label">{{ lang === 'zh' ? '收藏 / 取消收藏' : 'Toggle Favorite' }}</span>
        <span class="shortcut-key"><kbd>F</kbd></span>
      </div>
      <div class="shortcut-card">
        <span class="shortcut-label">{{ lang === 'zh' ? '静音 / 取消静音' : 'Mute / Unmute' }}</span>
        <span class="shortcut-key"><kbd>M</kbd></span>
      </div>
      <div class="shortcut-card">
        <span class="shortcut-label">{{ lang === 'zh' ? '聚焦搜索框' : 'Focus Search' }}</span>
        <span class="shortcut-key"><kbd>/</kbd></span>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
.app {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 104px);
  margin: 44px 80px;
  padding: 10px 12px;
  gap: 10px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background:
    radial-gradient(circle at 0 0, rgba(255, 255, 255, 0.06), transparent 60%),
    radial-gradient(circle at 100% 100%, rgba(136, 196, 255, 0.1), transparent 60%),
    rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(14px);
  box-shadow:
    0 0 40px rgba(0, 0, 0, 0.9),
    0 0 120px rgba(136, 196, 255, 0.35);
}

.layout {
  flex: 1;
  display: grid;
  grid-template-columns:
    minmax(260px, 0.8fr)
    minmax(360px, 1.58fr)
    minmax(260px, 0.82fr);
  gap: 10px;
  min-height: 0;
}

/* Panel base styles used by all panels */
:deep(.panel) {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 10px;
  border-radius: 18px;
  background: var(--panel-glass-soft, rgba(10, 14, 35, 0.26));
  border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.12));
  backdrop-filter: blur(18px);
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.85);
  z-index: 0;
}

:deep(.panel-header) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  flex-shrink: 0;
}

:deep(.panel-title) {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
}

:deep(.panel-title .icon) {
  font-size: 16px;
}

/* Responsive */
@media (max-width: 1280px) {
  .app { margin: 32px 40px; height: calc(100vh - 70px); }
}
@media (max-width: 1080px) {
  .layout {
    grid-template-columns: 1.1fr 1.2fr;
    grid-template-rows: minmax(260px, 0.9fr) minmax(260px, 1.1fr);
    grid-template-areas:
      "player player"
      "search playlist";
  }
  :deep(.search-panel) { grid-area: search; }
  :deep(.player-panel) { grid-area: player; }
  :deep(.playlist-panel) { grid-area: playlist; }
}
@media (max-width: 900px) {
  .app { margin: 16px; height: calc(100vh - 32px); }
}
@media (max-width: 860px) {
  .layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
    grid-template-areas:
      "player"
      "search"
      "playlist";
  }
}

/* Shortcut modal styles */
.shortcut-desc {
  margin: 2px 0 8px;
  font-size: 11px;
  color: var(--text-sub, #a1a6d0);
}
.shortcut-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px;
  margin-top: 6px;
  font-size: 12px;
}
.shortcut-card {
  border-radius: 12px;
  padding: 6px 8px;
  background: rgba(15, 18, 52, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.12);
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.shortcut-label {
  font-size: 11px;
  color: var(--text-sub, #a1a6d0);
}
.shortcut-key {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
}
.shortcut-key kbd {
  padding: 2px 6px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  font-size: 11px;
  background: rgba(0, 0, 0, 0.3);
}
</style>
