import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { GlobalContext } from '.'
import './App.scss'
import Game from './components/Game'
import IfComponent from './components/IfComponent'
import Menu from './components/Menu'
import { WIDTH, HEIGHT, CANVAS_DX } from './core/constants'
import { usePreventSelectAndDrag } from './core/utils'

const hextodec = {
  '0': 0, '1': 1,
  '2': 2, '3': 3,
  '4': 4, '5': 5,
  '6': 6, '7': 7,
  '8': 8, '9': 9,
  'a': 10, 'b': 11,
  'c': 12, 'd': 13,
  'e': 14, 'f': 15
} as any

function parseHex(hex: string): [number, number, number] {
  return [
    hextodec[hex[1]] * 16 + hextodec[hex[2]],
    hextodec[hex[3]] * 16 + hextodec[hex[4]],
    hextodec[hex[5]] * 16 + hextodec[hex[6]]
  ]
}

export type ITop = Array<{
  name: string
  score: number
}>

function App() {
  
  const {savedInterval: setInterval, savedTimeout: setTimeout} = useContext(GlobalContext)

  const [top, changeTop] = useState<ITop>([])

  useEffect(() => {
    fetch('/top')
      .then(res => res.json())
      .then((json: ITop) => {
        changeTop(json)
      })
  }, [])

  usePreventSelectAndDrag()

  const [scaleData, changeScaleData] = useState(Math.min(
    window.innerWidth / WIDTH - 0.0001, window.innerHeight / HEIGHT - 0.0001
  ).toFixed(4))

  useEffect(() => {
    const ti: number = setInterval(() => {
      const newData = Math.min(
        window.innerWidth / WIDTH - 0.0001, window.innerHeight / HEIGHT - 0.0001
      ).toFixed(4)
      if (newData !== scaleData)
        changeScaleData(newData)
    }, 128)
    return () => clearInterval(ti)
  }, [scaleData])

  const containerStyle = useMemo(() => ({
    transform: `translate(-50%, -50%) scale(${scaleData})`
  }), [scaleData])

  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [mainColor, changeMainColor] = useState<string>(localStorage.getItem('maincolor') || '#84ff32')

  useEffect(() => {
    const [r, g, b] = parseHex(mainColor)
    function getRandomColor() {
      let x = r + Math.floor(Math.random() * 20) - 10
      let y = g + Math.floor(Math.random() * 20) - 10
      let z = b + Math.floor(Math.random() * 20) - 10
      x = Math.min(x, 255)
      y = Math.min(y, 255)
      z = Math.min(z, 255)
      x = Math.max(x, 0)
      y = Math.max(y, 0)
      z = Math.max(z, 0)
      return `rgb(${x},${y},${z})`
    }
    const canvas = canvasRef.current as HTMLCanvasElement
    canvas.width = WIDTH
    canvas.height = HEIGHT
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    const coords: Array<[number, number]> = []
    for (let x = 0; x < WIDTH; x += CANVAS_DX) {
      for (let y = 0; y < HEIGHT; y += CANVAS_DX) {
        ctx.fillStyle = getRandomColor()
        ctx.fillRect(x, y, CANVAS_DX, CANVAS_DX)
        coords.push([x, y])
      }
    }
    const it = setInterval(() => {
      for (let i = 0; i < 10; ++i) {
        const [x, y] = coords[Math.floor(Math.random() * coords.length)]
        ctx.fillStyle = getRandomColor()
        ctx.fillRect(x, y, CANVAS_DX, CANVAS_DX)
      }
    }, 17)
    return () => clearInterval(it)
  }, [mainColor])

  const [mainState, changeMainState] = useState<'menu' | 'game'>('menu')

  function onStart() {
    changeMainState('game')
  }
  function onMouse(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const rect = (event.target as HTMLElement).closest('.container')!.getBoundingClientRect() as DOMRect
    const x = Math.floor((event.clientX - rect.left) * WIDTH / rect.width)
    const y = Math.floor((event.clientY - rect.top) * HEIGHT / rect.height)
    localStorage.setItem('mousex', x.toString())
    localStorage.setItem('mousey', y.toString())
  }

  return (
    <div className="container" style={containerStyle} onMouseMove={onMouse} onClick={onMouse}>
      <canvas className="canvas" ref={canvasRef} />
      <IfComponent condition={mainState === 'menu'}>
        <Menu onStart={onStart} top={top} onChangeColor={newColor => {
          changeMainColor(newColor)
          localStorage.setItem('maincolor', newColor)
        }}/>
      </IfComponent>
      <IfComponent condition={mainState === 'game'}>
        <Game onFinish={(top: ITop) => {
          changeTop(top)
          changeMainState('menu')
        }} />
      </IfComponent>
    </div>
  )
}

export default App
