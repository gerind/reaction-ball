import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useStore } from 'react-redux'
import { GlobalContext } from '..'
import { changeMainPageAction, changeTopAction, IState, pushLocalTopAction } from '../core/store'
import { checkCollision } from '../core/utils'
import IfComponent from './IfComponent'

type IType = Array<string | Array<number>>

interface IGameData {
    gameToken: string
    name: string
    game: Array<Array<number>>
    player: Array<Array<number>>
    score: number
    frame: number
    x: number
    y: number
}

interface IProps {
    coordsRef: { current: [number, number] }
}

const Game: React.FC<IProps> = ({ coordsRef }) => {

    console.log('Game render')

    const {savedInterval: setInterval, savedTimeout: setTimeout} = useContext(GlobalContext)

    const store = useStore<IState>()
    const dispatch = useDispatch()

    const audioRef = useMemo(() => ({audio: null as unknown as HTMLAudioElement}), [])

    const effects = store.getState().effectsOn
    const songUrl = store.getState().songs.songs[store.getState().songs.choosen].url
    const name = store.getState().name || 'Player'

    let [renderState, changeRender] = useState(0)
    const rerender = () => changeRender(++renderState)

    const [stage, changeStage] = useState<'preload' | 'game' | 'finish'>('preload')

    function getClose(num: number, closeto: number, add: number = 0) {
        const s = 'CBA9876543210000000000000000000000000000000'
        return s[Math.abs(num - closeto) + add]
    }
    function blickColor(frame: number) {
        const d = frame % 60
        if (d >= 59 && frame >= 800) {
            return `#0F0C`
        }
        if (frame >= 3600) {
            if ((d >= 0) && (d < 20))
                return `#FF4${getClose(d, 10, 8)}`
            if ((d >= 20) && (d < 40))
                return `#66F${getClose(d, 30, 8)}`
            if ((d >= 40) && (d < 60))
                return `#F88${getClose(d, 50, 8)}`
            return 'transparent'
        }
        if (frame >= 2400) {
            if ((d >= 5) && (d < 25))
                return `#FF4${getClose(d, 15, 8)}`
            if ((d >= 30) && (d < 50))
                return `#66F${getClose(d, 40, 8)}`
            return 'transparent'
        }
        if (frame >= 1200) {
            if ((d >= 5) && (d < 25))
                return `#FF0${getClose(d, 15, 8)}`
            return 'transparent'
        }
        return 'transparent'
    }

    const dataRef = useRef<IGameData>({
        gameToken: '',
        name,
        game: [[]],
        player: [coordsRef.current],
        score: 0,
        frame: 0,
        x: coordsRef.current[0],
        y: coordsRef.current[1]
    })
    const gameData = dataRef.current

    function checkFrameCollision(frame: number) {
        return checkCollision(gameData.game, gameData.player, gameData.frame)
    }

    const timeRef = useRef<number>(0)

    useEffect(() => {
        if (stage === 'preload') {
            setTimeout(() => fetch(`/gamestart?name=${gameData.name}`)
                .then(res => res.json())
                .then((json: IType) => {
                    if (!Array.isArray(json)) {
                        window.location.reload()
                        return
                    }
                    let audio = audioRef.audio = new Audio(songUrl)
                    audio.oncanplaythrough = () => {
                        audio.oncanplaythrough = null
                        audio.play()
                        gameData.gameToken = json[0] as string
                        gameData.name = json[1] as string
                        gameData.game = json.slice(2) as Array<Array<number>>
                        changeStage('game')
                        timeRef.current = Date.now()
                    }
                }), 888)
        }
        else if (stage === 'game') {
            const it = setInterval(() => {
                ++gameData.frame
                if (gameData.frame % 3 === 0) {
                    gameData.score += 5
                    // console.log(`score: ${gameData.score + 5}, frame: ${gameData.frame + 1}, time: ${Date.now() - timeRef.current}`)
                }
                gameData.x = coordsRef.current[0]
                gameData.y = coordsRef.current[1]
                gameData.player.push([gameData.x, gameData.y])
                if (checkFrameCollision(gameData.frame)) {
                    clearInterval(it)
                    audioRef.audio.pause()
                    changeStage('finish')
                }
                rerender()
            }, 17)
            return () => clearInterval(it)
        }
        else if (stage === 'finish') {
            setTimeout(() => fetch('/confirm', {
                    method: 'POST',
                    mode: 'cors',
                    cache: 'no-cache',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        token: gameData.gameToken,
                        data: gameData.player
                    })
                })
                .then(res => res.json())
                .then(json => {
                    dispatch(changeTopAction(json))
                    dispatch(pushLocalTopAction(gameData.name, gameData.score))
                    dispatch(changeMainPageAction('menu'))
                }), 999)
        }
    }, [stage])

    const balls = useMemo(() => {
        const rez = []
        const frameData = gameData.game[gameData.frame]
        for (let i = 0; i < frameData.length; i += 3) {
            rez.push(<div className="blue" key={frameData[i]} style={{
                left: `${frameData[i + 1]}px`,
                top: `${frameData[i + 2]}px`
            }}></div>)
        }
        return rez
    }, [gameData.frame])

    return (
        <>
            <IfComponent condition={stage === 'preload'}>
                <div className="preload">
                    Загрузка...<br />Держите курсор в центре экрана
                </div>
            </IfComponent>
            <IfComponent condition={stage === 'game' || stage === 'finish'}>
                <div className="game">
                    <IfComponent condition={effects}>
                        <div className="blick" style={{
                            background: blickColor(gameData.frame)
                        }}></div>
                    </IfComponent>
                    <div className="score">
                        Очки: {gameData.score}
                    </div>
                    {balls}
                    <div className="red" style={{
                        left: gameData.x,
                        top: gameData.y
                    }} />
                    <IfComponent condition={stage === 'finish'}>
                        <div className="preload">
                            Сохранение результата...<br />Набрано очков: {gameData.score}
                        </div>
                    </IfComponent>
                </div>
            </IfComponent>
        </>
    )
}

export default React.memo(Game)
