import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getInitialSongs, ISongs } from '../core/initialSongs'
import { getInitialLocalTop } from '../core/utils'

export type ITop = Array<{
  name: string
  score: number
}>
export type IMainPage = 'menu' | 'game' | 'songs'
export type ITopType = 'local' | 'global'
export type IGameStage = 'notstarted' | 'preload' | 'game' | 'finish'

interface IData {
  name: string
  top: ITop
  mainColor: string
  mainPage: IMainPage
  songs: ISongs
  localTop: ITop
  choosenTop: ITopType
  audio: HTMLAudioElement | null
  gameStage: IGameStage
}

const initialState: IData = {
  name: localStorage.getItem('name') || '',
  top: [],
  mainColor: localStorage.getItem('maincolor') || '#84ff32',
  mainPage: 'menu',
  songs: getInitialSongs(),
  localTop: getInitialLocalTop(),
  choosenTop: 'global',
  audio: null,
  gameStage: 'notstarted'
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
      state.mainColor = action.payload
      localStorage.setItem('maincolor', action.payload)
    },
    changeMainPage(state, action: PayloadAction<IMainPage>) {
      state.mainPage = action.payload
    },
    chooseSong(state, action: PayloadAction<number>) {
      state.songs.choosen = action.payload
      localStorage.setItem('choosen', action.payload.toString())
    },
    clearLocalTop(state) {
      localStorage.removeItem('localtop')
      state.localTop = getInitialLocalTop()
    },
    pushLocalTop: {
      reducer(state, action: PayloadAction<{ name: string, score: number }>) {
          let id = 10
          while (id > 0 && state.localTop[id - 1].score < action.payload.score)
            --id
          if (id === 10)
            return
          for (let i = 9; i > id; --i)
            state.localTop[i] = state.localTop[i - 1]
          state.localTop[id] = {
            name: action.payload.name, score: action.payload.score
          }
          localStorage.setItem('localtop', JSON.stringify(state.localTop))
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
      if (state.choosenTop === 'local')
        state.choosenTop = 'global'
      else
        state.choosenTop = 'local'
    },
    changeAudio(state, action: PayloadAction<HTMLAudioElement | null>) {
      state.audio = action.payload as typeof state.audio
    },
    changeGameStage(state, action: PayloadAction<IGameStage>) {
      state.gameStage = action.payload
    },
  }
})

export const dataActionCreators = dataSlice.actions
export const dataReducer = dataSlice.reducer
