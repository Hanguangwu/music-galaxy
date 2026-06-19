export interface SearchResultItem {
  id: string
  name: string
  artist: string[]
  album: string
  source: string
  pic_id: string
  lyric_id: string
}

export interface AudioUrlResponse {
  url: string
}

export interface PicUrlResponse {
  url: string
}

export interface LyricResponse {
  lyric: string
}
