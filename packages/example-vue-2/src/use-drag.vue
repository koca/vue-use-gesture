<template>
  <div id="app" class="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
    <div class="area w-20 h-20 bg-blue-300 rounded-2xl" ref="refEl" :style="transformStyle"></div>
  </div>
</template>
<script>
import { useDrag, useSpring } from 'vue-use-gesture'
import { defineComponent, computed, ref } from '@vue/composition-api'

export default defineComponent({
  setup() {
    const refEl = ref()
    const transform = useSpring({ x: 0, y: 0 })

    // bind doesn't work for vue 2 bec of event names we can change listener names using vue-demi
    const bind = useDrag(
      ({ down, movement: [mx, my] }) => {
        transform.x = down ? mx : 0
        transform.y = down ? my : 0
      },
      { domTarget: refEl }
    )
    console.log(bind())

    const transformStyle = computed(() => {
      const style = { transform: `translate3d(${transform.x}px,${transform.y}px,0)` }
      return style
    })

    return {
      refEl,
      bind,
      transformStyle,
    }
  },
})
</script>

<style>
.area {
  touch-action: none;
  cursor: -webkit-grab;
  cursor: grab;
}
</style>
