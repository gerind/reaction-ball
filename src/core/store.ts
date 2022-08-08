import { configureStore, createAction, createReducer, PayloadAction } from '@reduxjs/toolkit'
import { getInitialSongs } from './initialSongs'

export const changeNameAction = createAction<string>('changename')
export const changeTopAction = createAction<ITop>('changetop')
export const changeMainColorAction = createAction<string>('changemaincolor')
export const changeMainPageAction = createAction<IMainPage>('changemainstate')
export const turnEffectsAction = createAction('turneffects')
export const chooseSongAction = createAction<number>('choosesong')

export type ITop = Array<{
    name: string
    score: number
}>
export type IMainPage = 'menu' | 'game' | 'songs'
export interface ISong {
    url: string
    name: string
}
export interface ISongs {
    songs: ISong[]
    choosen: number
}

const initialState = {
    name: localStorage.getItem('name') || '',
    top: [] as ITop,
    maincolor: localStorage.getItem('maincolor') || '#84ff32',
    mainPage: 'menu' as IMainPage,
    effectsOn: localStorage.getItem('effects') === 'yes',
    songs: getInitialSongs()
}

const store = configureStore({
    reducer: createReducer(initialState, {
        [changeNameAction.type]: (state, action: PayloadAction<string>) => {
            const name = action.payload
            if (/^[0-9a-zA-Z]{0,20}$/.test(name)) {
                state.name = name
            }
        },
        [changeTopAction.type]: (state, action: PayloadAction<ITop>) => {
            state.top = action.payload
        },
        [changeMainColorAction.type]: (state, action: PayloadAction<string>) => {
            state.maincolor = action.payload
        },
        [changeMainPageAction.type]: (state, action: PayloadAction<IMainPage>) => {
            state.mainPage = action.payload
        },
        [turnEffectsAction.type]: (state) => {
            state.effectsOn = !state.effectsOn
        },
        [chooseSongAction.type]: (state, action: PayloadAction<number>) => {
            state.songs.choosen = action.payload
        }
    })
})

export type IState = typeof initialState

export default store