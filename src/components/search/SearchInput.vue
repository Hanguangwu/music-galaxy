<script setup lang="ts">
import { t } from '@/utils/i18n'

const props = defineProps<{
  modelValue: string
  lang: 'zh' | 'en'
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  search: []
}>()

function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    emit('search')
  }
}
</script>

<template>
  <div class="search-row">
    <span class="search-prefix">🔍</span>
    <input
      class="input"
      type="text"
      :placeholder="t('searchPlaceholder', lang)"
      :value="modelValue"
      @input="onInput"
      @keydown="onKeydown"
    />
    <button class="btn" @click="emit('search')">
      {{ t('searchButton', lang) }}
    </button>
  </div>
</template>

<style scoped>
.search-row {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 2px 2px 2px 10px;
  border-radius: 999px;
  background:
    radial-gradient(circle at 0 0, rgba(255, 255, 255, 0.18), transparent 60%),
    radial-gradient(circle at 100% 100%, rgba(104, 174, 255, 0.25), transparent 60%),
    rgba(4, 6, 20, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.9);
}
.search-prefix {
  font-size: 14px;
  margin-right: 6px;
  color: var(--accent-strong, #ffdd55);
  text-shadow: 0 0 8px rgba(245, 200, 76, 0.9);
}
.input {
  flex: 1;
  padding: 7px 10px;
  border: none;
  background: transparent;
  color: var(--text-main, #f5f6ff);
  font-size: 13px;
  outline: none;
  box-shadow: none;
  padding-left: 0;
}
.input::placeholder {
  color: var(--text-sub, #a1a6d0);
}
.btn {
  margin-left: 4px;
  border-radius: 999px;
  border: none;
  border-radius: 999px;
  padding: 6px 13px;
  background: radial-gradient(circle at 30% 0, rgba(255, 255, 255, 0.2), var(--accent, #f5c84c));
  color: #231b08;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 7px 16px rgba(245, 200, 76, 0.75);
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}
.btn:active {
  transform: translateY(1px) scale(0.97);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.85);
}
</style>
