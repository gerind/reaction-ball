import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getInitialSongs, ISongs } from '../core/initialSongs'
import { getInitialLocalTop } from '../core/utils'

export type ITop = Array<{
  name: string
  score: number
}>
export type IMainPage = 'menu' | 'game' | 'songs'
export type ITopType = 'local' | 'global'

interface IData {
  name: string,
  top: ITop,
  maincolor: string,
  mainpage: IMainPage,
  songs: ISongs,
  localtop: ITop,
  choosentop: ITopType
}

const initialState: IData = {
  name: localStorage.getItem('name') || '',
  top: [],
  maincolor: localStorage.getItem('maincolor') || '#84ff32',
  mainpage: 'menu',
  songs: getInitialSongs(),
  localtop: getInitialLocalTop(),
  choosentop: 'global'
}

export const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    changeName(state, action: PayloadAction<string>) {
      const name = action.payload
      if (/^[0-9a-zA-Z]{0,20}$/.test(name)) {
        state.name = name
        localStorage.setItem('name', name)
      }
    },
    changeTop(state, action: PayloadAction<ITop>) {
      state.top = action.payload
    },
    changeMainColor(state, action: PayloadAction<string>) {
      state.maincolor = action.payload
      localStorage.setItem('maincolor', action.payload)
    },
    changeMainPage(state, action: PayloadAction<IMainPage>) {
      state.mainpage = action.payload
    },
    chooseSong(state, action: PayloadAction<number>) {
      state.songs.choosen = action.payload
      localStorage.setItem('choosen', action.payload.toString())
    },
    clearLocalTop(state) {
      localStorage.removeItem('localtop')
      state.localtop = getInitialLocalTop()
    },
    pushLocalTop: {
      reducer(state, action: PayloadAction<{ name: string, score: number }>) {
          let id = 10
          while (id > 0 && state.localtop[id - 1].score < action.payload.score)
            --id
          if (id === 10)
            return
          for (let i = 9; i > id; --i)
            state.localtop[i] = state.localtop[i - 1]
          state.localtop[id] = {
            name: action.payload.name, score: action.payload.score
          }
          localStorage.setItem('localtop', JSON.stringify(state.localtop))
        },
        prepare(name: string, score: number) {
          return {
            payload: {
              name, score
            }
          }
        }
    },
    toggleTop(state) {
      if (state.choosentop === 'local')
        state.choosentop = 'global'
      else
        state.choosentop = 'local'
    }
  }
})

export const dataActionCreators = dataSlice.actions
export const dataReducer = dataSlice.reducer
