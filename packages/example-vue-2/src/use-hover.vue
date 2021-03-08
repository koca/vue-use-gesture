<template>
  <div id="app" class="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
    <div class="py-16 w-64">
      <h3 class="font-bold py-4">Hover Example</h3>
      <button ref="button" class="border-2 rounded-lg px-4 py-2" :class="{ 'border-teal-400': hoverState }">
        Hover Me
      </button>
      <div class="mt-4">hover state: {{ hoverState ? 'hover' : 'leave' }}</div>
    </div>
  </div>
</template>
<script>
import { useHover } from 'vue-use-gesture'
import { defineComponent, ref } from '@vue/composition-api'

export default defineComponent({
  setup() {
    const button = ref()
    const hoverState = ref(false)

    useHover(
      ({ hovering }) => {
        hoverState.value = hovering
        console.log(hovering ? 'hover' : 'leave')
      },
      { domTarget: button }
    )

    return {
      button,
      hoverState,
    }
  },
})
</script>

<style></style>
