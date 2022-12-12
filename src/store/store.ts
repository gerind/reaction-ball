import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import { dataApi } from './data.api'
import { dataReducer } from './data.slice'
import { gameReducer } from './game.slice'

export const store = configureStore({
  reducer: {
    data: dataReducer,
    game: gameReducer,
    [dataApi.reducerPath]: dataApi.reducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(dataApi.middleware)
})

setupListeners(store.dispatch)

export type StateType = ReturnType<typeof store.getState>
