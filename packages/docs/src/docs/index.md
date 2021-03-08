---
title: Getting Started
description: Getting Started with vue-use-gesture
tags:
  - 'components'
---

# Getting started

<p>
<vue-use-gesture></vue-use-gesture> is a set of hooks that let you bind mouse and touch events to any Vue component.
</p>

With the data you receive, it becomes easy to set up complex gestures like dragging and pinching with a few lines of code. You can use this library stand-alone, but to make the most of it you should combine it with an animation library like [vue-use-spring](https://github.com/posva/vue-use-spring).

> This library is a port of [React UseGesture](https://github.com/pmndrs/react-use-gesture). Thanks [Polmandres](https://twitter.com/pmndrs) 🙏

## Installation

<vue-use-gesture></vue-use-gesture> works with Vue 2 & 3 within a single package.

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

Add `vue-use-gesture` and `@vue/composition-api` dependencies to your project:

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

## Simple example

The following example makes a `&lt;div/&gt;` draggable so that it follows your mouse or finger on drag, and returns to its initial position on release.

<code-view id="PullRelease"></code-view>

```html
<template>
  <div v-bind="bind()" :style="style" class="box"></div>
</template>

<script>
  import { useDrag } from 'vue-use-gesture'
  import { useSpring } from 'vue-use-spring'
  import { defineComponent, computed } from 'vue'

  export default defineComponent({
    setup() {
      const [{ x, y }, set] = useSpring(() => ({ x: 0, y: 0 }))

      const bind = useDrag(({ down, movement: [mx, my] }) => {
        set({ x: down ? mx : 0, y: down ? my : 0 })
      })

      const style = computed(() => ({ transform: `translate3d(${x.value}px,${y.value}px,0)` }))

      return { bind, style }
    },
  })
</script>

<style>
  .box {
    touch-action: none;
    cursor: grab;
    width: 20px;
    height: 20ppx;
    background: blue;
  }
</style>
```

### How does this work?

The `useDrag` hook returns a function (stored in the `bind` constant), which when called returns an object with event handlers. Here, when you spread <br class="hidden xl:inline"> `v-bind="bind()"` into a component, you're actually adding `onMouseDown` and `onTouchStart` event handlers.

::: warning

It's important that you understand <vue-use-gesture></vue-use-gesture> is not responsible for actually moving the component. The `useDrag` hook just hands over gesture data to vue-use-spring which sets the component transforms. If you're not familiar with vue-use-spring, head over [its documentation here](https://github.com/posva/vue-use-spring).
:::
