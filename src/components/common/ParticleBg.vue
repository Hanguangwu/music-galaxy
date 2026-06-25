<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationId = 0
let audioLevel = 0

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  baseR: number
  hue: number
  a: number
}

const N = 90
let particles: Particle[] = []
const mouse = { x: 0, y: 0 }

function initParticles(w: number, h: number) {
  particles = []
  for (let i = 0; i < N; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: 1 + Math.random() * 2.5,
      baseR: 1 + Math.random() * 2.5,
      hue: 200 + Math.random() * 120,
      a: 0.22 + Math.random() * 0.3,
    })
  }
}

function tick(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const w = canvas.width
  const h = canvas.height
  ctx.clearRect(0, 0, w, h)

  const pulse = 1 + audioLevel * 2.2

  for (const p of particles) {
    p.x += p.vx
    p.y += p.vy
    p.hue += 0.08

    if (p.x < -40) p.x = w + 40
    if (p.x > w + 40) p.x = -40
    if (p.y < -40) p.y = h + 40
    if (p.y > h + 40) p.y = -40

    const dx = p.x - mouse.x
    const dy = p.y - mouse.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    const push = Math.max(0, 140 - dist) / 140
    p.x += dx * 0.011 * push
    p.y += dy * 0.011 * push

    ctx.beginPath()
    ctx.arc(p.x, p.y, p.baseR * pulse, 0, Math.PI * 2)
    const light = Math.min(80, 60 + audioLevel * 40)
    ctx.fillStyle = `hsla(${p.hue},70%,${light}%,${p.a})`
    ctx.fill()
  }

  ctx.lineWidth = 0.45
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i]
      const b = particles[j]
      const dx = a.x - b.x
      const dy = a.y - b.y
      const d = Math.sqrt(dx * dx + dy * dy)
      if (d < 100) {
        const al = 0.10 * (1 - d / 100) * (0.6 + audioLevel * 1.5)
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.strokeStyle = `rgba(120,160,255,${al})`
        ctx.stroke()
      }
    }
  }

  animationId = requestAnimationFrame(() => tick(canvas, ctx))
}

onMounted(() => {
  const cvs = canvasRef.value!
  const ctx = cvs.getContext('2d')!

  function resize() {
    const dpr = window.devicePixelRatio || 1
    cvs.width = window.innerWidth * dpr
    cvs.height = window.innerHeight * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    initParticles(window.innerWidth, window.innerHeight)
  }

  mouse.x = window.innerWidth / 2
  mouse.y = window.innerHeight / 2

  resize()
  window.addEventListener('resize', resize)
  window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY })
  window.addEventListener('touchmove', (e) => { const t = e.touches[0]; if (t) { mouse.x = t.clientX; mouse.y = t.clientY } }, { passive: true })
  window.addEventListener('touchstart', (e) => { const t = e.touches[0]; if (t) { mouse.x = t.clientX; mouse.y = t.clientY } }, { passive: true })

  tick(cvs, ctx)
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
})
</script>

<template>
  <canvas ref="canvasRef" id="bg-canvas"></canvas>
</template>

<style scoped>
#bg-canvas {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  background:
    radial-gradient(circle at 10% 0, #1b2340 0, transparent 55%),
    radial-gradient(circle at 90% 100%, #211a38 0, transparent 60%),
    #02030a;
}
</style>
