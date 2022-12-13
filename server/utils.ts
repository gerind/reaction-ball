const alph = '0123456789abcdefghijklmnopqrstuvwxyz'

export function random(n: number) {
  return Math.floor(Math.random() * n)
}

export function getRandomToken(length = 32): string {
  let token = ''
  for (let i = 0; i < length; ++i) {
    token += alph[random(alph.length)]
  }
  return token
}
