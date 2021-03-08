---
title: Useful extras
section: More
---

# Useful extras

These tips aren't specific to <vue-use-gesture></vue-use-gesture> but might come handy to anyone building mobile-friendly UI interfaces.

### touch-action

Let's take the mailbox email list: panning vertically should scroll vertically through the emails, and dragging horizontally should unveil options such as delete and mark undread.

In these situations you don't want the `body` of your page to scroll along with the user manipulating the item horizontally. Your first instinct might be to prevent the event default action by calling `event.preventDefault()` in your handler. But there is a simpler, more effective solution, which has to do with a simple CSS property.

[`touch-action`](https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action) is a CSS property that sets how an element's region can be manipulated by a touchscreen user.

::: info
This demo only makes sense on mobile or when your browser inspector is set for touch devices.
:::

<code-view id="TouchAction"></code-view>

Setting `touch-action: pan-y` on your draggable element class or style indicates the browser should only react to vertical scrolling when interacting with the item.

::: info
If you don't want the browser scrolling either vertically or horizontally, set `touch-action: none`.
:::

::: warning
`vue-use-spring` doesn't support spring groups, yet. So the actual source code is not the same as below.
If you want to take a look at the original source code its in `/packages/docs/src/examples/AllExamples.vue` file.
:::

```html {10-19}
<template>
  <div v-bind="bind(i)" :style="getStyle(spring)" v-for="(spring, i) in springs">item { { i } }</div>
</template>

<script>
  export default {
    setup() {
      // vue-use-spring doesnt support spring groups, yet. so this won't work.
      const [springs, set] = useSprings(4, () => ({ x: 0 }))

      const bind = useDrag(({ down, movement: [x], args: [index] }) => set((i) => i === index && { x: down ? x : 0 }), {
        axis: 'x',
      })

      const getStyle = (springItem) => ({
        transform: `translate3d(${springItem.x.value}px,0,0)`,
      })

      return { bind, springs, getStyle }
    },
  }
</script>
```

In your drag options, you should then set [`{axis:'x'}`](/docs/options/#axis-xy-gestures-only). This will result in the browser natively canceling vertical scrolling when it detects movement intent on the horizontal axis, while your handler will trigger your horizontal logic. When movement intent is detected as vertical by the browser, it will allow your body to scroll, but the `{axis:'x'}` option on the drag handler will prevent your item to move horizontally.

::: info
Note that you can fail this behaviour by slooowly scrolling sideways and then firmly up or down. But it should work in most situations.
:::

### Body Scroll Lock

When you have a menu overlay on top of your page you generally don't want the `body` to scroll along with the menu content. [Body scroll lock](https://github.com/willmcpo/body-scroll-lock) is a javascript library that disable body scroll.

Make sure you can't solve your problem scroll problem with [`touch-action`](#touch-action) before using this library though.

### Lethargy

[Lethargy](https://github.com/d4nyll/lethargy) is a library which objective is _to help distinguish between scroll events initiated by the user, and those by inertial scrolling_. It's especially useful when you want to create full page sliders. Here is an example on how to use it with `useWheel`.

::: info
This demo only makes sense on wheel-based devices. The sensitivity to wheeling depends on your device and can be adjusted with Lethargy options.
:::

<code-view id="LethargyWheel"></code-view>

```html
<template>
  <div ref="refElement" :style="{ transform: `translateY(${-index * 330}px)` }">
    <div :key="i" v-for="i in slides">{ { i } }</div>
  </div>
</template>
<script>
  import { useWheel } from 'vue-use-gesture'
  import { defineComponent, ref } from '@vue/composition-api'
  import { Lethargy } from 'lethargy'

  const clamp = (value, min, max) => Math.max(Math.min(max, value), min)

  const slides = [0, 1, 2, 3, 4, 5]
  // creates a new Lethargy check
  // could be stored as a ref, or a global anywhere in your app
  const lethargy = new Lethargy()

  export default {
    setup() {
      const index = ref(0)
      const refElement = ref(null)

      useWheel(
        ({ event, last, memo: wait = false }) => {
          if (last) return // event can be undefined as the last event is debounced
          event.preventDefault() // this is needed to prevent the native browser scroll
          const wheelDirection = lethargy.check(event)
          // wheelDirection === 0 when Lethargy thinks it's an inertia-triggered event
          if (wheelDirection) {
            // wait is going to switch from false to true when an intentional wheel
            // event has been detected
            if (!wait) setIndex((i) => clamp(index.value - wheelDirection, 0, slides.length - 1))
            return true // will set to wait to true in the next event frame
          }
          return false // will set to wait to false in the next event frame
        },
        // we need to use a ref to be able to get non passive events and be able
        // to trigger event.preventDefault()
        { domTarget: refElement, eventOptions: { passive: false } }
      )

      return { refElement, index, slides }
    },
  }
</script>
```

:::info
TODO: we'll add codesandbox example
:::
Example on CodeSandbox: link
