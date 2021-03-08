<template>
  <div class="code-group">
    <div class="bg-code-theme rounded-t-md px-2 text-sm text-white relative mb-0 z-30">
      <button
        v-for="(label, index) in labels"
        :key="label"
        @click="selectedLabel = index"
        ref="tabs"
        class="btn z-20 px-4 py-3 text-gray-100 font-bold font-mono focus:outline-none focus:text-white"
        :class="[selectedLabel === index && 'active']"
      >
        {{ label }}
      </button>
      <div
        class="border-b-2 border-white border-opacity-10 absolute w-full h-px bottom-0 left-0"
        style="z-index: -1"
      ></div>
    </div>
    <component :is="items[selectedLabel]" :key="items[selectedLabel].props.label"></component>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'CodeGroup',
  setup(_props, { slots }) {
    const size = ref('big')
    const items = slots.default!()
    const labels = items.map((item) => item.props!.label)
    const selectedLabel = ref(0)

    return {
      labels,
      size,
      slots,
      items,
      selectedLabel,
    }
  },
})
</script>
<style lang="postcss">
.btn.active {
  border-bottom: 2px solid #fff;
}
</style>
