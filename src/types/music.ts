export type MusicSource =
  | 'kuwo' | 'netease' | 'tencent' | 'tidal' | 'spotify'
  | 'ytmusic' | 'qobuz' | 'joox' | 'deezer' | 'migu'
  | 'kugou' | 'ximalaya' | 'apple'

export const SUPPORTED_SOURCES: { value: MusicSource; labelZh: string; labelEn: string }[] = [
  { value: 'kuwo', labelZh: '酷我音乐', labelEn: 'Kuwo' },
  { value: 'netease', labelZh: '网易云音乐', labelEn: 'Netease' },
  { value: 'tencent', labelZh: 'QQ音乐', labelEn: 'QQ Music' },
  { value: 'tidal', labelZh: 'Tidal', labelEn: 'Tidal' },
  { value: 'spotify', labelZh: 'Spotify', labelEn: 'Spotify' },
  { value: 'ytmusic', labelZh: 'YouTube Music', labelEn: 'YouTube Music' },
  { value: 'qobuz', labelZh: 'Qobuz', labelEn: 'Qobuz' },
  { value: 'joox', labelZh: 'JOOX音乐', labelEn: 'JOOX' },
  { value: 'deezer', labelZh: 'Deezer', labelEn: 'Deezer' },
  { value: 'migu', labelZh: '咪咕音乐', labelEn: 'Migu' },
  { value: 'kugou', labelZh: '酷狗音乐', labelEn: 'Kugou' },
  { value: 'ximalaya', labelZh: '喜马拉雅', labelEn: 'Ximalaya' },
  { value: 'apple', labelZh: 'Apple Music', labelEn: 'Apple Music' },
]

export interface Track {
  uid: string
  id: string
  name: string
  artist: string[]
  album: string
  source: MusicSource
  picId: string
  lyricId: string
  /** Lazy-loaded */
  audioUrl?: string
  coverUrl?: string
  lyric?: string
  loading?: boolean
}

export interface Playlist {
  id: string
  name: string
  tracks: Track[]
}

export type PlayMode = 'list' | 'single' | 'shuffle'

export type PlaylistTab = 'results' | 'favorites' | 'playlist'

export interface PlayContext {
  type: PlaylistTab
  index: number
  playlistId: string | null
}

export interface LyricLine {
  time: number
  text: string
}
