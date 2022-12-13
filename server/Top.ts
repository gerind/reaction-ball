import fs from 'fs'
import { ITop } from './models'

export class Top {
  private top: ITop = new Array(10).fill(0).map(() => ({
    name: '--------',
    score: 0,
  }))

  constructor() {
    try {
      const data = fs.readFileSync('saved.txt', 'utf8')
      this.top = JSON.parse(data)
    } catch (e) {
      //...
    }
  }
  push(name: string, score: number) {
    let p = 9
    while (p >= 0 && this.top[p].score < score) --p
    ++p
    for (let i = 9; i > p; --i) this.top[i] = this.top[i - 1]
    if (p <= 9) {
      this.top[p] = {
        name,
        score,
      }
      fs.writeFileSync('saved.txt', JSON.stringify(this.top))
    }
  }
  toJSON() {
    return this.top
  }
}
