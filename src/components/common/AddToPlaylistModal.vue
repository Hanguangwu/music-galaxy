<script setup lang="ts">
import { ref } from 'vue'
import { usePlaylistStore } from '@/stores/playlist'
import { t } from '@/utils/i18n'
import type { Track } from '@/types/music'

const props = defineProps<{
  show: boolean
  track: Track | null
  lang: 'zh' | 'en'
}>()

const emit = defineEmits<{
  close: []
}>()

const playlistStore = usePlaylistStore()
const showNewInput = ref(false)
const newPlaylistName = ref('')

function addToPlaylist(playlistId: string) {
  if (!props.track) return
  const added = playlistStore.addToPlaylist(playlistId, props.track)
  const msg = added
    ? t('toastAddedToPlaylist', props.lang)
    : t('toastAlreadyInList', props.lang)
  window.dispatchEvent(new CustomEvent('show-toast', { detail: msg }))
  if (added) emit('close')
}

function onCreateNew() {
  const name = newPlaylistName.value.trim() || (props.lang === 'zh' ? '未命名歌单' : 'Untitled')
  const pl = playlistStore.createPlaylist(name)
  newPlaylistName.value = ''
  showNewInput.value = false
  // Add the track to the newly created playlist
  if (props.track) {
    playlistStore.addToPlaylist(pl.id, props.track)
    window.dispatchEvent(new CustomEvent('show-toast', { detail: t('toastAddedToPlaylist', props.lang) }))
    emit('close')
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="show && track"
      class="modal-backdrop show"
      @click.self="emit('close')"
    >
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title-wrap">
            <div class="modal-title-icon">📋</div>
            <span>{{ t('addToPlaylist', lang) }}</span>
          </div>
          <button class="modal-close-btn" @click="emit('close')">×</button>
        </div>
        <div class="modal-body">
          <div class="track-preview">
            <span class="track-preview-name">{{ track.name }}</span>
            <span class="track-preview-artist">{{ track.artist?.join(', ') }}</span>
          </div>

          <div v-if="playlistStore.customPlaylists.length === 0 && !showNewInput" class="empty-playlists">
            <p>{{ lang === 'zh' ? '还没有创建歌单' : 'No playlists yet' }}</p>
          </div>

          <div class="playlist-list">
            <div
              v-for="pl in playlistStore.customPlaylists"
              :key="pl.id"
              class="playlist-item"
              @click="addToPlaylist(pl.id)"
            >
              <span class="playlist-item-icon">🎵</span>
              <span class="playlist-item-name">{{ pl.name }}</span>
              <span class="playlist-item-count">{{ pl.tracks.length }}</span>
            </div>
          </div>

          <div v-if="showNewInput" class="new-playlist-row">
            <input
              v-model="newPlaylistName"
              class="modal-input"
              type="text"
              :placeholder="lang === 'zh' ? '输入歌单名称...' : 'Enter playlist name...'"
              @keydown.enter="onCreateNew"
            />
            <div class="new-playlist-actions">
              <button class="btn btn-ghost" @click="showNewInput = false">{{ t('modalCancel', lang) }}</button>
              <button class="btn btn-secondary-confirm" @click="onCreateNew">{{ t('modalConfirm', lang) }}</button>
            </div>
          </div>

          <button
            v-else
            class="btn btn-new-playlist"
            @click="showNewInput = true"
          >
            + {{ t('newPlaylist', lang) }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(5, 7, 20, 0.86);
  backdrop-filter: blur(18px);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}
.modal-backdrop.show {
  display: flex;
}
.modal {
  background:
    radial-gradient(circle at 0 0, rgba(255, 255, 255, 0.08), transparent 60%),
    rgba(10, 14, 40, 0.98);
  border-radius: 18px;
  padding: 16px 20px 14px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.9);
  max-width: 380px;
  width: 92%;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.18);
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  margin-bottom: 6px;
  color: var(--text-main, #f5f6ff);
}
.modal-title-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
}
.modal-title-icon {
  width: 22px;
  height: 22px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  background: radial-gradient(circle at 30% 0, rgba(255, 255, 255, 0.32), rgba(255, 217, 140, 0.9));
  box-shadow: 0 0 10px rgba(255, 217, 140, 0.8);
}
.modal-close-btn {
  border: none;
  background: transparent;
  color: #aaa;
  font-size: 18px;
  cursor: pointer;
}
.modal-body {
  color: var(--text-main, #f5f6ff);
}
.track-preview {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  background: rgba(15, 18, 52, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.track-preview-name {
  font-size: 12px;
  font-weight: 600;
}
.track-preview-artist {
  font-size: 10px;
  color: var(--text-sub, #a1a6d0);
}
.empty-playlists {
  text-align: center;
  padding: 16px 0;
  font-size: 12px;
  color: var(--text-sub, #a1a6d0);
}
.playlist-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
  max-height: 220px;
  overflow-y: auto;
}
.playlist-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 10px;
  background: rgba(15, 18, 52, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.06);
  cursor: pointer;
  transition: background 0.15s, transform 0.1s;
  font-size: 12px;
}
.playlist-item:hover {
  background: rgba(26, 32, 80, 0.9);
  transform: translateY(-1px);
}
.playlist-item-icon {
  font-size: 14px;
  flex-shrink: 0;
}
.playlist-item-name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.playlist-item-count {
  font-size: 10px;
  color: var(--text-sub, #a1a6d0);
  background: rgba(0, 0, 0, 0.3);
  padding: 1px 6px;
  border-radius: 999px;
  flex-shrink: 0;
}
.new-playlist-row {
  margin-top: 8px;
}
.new-playlist-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 6px;
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
  box-sizing: border-box;
}
.btn-new-playlist {
  width: 100%;
  padding: 7px 0;
  border-radius: 999px;
  border: 1px dashed rgba(255, 255, 255, 0.25);
  background: transparent;
  color: var(--text-sub, #a1a6d0);
  font-size: 12px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.btn-new-playlist:hover {
  background: rgba(26, 32, 80, 0.6);
  color: var(--text-main, #f5f6ff);
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

@media (max-width: 480px) {
  .modal { max-width: 96%; padding: 14px; }
  .playlist-item { padding: 6px 8px; font-size: 11px; }
  .track-preview { font-size: 11px; }
  .modal-input { font-size: 11px; padding: 6px 8px; }
  .btn-new-playlist { font-size: 11px; }
  .btn-secondary-confirm { font-size: 11px; padding: 4px 10px; }
  .btn-ghost { font-size: 10px; padding: 2px 8px; }
}
</style>
