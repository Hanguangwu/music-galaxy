<script setup lang="ts">
import { ref } from 'vue'
import { formatTime } from '@/utils/format'

const props = defineProps<{
  currentTime: number
  duration: number
  volume: number
  isPlaying: boolean
}>()

const emit = defineEmits<{
  'toggle-play': []
  'seek-to': [time: number]
  'set-volume': [v: number]
  'prev-track': []
  'next-track': []
}>()

const isDragging = ref(false)
const wrapperRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)
const handleRef = ref<HTMLElement | null>(null)

function getPercent(e: MouseEvent): number {
  const el = wrapperRef.value
  if (!el) return 0
  const rect = el.getBoundingClientRect()
  return Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
}

function onWrapperClick(e: MouseEvent) {
  const pct = getPercent(e)
  emit('seek-to', pct * (props.duration || 0))
}

function onHandleDown(e: MouseEvent) {
  isDragging.value = true
  e.preventDefault()

  function onMove(me: MouseEvent) {
    if (!isDragging.value) return
    const pct = getPercent(me)
    if (progressRef.value) {
      progressRef.value.style.transform = `scaleX(${pct})`
    }
    if (handleRef.value) {
      handleRef.value.style.left = `${pct * 100}%`
    }
  }

  function onUp(me: MouseEvent) {
    if (isDragging.value) {
      const pct = getPercent(me)
      emit('seek-to', pct * (props.duration || 0))
    }
    isDragging.value = false
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
  }

  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}

function onVolumeChange(e: Event) {
  const v = parseFloat((e.target as HTMLInputElement).value)
  emit('set-volume', v)
}
</script>

<template>
  <div class="player-controls">
    <div class="progress-row">
      <span class="progress-time">{{ formatTime(currentTime) }}</span>
      <div
        ref="wrapperRef"
        class="progress-bar-wrapper"
        @click="onWrapperClick"
      >
        <div
          ref="progressRef"
          class="progress-bar"
          :style="{ transform: `scaleX(${duration ? currentTime / duration : 0})` }"
        />
        <div
          ref="handleRef"
          class="progress-handle"
          :style="{ left: `${duration ? (currentTime / duration) * 100 : 0}%` }"
          @mousedown="onHandleDown"
        />
      </div>
      <span class="progress-time">{{ formatTime(duration) }}</span>
    </div>
    <div class="control-row">
      <div class="control-main">
        <button class="btn btn-secondary btn-icon" title="Previous" @click="emit('prev-track')">⏮</button>
        <button class="btn play-btn" @click="emit('toggle-play')">
          {{ isPlaying ? '⏸' : '▶' }}
        </button>
        <button class="btn btn-secondary btn-icon" title="Next" @click="emit('next-track')">⏭</button>
      </div>
      <div class="control-secondary">
        <span>🔊</span>
        <input
          class="volume-slider"
          type="range"
          min="0"
          max="1"
          step="0.01"
          :value="volume"
          @input="onVolumeChange"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.player-controls {
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.progress-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
}
.progress-time {
  width: 42px;
  text-align: center;
  color: var(--text-sub, #a1a6d0);
  font-variant-numeric: tabular-nums;
}
.progress-bar-wrapper {
  flex: 1;
  height: 6px;
  border-radius: 999px;
  background: rgba(5, 7, 22, 0.9);
  position: relative;
  cursor: pointer;
  overflow: visible;
}
.progress-bar {
  position: absolute;
  inset: 0;
  transform-origin: left center;
  background: linear-gradient(90deg, var(--accent-pink, #ff7bb0), var(--accent-strong, #ffdd55), var(--accent-blue, #4ac8ff));
  border-radius: 999px;
}
.progress-handle {
  position: absolute;
  top: 50%;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #fffbe3;
  border: 2px solid #e6a52b;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
  z-index: 2;
  cursor: pointer;
}
.control-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}
.control-main {
  display: flex;
  align-items: center;
  gap: 6px;
}
.play-btn {
  width: 40px;
  height: 40px;
  font-size: 18px;
  border: none;
  border-radius: 999px;
  background: radial-gradient(circle at 30% 0, rgba(255, 255, 255, 0.2), var(--accent, #f5c84c));
  color: #231b08;
  cursor: pointer;
  box-shadow: 0 7px 16px rgba(245, 200, 76, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.12s ease;
}
.play-btn:active {
  transform: scale(0.95);
}
.btn-secondary {
  background: radial-gradient(circle at 30% 0, rgba(255, 255, 255, 0.05), rgba(80, 100, 180, 0.95));
  color: var(--text-main, #f5f6ff);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.8);
}
.btn-icon {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  font-size: 13px;
  cursor: pointer;
  transition: transform 0.12s ease;
}
.btn-icon:active {
  transform: scale(0.93);
}
.control-secondary {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
}
.volume-slider {
  width: 90px;
  accent-color: var(--accent, #f5c84c);
}
</style>
