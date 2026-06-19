import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Track, Playlist, PlaylistTab } from '@/types/music'

const STORAGE_KEY = 'music-galaxy-playlists'

function loadPlaylists(): Playlist[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function savePlaylists(playlists: Playlist[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(playlists))
  } catch {
    // localStorage full or unavailable
  }
}

export const usePlaylistStore = defineStore('playlist', () => {
  const favorites = ref<Track[]>([])
  const customPlaylists = ref<Playlist[]>(loadPlaylists())
  const activeTab = ref<PlaylistTab>('results')
  const selectedPlaylistId = ref<string | null>(null)

  const selectedPlaylist = computed(() =>
    customPlaylists.value.find((p) => p.id === selectedPlaylistId.value) ?? null,
  )

  function toggleFavorite(track: Track): boolean {
    const idx = favorites.value.findIndex((t) => t.uid === track.uid)
    if (idx >= 0) {
      favorites.value.splice(idx, 1)
      return false
    }
    favorites.value.push(track)
    return true
  }

  function isFavorite(track: Track): boolean {
    return favorites.value.some((t) => t.uid === track.uid)
  }

  function createPlaylist(name: string): Playlist {
    const pl: Playlist = {
      id: `pl-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      name,
      tracks: [],
    }
    customPlaylists.value.push(pl)
    selectedPlaylistId.value = pl.id
    savePlaylists(customPlaylists.value)
    return pl
  }

  function deletePlaylist(id: string) {
    const idx = customPlaylists.value.findIndex((p) => p.id === id)
    if (idx >= 0) {
      customPlaylists.value.splice(idx, 1)
      if (selectedPlaylistId.value === id) {
        selectedPlaylistId.value = customPlaylists.value[0]?.id ?? null
      }
      savePlaylists(customPlaylists.value)
    }
  }

  function addToPlaylist(playlistId: string, track: Track): boolean {
    const pl = customPlaylists.value.find((p) => p.id === playlistId)
    if (!pl) return false
    if (pl.tracks.some((t) => t.uid === track.uid)) return false
    pl.tracks.push(track)
    savePlaylists(customPlaylists.value)
    return true
  }

  function removeFromPlaylist(playlistId: string, trackUid: string) {
    const pl = customPlaylists.value.find((p) => p.id === playlistId)
    if (!pl) return
    const idx = pl.tracks.findIndex((t) => t.uid === trackUid)
    if (idx >= 0) {
      pl.tracks.splice(idx, 1)
      savePlaylists(customPlaylists.value)
    }
  }

  function getTracksForTab(tab: PlaylistTab): Track[] {
    if (tab === 'results') return []
    if (tab === 'favorites') return favorites.value
    const pl = selectedPlaylist.value
    return pl ? pl.tracks : []
  }

  return {
    favorites,
    customPlaylists,
    activeTab,
    selectedPlaylistId,
    selectedPlaylist,
    toggleFavorite,
    isFavorite,
    createPlaylist,
    deletePlaylist,
    addToPlaylist,
    removeFromPlaylist,
    getTracksForTab,
  }
})
