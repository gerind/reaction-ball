import { configureStore, createAction, createReducer, PayloadAction } from '@reduxjs/toolkit'
import { getInitialSongs } from './initialSongs'
import { getInitialLocalTop } from './utils'

export const changeNameAction = createAction<string>('changename')
export const changeTopAction = createAction<ITop>('changetop')
export const changeMainColorAction = createAction<string>('changemaincolor')
export const changeMainPageAction = createAction<IMainPage>('changemainstate')
export const turnEffectsAction = createAction('turneffects')
export const chooseSongAction = createAction<number>('choosesong')
export const clearLocalTopAction = createAction('clearlocaltop')
export const pushLocalTopAction = createAction('pushlocaltop', (name: string, score: number) => {
    return {
        payload: { name, score }
    }
})
export const toggleTopAction = createAction('toggletop')

export type ITop = Array<{
    name: string
    score: number
}>
export type IMainPage = 'menu' | 'game' | 'songs'
export type ITopType = 'local' | 'global'
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
    songs: getInitialSongs(),
    localtop: getInitialLocalTop(),
    choosentop: 'global' as ITopType
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
        },
        [clearLocalTopAction.type]: (state) => {
            localStorage.removeItem('localtop')
            state.localtop = getInitialLocalTop()
        },
        [pushLocalTopAction.type]: (state, action: PayloadAction<{ name: string, score: number }>) => {
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
        [toggleTopAction.type]: (state) => {
            if (state.choosentop === 'local')
                state.choosentop = 'global'
            else
                state.choosentop = 'local'
        }
    })
})

export type IState = typeof initialState

export default store