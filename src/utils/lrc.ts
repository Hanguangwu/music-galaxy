import type { LyricLine } from '@/types/music'

export function parseLRC(lrcText: string): LyricLine[] {
  if (!lrcText || !lrcText.trim()) return []

  const lines = lrcText.trim().split('\n')
  const result: LyricLine[] = []
  const regex = /\[(\d{1,2}):(\d{1,2})(?:\.(\d{1,3}))?\]/

  for (const line of lines) {
    const match = regex.exec(line)
    if (!match) continue

    const min = parseInt(match[1], 10) || 0
    const sec = parseInt(match[2], 10) || 0
    const ms = match[3] ? parseInt(match[3].padEnd(3, '0'), 10) : 0
    const time = min * 60 + sec + ms / 1000
    const text = line.replace(regex, '').trim()

    if (text) {
      result.push({ time, text })
    }
  }

  result.sort((a, b) => a.time - b.time)
  return result
}
