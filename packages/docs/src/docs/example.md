---
title: Getting Started
description: Getting Started with vue-use-gesture
tags:
  - 'components'
---

# Getting started

<p class="text-xl">
  <vue-use-gesture></vue-use-gesture>
is a set of hooks that let you bind mouse and touch events to any Vue component.
</p>

With the data you receive, it becomes easy to set up complex gestures like dragging and pinching with a few lines of code. You can use this library stand-alone, but to make the most of it you should combine it with an animation library like [vue-use-spring](https://github.com/posva/vue-use-spring).

## Installation

<vue-use-gesture></vue-use-gesture> works with Vue 2 & 3 within a single package.

Thanks to [Vue Demi](https://github.com/vueuse/vue-demi)

### Vue 3 setup

Add `vue-use-gesture` dependency to your project:

<code-group>
  <code-block label="YARN" active>
  
```sh
yarn add vue-use-gesture
```

  </code-block>
  <code-block label="NPM">

```sh
npm install vue-use-gesture
```

  </code-block>
</code-group>

### Vue 2 setup

Add `vue-use-gesture` and `@vue/composition-api` dependency to your project:

<code-group>
  <code-block label="YARN" active>
  
```sh
yarn add vue-use-gesture @vue/composition-api
```

  </code-block>
  <code-block label="NPM">

```sh
npm install vue-use-gesture @vue/composition-api
```

  </code-block>
</code-group>

::: info
This is a info
:::

::: warning
This is a warning
:::

::: danger
This is a dangerous warning
:::

::: warning
**Warning**

All examples in this documentation use React-spring v9, that you can install with the `next` tag: `react-spring@next`. v9 api is more convenient and allows for more compact, less distracting code. The following example is the only one available with React-spring v8.
:::

<example-one>

```html
<template>
  <div id="app" class="bg-gray-900 py-16 text-white flex flex-col items-center justify-center">
    <div class="area w-20 h-20 bg-blue-300 rounded-2xl" v-on="bind()" :style="transformStyle"></div>
  </div>
</template>
<script>
  import { useDrag, useSpring } from 'vue-use-gesture'
  import { defineComponent, computed } from 'vue'

  export default defineComponent({
    setup() {
      const transform = useSpring({ x: 0, y: 0 })

      const bind = useDrag(({ down, movement: [mx, my] }) => {
        transform.x = down ? mx : 0
        transform.y = down ? my : 0
      })

      const transformStyle = computed(() => {
        const style = { transform: `translate3d(${transform.x}px,${transform.y}px,0)` }
        return style
      })

      return {
        bind,
        transformStyle,
      }
    },
  })
</script>

<style>
  .area {
    touch-action: none;
    cursor: -webkit-grab;
    cursor: grab;
  }
</style>
```
