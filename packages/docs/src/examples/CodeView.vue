<template>
  <div v-if="!disableOverlay" :class="{ [styles.overlay]: true, [styles.active]: active }"></div>
  <div :class="{ [styles.example]: true, [styles[id]]: !!styles[id] }">
    <component :is="exampleComponent" :setActive="setActive"></component>
  </div>
</template>

<script>
import { defineComponent, ref, watchEffect, Teleport } from 'vue'
import * as Examples from './AllExamples.vue'
import styles from './style.module.css'

export default defineComponent({
  components: {
    Teleport,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    disableOverlay: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const exampleComponent = Examples[props.id]
    const active = ref(false)

    const setActive = (val) => {
      active.value = val
    }

    watchEffect(() => {
      document.body.classList.toggle('dragged', active.value)
    })

    return { active, setActive, styles, exampleComponent }
  },
})
</script>

<style></style>
