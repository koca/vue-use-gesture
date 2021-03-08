<template>
  <div id="app" class="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
    <h3 class="font-bold text-yellow-500 text-xl py-4">Pinch Me (zoom, rotate etc)</h3>
    <div v-on="bind()" class="drag transform" ref="domTarget" :style="style"></div>
    <pre class="text-gray-700 absolute top-0 left-0">{{ springObject }}</pre>
  </div>
</template>
<script>
import './assets/editorstyle.css'
import { usePinch, useSpring } from 'vue-use-gesture'
import { computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  setup() {
    const springObject = useSpring({ rotate: 0, scale: 1 })
    const style = computed(() => {
      return {
        transform: `rotate(${springObject.rotate}deg) scale(${springObject.scale})`,
        transformOrigin: `100px 100px`,
      }
    })
    const bind = usePinch(({ offset: [d, a] }) => {
      springObject.scale = 1 + d / 200
      springObject.rotate = a
    })

    return {
      bind,
      style,
      springObject,
    }
  },
})
</script>

<style>
.drag {
  position: relative;
  width: 200px;
  height: 200px;
  background: grey;
  border-radius: 5px;
  box-shadow: 0px 10px 30px -5px rgba(0, 0, 0, 0.3);
  transition: box-shadow 0.5s, opacity 0.5s;
  will-change: transform;
  border: 10px solid white;
  cursor: grab;
  overflow: hidden;
  touch-action: none;
}
</style>
