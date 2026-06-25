<script setup lang="ts">
import { SUPPORTED_SOURCES, type MusicSource } from '@/types/music'
import { t } from '@/utils/i18n'

const props = defineProps<{
  sources: MusicSource[]
  lang: 'zh' | 'en'
}>()

const emit = defineEmits<{
  'update:sources': [sources: MusicSource[]]
}>()

function toggle(source: MusicSource) {
  const idx = props.sources.indexOf(source)
  if (idx >= 0) {
    emit('update:sources', props.sources.filter((s) => s !== source))
  } else {
    emit('update:sources', [...props.sources, source])
  }
}

function toggleAll() {
  if (props.sources.length === SUPPORTED_SOURCES.length) {
    emit('update:sources', [])
  } else {
    emit('update:sources', SUPPORTED_SOURCES.map((s) => s.value))
  }
}

const allSelected = SUPPORTED_SOURCES.every((s) => props.sources.includes(s.value))
</script>

<template>
  <div class="source-row">
    <label class="source-chip" @click.prevent="toggleAll">
      <span>{{ allSelected ? t('sourceNone', lang) : t('sourceAll', lang) }}</span>
    </label>
    <label
      v-for="src in SUPPORTED_SOURCES"
      :key="src.value"
      class="source-chip"
    >
      <span
        class="source-dot"
        :style="{ background: `var(--src-${src.value})`, color: `var(--src-${src.value})` }"
      />
      <input
        type="checkbox"
        :checked="sources.includes(src.value)"
        @change="toggle(src.value)"
      />
      <span>{{ lang === 'zh' ? src.labelZh : src.labelEn }}</span>
    </label>
  </div>
</template>

<style scoped>
.source-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  font-size: 11px;
}
.source-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 999px;
  background: rgba(4, 6, 20, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.16);
  cursor: pointer;
  user-select: none;
}
.source-chip input {
  margin: 0;
  width: 12px;
  height: 12px;
  accent-color: var(--accent, #f5c84c);
  cursor: pointer;
}
.source-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  box-shadow: 0 0 6px currentColor;
}

@media (max-width: 768px) {
  .source-chip { padding: 3px 7px; }
}
@media (max-width: 480px) {
  .source-row { gap: 4px; }
  .source-chip { font-size: 10px; padding: 3px 6px; gap: 3px; }
  .source-chip input { width: 10px; height: 10px; }
  .source-dot { width: 6px; height: 6px; }
}
</style>
