<script setup lang="ts">
const RIPPLE_DURATION = 800

function onPointerDown(e: PointerEvent) {
  const el = e.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const max = Math.max(rect.width, rect.height)

  const outer = document.createElement('span')
  outer.className = 'ripple-circle'
  outer.style.left = x + 'px'
  outer.style.top = y + 'px'
  outer.style.width = outer.style.height = max * 2 + 'px'

  const inner = document.createElement('span')
  inner.className = 'ripple-circle-inner'
  inner.style.left = x + 'px'
  inner.style.top = y + 'px'
  inner.style.width = inner.style.height = max * 1.4 + 'px'

  el.appendChild(outer)
  el.appendChild(inner)
  setTimeout(() => outer.remove(), RIPPLE_DURATION)
  setTimeout(() => inner.remove(), RIPPLE_DURATION)
}
</script>

<template>
  <span class="ripple-target" @pointerdown="onPointerDown">
    <slot />
  </span>
</template>

<style scoped>
.ripple-target {
  position: relative;
  overflow: hidden;
  display: inline-block;
}

:deep(.ripple-circle),
:deep(.ripple-circle-inner) {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%) scale(0);
  opacity: 0.9;
  z-index: 20;
}

:deep(.ripple-circle) {
  border: 2px solid rgba(255, 223, 140, 0.85);
  box-shadow: 0 0 14px rgba(255, 223, 140, 0.9);
  background: radial-gradient(circle, rgba(255, 250, 220, 0.45), rgba(255, 223, 140, 0));
  animation: rippleOuter 0.75s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
}

:deep(.ripple-circle-inner) {
  border: 1px solid rgba(130, 196, 255, 0.9);
  box-shadow: 0 0 16px rgba(130, 196, 255, 0.9);
  background: radial-gradient(circle, rgba(255, 255, 255, 0.35), rgba(102, 196, 255, 0));
  animation: rippleInner 0.75s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
  z-index: 19;
}

@keyframes rippleOuter {
  to {
    transform: translate(-50%, -50%) scale(2.4);
    opacity: 0;
  }
}

@keyframes rippleInner {
  to {
    transform: translate(-50%, -50%) scale(1.7);
    opacity: 0;
  }
}
</style>
