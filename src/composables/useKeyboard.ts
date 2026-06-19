import { onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'

interface KeyboardOptions {
  togglePlay: () => void
  seek: (time: number) => void
  setVolume: (v: number) => void
  playNext: (dir: 'next' | 'prev') => void
  toggleFavorite: () => void
  toggleLyricsAlt: () => void
  toggleMuted: () => void
  searchInputRef: Ref<HTMLInputElement | null>
}

export function useKeyboard(options: KeyboardOptions) {
  function handleKeydown(e: KeyboardEvent) {
    const tag = (e.target as HTMLElement)?.tagName.toLowerCase()
    const typing = tag === 'input' || tag === 'textarea'
    const modalOpen = document.querySelector('.modal-backdrop.show') !== null

    if (e.key === 'Escape') {
      const modals = document.querySelectorAll('.modal-backdrop.show')
      modals.forEach((m) => m.classList.remove('show'))
      return
    }

    if (modalOpen) return

    switch (e.code) {
      case 'Space':
        if (!typing) {
          e.preventDefault()
          options.togglePlay()
        }
        break
      case 'ArrowRight':
        if (!typing) options.seek(5)
        break
      case 'ArrowLeft':
        if (!typing) options.seek(-5)
        break
      case 'ArrowUp':
        if (!typing) options.setVolume(0.05)
        break
      case 'ArrowDown':
        if (!typing) options.setVolume(-0.05)
        break
    }

    if (!typing) {
      switch (e.key.toLowerCase()) {
        case 'n':
          options.playNext('next')
          break
        case 'p':
          options.playNext('prev')
          break
        case 'f':
          options.toggleFavorite()
          break
        case 'l':
          options.toggleLyricsAlt()
          break
        case 'm':
          options.toggleMuted()
          break
      }
    }

    if (e.key === '/' && !typing) {
      e.preventDefault()
      options.searchInputRef.value?.focus()
      options.searchInputRef.value?.select()
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
}
