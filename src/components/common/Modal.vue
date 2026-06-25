<script setup lang="ts">
defineProps<{
  show: boolean
  title: string
}>()

const emit = defineEmits<{
  close: []
}>()

function onBackdropClick(e: MouseEvent) {
  if ((e.target as HTMLElement)?.classList.contains('modal-backdrop')) {
    emit('close')
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="modal-backdrop show"
      @click="onBackdropClick"
    >
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title-wrap">
            <div class="modal-title-icon">🎵</div>
            <span>{{ title }}</span>
          </div>
          <button class="modal-close-btn" @click="emit('close')">×</button>
        </div>
        <div class="modal-body">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(5, 7, 20, 0.86);
  backdrop-filter: blur(18px);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}
.modal-backdrop.show {
  display: flex;
}
.modal {
  background:
    radial-gradient(circle at 0 0, rgba(255, 255, 255, 0.08), transparent 60%),
    rgba(10, 14, 40, 0.98);
  border-radius: 18px;
  padding: 16px 20px 14px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.9);
  max-width: 380px;
  width: 92%;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.18);
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  margin-bottom: 6px;
  color: var(--text-main, #f5f6ff);
}
.modal-title-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
}
.modal-title-icon {
  width: 22px;
  height: 22px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  background: radial-gradient(circle at 30% 0, rgba(255, 255, 255, 0.32), rgba(255, 217, 140, 0.9));
  box-shadow: 0 0 10px rgba(255, 217, 140, 0.8);
}
.modal-close-btn {
  border: none;
  background: transparent;
  color: #aaa;
  font-size: 18px;
  cursor: pointer;
}
.modal-body {
  color: var(--text-main, #f5f6ff);
}

@media (max-width: 768px) {
  .modal { max-width: 88%; }
}
@media (max-width: 480px) {
  .modal { max-width: 96%; padding: 14px 14px 12px; border-radius: 14px; }
  .modal-header { font-size: 13px; }
  .modal-title-icon { width: 20px; height: 20px; font-size: 12px; }
  .modal-close-btn { font-size: 16px; }
}
</style>
