<script setup lang="ts">
import { t } from '@/utils/i18n'

defineProps<{
  lang: 'zh' | 'en'
}>()
</script>

<template>
  <footer>
    {{ t('footerText', lang) }}
  </footer>
</template>

<style scoped>
footer {
  font-size: 10px;
  color: var(--text-sub, #a1a6d0);
  text-align: right;
  padding: 0 4px 2px;
  flex-shrink: 0;
}
</style>
