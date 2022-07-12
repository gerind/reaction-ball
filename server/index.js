
const express = require('express')
const gamestart = require('./gamestart')
const { checkCollision } = require('./geometry')
const { Top } = require('./Top')

const app = express()

const port = 80

const gamesData = {}
const top = new Top()

app.use(express.static('build'))

app.use(express.json())

app.get('/gamestart', (req, res) => {
    let name = req.query.name
    if (!/^[0-9a-zA-Z]{1,20}$/.test(name)) {
        name = 'Player'
    }
    const game = gamestart(name, gamesData)
    res.send(game)
})

app.post('/confirm', (req, res) => {
    const token = req.body.token
    const data = gamesData[token].data
    const name = gamesData[token].name
    const timeout = gamesData[token].timeout
    const player = req.body.data
    delete gamesData[token]
    clearTimeout(timeout)
    let frame = 1, score = 0
    while (frame + 1 < player.length && !checkCollision(data, player, frame)){
        ++frame
        if (frame % 3 === 0)
            score += 5
    }
    top.push(name, score)
    res.send(top.toJSON())
})

app.get('/top', (req, res) => {
    res.send(top.toJSON())
})

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})
