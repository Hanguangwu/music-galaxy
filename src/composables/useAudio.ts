import { watch } from 'vue'
import type { Ref } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { usePlaylistStore } from '@/stores/playlist'
import { useSearchStore } from '@/stores/search'

export function useAudio(audioRef: Ref<HTMLAudioElement | null>) {
  const playerStore = usePlayerStore()
  const playlistStore = usePlaylistStore()
  const searchStore = useSearchStore()

  function getAudio(): HTMLAudioElement | null {
    return audioRef.value
  }

  function onTimeUpdate() {
    const el = getAudio()
    if (!el) return
    playerStore.setCurrentTime(el.currentTime)
    if (el.duration) {
      playerStore.setDuration(el.duration)
    }
  }

  function onLoadedMetadata() {
    const el = getAudio()
    if (!el) return
    playerStore.setDuration(el.duration)
  }

  function onPlay() {
    playerStore.setPlaying(true)
  }

  function onPause() {
    playerStore.setPlaying(false)
  }

  function onEnded() {
    playNext()
  }

  function playNext(direction: 'next' | 'prev' = 'next') {
    const track = playerStore.currentTrack
    if (!track) return
    const mode = playerStore.playMode

    if (mode === 'single') {
      // Restart current track — handled externally via audio.currentTime = 0
      const el = getAudio()
      if (el) {
        el.currentTime = 0
        el.play().catch(() => {})
      }
      return
    }

    let list = getActiveList()
    if (!list.length) return

    let idx = playerStore.contextIndex
    if (idx < 0 || idx >= list.length) idx = 0

    if (mode === 'shuffle') {
      if (list.length === 1) {
        idx = 0
      } else {
        let newIdx: number
        do {
          newIdx = Math.floor(Math.random() * list.length)
        } while (newIdx === idx)
        idx = newIdx
      }
    } else {
      const dir = direction === 'prev' ? -1 : 1
      idx = (idx + dir + list.length) % list.length
    }

    const nextTrack = list[idx]
    if (nextTrack) {
      playerStore.play(nextTrack, playerStore.contextType, idx, playerStore.contextPlaylistId)
    }
  }

  function getActiveList() {
    const tab = playerStore.contextType
    if (tab === 'results') {
      return searchStore.results
    }
    if (tab === 'favorites') {
      return playlistStore.favorites
    }
    const pl = playlistStore.selectedPlaylist
    return pl ? pl.tracks : []
  }

  function togglePlay() {
    const el = getAudio()
    if (!el || !playerStore.currentTrack) return
    if (playerStore.isPlaying) {
      el.pause()
    } else {
      el.play().catch(() => {})
    }
  }

  function seek(time: number) {
    const el = getAudio()
    if (!el) return
    el.currentTime = time
  }

  function setVolume(v: number) {
    const el = getAudio()
    if (!el) return
    el.volume = v
    playerStore.setVolume(v)
  }

  watch(
    () => playerStore.muted,
    (val) => {
      const el = getAudio()
      if (el) el.muted = val
    },
  )

  watch(
    () => playerStore.audioUrl,
    (url) => {
      const el = getAudio()
      if (!el || !url) return
      el.src = url
      el.load()
      el.play().catch(() => {})
    },
  )

  function bindEvents() {
    const el = getAudio()
    if (!el) return
    el.addEventListener('timeupdate', onTimeUpdate)
    el.addEventListener('loadedmetadata', onLoadedMetadata)
    el.addEventListener('play', onPlay)
    el.addEventListener('pause', onPause)
    el.addEventListener('ended', onEnded)
  }

  function unbindEvents() {
    const el = getAudio()
    if (!el) return
    el.removeEventListener('timeupdate', onTimeUpdate)
    el.removeEventListener('loadedmetadata', onLoadedMetadata)
    el.removeEventListener('play', onPlay)
    el.removeEventListener('pause', onPause)
    el.removeEventListener('ended', onEnded)
  }

  return {
    togglePlay,
    seek,
    setVolume,
    playNext,
    bindEvents,
    unbindEvents,
    getAudio,
  }
}
