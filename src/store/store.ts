import { configureStore } from '@reduxjs/toolkit'
import { dataReducer } from './data.slice'

export const store = configureStore({
  reducer: {
    data: dataReducer
  }
})

export type StateType = ReturnType<typeof store.getState>
