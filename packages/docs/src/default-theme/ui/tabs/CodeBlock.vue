<template>
  <div class="code-block">
    <slot />
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CodeBlock',
  props: {
    label: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
})
</script>

<style lang="postcss">
.code-block pre {
  margin-top: 0;
  padding: 15px !important;
  @apply rounded-none rounded-bl rounded-br !important;
}
</style>
