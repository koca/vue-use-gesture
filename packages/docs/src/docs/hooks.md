---
title: Available hooks
section: Reference
order: 1
---

# Available hooks

<p>
&zwnj;<vue-use-gesture></vue-use-gesture> exports several hooks that can handle different gestures.
</p>

| Hook         | Description                                |
| ------------ | ------------------------------------------ |
| `useDrag`    | Handles the drag gesture                   |
| `useMove`    | Handles mouse move events                  |
| `useHover`   | Handles mouse enter and mouse leave events |
| `useScroll`  | Handles scroll events                      |
| `useWheel`   | Handles wheel events                       |
| `usePinch`   | Handles the pinch gesture                  |
| `useGesture` | Handles multiple gestures in one hook      |

## Usage

With the exception of `useGesture` which is a special hook, all other hooks share the same API:

```js
const bind = useDrag((state) => doSomethingWith(state), config)
return <div {...bind(arg)} />
```

- `state` is an object containing all attributes of the gesture, including the original event. That state is passed to your handler every time the gesture updates. You can find all state attributes in the [Gesture state section](/docs/state).
- `config` is an object containing options for the gesture. You can find all config options in the [Gesture options section](/docs/options).
- `arg` is a custom argument you can pass to the bind function. See this [example](https://codesandbox.io/s/fh8r8) to see where it can be useful.

### About the drag gesture

The drag gesture is possibly the most popular gesture of <vue-use-gesture></vue-use-gesture>. Because of the way pointer events work, dragging might cause conflict with scrolling on touch-based devices. So to signify that your element is draggable and therefore shouldn't trigger the browser scrolling, you **need** to use the [`touch-action`](https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action) css property. [Read more here](/docs/extras/#touch-action).

### About the pinch gesture

The pinch gesture is a bit specific because depending on your device input, it might behave differently. On touch devices, two pointers (generally your fingers) allow for zooming and rotating.

But Macbook trackpads also support pinching and rotating in Safari, but because Vue doesn't support proprietary Webkit GestureEvents, you will need to attach the gesture using a ref, with the `domTarget` [option](/docs/options/#domtarget). To make sure the zooming gesture doesn't interfere with Safari accessibility zoom, you will need to prevent the gesture like so:

```js
document.addEventListener('gesturestart', (e) => e.preventDefault())
document.addEventListener('gesturechange', (e) => e.preventDefault())
```

Also, a pretty unknown feature allows devices supporting wheel to **zoom** (not rotate) by wheeling and pressing the **control** modifier key. <vue-use-gesture></vue-use-gesture> supports it, but to make sure the zooming doesn't interefere with the browser accessibility zoom, you'll also be better using the `domTarget` [option](/docs/options/#domtarget).

### About the wheel gesture

The wheel gesture is a bit tricky, due to the nature of the wheel event. In fact, mouse devices such as the Macbook trackpad, or the Magic Mouse have inertia, but there is no native way to distinguish between an actual wheel intent and its resulting inertia. To detect intent, you can use [Lethargy](https://github.com/d4nyll/lethargy) and [read more about it here](/docs/extras/#lethargy).

## Handling multiple gestures in one hook with useGesture

`useGesture` is a hook that allows you to manage different gestures at once: for example you might want to enable pinching and dragging on the same component, in that case `useGesture` is the way to go.

```js
const bind = useGesture(
  {
    onDrag: state => doSomethingWith(state),
    onDragStart: state => doSomethingWith(state),
    onDragEnd: state => doSomethingWith(state),
    onPinch: state => doSomethingWith(state),
    onPinchStart: state => doSomethingWith(state),
    onPinchEnd: state => doSomethingWith(state),
    onScroll: state => doSomethingWith(state),
    onScrollStart: state => doSomethingWith(state),
    onScrollEnd: state => doSomethingWith(state),
    onMove: state => doSomethingWith(state),
    onMoveStart: state => doSomethingWith(state),
    onMoveEnd: state => doSomethingWith(state),
    onWheel: state => doSomethingWith(state),
    onWheelStart: state => doSomethingWith(state),
    onWheelEnd: state => doSomethingWith(state),
    onHover: state => doSomethingWith(state),
  },
  config
)
// template
<div v-bind="bind()" />
```

The `config` object passed to `useGesture` has `drag`, `wheel`, `scroll`, `pinch` and `move` keys for specific gesture options. See here for more details.

### Start and end handlers

As you can see from the snippet above, the `useGesture` hook allows `drag`, `wheel`, `scroll`, `pinch` and `move` gestures to have two additional handlers that let you perform actions when they start or end. For example, `onScrollEnd` fires when the user just finished scrolling.

Note that **end event handlers** for `wheel`, `scroll` and `move` are **debounced** because of the way these events work in the DOM.

### Native Vue event handlers

Imagine you want to add an action when you mouse down on a draggable component. You'll probably be tempted to try the following code at first:

```html {1,3,10}
<!-- This won't work as you'd expect -->
<template>
  <div v-bind="bind()" @pointerDown="() => console.log('pointer down')" :style="style" />
</template>

<script>
  export default defineComponent({
    setup() {
      const [{ x, y }, set] = useSpring(() => ({ x: 0, y: 0 }))
      const bind = useDrag(({ down, offset: [x, y] }) => set({ x, y }))
      const style = computed(() => ({ transform: `translate3d(${x.value}px,${y.value}px,0)` }))
      return { bind, style }
    },
  })
</script>
```

This looks fine on paper, but it actually won't work: the reason is that the attribute `@pointerDown` will overwrite the one created by expanding `v-bind="bind()"` and therefore the drag gesture won't start.

Fortunately, the hook `useGesture` supports native Vue event handlers, and will make sure they are executed on the side without overwriting anything:

```html {1,3,10-13}
<!-- This will work as intended -->
<template>
  <div v-bind="bind()" :style="style" />
</template>

<script>
  export default defineComponent({
    setup() {
      const [{ x, y }, set] = useSpring(() => ({ x: 0, y: 0 }))
      const bind = useGesture({
        onDrag: ({ down, offset: [x, y] }) => set({ x, y }),
        onPointerDown: ({ event, ...sharedState }) => console.log('pointer down', event),
      })
      const style = computed(() => ({ transform: `translate3d(${x.value}px,${y.value}px,0)` }))
      return { bind, style }
    },
  })
</script>
```

Even better, the native handler will be passed the shared state of the gestures, including the original event, and the arguments passed to the `bind` function.
