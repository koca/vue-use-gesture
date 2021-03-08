# Vue UseGesture

<!-- [![Bundle size (minified + gzip)][bundle-size-badge]][bundle-size]
[![NPM Downloads][downloads-badge]][downloads]
[![Build Status][build-badge]][build]
![Codecov][covarage-badge]
[![Version][version-badge]][package]
[![MIT License][license-badge]][license] -->

Vue UseGesture is a hook that lets you bind richer mouse and touch events to any component or view. With the data you receive, it becomes trivial to set up gestures, and often takes no more than a few lines of code.

You can use it stand-alone, but to make the most of it you should combine it with an animation library like [vue-use-spring](https://github.com/posva/vue-use-spring), though you can most certainly use any other.

<p align="middle">
  <a href="#"><img src="https://i.imgur.com/qLKJod3.gif" width="400"/></a>
  <a href="#"><img src="https://i.imgur.com/H6nXQEq.gif" width="400"/></a>
  <a href="#"><img src="https://i.imgur.com/THKPrmR.gif" width="400"/></a>
  <a href="#"><img src="https://i.imgur.com/cuOfqST.gif" width="400"/></a>
  <a href="#"><img src="https://i.imgur.com/iwZOfT9.gif" width="400"/></a>
  <a href="#"><img src="https://i.imgur.com/Walt1Ip.gif" width="400"/></a>
</p>

<p align="middle"><i>The demos are real (we'll add them to the codesandbox soon)</i></p>

### Installation

```bash
#Yarn
yarn add vue-use-gesture

#NPM
npm install vue-use-gesture
```

### [Full documentation website](https://vue-use-gesture.netlify.com)

- [Available Hooks](https://vue-use-gesture.netlify.com/docs/hooks)
- [Gesture State](https://vue-use-gesture.netlify.com/docs/state)
- [Gesture Options](https://vue-use-gesture.netlify.com/docs/options)
- [Utilities](https://vue-use-gesture.netlify.com/docs/utilities)
- [FAQ](https://vue-use-gesture.netlify.com/docs/faq)

### Simple example

<p align="middle">
  <a href="#"><img src="https://i.imgur.com/AMzsEi3.gif" width="400"/></a>
</p>

```html
<template>
  <!-- Bind it to a component -->
  <div v-bind="bind()" :style="style" class="box"></div>
</template>

<script>
  import { useDrag } from 'vue-use-gesture'
  import { useSpring } from 'vue-use-spring'
  import { defineComponent, computed } from 'vue'

  export default defineComponent({
    setup() {
      const [{ x, y }, set] = useSpring(() => ({ x: 0, y: 0 }))

      // Set the drag hook and define component movement based on gesture data
      const bind = useDrag(({ down, movement: [mx, my] }) => {
        set({ x: down ? mx : 0, y: down ? my : 0 })
      })

      const style = computed(() => ({ transform: `translate3d(${x.value}px,${y.value}px,0)`, touchAction: 'none' }))

      return { bind, style }
    },
  })
</script>
```

The example above makes a `div` draggable so that it follows your mouse on drag, and returns to its initial position on release.

**Make sure you always set [`touchAction`](https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action) on a draggable element to prevent glitches with the browser native scrolling on touch devices**.

### Available hooks

`vue-use-gesture` exports several hooks that can handle different gestures:

| Hook         | Description                                |
| ------------ | ------------------------------------------ |
| `useDrag`    | Handles the drag gesture                   |
| `useMove`    | Handles mouse move events                  |
| `useHover`   | Handles mouse enter and mouse leave events |
| `useScroll`  | Handles scroll events                      |
| `useWheel`   | Handles wheel events                       |
| `usePinch`   | Handles the pinch gesture                  |
| `useGesture` | Handles multiple gestures in one hook      |

#### [More on the full documentation website...](https://vue-use-gesture.netlify.com)

## Thanks

> This library is a port of [React UseGesture](https://github.com/pmndrs/react-use-gesture). Thanks [Polmandres](https://twitter.com/pmndrs) 🙏

## License

MIT

[build-badge]: https://img.shields.io/circleci/project/github/koca/vue-use-gesture/master.svg?style=flat-square
[build]: https://circleci.com/gh/koca/vue-use-gesture
[downloads-badge]: https://img.shields.io/npm/dt/vue-use-gesture.svg?style=flat-square
[downloads]: https://npmjs.com/package/vue-use-gesture
[build-badge]: https://img.shields.io/npm/dm/vue-client-only.svg?style=flat
[license-badge]: https://img.shields.io/npm/l/vue-use-gesture.svg?style=flat-square
[license]: https://opensource.org/licenses/MIT
[version-badge]: https://img.shields.io/npm/v/vue-use-gesture.svg?style=flat-square
[package]: https://www.npmjs.com/package/vue-use-gesture
[bundle-size-badge]: https://img.shields.io/bundlephobia/minzip/vue-use-gesture@1.x.x.svg?style=flat-square
[bundle-size]: https://bundlephobia.com/result?p=vue-use-gesture
[covarage-badge]: https://img.shields.io/codecov/c/github/koca/vue-use-gesture?style=flat-square
