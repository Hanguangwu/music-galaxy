import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Track, PlayMode, PlaylistTab, LyricLine } from '@/types/music'
import { getAudioUrl, getCoverUrl, getLyric, buildAudioUrl } from '@/api'
import { parseLRC } from '@/utils/lrc'

export const usePlayerStore = defineStore('player', () => {
  const currentTrack = ref<Track | null>(null)
  const playMode = ref<PlayMode>('list')
  const isPlaying = ref(false)
  const isLoading = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)
  const volume = ref(0.8)
  const muted = ref(false)
  const lyrics = ref<LyricLine[]>([])
  const currentLyricIndex = ref(-1)

  // Play context
  const contextType = ref<PlaylistTab>('results')
  const contextIndex = ref(-1)
  const contextPlaylistId = ref<string | null>(null)

  const audioUrl = computed(() => currentTrack.value?.audioUrl ?? '')

  async function play(
    track: Track,
    type: PlaylistTab,
    index: number,
    playlistId?: string | null,
  ) {
    currentTrack.value = track
    contextType.value = type
    contextIndex.value = index
    contextPlaylistId.value = playlistId ?? null
    isLoading.value = true

    try {
      // Fetch audio URL
      if (!track.audioUrl) {
        const rawUrl = await getAudioUrl(track.source, track.id)
        track.audioUrl = buildAudioUrl(rawUrl)
      }

      // Fetch cover
      if (!track.coverUrl) {
        try {
          track.coverUrl = await getCoverUrl(track.source, track.picId)
        } catch {
          track.coverUrl = ''
        }
      }

      // Fetch lyrics
      if (!track.lyric) {
        try {
          track.lyric = await getLyric(track.source, track.lyricId)
        } catch {
          track.lyric = ''
        }
      }

      lyrics.value = parseLRC(track.lyric)
      currentLyricIndex.value = -1
    } catch {
      // Audio URL fetch failed
    } finally {
      isLoading.value = false
    }
  }

  function setPlaying(state: boolean) {
    isPlaying.value = state
  }

  function setCurrentTime(time: number) {
    currentTime.value = time
    updateLyricIndex(time)
  }

  function setDuration(dur: number) {
    duration.value = dur
  }

  function setVolume(v: number) {
    volume.value = Math.max(0, Math.min(1, v))
  }

  function toggleMuted() {
    muted.value = !muted.value
  }

  function setPlayMode(mode: PlayMode) {
    playMode.value = mode
  }

  function updateLyricIndex(time: number) {
    const lines = lyrics.value
    if (!lines.length) {
      currentLyricIndex.value = -1
      return
    }

    let idx = currentLyricIndex.value
    if (idx < 0 || idx >= lines.length) idx = 0

    // Find the correct index
    if (time < lines[idx].time) {
      // Search backward
      for (let i = idx - 1; i >= 0; i--) {
        if (time >= lines[i].time) {
          idx = i
          break
        }
      }
      if (time < lines[0].time) idx = -1
    } else {
      // Search forward
      while (idx + 1 < lines.length && time >= lines[idx + 1].time) {
        idx++
      }
    }

    currentLyricIndex.value = idx
  }

  function reset() {
    currentTrack.value = null
    isPlaying.value = false
    isLoading.value = false
    currentTime.value = 0
    duration.value = 0
    lyrics.value = []
    currentLyricIndex.value = -1
  }

  return {
    currentTrack,
    playMode,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    volume,
    muted,
    lyrics,
    currentLyricIndex,
    contextType,
    contextIndex,
    contextPlaylistId,
    audioUrl,
    play,
    setPlaying,
    setCurrentTime,
    setDuration,
    setVolume,
    toggleMuted,
    setPlayMode,
    updateLyricIndex,
    reset,
  }
})
