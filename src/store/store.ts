import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import { dataApi } from './data.api'
import { dataReducer } from './data.slice'

export const store = configureStore({
  reducer: {
    data: dataReducer,
    [dataApi.reducerPath]: dataApi.reducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(dataApi.middleware)
})

setupListeners(store.dispatch)

export type StateType = ReturnType<typeof store.getState>
