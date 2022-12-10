import { TypedUseSelectorHook } from 'react-redux'
import { StateType } from '../store/store'
import { useStateSelector } from './stateSelector'

export const useDataSelector: TypedUseSelectorHook<StateType['data']> = (selector) => {
  const data = useStateSelector(state => state.data)
  return selector(data)
}
