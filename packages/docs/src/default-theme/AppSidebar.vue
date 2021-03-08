<template>
  <div
    class="nav-wrapper -mx-2 h-full overflow-y-auto scrolling-touch lg:h-auto lg:block lg:sticky lg:bg-transparent overflow-hidden max-h-screen-18 lg:top-18 lg:mr-8"
  >
    <nav class="nav overflow-y-auto font-medium text-base lg:text-sm pb-10 lg:pb-14">
      <ul class="pt-8 text-sm">
        <li class="flex flex-col space-y-1 mb-8" v-for="group in links" :key="group.title">
          <h5 class="px-3 uppercase font-bold mb-2">{{ group.title }}</h5>
          <a
            v-for="link in group.items"
            :key="link.title"
            :class="{ active: isLinkActive(link.slug) }"
            class="link link--sidebar"
            :href="`/docs${link.slug}`"
          >
            {{ link.title }}
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useRoute } from 'vue-router'

const links = [
  {
    title: 'Getting Started',
    items: [
      { slug: '/', title: 'Installation' },
      { slug: '/motivation', title: 'Motivation' },
    ],
  },
  {
    title: 'Reference',
    items: [
      { slug: '/hooks', title: 'Available Hooks' },
      { slug: '/options', title: 'Gesture Options' },
      { slug: '/state', title: 'Gesture state' },
      { slug: '/utilities', title: 'Utilities' },
    ],
  },
  {
    title: 'More',
    items: [
      { slug: '/changelog', title: 'Changelog' },
      { slug: '/examples', title: 'Examples' },
      { slug: '/faq', title: 'FAQ' },
      { slug: '/extras', title: 'Useful Extras' },
    ],
  },
]

export default defineComponent({
  setup() {
    const { params } = useRoute()

    const slug = computed(() => {
      return params?.slug || 'index' //index.md
    })

    const isLinkActive = (linkSlug) => {
      if (slug.value === 'index' && linkSlug === '/') return true
      const isActive = slug.value === linkSlug.substring(1)
      return isActive
    }

    return { slug, links, isLinkActive }
  },
})
</script>

<style lang="postcss">
.nav {
  height: calc(100vh - 4.5rem);
}
.link--sidebar {
  @apply px-3 py-2  hover:bg-gray-800 rounded;
}
.link--sidebar.active {
  @apply text-yellow-100 font-bold bg-yellow-100 bg-opacity-10;
}
</style>
