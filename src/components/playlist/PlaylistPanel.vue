<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { useSearchStore } from '@/stores/search'
import { usePlaylistStore } from '@/stores/playlist'
import { t } from '@/utils/i18n'
import type { PlaylistTab } from '@/types/music'
import PlaylistTabs from './PlaylistTabs.vue'
import TrackItem from './TrackItem.vue'
import Modal from '@/components/common/Modal.vue'

const props = defineProps<{
  lang: 'zh' | 'en'
}>()

const playerStore = usePlayerStore()
const searchStore = useSearchStore()
const playlistStore = usePlaylistStore()

const showNewPlaylistModal = ref(false)
const newPlaylistName = ref('')

const activeTracks = computed(() => {
  const tab = playlistStore.activeTab
  if (tab === 'results') return searchStore.results
  if (tab === 'favorites') return playlistStore.favorites
  const pl = playlistStore.selectedPlaylist
  return pl ? pl.tracks : []
})

function onTabChange(tab: PlaylistTab) {
  playlistStore.activeTab = tab
}

function onPlayTrack(track: any) {
  const list = activeTracks.value
  const idx = list.findIndex((t) => t.uid === track.uid)
  if (idx >= 0) {
    playerStore.play(track, playlistStore.activeTab, idx, playlistStore.selectedPlaylistId)
  }
}

function onToggleFav(track: any) {
  playlistStore.toggleFavorite(track)
}

function onCreatePlaylist() {
  const name = newPlaylistName.value.trim() || (props.lang === 'zh' ? '未命名歌单' : 'Untitled')
  playlistStore.createPlaylist(name)
  playlistStore.activeTab = 'playlist'
  newPlaylistName.value = ''
  showNewPlaylistModal.value = false
}

function setPlayMode(mode: 'list' | 'single' | 'shuffle') {
  playerStore.setPlayMode(mode)
}


</script>

<template>
  <section class="panel playlist-panel">
    <div class="panel-header">
      <div class="panel-title">
        <span class="icon">📜</span>
        <span>{{ t("playlistTitle", lang) }}</span>
      </div>
      <PlaylistTabs
        :active="playlistStore.activeTab"
        :lang="lang"
        @update:active="onTabChange"
      />
    </div>

    <div class="playlist-main">
      <div class="playlist-bar">
        <span class="playlist-info">
          <template v-if="playlistStore.activeTab === 'results'">{{ t('playlistInfoResults', lang) }}</template>
          <template v-else-if="playlistStore.activeTab === 'favorites'">{{ t('playlistInfoFavorites', lang) }}</template>
          <template v-else>
            {{ t('playlistInfoPlaylist', lang) }} · {{ playlistStore.selectedPlaylist?.name ?? '' }}
          </template>
        </span>
        <div class="playlist-right-controls">
          <div v-if="playlistStore.activeTab === 'playlist'" class="playlist-select-row">
            <select v-model="playlistStore.selectedPlaylistId">
              <option
                v-for="pl in playlistStore.customPlaylists"
                :key="pl.id"
                :value="pl.id"
              >{{ pl.name }}</option>
            </select>
            <button
              class="btn btn-ghost"
              @click="showNewPlaylistModal = true"
            >{{ t('newPlaylist', lang) }}</button>
          </div>
          <div class="playmode-row">
            <button
              class="playmode-btn"
              :class="{ active: playerStore.playMode === 'list' }"
              title="List loop"
              @click="setPlayMode('list')"
            >🔁</button>
            <button
              class="playmode-btn"
              :class="{ active: playerStore.playMode === 'single' }"
              title="Single loop"
              @click="setPlayMode('single')"
            >🔂</button>
            <button
              class="playmode-btn"
              :class="{ active: playerStore.playMode === 'shuffle' }"
              title="Shuffle"
              @click="setPlayMode('shuffle')"
            >🔀</button>
          </div>
        </div>
      </div>

      <div class="playlist-list">
        <TrackItem
          v-for="(track, idx) in activeTracks"
          :key="track.uid"
          :track="track"
          :index="idx"
          :is-playing="playerStore.currentTrack?.uid === track.uid && playerStore.isPlaying"
          :is-favorite="playlistStore.isFavorite(track)"
          :lang="lang"
          @play="onPlayTrack(track)"
          @toggle-favorite="onToggleFav(track)"
        />
      </div>
    </div>

    <Modal
      :show="showNewPlaylistModal"
      :title="t('modalNewPlaylistTitle', lang)"
      @close="showNewPlaylistModal = false"
    >
      <p class="modal-desc">{{ t('modalNewPlaylistDesc', lang) }}</p>
      <input
        v-model="newPlaylistName"
        class="modal-input"
        type="text"
        :placeholder="t('modalNewPlaylistTitle', lang)"
        @keydown.enter="onCreatePlaylist"
      />
      <div class="modal-actions">
        <button class="btn btn-ghost" @click="showNewPlaylistModal = false">{{ t('modalCancel', lang) }}</button>
        <button class="btn btn-secondary-confirm" @click="onCreatePlaylist">{{ t('modalConfirm', lang) }}</button>
      </div>
    </Modal>
  </section>
</template>

<style scoped>
.playlist-panel {
  display: flex;
  flex-direction: column;
  min-height: 0;
  background:
    radial-gradient(circle at 100% -40%, rgba(120, 195, 255, 0.22), transparent 60%),
    var(--panel-glass, rgba(8, 10, 26, 0.26));
}
.playlist-main {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding-right: 4px;
}
.playlist-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  color: var(--text-sub, #a1a6d0);
  gap: 6px;
  flex-shrink: 0;
  padding-bottom: 4px;
  margin-bottom: 4px;
  position: sticky;
  top: 0;
  z-index: 2;
  background: linear-gradient(180deg, rgba(7, 10, 30, 0.98), rgba(7, 10, 30, 0.85));
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.playlist-info {
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.playlist-right-controls {
  display: flex;
  align-items: center;
  gap: 6px;
}
.playlist-select-row {
  display: flex;
  align-items: center;
  gap: 6px;
}
.playlist-select-row select {
  background: rgba(5, 7, 24, 0.8);
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--text-main, #f5f6ff);
  padding: 3px 8px;
  font-size: 11px;
  outline: none;
}
.playmode-row {
  display: flex;
  align-items: center;
  gap: 4px;
}
.playmode-btn {
  border: none;
  border-radius: 999px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  background: rgba(0, 0, 0, 0.35);
  color: var(--text-sub, #a1a6d0);
  cursor: pointer;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.8);
}
.playmode-btn.active {
  background: radial-gradient(circle at 30% 0, rgba(255, 255, 255, 0.18), rgba(110, 190, 255, 0.95));
  color: #02030a;
  box-shadow: 0 0 10px rgba(110, 190, 255, 0.95);
}
.playlist-list {
  flex: 0 0 auto;
}
.btn-ghost {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.22);
  color: var(--text-sub, #a1a6d0);
  box-shadow: none;
  border-radius: 999px;
  padding: 3px 10px;
  font-size: 11px;
  cursor: pointer;
}
.btn-secondary-confirm {
  background: radial-gradient(circle at 30% 0, rgba(255, 255, 255, 0.05), rgba(80, 100, 180, 0.95));
  color: var(--text-main, #f5f6ff);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.8);
  border: none;
  border-radius: 999px;
  padding: 6px 13px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
}
.modal-desc {
  margin: 2px 0 8px;
  font-size: 11px;
  color: var(--text-sub, #a1a6d0);
}
.modal-input {
  width: 100%;
  padding: 7px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  background: rgba(4, 6, 20, 0.96);
  color: var(--text-main, #f5f6ff);
  font-size: 12px;
  outline: none;
  margin-bottom: 10px;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 4px;
}
</style>
