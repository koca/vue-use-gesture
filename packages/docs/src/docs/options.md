---
title: Gesture options
section: Reference
order: 2
---

# Gesture options

&zwnj;<vue-use-gesture></vue-use-gesture> offers different options to configure the gestures.

Some options are generic to the way <vue-use-gesture></vue-use-gesture> behaves while some other options can be configured per gesture.

## Structure of the config object

Depending on whether you use gesture-specific hooks or if you use the `useGesture` hook, you'll need to structure the config option object differently.

<!-- prettier-ignore -->
```js
// when you use a gesture-specific hook
useDrag(state => doSomethingWith(state), { ...genericOptions, ...dragOptions })

// when you use the useGesture hook
useGesture(state => doSomethingWith(state), {
  // global options such as `domTarget`
  ...genericOptions,
  // gesture specific options
  drag:   dragOptions,
  wheel:  wheelOptions,
  pinch:  pinchOptions,
  scroll: scrollOptions,
  wheel:  wheelOptions,
  hover:  hoverOptions,
})
```

### Generic options

Generic options deal with how <vue-use-gesture></vue-use-gesture> will set event listeners.

| Option                          | Description                                                                                                     |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| [`domTarget`](#domtarget)       | Lets you specify a dom node or Vue ref you want to attach the gesture to.                                       |
| [`eventOptions`](#eventoptions) | Lets you customize if you want events to be passive or captured.                                                |
| [`window`](#window)             | Lets you specify which window element the gesture should bind events to (only relevant for the `drag` gesture). |
| [`enabled`](#enabled)           | When set to `false` none of your handlers will be fired.                                                        |

### Gesture options

Here are all options that can be applied to gestures.

::: warning
All options are not available to all gestures. In the table below **xy** designates coordinates-based gestures: drag, move, wheel and scroll.
:::

| Options                                                                             | Gestures  | Description                                                                                                                                                                                          |
| ----------------------------------------------------------------------------------- | :-------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`enabled`](#enabled)                                                               |  **all**  | Whether the gesture is enabled.                                                                                                                                                                      |
| [`initial`](#initial)                                                               |  **all**  | The initial position `movement` should start from.                                                                                                                                                   |
| [`threshold`](#threshold)                                                           |  **all**  | The handler will fire only when the gesture displacement is greater than the threshold.                                                                                                              |
| [`triggerAllEvents`](#triggerallevents)                                             |  **all**  | Forces the handler to fire even for non intentional displacement (ignores the `threshold`). In that case, the `intentional` attribute from state will remain `false` until the threshold is reached. |
| [`axis`](#axis-xy-gestures-only)                                                    |  **xy**   | Your handler will only trigger if a movement is detected on the specified axis.                                                                                                                      |
| [`lockDirection`](#lockdirection-xy-gestures-only)                                  |  **xy**   | If `true`, the gesture will lock the first detected direction.                                                                                                                                       |
| [`bounds`](#bounds)                                                                 |  **xy**   | Limits the gesture `movement` and `offset` to the specified bounds.                                                                                                                                  |
| [`distanceBounds`](#distancebounds)                                                 | **pinch** | Limits the distance `movement` and `offset` to the specified bounds.                                                                                                                                 |
| [`angleBounds`](#anglebounds)                                                       | **pinch** | Limits the angle `movement` and `offset` to the specified bounds.                                                                                                                                    |
| [`rubberband`](#rubberband)                                                         |  **all**  | The elasticity coefficient of the gesture when going out of bounds. When set to `true`, the elasticiy coefficient will be defaulted to `0.15`                                                        |
| [`transform`](#transform)                                                           |  **all**  | A function that you can use to transform pointer values. Useful to map your screen coordinates to custom space coordinates such as a canvas.                                                         |
| [`filterTaps`](#filtertaps-drag-only)                                               | **drag**  | If `true`, the component won't trigger your drag logic if the user just clicked on the component.                                                                                                    |
| [`experimental_preventWindowScrollY`](#experimental_preventwindowscrolly-drag-only) | **drag**  | If `true`, drag will be triggered after `250ms` and will prevent window scrolling.                                                                                                                   |
| [`useTouch`](#usetouch-drag-only)                                                   | **drag**  | If `true`, drag will use touch events on touch-enabled devices. [Read more below](#usetouch-drag-only).                                                                                              |
| [`delay`](#delay-drag-only)                                                         | **drag**  | If set, the handler will be delayed for the duration of the delay (in `ms`) — or if the user starts moving. When set to `true`, `delay` is defaulted to `180ms`.                                     |
| [`swipeDistance`](#swipedistance-drag-only)                                         | **drag**  | The minimum distance per axis (in `pixels`) the drag gesture needs to travel to trigger a swipe.                                                                                                     |
| [`swipeVelocity`](#swipevelocity-drag-only)                                         | **drag**  | The minimum velocity per axis (in `pixels / ms`) the drag gesture needs to reach before the pointer is released.                                                                                     |
| [`swipeDuration`](#swipeduration-drag-only)                                         | **drag**  | The maximum duration in milliseconds that a swipe is detected.                                                                                                                                       |

## Options explained

### domTarget

<specs-row :types="['node', 'Ref']" default-value="undefined"></specs-row>

&zwnj;<vue-use-gesture></vue-use-gesture> also supports adding handlers to dom nodes directly (or the <code>window</code> or <code>document</code> objects). In that case, you shouldn't spread the <code>bind()</code> object returned by the
hooks as a prop. Cleaning is handled automatically.

```html {7}
<script>
  export default {
    setup() {
      const [{ width }, set] = useSpring(() => ({ width: 0 }))
      const height = document.documentElement.scrollHeight

      useScroll(({ xy: [, y] }) => set({ width: (y / height) * 100 }), { domTarget: window })

      const style = computed(() => ({ width }))
      return { style }
    },
  }
</script>
<div :style="style" />
```

The code above binds the `scroll` gesture to the document `window`, and acts as a scroll indicator. Try scrolling the page and you'll see the blue bar progress.

<code-view id="DomTarget" disable-overlay></code-view>

You can also directly pass a ref to `domTarget`. This is actually usefull when you want your events **not to be passive**.

```html {2,11}
<template>
  <div :ref="myRef" />
</template>

<script>
  export default {
    setup() {
      const myRef = ref(null)
      // This will add a scroll listener the div
      useScroll(({ event }) => event.preventDefault(), {
        domTarget: myRef,
        eventOptions: { passive: false },
      })
      return { myRef }
    },
  }
</script>
```

### eventOptions

<specs-row types="{capture: boolean, passive: bolean}" default-value="{capture: false, passive: true}"></specs-row>

When `eventOptions.capture` is set to `true`, [events will be captured](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).

`eventOptions.passive` sets whether events are [passive](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener).

### window

<specs-row types="node" default-value="window"></specs-row>

Lets you specify which window element the gesture should bind events to (only relevant for the `drag` gesture).

### enabled

<specs-row types="boolean" default-value="true"></specs-row>

Whether the gesture is enabled.

### initial

<specs-row :types="['vector', '(gestureState) => vector']" default-value="[0,0]"></specs-row>

Everytime a gesture starts, the `movement` state attribute is set to `[0,0]`. But in some cases, you might want to calculate `movement` from an initial position that is external to your logic[^1].

[^1]: If you're used to <vue-use-gesture></vue-use-gesture>, this was the most common usecase for `memo`.

Let's take a tangible example: say that a draggable component turns back to its initial position **slowly**. In the meantime, the draggable component should still be **interruptible** at any moment. In that case, you can use `initial` to set the position of the component **at the moment** the user drags it to the value of the spring.

::: info
TODO: the following example doesn't work as expected, WIP.
:::
<code-view id="Initial"></code-view>

Drag the blue square and **before it goes back to its origin** drag it again. If you've unticked the checkbox, you'll notice that the square goes back to its origin instead of moving from where you've dragged it: that's because `movement` is by default reset to `[0,0]`.

The code below shows how the example works:

```html {9-12}
<template>
  <div v-bind="bind()" :style="style" />
</template>

<script>
  export default {
    setup() {
      const [{ x }, set] = useSpring(() => ({ x: 0 }))
      const bind = useDrag(
        ({ down, movement: [mx] }) => set({ x: down ? mx : 0, immediate: down, config: { duration: 3000 } }),
        { initial: () => [x.value, 0] }
      )
      const style = computed(() => ({ transform: `translate3d(${x.value}px,0,0)` }))
      return { bind, style }
    },
  }
</script>
```

### threshold

<specs-row :types="['vector', 'number']" default-value="[0,0]"></specs-row>

By default, your gesture handler will be triggered as soon as an event is fired. However, there are situations where you want to make sure the user action is **intentional**: that's where `threshold` comes into play.

`threshold` is the minimum displacement the gesture movement needs to travel before your handler is fired.

<code-view id="Threshold"></code-view>

In this example, we've set the `threshold` to `100`[^2] and made visible when that threshold is exceeded: when you start dragging the blue square, you'll see a ghost square showing how many pixels are left until the blue square starts moving per axis[^3].

[^2]: This is a bit extreme in actual use cases you would be closer to `20`.
[^3]: As you might have noticed from the example above, `threshold` works **per axis**: if the gesture exceeds the threshold value horizontally, you will get updates for horizontal displacement, but vertical threshold will have to be reached before vertical displacement is registered.

```html {9-11}
<template>
  <div v-bind="bind()" :style="style" />
</template>

<script>
  export default {
    setup() {
      const [{ x, y }, set] = useSpring(() => ({ x: 0, y: 0 }))
      const bind = useDrag(({ offset: [x, y] }) => set({ x, y }), {
        threshold: 10,
      })
      const style = computed(() => ({ transform: `translate3d(${x.value}px,${y.value}px,0)` }))
      return { bind, style }
    },
  }
</script>
```

::: info
If you still want your handler to be triggered for non intentional displacement, this is where the `triggerAllEvents` config option and the `intentional` state attribute become useful.
:::

### triggerAllEvents

<specs-row types="boolean" default-value="false"></specs-row>

Forces the handler to fire even for non intentional displacement (ignores the `threshold`). In that case, the `intentional` attribute from state will remain `false` until the threshold is reached.

### bounds

<specs-row :types="['Bounds: { top?: number, bottom?: number, left?: number, right?: number }', '(gestureState) => Bounds']" default-value="{ top: -Infinity, bottom: Infinity, left: -Infinity, right: Infinity }"></specs-row>

If you want to set contraints to the user gesture, then you should use the `bounds` option. In that case, **both** the gesture `movement` and `offset` will be clamped to the specified `bounds`. `bounds` will be defaulted to `Infinity` when not set.

<code-view id="Bounds" disable-overlay></code-view>

```html {9-11}
<template>
  <div v-bind="bind()" :style="style" />
</template>

<script>
  export default {
    setup() {
      const [{ x, y }, set] = useSpring(() => ({ x: 0, y: 0 }))
      const bind = useDrag(({ down, offset: [ox, oy] }) => set({ x: ox, y: oy, immediate: down }), {
        bounds: { left: -100, right: 100, top: -50, bottom: 50 },
      })
      const style = computed(() => ({ transform: `translate3d(${x.value}px,${y.value}px,0)` }))
      return { bind, style }
    },
  }
</script>
```

::: info
`distanceBounds` and `angleBounds` serve the same purpose as `bounds` for the `pinch` gesture, in a `{min,max}` format.
:::

### distanceBounds

<specs-row :types="['DistanceBounds: { min?: number, max?: number }', '(gestureState) => DistanceBounds']" default-value="{ min: -Infinity, max: Infinity }"></specs-row>

### angleBounds

<specs-row :types="['AngleBounds: { min?: number, max?: number }', '(gestureState) => AngleBounds']" default-value="{ min: -Infinity, max: Infinity }"></specs-row>

### rubberband

<specs-row :types="['boolean', 'number', 'vector']" default-value="[0,0]"></specs-row>

In some cases, you may want to simulate resistance when the user drags a component, for example when the end of a content is reached[^4].

[^4]: Have a look at [this article](https://medium.com/@nathangitter/building-fluid-interfaces-ios-swift-9732bb934bf5) for more details about building mobile interfaces.

<code-view id="Rubberband" disable-overlay></code-view>

You can set `rubberband` to `true` to use the default elasticity coeffecient of `0.15`, or specify your own. The `rubberband` option also accepts a vector if you want to set different elasticity coeffecients per axis.

```html {9-12}
<template>
  <div v-bind="bind()" :style="style" />
</template>

<script>
  export default {
    setup() {
      const [{ x, y }, set] = useSpring(() => ({ x: 0, y: 0 }))
      const bind = useDrag(({ down, offset: [ox, oy] }) => set({ x: ox, y: oy, immediate: down }), {
        bounds: { left: -100, right: 100, top: -50, bottom: 50 },
        rubberband: true,
      })
      const style = computed(() => ({ transform: `translate3d(${x.value}px,${y.value}px,0)` }))
      return { bind, style }
    },
  }
</script>
```

Note that you have to set [`bounds`](#bounds) for rubberbanding to take effect.

::: info
If you stop your gesture while being off-bounds, **the `offset` or `movement` for the last event will be reverted to the closest bounds**.
:::

### transform

<specs-row types="(xy: Vector2) => Vector2" default-value="undefined"></specs-row>

When you're interacting with canvas objects, you're dealing with space coordinates that aren't measured in pixels. In that case, you can tell <vue-use-gesture></vue-use-gesture> to map screen values to the space with a `transform` function.

::: info
TODO: we'll add trois example here.
:::

<!-- <code-view id="Transform"></code-view> -->

As you can see from the example below, we use the `transform` function to map the screen coordinates to THREE coordinates. Note that `bounds` or `initial` values are expected to be expressed in the new space coordinates. Only `threshold` always refers to screen pixel values.

```js
// todo: example code
```

::: info
When you use the `useGesture` hook, you can set the `transform` option at the shared level and at the gesture level, with the `transform` set at the gesture level oveerriding the shared one.
:::

```js
useGesture({/* handlers */ }, {
  transform: ([x, y]) => [x/2, y/2 ] // shared transform applies to all gestures
  pinch: {
    transform: xy => xy // specific pinch transform overrides shared
  }
})
```

### axis (xy gestures only)

<specs-row :types="['x', 'y', 'undefined']" default-value="undefined"></specs-row>

`axis` makes it easy to constraint the user gesture to a specific axis.

<code-view id="Axis"></code-view>

```html {9}
<template>
  <div v-bind="bind()" :style="style" />
</template>

<script>
  export default {
    setup() {
      const [{ x }, set] = useSpring(() => ({ x: 0 }))
      const bind = useDrag(({ down, movement: [mx] }) => set({ x: down ? mx : 0 }), { axis: 'x' })
      const style = computed(() => ({ transform: `translate3d(${x.value}px,${y.value}px,0)` }))
      return { bind, style }
    },
  }
</script>
```

From the code below it isn't obvious to understand why `axis` might be useful, since in any case the `y` movement isn't part of the logic.

But in reality `axis` does slightly more than just locking the gesture direction: if it detects that the user intent is to move the component in a different direction, it will stop firing the gesture handler. Here is an example to show the difference.

<code-view id="Axis2"></code-view>

The component above can only move along the `x` axis. But try dragging and moving the component on the vertical axis. Without the `axis` option, you should notice the component movement will slightly jiggle horizontally because your movement won't be perfectly vertical.

### lockDirection (xy gestures only)

<specs-row types="boolean" default-value="false"></specs-row>

`lockDirection` allows you to lock the movement of the gesture once a direction has been detected. In other words, if the user starts moving horizontally, the gesture will be locked on the `x` axis.

<code-view id="LockDirection"></code-view>

```html {9-14}
<template>
  <div v-bind="bind()" :style="style" />
</template>

<script>
  export default {
    setup() {
      const [{ x, y }, set] = useSpring(() => ({ x: 0, y: 0 }))
      const bind = useDrag(
        ({ down, movement: [mx, my] }) => {
          set({ x: down ? mx : 0, y: down ? my : 0, immediate: down })
        },
        { lockDirection: true }
      )
      const style = computed(() => ({ transform: `translate3d(${x.value}px,${y.value}px,0)` }))
      return { bind, style }
    },
  }
</script>
```

### filterTaps (drag only)

<specs-row types="boolean" default-value="false"></specs-row>

Making a draggable component tappable or clickable can be tricky: differenciating a click from a drag is not always trivial. When you set `filterTaps` to `true`, the [`tap`](/docs/state/#tap-drag-only) state attribute will be `true` on release if the total displacement is inferior to `3 pixels` while `down` will remain `false` all along.

<code-view id="FilterTaps"></code-view>

```html {9-15}
<template>
  <div v-bind="bind()" :style="style" />
</template>

<script>
  export default {
    setup() {
      const [{ x, y }, set] = useSpring(() => ({ x: 0, y: 0 }))
      const bind = useDrag(
        ({ down, movement: [mx, my], tap }) => {
          if (tap) alert('tap!')
          set({ x: down ? mx : 0, y: down ? my : 0 })
        },
        { filterTaps: true }
      )
      const style = computed(() => ({ transform: `translate3d(${x.value}px,${y.value}px,0)` }))
      return { bind, style }
    },
  }
</script>
```

::: info
If you still want your handler to be triggered for non intentional displacement, this is where the `triggerAllEvents` config option and the `intentional` state attribute become useful.
:::

<specs-row types="boolean" default-value="false"></specs-row>

**This is an experimental feature, relevant for mobile devices**.

`touch-action: none` is a common css property that you'll set on draggable items so that scroll doesn't interfere with the drag behavior on touch devices. However, this generally means that the scroll of the page can't be initiated from the draggable element. This is fine if your page isn't meant to be scrolled or if your draggable element is relatively small, but in case of large draggable areas this might become a usability issue.

`experimental_preventWindowScrollY` is a convenient way to have both vertical drag and vertical scrolling coexist. Note that scroll will always have precedence over drag. To drag vertically the user will have to press the draggable area for `250ms` without moving. After these `250ms` the element is draggable and scroll is prevented. Note that if you drag horizontally the scroll will immediately be prevented without waiting for `250ms`.

::: info
TODO: we'll add trois example here.
:::

On desktop, you should be able to drag the torus as you would expect. On mobile, initiating the scroll from the torus should let you scroll the page as expected. Hold touch and drag and you should be able to drag the canvas. This might be clunky as still under test.

### useTouch (drag only)

Most gestures, drag included, use [pointer events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events). This works well in 99 situations in 100, but pointer events get canceled on touch devices when the user starts scrolling. Usually this is what you actually want, and the browser does it for you. But in some situations you may want the drag to persist while scrolling. In that case you'll need to indicate <vue-use-gesture></vue-use-gesture> to use touch events, which aren't canceled on scroll.

### delay (drag only)

<specs-row :types="['boolean', 'number']" default-value="0"></specs-row>

`delay` delays the drag gesture for the amount of milliseconds you specify. This might be useful if you don't want your logic to fire right away. The below example has a `delay` set to `1000`. Try clicking on the square without moving your mouse.

<code-view id="Delay"></code-view>

::: info
Note that `delay` and `threshold` don't play well together: without moving your pointer, your handler will never get triggered.
:::

```html {9-12}
<template>
  <div v-bind="bind()" :style="style" />
</template>

<script>
  export default {
    setup() {
      const [{ x, y, scale }, set] = useSpring(() => ({ x: 0, y: 0, scale: 1 }))
      const bind = useDrag(
        ({ down, movement: [mx, my] }) => set({ x: down ? mx : 0, y: down ? my : 0, scale: down ? 1.2 : 1 }),
        { delay: 1000 }
      )
      const style = computed(() => ({ transform: `scale(${scale.value}) translate3d(${x.value}px,${y.value}px,0)` }))
      return { bind, style }
    },
  }
</script>
```

### swipeDistance (drag only)

<specs-row types="['number', 'vector']" default-value="[50,50]" ></specs-row>

See the [`swipe`](/docs/state/#swipe-drag-only) state attribute for more.

### swipeVelocity (drag only)

<specs-row types="['number', 'vector']" default-value="[0.5,0.5]" ></specs-row>

See the [`swipe`](/docs/state/#swipe-drag-only) state attribute for more.

### swipeDuration (drag only)

<specs-row types="number" default-value="250"></specs-row>

A drag gesture lasting moore than `swipeDuration` (in milliseconds) will never be considered a swipe. See the [`swipe`](/docs/state/#swipe-drag-only) state attribute for more.
