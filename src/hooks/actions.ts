import { useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
import { dataActionCreators } from '../store/data.slice'
import { useMemo } from 'react'
import { gameActionCreators } from '../store/game.slice'

export const useDataActions = () => {
  const dispatch = useDispatch()
  return useMemo(() => bindActionCreators(dataActionCreators, dispatch), [dispatch])
}

export const useGameActions = () => {
  const dispatch = useDispatch()
  return useMemo(() => bindActionCreators(gameActionCreators, dispatch), [dispatch])
}
