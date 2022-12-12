const { FPS, SECOND_GENERATE, STORE_TIME } = require('./constants')
const { generateBall, isOutside } = require('./geometry')
const { getRandomToken } = require('./utils')

function gamestart(name, gamesData) {
  const FRAME_COUNT = FPS * SECOND_GENERATE
  const gameToken = getRandomToken()
  const game = [gameToken, name, []]
  let n = 0
  const balls = {}
  /*
    balls = {
      id: {
        x: number
        y: number
        speedVector: [number, number]
      }
    }
  */
  for (let frame = 1; frame <= FRAME_COUNT; ++frame) {
    const curframe = []

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
    if ((frame % 15) === 0) {
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
    data: game.slice(2),
    timeout: setTimeout(() => {
      delete gamesData[gameToken]
    }, STORE_TIME),
    name: name
  }

  return game
}

module.exports = gamestart