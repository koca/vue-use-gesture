import { SpringConfig } from './presets'

export const isClient = typeof window !== 'undefined'

export const raf = isClient ? window.requestAnimationFrame.bind(window) : () => {}
export const cancelRaf = isClient ? window.cancelAnimationFrame.bind(window) : () => {}

export const now = typeof performance !== 'undefined' ? performance.now.bind(performance) : Date.now.bind(Date)

export const isArray = Array.isArray.bind(Array)

export const isObject = (value: any): value is object => value != null && typeof value === 'object'
export const isFunction = (value: unknown): value is Function => typeof value === 'function'

// stepper is used a lot. Saves allocation to return the same array wrapper.
// This is fine and danger-free against mutations because the callsite
// immediately destructures it and gets the numbers inside without passing the
// array reference around.
const reusedTuple: [number, number] = [0, 0]
export function stepper(
  secondPerFrame: number,
  x: number,
  v: number,
  destX: number,
  spring: SpringConfig
): [number, number] {
  // Spring stiffness, in kg / s^2

  // for animations, destX is really spring length (spring at rest). initial
  // position is considered as the stretched/compressed position of a spring
  const Fspring = -spring.tension * (x - destX)
  // Damping, in kg / s
  const Fdamper = -spring.friction * v

  const a = (Fspring + Fdamper) / (spring.mass || 1)

  const newV = v + a * secondPerFrame
  const newX = x + newV * secondPerFrame

  const precision = spring.precision || 0.01

  if (Math.abs(newV) < precision && Math.abs(newX - destX) < precision) {
    reusedTuple[0] = destX
    reusedTuple[1] = 0
    return reusedTuple
  }

  reusedTuple[0] = newX
  reusedTuple[1] = newV

  return reusedTuple
}
