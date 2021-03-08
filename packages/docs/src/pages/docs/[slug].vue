<template>
  <DocLayout :config="config">
    <component :is="VueComponent"></component>
  </DocLayout>
</template>

<script>
import LinkToRepository from '@/default-theme/LinkToRepository.vue'
import CodeBlock from '@/default-theme/ui/tabs/CodeBlock.vue'
import CodeGroup from '@/default-theme/ui/tabs/CodeGroup.vue'
import VueUseGesture from '@/components/VueUseGesture.vue'
import SpecsRow from '@/components/SpecsRow.vue'
import VideoList from '@/components/VideoList.vue'
import CodeView from '@/examples/CodeView.vue'
import ExampleOne from '@/examples/ExampleOne.vue'

import { asyncComputed } from '@vueuse/core'
import { computed, defineComponent, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { slugify } from '@/utils/slugify'
import { useHead } from '@vueuse/head'

export default defineComponent({
  components: {},
  name: 'doc-home',
  setup() {
    const { params } = useRoute()

    const slug = computed(() => {
      return params?.slug || 'index' //index.md
    })

    const markdownImport = asyncComputed(
      async () => {
        const component = await import(`../../docs/${slug.value}.md`)
        return component
      },
      null // initial state
    )

    const VueComponent = computed(() => {
      return markdownImport.value?.VueComponentWith({
        LinkToRepository,
        VueUseGesture,
        CodeBlock,
        CodeGroup,
        CodeView,
        SpecsRow,
        VideoList,
        ExampleOne,
      })
    })

    const toc = computed(() => {
      // not happy about it, but, u know it works :D
      const tocRaw = markdownImport.value?.toc || []
      const tocWithLinks = tocRaw
        .map((tocItem) => {
          tocItem.content = tocItem.content.replace(/^.*a>\s/, '') // remove anchor tag
          tocItem.slug = slugify(tocItem.content)
          return tocItem
        })
        .filter((tocItem) => tocItem.level !== '1')
      return tocWithLinks
    })

    const attributes = computed(() => {
      return markdownImport.value?.attributes || {}
    })

    // layout config
    const config = reactive({ toc, attributes })

    useHead({
      title: computed(() => attributes.value.title + ' - Vue UseGesture'),
    })

    return { config, VueComponent }
  },
})
</script>
