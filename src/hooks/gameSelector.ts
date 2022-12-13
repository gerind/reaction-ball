import { TypedUseSelectorHook } from 'react-redux'
import { StateType } from '../store/store'
import { useStateSelector } from './stateSelector'

export const useGameSelector: TypedUseSelectorHook<
  StateType['game']
> = selector => {
  const game = useStateSelector(state => state.game)
  return selector(game)
}
