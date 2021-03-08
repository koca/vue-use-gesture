<template>
  <div
    class="z-50 relative bg-gray-700x bg-code-theme rounded py-16 text-white flex flex-col items-center justify-center"
  >
    <div class="box w-20 h-20 bg-blue-300 rounded-2xl" v-bind="bind()" :style="transformStyle"></div>
  </div>
</template>
<script>
import { useDrag, useSpring } from 'vue-use-gesture'
import { computed } from 'vue'

export default {
  name: 'ExampleOne',
  setup() {
    const [{ x, y }, set] = useSpring(() => ({ x: 0, y: 0 }))

    const bind = useDrag(({ down, movement: [mx, my] }) => set({ x: down ? mx : 0, y: down ? my : 0 }))

    const transformStyle = computed(() => ({ transform: `translate3d(${x.value}px,${y.value}px,0)` }))

    return {
      bind,
      transformStyle,
    }
  },
}
</script>

<style>
.box {
  touch-action: none;
  cursor: grab;
  user-select: none;
}
</style>
