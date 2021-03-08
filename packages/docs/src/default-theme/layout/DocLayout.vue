<template>
  <div
    class="dark min-h-screen font-sans antialiased flex flex-col bg-white text-gray-700 dark:bg-gray-900 dark:text-gray-50"
  >
    <AppHeader></AppHeader>
    <div class="mx-auto w-full max-w-7xl px-0 lg:px-4">
      <div class="lg:flex">
        <div
          class="sidebar fixed z-40 inset-0 flex-none h-full w-full lg:static lg:h-auto lg:overflow-y-visible lg:pt-0 lg:w-64 lg:block hidden"
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
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  name: 'DocLayout',
})
</script>
