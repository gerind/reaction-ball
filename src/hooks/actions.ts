import { useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
import { dataActionCreators } from '../store/data.slice'
import { useMemo } from 'react'

export const useActions = () => {
  const dispatch = useDispatch()
  return useMemo(() => bindActionCreators(dataActionCreators, dispatch), [dispatch])
}