<script setup lang="ts">
import { ref, watch } from 'vue'
import type { LyricLine } from '@/types/music'
import { t } from '@/utils/i18n'

const props = defineProps<{
  lyrics: LyricLine[]
  currentIndex: number
  altStyle: boolean
  isPlaying: boolean
  trackTitle: string
  trackArtist: string
  lang: 'zh' | 'en'
}>()

const containerRef = ref<HTMLElement | null>(null)

watch(
  () => props.currentIndex,
  (idx) => {
    const container = containerRef.value
    if (!container || idx < 0) return
    const line = container.querySelector(`[data-lyric-idx="${idx}"]`) as HTMLElement | null
    if (!line) return
    const target = line.offsetTop - container.clientHeight * 0.45
    container.scrollTo({ top: target, behavior: 'smooth' })
  },
)
</script>

<template>
  <div
    ref="containerRef"
    class="lyrics-container"
    :class="{ 'alt-style': altStyle }"
  >
    <div class="lyrics-inner">
      <div class="lyrics-title-line">
        {{ trackTitle }}{{ trackArtist ? ' - ' + trackArtist : '' }}
      </div>
      <template v-if="lyrics.length">
        <div
          v-for="(line, idx) in lyrics"
          :key="idx"
          :data-lyric-idx="idx"
          class="lyrics-line"
          :class="{ active: idx === currentIndex }"
        >
          {{ line.text }}
        </div>
      </template>
      <div v-else class="lyrics-empty">
        {{ t("lyricsEmpty", lang) }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.lyrics-container {
  flex: 1;
  min-height: 0;
  margin-top: 6px;
  padding: 10px 18px 8px;
  border-radius: 16px;
  background:
    radial-gradient(circle at 50% 0, rgba(255, 220, 150, 0.26), transparent 60%),
    radial-gradient(circle at 10% 100%, rgba(107, 150, 255, 0.26), transparent 60%),
    rgba(4, 6, 20, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.16);
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.9);
}
.lyrics-container::before,
.lyrics-container::after {
  content: "";
  position: absolute;
  pointer-events: none;
  mix-blend-mode: screen;
}
.lyrics-container::before {
  inset: -25%;
  background: conic-gradient(
    from 0deg,
    rgba(255, 214, 102, 0.08),
    rgba(255, 214, 102, 0.38),
    rgba(104, 184, 255, 0.38),
    rgba(186, 132, 255, 0.4),
    rgba(255, 214, 102, 0.08)
  );
  opacity: 0.46;
  filter: blur(14px);
  animation: glowRotate 16s linear infinite;
}
.lyrics-container.alt-style::before {
  background: conic-gradient(
    from 0deg,
    rgba(104, 184, 255, 0.14),
    rgba(186, 132, 255, 0.4),
    rgba(255, 214, 102, 0.32),
    rgba(104, 184, 255, 0.46),
    rgba(186, 132, 255, 0.4)
  );
}
.lyrics-container::after {
  top: -40%;
  left: -20%;
  width: 70%;
  height: 150%;
  background: linear-gradient(
    120deg,
    rgba(255, 248, 170, 0),
    rgba(255, 248, 170, 0.36),
    rgba(161, 233, 255, 0)
  );
  transform: translateX(-130%);
  animation: sweep 7s linear infinite;
  opacity: 0.95;
}
@keyframes glowRotate {
  to { transform: rotate(360deg); }
}
@keyframes sweep {
  0% { transform: translateX(-130%); }
  50% { transform: translateX(40%); }
  100% { transform: translateX(130%); }
}
.lyrics-inner {
  position: relative;
  z-index: 1;
  padding: 2px 4px 10px;
  text-align: center;
  max-width: 540px;
  margin: 0 auto;
}
.lyrics-title-line {
  font-size: 14px;
  color: var(--text-sub, #a1a6d0);
  margin-bottom: 8px;
  letter-spacing: 0.05em;
}
.lyrics-line {
  font-size: 17px;
  color: rgba(196, 199, 235, 0.78);
  margin: 4px 0;
  opacity: 0.52;
  transition: transform 0.25s ease, color 0.25s ease, text-shadow 0.25s ease, opacity 0.25s ease;
  white-space: normal;
  letter-spacing: 0.04em;
}
.lyrics-line.active {
  opacity: 1;
  transform: scale(1.14);
  background: linear-gradient(120deg, #ffe6a7, #ff9bd4, #8fd5ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow:
    0 0 10px rgba(255, 255, 255, 0.7),
    0 0 22px rgba(245, 200, 76, 0.9),
    0 0 30px rgba(106, 207, 255, 1);
}
.lyrics-empty {
  font-size: 15px;
  color: var(--text-sub, #a1a6d0);
  margin-top: 18px;
  letter-spacing: 0.03em;
}
</style>
