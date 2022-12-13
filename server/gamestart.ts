import { FPS, SECOND_GENERATE, STORE_TIME } from './constants'
import { IBallConfig, IGamesData } from './models'
import { getRandomToken } from './utils'
import { generateBall, isOutside } from './geometry'

export function gamestart(name: string, gamesData: IGamesData) {
  const FRAME_COUNT = FPS * SECOND_GENERATE
  const gameToken = getRandomToken()
  const game: (string | number[])[] = [gameToken, name, []]
  let n = 0

  const balls: {
    [key: string]: IBallConfig
  } = {}

  for (let frame = 1; frame <= FRAME_COUNT; ++frame) {
    const curframe: number[] = []

    /*
      0. Удалить шарики вышедшие за границу
    */
    Object.keys(balls).forEach(id => {
      if (isOutside(balls[id].x, balls[id].y)) {
        delete balls[id]
      }
    })
    /*
      1. сдвинуть все имеющиеся шарики
    */
    Object.keys(balls).forEach(id => {
      balls[id].x += balls[id].speedVector[0] * frame
      balls[id].y += balls[id].speedVector[1] * frame
    })
    /*
      2. создать новые шарики
    */
    if (frame % 15 === 0) {
      balls[n++] = generateBall(0)
      balls[n++] = generateBall(1)
      balls[n++] = generateBall(2)
      balls[n++] = generateBall(3)
    }
    /*
      3. Запушить все шарики в массив curframe
    */
    Object.entries(balls).forEach(([id, ball]) => {
      curframe.push(parseInt(id), Math.floor(ball.x), Math.floor(ball.y))
    })

    /*
      4. Добавить массив curframe в массив game
    */
    game.push(curframe)
  }

  gamesData[gameToken] = {
    data: game.slice(2) as number[][],
    timeout: setTimeout(() => {
      delete gamesData[gameToken]
    }, STORE_TIME),
    name: name,
  }

  return game
}
