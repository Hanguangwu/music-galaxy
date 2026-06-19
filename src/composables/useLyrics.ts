import { ref } from 'vue'
import type { LyricLine } from '@/types/music'

export function useLyrics() {
  const lyrics = ref<LyricLine[]>([])
  const currentIndex = ref(-1)
  const altStyle = ref(false)

  function setLyrics(lines: LyricLine[]) {
    lyrics.value = lines
    currentIndex.value = -1
  }

  function updateHighlight(time: number) {
    const lines = lyrics.value
    if (!lines.length) {
      currentIndex.value = -1
      return
    }

    let idx = currentIndex.value
    if (idx < 0 || idx >= lines.length) idx = 0

    if (time < lines[idx].time) {
      for (let i = idx - 1; i >= 0; i--) {
        if (time >= lines[i].time) {
          idx = i
          break
        }
      }
      if (time < lines[0].time) idx = -1
    } else {
      while (idx + 1 < lines.length && time >= lines[idx + 1].time) {
        idx++
      }
    }

    currentIndex.value = idx
  }

  function toggleAltStyle() {
    altStyle.value = !altStyle.value
  }

  return {
    lyrics,
    currentIndex,
    altStyle,
    setLyrics,
    updateHighlight,
    toggleAltStyle,
  }
}
