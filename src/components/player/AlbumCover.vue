<script setup lang="ts">
defineProps<{
  coverUrl: string
  isPlaying: boolean
}>()
</script>

<template>
  <div class="cover-wrapper">
    <img v-if="coverUrl" :src="coverUrl" alt="cover" class="cover-img" />
    <div v-else class="cover-placeholder">
      <div class="cover-disc" :class="{ spinning: isPlaying }" />
      <div class="cover-hint">🎵</div>
    </div>
  </div>
</template>

<style scoped>
.cover-wrapper {
  width: 130px;
  height: 130px;
  border-radius: 18px;
  overflow: hidden;
  background: radial-gradient(circle at 30% 0, #34344b, #151628);
  box-shadow:
    0 14px 30px rgba(0, 0, 0, 0.9),
    0 0 18px rgba(245, 200, 76, 0.75);
  flex-shrink: 0;
  position: relative;
}
.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.cover-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: var(--text-sub, #a1a6d0);
  font-size: 12px;
}
.cover-disc {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: 10px solid rgba(0, 0, 0, 0.7);
  background: radial-gradient(circle, #16141f 0%, #000 45%, #222 70%, #000 100%);
  position: relative;
}
.cover-disc.spinning {
  animation: disc-spin 12s linear infinite;
}
.cover-disc::before {
  content: "";
  position: absolute;
  inset: 24%;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 0, var(--accent-pink, #ff7bb0), #b546b8, #5a2a7c);
}
.cover-disc::after {
  content: "";
  position: absolute;
  inset: 42%;
  border-radius: 50%;
  background: #05050a;
}
.cover-hint {
  font-size: 18px;
}
@keyframes disc-spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .cover-wrapper { width: 100px; height: 100px; }
}
@media (max-width: 480px) {
  .cover-wrapper { width: 80px; height: 80px; border-radius: 14px; }
  .cover-disc { width: 50px; height: 50px; border-width: 7px; }
}
</style>
