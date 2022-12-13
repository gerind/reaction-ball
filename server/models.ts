export type IVector = [number, number]
export interface IBallConfig {
  x: number
  y: number
  speedVector: IVector
}
export type ITop = Array<{
  name: string
  score: number
}>
export type IGamesData = {
  [key: string]: {
    data: number[][]
    timeout: NodeJS.Timeout
    name: string
  }
}
