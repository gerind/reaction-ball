
const alph = '0123456789abcdefghijklmnopqrstuvwxyz'

function random(n) {
  return Math.floor(Math.random() * n)
}

function getRandomToken(length = 32) {
  let token = ''
  for (let i = 0; i < length; ++i) {
    token += alph[random(alph.length)]
  }
  return token
}

module.exports.random = random
module.exports.getRandomToken = getRandomToken
