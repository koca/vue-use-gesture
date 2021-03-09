<template>
  <div>HOME</div>
</template>

<script>
import { onMounted } from 'vue'
export default {
  setup() {
    onMounted(() => {
      location.href = '/docs'
    })
  },
}
</script>

<style></style>
