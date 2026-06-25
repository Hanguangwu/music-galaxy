<script setup lang="ts">
import type { PlaylistTab } from '@/types/music'
import { t } from '@/utils/i18n'

defineProps<{
  active: PlaylistTab
  lang: 'zh' | 'en'
}>()

const emit = defineEmits<{
  'update:active': [tab: PlaylistTab]
}>()

const tabs: { value: PlaylistTab; key: string }[] = [
  { value: 'results', key: 'tabResults' },
  { value: 'favorites', key: 'tabFavorites' },
  { value: 'playlist', key: 'tabCustomLists' },
]
</script>

<template>
  <div class="playlist-tabs">
    <div
      v-for="tab in tabs"
      :key="tab.value"
      class="playlist-tab"
      :class="{ active: active === tab.value }"
      @click="emit('update:active', tab.value)"
    >
      {{ t(tab.key, lang) }}
    </div>
  </div>
</template>

<style scoped>
.playlist-tabs {
  display: inline-flex;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 2px;
  background: rgba(0, 0, 0, 0.35);
  font-size: 11px;
}
.playlist-tab {
  padding: 3px 10px;
  border-radius: 999px;
  cursor: pointer;
  color: var(--text-sub, #a1a6d0);
}
.playlist-tab.active {
  background: radial-gradient(circle at 30% 0, rgba(255, 255, 255, 0.15), rgba(104, 174, 255, 0.9));
  color: #02040a;
  font-weight: 600;
  box-shadow: 0 0 8px rgba(104, 174, 255, 0.7);
}

@media (max-width: 480px) {
  .playlist-tabs { font-size: 10px; }
  .playlist-tab { padding: 2px 8px; }
}
</style>
