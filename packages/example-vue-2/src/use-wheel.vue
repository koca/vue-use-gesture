<template>
  <div id="app" class="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
    <div class="fixed w-4 p-4 left-0 top-0 text-gray-700">{{ index }}</div>

    <div class="LethargyWheel w-full sm:w-1/2">
      <div ref="refElement" :style="{ transform: `translateY(${-index * 330}px)` }">
        <div :key="i" v-for="i in slides">{{ i }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import './assets/editorstyle.css'
import { useWheel } from 'vue-use-gesture'
import { defineComponent, ref } from '@vue/composition-api'
import { Lethargy } from 'lethargy'

const clamp = (value, min, max) => Math.max(Math.min(max, value), min)

const slides = [0, 1, 2, 3, 4, 5]
const lethargy = new Lethargy()

export default defineComponent({
  setup() {
    const index = ref(0)
    const refElement = ref(null)

    useWheel(
      ({ event, last, memo: wait = false }) => {
        if (last) return
        event.preventDefault()
        event.stopPropagation()
        const s = lethargy.check(event)
        if (s) {
          if (!wait) index.value = clamp(index.value - s, 0, slides.length - 1)
          return true
        }
        return false
      },
      { domTarget: refElement, eventOptions: { passive: false } }
    )

    return {
      slides,
      index,
      refElement,
    }
  },
})
</script>

<style>
.LethargyWheel {
  overflow: hidden;
  height: 400px;
  align-items: flex-start;
  justify-content: center;
  padding: 30px 0 0 0;
  touch-action: none;
}

.LethargyWheel > div {
  width: 80%;
  transition: transform 350ms ease-in-out;
}

.LethargyWheel > div > div {
  border-radius: 4px;
  font-size: 50px;
  color: white;
  min-height: 320px;
  width: 100%;
  background-color: royalblue;
  margin: 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
</style>
