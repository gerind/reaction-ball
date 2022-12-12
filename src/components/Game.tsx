import React, { useContext, useEffect, useMemo, useRef, useReducer } from 'react'
import { GlobalContext } from '..'
import { checkCollision } from '../core/utils'
import { useDataActions } from '../hooks/actions'
import { useDataSelector } from '../hooks/dataSelector'
import { useGameSelector } from '../hooks/gameSelector'
import If from './If'

interface IGameData {
  player: Array<Array<number>>
  score: number
  frame: number
  x: number
  y: number
}

interface IProps {
  coordsRef: { current: [number, number] }
}

const renderReducer = (state: number) => state + 1

const Game: React.FC<IProps> = ({ coordsRef }) => {

  const { savedInterval: setInterval, savedTimeout: setTimeout } = useContext(GlobalContext)

  const { changeTop, pushLocalTop, changeMainPage, changeGameStage } = useDataActions()

  const audio = useDataSelector(data => data.audio)
  const name = useDataSelector(data => data.name || 'Player')

  const gameToken = useGameSelector(game => game.gameToken)
  const frames = useGameSelector(game => game.frames)
  const gameStage = useDataSelector(data => data.gameStage)

  const rerender = useReducer(renderReducer, 0)[1]

  const dataRef = useRef<IGameData>({
    player: [coordsRef.current],
    score: 0,
    frame: 0,
    x: coordsRef.current[0],
    y: coordsRef.current[1]
  })
  const gameData = dataRef.current

  function checkFrameCollision(frame: number) {
    return checkCollision(frames, gameData.player, gameData.frame)
  }

  useEffect(() => {
    if (gameStage === 'game') {
      const it = setInterval(() => {
        ++gameData.frame
        if (gameData.frame % 3 === 0) {
          gameData.score += 5
        }
        gameData.x = coordsRef.current[0]
        gameData.y = coordsRef.current[1]
        gameData.player.push([gameData.x, gameData.y])
        if (checkFrameCollision(gameData.frame)) {
          clearInterval(it)
          audio!.pause()
          changeGameStage('finish')
        }
        rerender()
      }, 17)
      return () => clearInterval(it)
    }
    else if (gameStage === 'finish') {
      setTimeout(() => fetch('/confirm', {
          method: 'POST',
          mode: 'cors',
          cache: 'no-cache',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            token: gameToken,
            data: gameData.player
          })
        })
        .then(res => res.json())
        .then(json => {
          changeTop(json)
          pushLocalTop(name, gameData.score)
          changeGameStage('notstarted')
          changeMainPage('menu')
        }), 999)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStage])

  const balls = useMemo(() => {
    const rez = []
    const frameData = frames[gameData.frame]
    for (let i = 0; i < frameData.length; i += 3) {
      rez.push(<div className="blue" key={frameData[i]} style={{
        left: `${frameData[i + 1]}px`,
        top: `${frameData[i + 2]}px`
      }}></div>)
    }
    return rez
  }, [gameData.frame, frames])

  return (
    <div className="game">
      <div className="score">
        Очки: {gameData.score}
      </div>
      {balls}
      <div className="red" style={{
        left: gameData.x,
        top: gameData.y
      }} />
      <If cond={gameStage === 'finish'}>
        <div className="preload">
          Сохранение результата...<br />Набрано очков: {gameData.score}
        </div>
      </If>
    </div>
  )
}

export default React.memo(Game)
