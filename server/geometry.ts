import { IBallConfig, IVector } from './models'

import { WIDTH, HEIGHT, RADIUS } from './constants'

const { random } = require('./utils')

export function turnVector(vector: IVector, degrees: number): IVector {
  const angle = (degrees / 180) * Math.PI
  return [
    vector[0] * Math.cos(angle) + vector[1] * Math.sin(angle),
    -vector[0] * Math.sin(angle) + vector[1] * Math.cos(angle),
  ]
}

export function getRandomDirectionDegrees(direction: number) {
  return direction + random(181) - 90
}

export function generateBall(side: 0 | 1 | 2 | 3): IBallConfig {
  const initialVector: IVector = [0.0025, 0]
  switch (side) {
    case 0:
      return {
        x: WIDTH - 1,
        y: random(HEIGHT),
        speedVector: turnVector(initialVector, getRandomDirectionDegrees(180)),
      }
    case 1:
      return {
        x: random(WIDTH),
        y: 0,
        speedVector: turnVector(initialVector, getRandomDirectionDegrees(270)),
      }
    case 2:
      return {
        x: 0,
        y: random(HEIGHT),
        speedVector: turnVector(initialVector, getRandomDirectionDegrees(0)),
      }
    case 3:
      return {
        x: random(WIDTH),
        y: HEIGHT - 1,
        speedVector: turnVector(initialVector, getRandomDirectionDegrees(90)),
      }
  }
}

export function isOutside(x: number, y: number) {
  return x < 0 || y < 0 || x >= WIDTH || y >= HEIGHT
}

export function isPointCloseToLine(
  x: number,
  y: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  mindist: number
) {
  if ((x0 - x) * (x0 - x) + (y0 - y) * (y0 - y) < mindist * mindist) return true
  if ((x1 - x) * (x1 - x) + (y1 - y) * (y1 - y) < mindist * mindist) return true
  if (
    (x1 - x0) * (x - x0) + (y1 - y0) * (y - y0) > 0 &&
    (x0 - x1) * (x - x1) + (y0 - y1) * (y - y1) > 0
  ) {
    if (
      Math.abs((x0 - x) * (y1 - y) - (x1 - x) * (y0 - y)) ** 2 <
      ((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0)) * mindist * mindist
    )
      return true
  }
  return false
}

export function checkCollision(
  framesData: number[][],
  playerData: number[][],
  frame: number
) {
  const preframeData = framesData[frame - 1]
  const preBalls: {
    [key: string]: [number, number]
  } = {}
  for (let i = 0; i < preframeData.length; i += 3) {
    preBalls[preframeData[i]] = [preframeData[i + 1], preframeData[i + 2]]
  }
  const [prex, prey] = playerData[frame - 1]
  const [nextx, nexty] = playerData[frame]
  const nextframeData = framesData[frame]
  for (let i = 0; i < nextframeData.length; i += 3) {
    const [id, x, y] = [
      nextframeData[i],
      nextframeData[i + 1],
      nextframeData[i + 2],
    ]
    if (
      id in preBalls &&
      isPointCloseToLine(
        prex,
        prey,
        preBalls[id][0],
        preBalls[id][1],
        x,
        y,
        RADIUS * 2
      )
    )
      return true
    if (isPointCloseToLine(x, y, prex, prey, nextx, nexty, RADIUS * 2))
      return true
  }
  return false
}
