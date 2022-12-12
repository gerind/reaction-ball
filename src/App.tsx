import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { GlobalContext } from '.'
import './App.scss'
import Game from './components/Game'
import If from './components/If'
import Menu from './components/Menu'
import SongsPage from './components/SongsPage'
import { WIDTH, HEIGHT, CANVAS_DX } from './core/constants'
import { useActions } from './hooks/actions'
import { useDataSelector } from './hooks/dataSelector'
import { usePreventSelectAndDrag } from './hooks/selectanddrag'
import { useGetTopQuery } from './store/data.api'

function parseHex(hex: string): [number, number, number] {
  return [
    parseInt(hex.substring(1, 3), 16),
    parseInt(hex.substring(3, 5), 16),
    parseInt(hex.substring(5, 7), 16)
  ]
}

function App() {

  const {savedInterval: setInterval} = useContext(GlobalContext)

  const { changeTop } = useActions()

  const {
    data: top,
  } = useGetTopQuery()

  useEffect(() => {
    if (Array.isArray(top))
      changeTop(top)
  }, [top, changeTop])

  usePreventSelectAndDrag()

  const [scaleData, changeScaleData] = useState(Math.min(
    window.innerWidth / WIDTH, window.innerHeight / HEIGHT
  ).toFixed(4))

  useEffect(() => {
    const ti = setInterval(() => {
      const newData = Math.min(
        window.innerWidth / WIDTH, window.innerHeight / HEIGHT
      ).toFixed(4)
      if (newData !== scaleData)
        changeScaleData(newData)
    }, 128)
    return () => clearInterval(ti)
  }, [scaleData, setInterval])

  const containerStyle = useMemo(() => ({
    transform: `translate(-50%, -50%) scale(${scaleData})`
  }), [scaleData])

  const canvasRef = useRef<HTMLCanvasElement>(null)

  const mainColor = useDataSelector(data => data.maincolor)

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
  }, [mainColor, setInterval])

  const mainPage = useDataSelector(data => data.mainPage)

  const containerRef = useRef<HTMLDivElement>(null)

  const mouseCoordsRef = useRef<[number, number]>([500, 500])

  function onMouse(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const rect = containerRef.current!.getBoundingClientRect() as DOMRect
    const x = Math.floor((event.clientX - rect.left) * WIDTH / rect.width)
    const y = Math.floor((event.clientY - rect.top) * HEIGHT / rect.height)
    mouseCoordsRef.current = [x, y]
  }

  return (
    <div className="container" style={containerStyle} onMouseMove={onMouse} onClick={onMouse} ref={containerRef}>
      <canvas className="canvas" ref={canvasRef} />
      <If condition={mainPage === 'menu'}>
        <Menu />
      </If>
      <If condition={mainPage === 'game'}>
        <Game coordsRef={mouseCoordsRef}/>
      </If>
      <If condition={mainPage === 'songs'}>
        <SongsPage />
      </If>
    </div>
  )
}

export default App
