<script setup lang="ts">
import { t } from '@/utils/i18n'

const props = defineProps<{
  lang: 'zh' | 'en'
}>()

const emit = defineEmits<{
  'lang-change': [lang: 'zh' | 'en']
  'toggle-shortcuts': []
}>()
</script>

<template>
  <header class="ripple-target">
    <div class="logo-area">
      <div class="galaxy-box ripple-target">
        <div class="galaxy-icon">🎵</div>
      </div>
      <div class="title-text">
        <h1>{{ t('appTitle', lang) }}</h1>
        <p>{{ t('appSubtitle', lang) }}</p>
      </div>
    </div>
    <div class="header-controls">
      <div class="lang-toggle ripple-target">
        <button
          class="lang-btn"
          :class="{ active: lang === 'zh' }"
          @click="emit('lang-change', 'zh')"
        >中</button>
        <button
          class="lang-btn"
          :class="{ active: lang === 'en' }"
          @click="emit('lang-change', 'en')"
        >EN</button>
      </div>
      <div class="shortcut-hint" v-text="t('shortcutHint', lang)" />
      <button
        id="shortcut-toggle-btn"
        class="shortcut-toggle-btn ripple-target"
        :title="t('appTitle', lang)"
        @click="emit('toggle-shortcuts')"
      >⌨️</button>
    </div>
  </header>
</template>

<style scoped>
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  border-radius: 18px;
  background: linear-gradient(120deg, rgba(255, 255, 255, 0.06), rgba(7, 10, 30, 0.9));
  border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.12));
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.8);
  min-height: 64px;
  flex-shrink: 0;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 10px;
}

.galaxy-box {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  padding: 4px;
  background:
    radial-gradient(circle at 30% 0, rgba(255, 255, 255, 0.65), rgba(255, 230, 140, 1)),
    radial-gradient(circle at 70% 100%, rgba(150, 200, 255, 0.9), rgba(130, 220, 255, 0.9));
  box-shadow:
    0 0 18px rgba(130, 200, 255, 1),
    0 14px 28px rgba(0, 0, 0, 0.95);
  border: 2px solid rgba(190, 230, 255, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: float 2.4s ease-in-out infinite;
}

.galaxy-icon {
  font-size: 32px;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.title-text h1 {
  margin: 0;
  font-size: 18px;
  letter-spacing: 1px;
  text-shadow:
    0 0 12px rgba(130, 200, 255, 0.9),
    0 0 26px rgba(100, 180, 255, 0.7);
}

.title-text p {
  margin: 2px 0 0;
  font-size: 11px;
  color: var(--text-sub, #a1a6d0);
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 11px;
  color: var(--text-sub, #a1a6d0);
}

.lang-toggle {
  display: inline-flex;
  border-radius: 999px;
  padding: 2px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(0, 0, 0, 0.4);
}

.lang-btn {
  border: none;
  background: transparent;
  padding: 3px 10px;
  border-radius: 999px;
  color: var(--text-sub, #a1a6d0);
  font-size: 11px;
  cursor: pointer;
}

.lang-btn.active {
  background: radial-gradient(circle at 30% 0, rgba(255, 255, 255, 0.28), var(--accent, #f5c84c));
  color: #231b08;
  font-weight: 600;
  box-shadow: 0 0 8px rgba(245, 200, 76, 0.8);
}

.shortcut-hint {
  max-width: 260px;
  text-align: right;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.shortcut-toggle-btn {
  border: none;
  border-radius: 999px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  color: var(--text-sub, #a1a6d0);
  cursor: pointer;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.9);
  font-size: 15px;
}

@media (max-width: 860px) {
  header {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
  .header-controls {
    width: 100%;
    justify-content: space-between;
  }
  .shortcut-hint {
    display: none;
  }
}
@media (max-width: 768px) {
  .galaxy-box { width: 52px; height: 52px; }
  .galaxy-icon { font-size: 24px; }
  .title-text h1 { font-size: 15px; }
  header { min-height: 52px; padding: 6px 12px; }
  .header-controls { gap: 8px; }
}
@media (max-width: 480px) {
  .galaxy-box { width: 40px; height: 40px; }
  .galaxy-icon { font-size: 20px; }
  .title-text h1 { font-size: 13px; }
  .title-text p { display: none; }
  header { padding: 4px 8px; min-height: 44px; }
  .header-controls { gap: 6px; }
  .lang-btn { font-size: 10px; padding: 2px 8px; }
  .shortcut-toggle-btn { width: 24px; height: 24px; font-size: 13px; }
  .logo-area { gap: 6px; }
}
</style>
