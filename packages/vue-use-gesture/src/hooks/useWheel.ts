import { UseWheelConfig, Handler, EventTypes } from '../types'
import { _buildWheelConfig } from './buildConfig'
import useRecognizers from './useRecognizers'
import { RecognizersMap } from '../recognizers/Recognizer'
import { WheelRecognizer } from '../recognizers/WheelRecognizer'
import memoize from '../utils/memoize-one'
import isEqual from '../utils/react-fast-compare'
import { ref } from 'vue-demi'

/**
 * Wheel hook.
 *
 * @param handler - the function fired every time the wheel gesture updates
 * @param the config object including generic options and wheel options
 */
export function useWheel<K = EventTypes['wheel']>(handler: Handler<'wheel', K>, config: UseWheelConfig | {} = {}) {
  RecognizersMap.set('wheel', WheelRecognizer)
  const buildWheelConfig = ref<any>()
  if (!buildWheelConfig.value) {
    buildWheelConfig.value = memoize(_buildWheelConfig, isEqual)
  }
  return useRecognizers<UseWheelConfig>({ wheel: handler }, buildWheelConfig.value(config))
}
