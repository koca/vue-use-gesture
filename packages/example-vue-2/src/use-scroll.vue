<template>
  <div id="app" class="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
    <div class="fixed w-4 bg-red-500 h-8 top-0 left-0" :style="{ width: springObject.width + '%' }">
      {{ springObject.width + '%' }}
    </div>

    <div class="py-16">
      <h3>START SCROLLING</h3>
      <div class="area border-2 border-red-500 overflow-scroll max-w-sm mx-auto">
        <div class="scroll-area">
          <p class="py-64 text-center" :key="i" v-for="(p, i) in [0, 1, 2, 3]">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Blanditiis neque, ad possimus officia mollitia
            perspiciatis, illum nisi nulla tenetur repudiandae nesciunt laboriosam illo accusantium necessitatibus eius
            sapiente quae exercitationem harum. Corporis rem cumque a fuga magni, ea vel culpa dolorem totam architecto
            reprehenderit? Ipsam voluptatibus nisi, facilis autem iusto voluptates.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import './assets/editorstyle.css'
import { useScroll, useSpring } from 'vue-use-gesture'
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  setup() {
    const springObject = useSpring({ width: 0 })

    useScroll(
      ({ xy: [, y] }) => {
        const height = document.body.clientHeight - document.documentElement.clientHeight
        springObject.width = Math.floor((y / height) * 100)
      },
      { domTarget: window }
    )

    return {
      springObject,
    }
  },
})
</script>

<style></style>
