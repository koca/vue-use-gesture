<template>
  <div id="app" class="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
    <h3
      class="text-clip text-5xl font-bold py-4 bg-gradient-to-r from-red-400 via-yellow-500 to-teal-500"
      :style="{ backgroundPositionX: springObject.x * 100 + '%' }"
    >
      move it, zoom it, drag it, scroll it, pinch it
    </h3>
    <p class="text-gray-700 absolute bottom-0 right-0">{{ springObject.x }}</p>
  </div>
</template>
<script>
import './assets/editorstyle.css'
import { useMove, useSpring } from 'vue-use-gesture'
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  setup() {
    const springObject = useSpring({ x: 0 })

    useMove(
      // xy: [x,y] for the y
      ({ xy: [x] }) => {
        springObject.x = x / window.innerWidth
      },
      {
        domTarget: typeof window === 'object' ? window : null,
      }
    )

    return {
      springObject,
    }
  },
})
</script>

<style>
.text-clip {
  background-size: 400% 400%;
  background-clip: text;
  text-fill-color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
