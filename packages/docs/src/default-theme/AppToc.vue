<template>
  <ul class="overflow-x-hidden text-gray-500 font-medium">
    <li :key="item.level" class="catalog-item leading-4" v-for="item in toc" :class="{ 'ml-4': item.level == 3 }">
      <a
        class="toc-item block transform transition-colors duration-200 py-2 hover:text-white"
        @click="handleItemClick(item)"
        ref="tocItemRef"
        :href="'#' + item.slug"
        :class="{
          'text-gray-100  font-bold': item.slug === activeTocId,
          'text-gray-400 ': item.slug !== activeTocId,
        }"
        v-html="item.content"
      ></a>
    </li>
  </ul>
</template>
<script>
import { defineComponent, onMounted, ref, nextTick } from 'vue'
import { debouncedWatch, useWindowScroll } from '@vueuse/core'
import { useRoute } from 'vue-router'

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export default defineComponent({
  props: {
    toc: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const tocItemRef = ref()
    const activeTocId = ref()

    onMounted(async () => {
      const { hash } = useRoute()
      await nextTick()

      await sleep(300)
      const scrollMarginTop = 72 // 4.5rem in style.css

      const pageOffset = document.getElementById('app').offsetTop

      if (hash) {
        const scrollTarget = document.querySelector(hash)
        const targetTop = scrollTarget.offsetTop - pageOffset - scrollMarginTop
        scrollTo(0, targetTop)
        activeTocId.value = hash.substring(1) // without #
      }

      const { y } = useWindowScroll()
      const anchors = [...document.querySelectorAll('#article-main h3[id], #article-main h2[id]')]
      const getAnchorTop = (anchor) => anchor.offsetTop - pageOffset - 15 - scrollMarginTop

      debouncedWatch(
        y,
        () => {
          const scrollTop = y.value

          for (let i = 0; i < anchors.length; i++) {
            const anchor = anchors[i]
            const nextAnchor = anchors[i + 1]
            const isActive =
              (i === 0 && scrollTop === 0) ||
              (scrollTop >= getAnchorTop(anchor) && (!nextAnchor || scrollTop < getAnchorTop(nextAnchor)))

            if (isActive) {
              const id = anchor.getAttribute('id')
              // set active toc id
              activeTocId.value = id
              return
            }
          }
        },
        { debounce: 50 }
      )
    })

    const handleItemClick = (item) => {
      activeTocId.value = item.slug
    }

    return { handleItemClick, activeTocId, tocItemRef }
  },
})
</script>
<style>
.toc-item {
  scroll-margin-top: 6.875rem;
}
</style>
