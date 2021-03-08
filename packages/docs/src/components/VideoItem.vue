<template>
  <div>
    <a target="_blank" rel="noopener noreferrer" href="#" xhref="`https://codesandbox.io/s/${id}`">
      <video autoPlay muted playsInline loop width="100%" class="w-full">
        <source :src="video" type="video/mp4" />
      </video>
    </a>
    <template v-if="badges">
      <div class="badges">
        <a :href="`/docs/${links[b].link}`" :key="i" className="badge" v-for="(b, i) in badges">{{ links[b].label }}</a>
      </div>
    </template>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

const links = {
  drag: { label: 'useDrag', link: 'hooks/#list-of-hooks' },
  wheel: { label: 'useWheel', link: 'hooks/#list-of-hooks' },
  pinch: { label: 'usePinch', link: 'hooks/#list-of-hooks' },
  move: { label: 'useMove', link: 'hooks/#list-of-hooks' },
  initial: { label: 'initial', link: 'options/#initial' },
  rubberband: { label: 'rubberband', link: 'options/#rubberband' },
  touchaction: { label: 'touch-action', link: 'extras/#touch-action' },
}

export default defineComponent({
  props: ['video', 'id', 'badges'],
  setup() {
    return { links }
  },
})
</script>

<style></style>
