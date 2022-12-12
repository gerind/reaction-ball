import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IGame {
  gameToken: string
  frames: Array<Array<number>>
}

const initialState: IGame = {
  gameToken: '',
  frames: [],
}

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    changeGameToken(state, action: PayloadAction<string>) {
      state.gameToken = action.payload
    },
    changeFrames(state, action: PayloadAction<Array<Array<number>>>) {
      state.frames = action.payload
    },
  }
})

export const gameActionCreators = gameSlice.actions
export const gameReducer = gameSlice.reducer
