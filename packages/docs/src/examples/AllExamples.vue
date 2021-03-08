<script lang="jsx">
import { useDrag, useSpring, useScroll, useGesture, useWheel } from 'vue-use-gesture'
import { computed, defineComponent, ref, watchEffect, onMounted } from 'vue'
import styles from './style.module.css'
import cn from 'classnames'
import { Lethargy } from 'lethargy'

export default {}

export const PullRelease = defineComponent({
  props: ['setActive'],
  setup(props) {
    const [{ x, y }, set] = useSpring(() => ({ x: 0, y: 0 }))

    const bind = useDrag(({ down, movement: [mx, my] }) => {
      props.setActive && props.setActive(down)
      set({ x: down ? mx : 0, y: down ? my : 0, immediate: down })
    })

    const style = computed(() => ({ transform: `translate3d(${x.value}px,${y.value}px,0)` }))

    return () => {
      // return h('div', { ...bind(), style: style.value, class: styles.drag }, '')
      return <div {...bind()} style={style.value} className={styles.drag}></div>
    }
  },
})

export const DomTarget = defineComponent({
  setup() {
    const [{ width }, set] = useSpring(() => ({ width: 0 }))
    useScroll(
      ({ xy: [, y] }) => {
        set({ width: (y / document.documentElement.scrollHeight) * 100 })
      },
      { domTarget: typeof window === 'object' ? window : null }
    )

    return () => {
      return <div className={styles.scroll} style={{ width: width.value + '%' }}></div>
    }
  },
})

export const Initial = defineComponent({
  props: ['setActive'],
  setup(props) {
    const usingInitial = ref(true)
    const [{ x }, set] = useSpring(() => ({ x: 0 }))

    const bind = useDrag(
      ({ down, movement: [mx] }) => {
        props.setActive && props.setActive(down)
        // TODO: vue-use-spring doesn't support immediate and duration
        set({ x: down ? mx : 0, immediate: down, config: { duration: 3000 } })
      },
      {
        initial: usingInitial.value ? () => [x.value, 0] : [0, 0],
      }
    )

    const style = computed(() => ({ transform: `translate3d(${x.value}px,0,0)` }))

    return () => {
      return (
        <>
          <div className={styles.ui}>
            <label>
              <input
                type="checkbox"
                checked={usingInitial.value}
                onInput={(e) => (usingInitial.value = e.target.checked)}
              />
              Use initial
            </label>
          </div>
          <div className={styles.drag} {...bind()} style={style.value} />
        </>
      )
    }
  },
})

export const Threshold = defineComponent({
  props: ['setActive'],
  setup() {
    const [{ x, y }, set] = useSpring(() => ({ x: 0, y: 0 }))
    const [props, setL] = useSpring(() => ({ x: 0, y: 0, opacity: 0 }))

    const movX = ref(false)
    const movY = ref(false)

    const bind = useDrag(
      ({ _movement: [mx, my], _intentional: [ix, iy], down, movement: [x, y], intentional }) => {
        if (intentional) {
          // TODO: vue-use-spring immediate
          set({ x: down ? x : 0, y: down ? y : 0, immediate: down })
        }
        if (!down) {
          movX.value = false
          movY.value = false
          setL({ x: 0, y: 0, opacity: 0 })
        } else {
          setL({ opacity: 1 })
          ix ? (movX.value = true) : setL({ x: mx })
          iy ? (movY.value = true) : setL({ y: my })
        }
      },
      { threshold: 100, triggerAllEvents: true }
    )

    const th = (index) => (v) => {
      const displ = Math.floor(100 - Math.abs(v))
      const axis = index === 0 ? 'x: ' : 'y: '
      const m = index === 0 ? movX.value : movY.value
      if (displ > 0 && !m) return axis + `${displ} px`
      return axis + 'moves!'
    }

    // TODO: vue-use-spring `.to`
    const xMoves = computed(() => th(0)(props.x.value))
    const yMoves = computed(() => th(1)(props.y.value))

    const style = computed(() => ({ transform: `translate3d(${x.value}px, ${y.value}px,0)` }))
    const styleProps = computed(() => ({
      transform: `translate3d(${props.x.value}px, ${props.y.value}px,0)`,
      opacity: props.opacity.value,
    }))

    return () => {
      return (
        <>
          <div className={styles.drag} {...bind()} style={style.value}>
            <div style={styleProps.value}>
              <div>
                <div style={{ color: movX.value ? 'red' : 'black' }}>{xMoves.value}</div>
                <div style={{ color: movY.value ? 'blue' : 'black' }}>{yMoves.value}</div>
              </div>
            </div>
          </div>
        </>
      )
    }
  },
})

const bounds = { left: -85, right: 85, top: -50, bottom: 50 }
export const Bounds = defineComponent({
  props: ['setActive'],
  setup(props) {
    const [{ x, y }, set] = useSpring(() => ({ x: 0, y: 0 }))
    const bind = useDrag(
      ({ down, offset: [ox, oy] }) => {
        props.setActive && props.setActive(down)
        set({ x: ox, y: oy, immediate: down })
      },
      { bounds }
    )
    const style = computed(() => ({ transform: `translate3d(${x.value}px,${y.value}px,0)` }))

    return () => {
      return (
        <>
          <div className={styles.limits} />
          <div className={styles.drag} {...bind()} style={style.value} />
        </>
      )
    }
  },
})

export const Rubberband = defineComponent({
  props: ['setActive'],
  setup(props) {
    const [{ x, y }, set] = useSpring(() => ({ x: 0, y: 0 }))
    const bind = useDrag(
      ({ down, offset: [ox, oy] }) => {
        props.setActive && props.setActive(down)
        set({ x: ox, y: oy, immediate: down })
      },
      { bounds, rubberband: true }
    )
    const style = computed(() => ({ transform: `translate3d(${x.value}px,${y.value}px,0)` }))

    return () => {
      return (
        <>
          <div className={styles.limits} />
          <div className={styles.drag} {...bind()} style={style.value} />
        </>
      )
    }
  },
})

export const Axis = defineComponent({
  props: ['setActive'],
  setup(props) {
    const axis = ref('x')
    const [{ x, y }, set] = useSpring(() => ({ x: 0, y: 0 }))
    const bind = useDrag(
      ({ down, movement: [mx, my] }) => {
        props.setActive && props.setActive(down)
        set({ x: down ? mx : 0, y: down ? my : 0, immediate: down })
      },
      { axis: axis.value === 'false' ? undefined : axis.value }
    )
    const style = computed(() => ({ transform: `translate3d(${x.value}px,${y.value}px,0)` }))

    return () => {
      return (
        <>
          <div class={cn(styles.ui, styles.horizontal)}>
            <label>
              <input
                type="radio"
                checked={axis.value === 'x'}
                value="x"
                onInput={(e) => (axis.value = e.target.value)}
              />
              X axis
            </label>
            <label>
              <input
                type="radio"
                checked={axis.value === 'y'}
                value="y"
                onInput={(e) => (axis.value = e.target.value)}
              />
              Y axis
            </label>
            <label>
              <input
                type="radio"
                checked={axis.value === 'false'}
                value="false"
                onInput={(e) => (axis.value = e.target.value)}
              />
              No axis lock
            </label>
          </div>
          <div className={styles.drag} {...bind()} style={style.value} />
        </>
      )
    }
  },
})

export const Axis2 = defineComponent({
  props: ['setActive'],
  setup(props) {
    const axis = ref('x')
    const [{ x }, set] = useSpring(() => ({ x: 0 }))
    const bind = useDrag(
      ({ down, movement: [mx] }) => {
        props.setActive && props.setActive(down)
        set({ x: down ? mx : 0, immediate: down })
      },
      { axis: axis.value === 'false' ? undefined : axis.value }
    )
    const style = computed(() => ({ transform: `translate3d(${x.value}px,0,0)` }))

    return () => {
      return (
        <>
          <div class={cn(styles.ui, styles.horizontal)}>
            <label>
              <input
                type="radio"
                checked={axis.value === 'x'}
                value="x"
                onInput={(e) => (axis.value = e.target.value)}
              />
              X axis
            </label>
            <label>
              <input
                type="radio"
                checked={axis.value === 'false'}
                value="false"
                onInput={(e) => (axis.value = e.target.value)}
              />
              No axis lock
            </label>
          </div>
          <div className={styles.drag} {...bind()} style={style.value} />
        </>
      )
    }
  },
})

export const LockDirection = defineComponent({
  props: ['setActive'],
  setup(props) {
    const [{ x, y }, set] = useSpring(() => ({ x: 0, y: 0 }))
    const bind = useDrag(
      ({ down, movement: [mx, my] }) => {
        set({ x: down ? mx : 0, y: down ? my : 0, immediate: down })
        props.setActive && props.setActive(down)
      },
      { lockDirection: true }
    )

    const style = computed(() => ({ transform: `translate3d(${x.value}px,${y.value}px,0)` }))

    return () => {
      return <div className={styles.drag} {...bind()} style={style.value} />
    }
  },
})

export const FilterTaps = defineComponent({
  props: ['setActive'],
  setup(props) {
    const [{ x, y }, set] = useSpring(() => ({ x: 0, y: 0 }))
    const status = ref('idle')
    const bind = useDrag(
      ({ down, movement: [mx, my], tap, elapsedTime }) => {
        if (tap) {
          status.value = `tap registered in ${~~elapsedTime}ms`
          setTimeout(() => (status.value = 'idle'), 1000)
          return
        } else {
          status.value = down ? 'dragging' : 'idle'

          props.setActive && props.setActive(down)
          set({ x: down ? mx : 0, y: down ? my : 0 })
        }
      },
      { filterTaps: true }
    )

    const style = computed(() => ({ transform: `translate3d(${x.value}px,${y.value}px,0)` }))

    return () => {
      return (
        <>
          <div className={styles.ui}>
            <div>status: {status.value}</div>
          </div>
          <div className={styles.drag} {...bind()} style={style.value} />
        </>
      )
    }
  },
})

export const Delay = defineComponent({
  props: ['setActive'],
  setup(props) {
    const [style, set] = useSpring(() => ({
      x: 0,
      y: 0,
      scale: 1,
      backgroundColor: 'lightskyblue',
    }))
    const [{ countdown }, setCountdown] = useSpring(() => ({
      countdown: 1000,
    }))
    const status = ref('idle')
    const timer = ref()

    const startCountdown = () => {
      props.setActive(true)
      const start = performance.now()
      timer.value = setInterval(() => {
        const elapsedTime = Math.max(0, Math.floor(1000 - performance.now() + start))
        if (elapsedTime === 0) {
          clearInterval(timer.value)
          status.value = 'elapsed'
        }
        setCountdown({ countdown: elapsedTime })
      }, 10)
    }

    const clearCountdown = () => {
      props.setActive(false)
      clearInterval(timer.value)
      setCountdown({ countdown: 1000, immediate: true })
      status.value = 'idle'
    }

    const bind = useGesture(
      {
        onDrag: ({ down, movement: [mx, my], distance, last }) => {
          if (distance > 0 && down && status.value !== 'elapsed') {
            clearInterval(timer.value)
            status.value = 'moved'
          }
          if (last) clearCountdown()

          set({
            x: down ? mx : 0,
            y: down ? my : 0,
            scale: down ? 1.2 : 1,
            backgroundColor: down ? 'hotpink' : 'lightskyblue',
          })
        },
        onPointerDown: startCountdown,
        onPointerUp: clearCountdown,
      },
      { drag: { delay: 1000 } }
    )

    onMounted(() => {
      clearInterval(timer.value)
    })

    const styleCss = computed(() => ({ transform: `translate3d(${style.x.value}px,${style.y.value}px,0)` }))

    return () => {
      return (
        <>
          <div className={styles.ui}>
            {status.value === 'elapsed' ? (
              <span style={{ color: 'hotpink' }}>Drag started after 1000ms delay</span>
            ) : status.value === 'moved' ? (
              <span style={{ color: 'hotpink' }}>Drag started because you moved!</span>
            ) : (
              <span>{countdown.value.toFixed(0)}ms before drag starts</span>
            )}
          </div>
          <div className={styles.drag} {...bind()} style={styleCss.value} />
        </>
      )
    }
  },
})

export const Offset = defineComponent({
  props: ['setActive'],
  setup(props) {
    const [{ x, y }, set] = useSpring(() => ({ x: 0, y: 0 }))
    const bind = useDrag(({ down, offset: [x, y] }) => {
      props.setActive && props.setActive(down)
      set({ x, y })
    })

    const style = computed(() => ({ transform: `translate3d(${x.value}px,${y.value}px,0)` }))

    return () => {
      return <div className={styles.drag} {...bind()} style={style.value} />
    }
  },
})

export const Cancel = defineComponent({
  props: ['setActive'],
  setup(props) {
    const bg = ref('cornflowerblue')
    const [{ x }, set] = useSpring(() => ({ x: 0 }))
    const bind = useDrag(({ active, movement: [mx], cancel, canceled }) => {
      props.setActive && props.setActive(active)
      if (mx > 200) cancel()
      set({
        x: active ? mx : 0,
        immediate: active,
      })

      bg.value = canceled ? 'lightpink' : 'cornflowerblue'
    })

    const style = computed(() => ({ transform: `translate3d(${x.value}px,0,0)`, background: bg.value }))

    return () => {
      return (
        <>
          <div className={styles.cancelLimit} />
          <div className={styles.drag} {...bind()} style={style.value} />
        </>
      )
    }
  },
})

export const Swipe = defineComponent({
  props: ['setActive'],
  setup(props) {
    const position = ref(0)
    const space = 100

    const [{ x }, set] = useSpring(() => ({ x: position.value * space }))
    const bind = useDrag(({ down, swipe: [swipeX] }) => {
      position.value = Math.min(Math.max(-1, position.value + swipeX), 1)
      props.setActive && props.setActive(down)
    })

    watchEffect(() => {
      set({ x: position.value * space })
    })

    const style = computed(() => ({ transform: `translate3d(${x.value}px,0,0)` }))

    return () => {
      return (
        <>
          <div
            className={cn(styles.square, { [styles.active]: position.value === -1 })}
            style={{ transform: `translateX(-${space}px) scale(1.1)` }}
          />
          <div className={cn(styles.square, { [styles.active]: position.value === 0 })} />
          <div
            className={cn(styles.square, { [styles.active]: position.value === 1 })}
            style={{ transform: `translateX(${space}px) scale(1.1)` }}
          />
          <div className={styles.drag} {...bind()} style={style.value} />
        </>
      )
    }
  },
})

const colors = ['lightcoral', 'cadetblue', 'mediumpurple', 'darkorange']

export const TouchAction = defineComponent({
  props: ['setActive'],
  setup() {
    const itemsState = ref(colors.map((color) => ({ moving: false, background: color })))

    const [item1, set1] = useSpring(() => ({ x: 0, opacity: 1 }))
    const [item2, set2] = useSpring(() => ({ x: 0, opacity: 1 }))
    const [item3, set3] = useSpring(() => ({ x: 0, opacity: 1 }))
    const [item4, set4] = useSpring(() => ({ x: 0, opacity: 1 }))

    const springGroup = [
      { item: item1, set: set1, state: itemsState.value[0] },
      { item: item2, set: set2, state: itemsState.value[1] },
      { item: item3, set: set3, state: itemsState.value[2] },
      { item: item4, set: set4, state: itemsState.value[3] },
    ]

    const groupSetter = (index, value, value2) => {
      springGroup.forEach((springItem, i) => {
        if (index === i) {
          springItem.set(value)
          springItem.state.moving = value.moving
        } else {
          springItem.set(value2)
        }
      })
    }

    const bind = useDrag(
      ({ active, down, movement: [x], args: [index] }) => {
        groupSetter(index, { x: active ? x : 0, moving: active, immediate: down }, { opacity: down ? 0.6 : 1 })
      },
      { axis: 'x', threshold: 20 }
    )

    const getStyle = (springItem) => ({
      transform: `translate3d(${springItem.item.x.value}px,0,0)`,
      opacity: springItem.item.opacity.value,
      background: springItem.state.background,
      // touchAction: 'pan-y',
    })

    return () => {
      return (
        <>
          {springGroup.map((springItem, i) => (
            <div className={styles.drag} {...bind(i)} style={getStyle(springItem)}>
              {springItem.state.moving ? `body shouldn't scroll` : '← Drag me →'}
            </div>
          ))}
        </>
      )
    }
  },
})

const clamp = (value, min, max) => Math.max(Math.min(max, value), min)

const slides = [0, 1, 2, 3, 4, 5]
// creates a new Lethargy check
// could be stored as a ref, or a global anywhere in your app
const lethargy = new Lethargy()

export const LethargyWheel = defineComponent({
  props: ['setActive'],
  setup() {
    const index = ref(0)
    const refElement = ref(null)

    useWheel(
      ({ event, last, memo: wait = false }) => {
        if (last) return
        event.preventDefault()
        event.stopPropagation()
        const s = lethargy.check(event)
        if (s) {
          if (!wait) index.value = clamp(index.value - s, 0, slides.length - 1)
          return true
        }
        return false
      },
      { domTarget: refElement, eventOptions: { passive: false } }
    )

    return () => {
      return (
        <>
          <div ref={refElement} style={{ transform: `translateY(${-index.value * 330}px)` }}>
            {slides.map((i) => (
              <div key={i}>{i}</div>
            ))}
          </div>
        </>
      )
    }
  },
})
</script>
