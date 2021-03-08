import { computed, onMounted, onUnmounted, reactive, Ref, ref, watch, toRefs } from 'vue-demi'
import { SpringConfig, noWobble } from './presets'
import { raf, cancelRaf, now, isArray, stepper, isFunction } from './utils'

const msPerFrame = 1000 / 60

type NumericalValues = Record<string, number> | number[]
export type SpringValue = NumericalValues

function defineInitialValues<T extends NumericalValues>(values: T, velocities: T | null): [T, T] {
  const newValues = (isArray(values) ? [] : {}) as T
  const newVelocities = (isArray(values) ? [] : {}) as T

  for (const key in values) {
    newValues[key] = values[key]
    // @ts-ignore
    newVelocities[key] = velocities ? velocities[key] : 0
  }

  return [newValues, newVelocities]
}

export interface SpringObject<T extends SpringValue> {
  values: T
}

const noop = () => {}

export function useSpring<T extends SpringValue>(
  initialValue: T | Ref<T>,
  // TODO: could change
  springConfiguration?: SpringConfig,
  options: {
    onRest?: () => any
  } = {}
): T {
  const spring = springConfiguration || noWobble

  const onRest = options.onRest || noop

  // hold a ref to real values so we can change them
  // @ts-ignore
  const realValues = isFunction(initialValue) ? ref(initialValue()) : ref(initialValue)

  let wasAnimating = false
  let prevTime = 0
  let accumulatedTime = 0

  watch(
    realValues,
    (_current, _old) => {
      if (!wasAnimating) {
        prevTime = now()
        accumulatedTime = 0
        animate()
      }
    },
    { deep: true }
  )

  const current = defineInitialValues(realValues.value, null)

  const currentValues = ref(current[0])
  const currentVelocities = ref(current[1])

  // only done to correctly infer types, they're overridden in mounted
  let idealValues = current[0]
  let idealVelocities = current[1]

  onMounted(() => {
    prevTime = now()
    accumulatedTime = 0

    const ideal = defineInitialValues(currentValues.value, currentVelocities.value)

    idealValues = ideal[0]
    idealVelocities = ideal[1]

    animate()
  })

  let animationId: number | void | undefined | null
  // TODO: also cancel when a new value comes
  onUnmounted(() => {
    if (animationId) {
      cancelRaf(animationId)
    }
  })

  function animate() {
    animationId = raf(() => {
      if (shouldStopAnimation(currentValues.value, realValues.value, currentVelocities.value)) {
        // TODO: emit
        if (wasAnimating) onRest()

        // reset everything for next animation
        animationId = null
        wasAnimating = false
        return
      }

      // TODO: emit
      // if (!wasAnimating) this.$emit('motion-start')
      wasAnimating = true

      // get time from last frame
      const currentTime = now()
      const timeDelta = currentTime - prevTime
      prevTime = currentTime
      accumulatedTime += timeDelta

      // more than 10 frames? probably switched browser tab. Restart
      if (accumulatedTime > msPerFrame * 10) {
        accumulatedTime = 0
      }

      if (accumulatedTime === 0) {
        // no need to cancel animationID here; shouldn't have any in flight
        animationId = null
        // TODO: emit
        // this.$emit('motion-restart')
        return animate()
      }

      const currentFrameCompletion =
        (accumulatedTime - Math.floor(accumulatedTime / msPerFrame) * msPerFrame) / msPerFrame
      const framesToCatchUp = Math.floor(accumulatedTime / msPerFrame)

      animateValues(
        framesToCatchUp,
        currentFrameCompletion,
        spring,
        realValues.value,
        currentValues.value,
        currentVelocities.value,
        idealValues,
        idealVelocities
      )

      // out of the update loop
      animationId = null
      // the amount we're looped over above
      accumulatedTime -= framesToCatchUp * msPerFrame

      // keep going!
      animate()
    })
  }

  const modifiableValues = (isArray(realValues.value) ? [] : {}) as T
  for (const key in realValues.value) {
    // @ts-ignore
    modifiableValues[key] = computed({
      // @ts-ignore
      get: () => currentValues.value[key],
      // @ts-ignore
      set: (v) => (realValues.value[key] = v),
    })
  }

  if (isFunction(initialValue)) {
    // @ts-ignore
    const values = toRefs(reactive(modifiableValues)) as any

    const update = (rawValuesObject: any) => {
      const keys = Object.keys(rawValuesObject)
      keys.forEach((key) => {
        if (!(key in values)) return
        values[key].value = rawValuesObject[key]
        if ('config' in rawValuesObject) Object.assign(spring, { config: rawValuesObject.config })
        if ('immediate' in rawValuesObject) Object.assign(spring, { immediate: rawValuesObject.immediate })
      })
    }

    // @ts-ignore
    return [values as T, update as any]
  }

  return reactive(modifiableValues) as T
}

function shouldStopAnimation(currentValues: SpringValue, values: SpringValue, currentVelocities: NumericalValues) {
  for (const key in values) {
    // istanbul ignore if
    // if (!Object.prototype.hasOwnProperty.call(values, key)) continue

    // Something is still moving
    if (currentVelocities[key as keyof NumericalValues] !== 0) return false

    // Something hasn't reached its destination
    // stepper will have already taken care of rounding precision errors, so
    // won't have such thing as 0.9999 != 1
    if (currentValues[key as keyof SpringValue] !== values[key as keyof SpringValue]) return false
  }

  return true
}

function animateValues(
  framesToCatchUp: number,
  currentFrameCompletion: number,
  spring: SpringConfig,
  realValues: SpringValue,
  currentValues: SpringValue,
  currentVelocities: SpringValue,
  idealValues: SpringValue,
  idealVelocities: SpringValue
) {
  for (const key in realValues) {
    // istanbul ignore if
    // if (!Object.prototype.hasOwnProperty.call(realValues, key)) continue

    let newIdealValue = idealValues[key as keyof NumericalValues] as number
    let newIdealVelocity = idealVelocities[key as keyof NumericalValues] as number
    const value = realValues[key as keyof NumericalValues] as number

    // iterate as if the animation took place
    for (let i = 0; i < framesToCatchUp; i++) {
      ;[newIdealValue, newIdealVelocity] = stepper(msPerFrame / 1000, newIdealValue, newIdealVelocity, value, spring)
    }

    const [nextIdealValue, nextIdealVelocity] = stepper(
      msPerFrame / 1000,
      newIdealValue,
      newIdealVelocity,
      value,
      spring
    )

    // @ts-ignore
    currentValues[key] = newIdealValue + (nextIdealValue - newIdealValue) * currentFrameCompletion
    // @ts-ignore
    currentVelocities[key] = newIdealVelocity + (nextIdealVelocity - newIdealVelocity) * currentFrameCompletion
    // @ts-ignore
    idealValues[key] = newIdealValue
    // @ts-ignore
    idealVelocities[key] = newIdealVelocity
  }
}
