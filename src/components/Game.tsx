import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { GlobalContext } from '..'
import { ITop } from '../App'
import { HEIGHT, RADIUS, WIDTH } from '../core/constants'
import { checkCollision, isPointCloseToLine } from '../core/utils'
import IfComponent from './IfComponent'

type IType = Array<string | Array<number>>

interface IBalls {
    [key: number]: [number, number]
}

interface IGameData {
    gameToken: string
    name: string
    game: Array<Array<number>>
    player: Array<Array<number>>
    score: number
    frame: number
    mousex: number
    mousey: number
    x: number
    y: number
}

interface IProps {
    onFinish: (top: ITop) => void
}

const Game: React.FC<IProps> = ({onFinish}) => {

    const {savedInterval: setInterval, savedTimeout: setTimeout} = useContext(GlobalContext)

    let [renderState, changeRender] = useState(0)
    const rerender = () => changeRender(++renderState)

    const [stage, changeStage] = useState<'preload' | 'game' | 'finish'>('preload')

    const [initx, inity] = useMemo(() => {
        return [
            +(localStorage.getItem('mousex') ?? 900),
            +(localStorage.getItem('mousey') ?? 350)
        ]
    }, [])

    const dataRef = useRef<IGameData>({
        gameToken: '',
        name: localStorage.getItem('name') || 'Player',
        game: [[]],
        player: [[initx, inity]],
        score: 0,
        frame: 0,
        mousex: initx,
        mousey: inity,
        x: initx,
        y: inity
    })
    const gameData = dataRef.current

    function onMouseMove(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const rect = (event.target as HTMLDivElement).closest('.game,.preload')!.getBoundingClientRect() as DOMRect
        gameData.mousex = Math.floor((event.clientX - rect.left) * WIDTH / rect.width)
        gameData.mousey = Math.floor((event.clientY - rect.top) * HEIGHT / rect.height)
    }

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
                    gameData.gameToken = json[0] as string
                    gameData.name = json[1] as string
                    gameData.game = json.slice(2) as Array<Array<number>>
                    changeStage('game')
                    timeRef.current = Date.now()
                }), 1111)
        }
        else if (stage === 'game') {
            const it = setInterval(() => {
                ++gameData.frame
                if (gameData.frame % 3 === 0) {
                    gameData.score += 5
                    // console.log(`score: ${gameData.score + 5}, frame: ${gameData.frame + 1}, time: ${Date.now() - timeRef.current}`)
                }
                gameData.x = gameData.mousex
                gameData.y = gameData.mousey
                gameData.player.push([gameData.x, gameData.y])
                if (checkFrameCollision(gameData.frame)) {
                    clearInterval(it)
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
                    onFinish(json)
                }), 2222)
        }
    }, [stage])

    const balls = (() => {
        const rez = []
        const frameData = gameData.game[gameData.frame]
        for (let i = 0; i < frameData.length; i += 3) {
            rez.push(<div className="blue" key={frameData[i]} style={{
                left: `${frameData[i + 1]}px`,
                top: `${frameData[i + 2]}px`
            }}></div>)
        }
        return rez
    })()

    return (
        <>
            <IfComponent condition={stage === 'preload'}>
                <div className="preload" onMouseMove={onMouseMove}>
                    Загрузка...<br />Держите курсор в центре экрана
                </div>
            </IfComponent>
            <IfComponent condition={stage === 'game' || stage === 'finish'}>
                <div className="game" onMouseMove={onMouseMove}>
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

export default Game
