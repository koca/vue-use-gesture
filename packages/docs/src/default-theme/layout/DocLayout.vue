<template>
  <div
    class="dark min-h-screen font-sans antialiased flex flex-col bg-white text-gray-700 dark:bg-gray-900 dark:text-gray-50"
  >
    <AppHeader></AppHeader>
    <div class="mx-auto w-full max-w-7xl px-0 lg:px-4">
      <div class="lg:flex">
        <button
          @click="toggleMenu"
          type="button"
          class="fixed z-50 bottom-4 right-4 w-16 h-16 rounded-full bg-gray-700 text-white block lg:hidden"
        >
          <span class="sr-only">Open site navigation</span>
          <!-- prettier-ignore -->
          <svg width="24" height="24" fill="none" class="absolute top-1/2 left-1/2 -mt-3 -ml-3 transition duration-300 transform"><path d="M4 8h16M4 16h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
          <!-- prettier-ignore -->
          <svg width="24" height="24" fill="none" class="absolute top-1/2 left-1/2 -mt-3 -ml-3 transition duration-300 transform opacity-0 scale-80"><path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
        </button>
        <div
          :class="
            `sidebar fixed z-40 inset-0 flex-none h-full w-full lg:static lg:h-auto lg:overflow-y-visible lg:pt-0 lg:w-64 lg:block bg-gray-900 p-4 ${
              isMenuVisible ? 'mt-8 lg:mt-0' : 'hidden'
            }`
          "
        >
          <AppSidebar></AppSidebar>
        </div>
        <div class="content-wrapper min-w-0 w-full flex-auto lg:static lg:max-h-full lg:overflow-visible">
          <div class="w-full flex h-full">
            <div class="min-w-0 flex-auto px-4 pt-0 pb-24 lg:pb-16">
              <div class="pb-64 pt-10 min-h-screen">
                <article class="prose mx-auto" id="article-main">
                  <slot></slot>
                </article>
              </div>
            </div>
            <aside class="hidden xl:text-sm xl:block flex-none w-52 ml-8 mr-8">
              <div class="flex flex-col justify-between overflow-y-auto sticky max-h-screen-18 pt-10 pb-6 top-18">
                <div class="mb-8" v-if="config.toc.length">
                  <h5 class="uppercase tracking-wide font-semibold mb-3 text-sm lg:text-xs">On this page</h5>
                  <AppToc :toc="config.toc"></AppToc>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useLockScroll } from 'vue-composable'

export default defineComponent({
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  name: 'DocLayout',
  setup() {
    const isMenuVisible = ref(false)
    const { locked } = useLockScroll('body', { auto: false })
    const toggleMenu = () => {
      isMenuVisible.value = !isMenuVisible.value
      locked.value = !!isMenuVisible.value
    }
    return {
      isMenuVisible,
      toggleMenu,
    }
  },
})
</script>
