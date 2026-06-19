<script setup lang="ts">
defineProps<{
  message: string
  visible: boolean
}>()
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" id="toast" :class="{ show: visible }">
      {{ message }}
    </div>
  </Teleport>
</template>

<style scoped>
#toast {
  position: fixed;
  left: 50%;
  bottom: 18px;
  transform: translateX(-50%);
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(8, 10, 26, 0.96);
  border: 1px solid rgba(255, 255, 255, 0.15);
  font-size: 11px;
  color: var(--text-main, #f5f6ff);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.9);
  z-index: 1500;
  animation: toastIn 0.2s ease forwards;
  white-space: nowrap;
}

@keyframes toastIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
</style>
