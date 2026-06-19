import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Track, MusicSource } from '@/types/music'
import { searchMusic } from '@/api'
import { usePlayerStore } from './player'

export const useSearchStore = defineStore('search', () => {
  const keyword = ref('')
  const results = ref<Track[]>([])
  const loading = ref(false)
  const enabledSources = ref<MusicSource[]>([
    'netease', 'tencent', 'migu',
  ])
  const perSourceLimit = ref(10)
  const noMoreResults = ref(false)

  function generateUid(source: MusicSource, id: string): string {
    return `${source}-${id}`
  }

  async function doSearch(reset = true) {
    const kw = keyword.value.trim()
    if (!kw) return

    loading.value = true
    if (reset) {
      results.value = []
      noMoreResults.value = false
    }

    const sources = enabledSources.value
    if (sources.length === 0) {
      loading.value = false
      return
    }

    const promises = sources.map((src) =>
      searchMusic(src, kw, perSourceLimit.value).then((items) =>
        items.map(
          (item): Track => ({
            uid: generateUid(src, item.id),
            id: item.id,
            name: item.name,
            artist: item.artist,
            album: item.album,
            source: src,
            picId: item.pic_id,
            lyricId: item.lyric_id,
          }),
        ),
      ),
    )

    try {
      const batches = await Promise.allSettled(promises)
      const newTracks: Track[] = []
      const existingUids = new Set(reset ? [] : results.value.map((t) => t.uid))

      for (const batch of batches) {
        if (batch.status === 'fulfilled') {
          for (const track of batch.value) {
            if (!existingUids.has(track.uid)) {
              existingUids.add(track.uid)
              newTracks.push(track)
            }
          }
        }
      }

      if (reset) {
        results.value = newTracks
      } else {
        results.value.push(...newTracks)
      }

      if (newTracks.length === 0) {
        noMoreResults.value = true
      }

      // Auto-play first result if nothing is playing
      const playerStore = usePlayerStore()
      if (!playerStore.currentTrack && results.value.length > 0) {
        playerStore.play(results.value[0], 'results', 0)
      }
    } catch {
      // Error handled per-source via allSettled
    } finally {
      loading.value = false
    }
  }

  async function loadMore() {
    if (loading.value || noMoreResults.value) return
    perSourceLimit.value += 10
    await doSearch(false)
  }

  function toggleSource(source: MusicSource) {
    const idx = enabledSources.value.indexOf(source)
    if (idx >= 0) {
      enabledSources.value.splice(idx, 1)
    } else {
      enabledSources.value.push(source)
    }
  }

  function setSources(sources: MusicSource[]) {
    enabledSources.value = sources
  }

  return {
    keyword,
    results,
    loading,
    enabledSources,
    perSourceLimit,
    noMoreResults,
    doSearch,
    loadMore,
    toggleSource,
    setSources,
  }
})
