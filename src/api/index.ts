import type { MusicSource } from '@/types/music'
import type { SearchResultItem, AudioUrlResponse, PicUrlResponse, LyricResponse } from './types'

const API_BASE = 'https://music-api.gdstudio.xyz/api.php'

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export async function searchMusic(
  source: MusicSource,
  keyword: string,
  count = 10,
  page = 1,
): Promise<SearchResultItem[]> {
  const url = `${API_BASE}?types=search&source=${source}&name=${encodeURIComponent(keyword)}&count=${count}&pages=${page}`
  const data = await fetchJson<SearchResultItem[]>(url)
  return data
}

export async function getAudioUrl(
  source: MusicSource,
  id: string,
  br = 128,
): Promise<string> {
  const url = `${API_BASE}?types=url&source=${source}&id=${id}&br=${br}`
  const data = await fetchJson<AudioUrlResponse>(url)
  return data.url
}

export async function getCoverUrl(
  source: MusicSource,
  picId: string,
  size = 300,
): Promise<string> {
  const url = `${API_BASE}?types=pic&source=${source}&id=${picId}&size=${size}`
  const data = await fetchJson<PicUrlResponse>(url)
  return data.url
}

export async function getLyric(
  source: MusicSource,
  lyricId: string,
): Promise<string> {
  const url = `${API_BASE}?types=lyric&source=${source}&id=${lyricId}`
  const data = await fetchJson<LyricResponse>(url)
  return data.lyric
}

/**
 * Build a proxied URL for audio playback.
 * If the URL is HTTP and the page is HTTPS, try to rewrite to HTTPS first,
 * or fall back to the local dev proxy.
 */
export function buildAudioUrl(rawUrl: string): string {
  if (!rawUrl) return ''
  try {
    const parsed = new URL(rawUrl)
    // If already HTTPS, use directly
    if (parsed.protocol === 'https:') return rawUrl
    // If HTTP, try upgrading to HTTPS
    if (parsed.protocol === 'http:' && window.location.protocol === 'https:') {
      parsed.protocol = 'https:'
      return parsed.toString()
    }
    // For local dev with HTTP, use Vite proxy
    if (parsed.protocol === 'http:' && window.location.hostname === 'localhost') {
      return `/proxy?target=${encodeURIComponent(rawUrl)}`
    }
    return rawUrl
  } catch {
    return rawUrl
  }
}
