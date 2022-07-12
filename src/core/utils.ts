import { useEffect } from 'react'
import { RADIUS } from './constants'

export function preventDefault(event: Event) {
    event.preventDefault()
}

export function usePreventSelectAndDrag() {
    useEffect(() => {
        document.addEventListener('dragstart', preventDefault)
        document.addEventListener('selectstart', preventDefault)
        return () => {
            document.removeEventListener('dragstart', preventDefault)
            document.removeEventListener('selectstart', preventDefault)
        }
    }, [])
}

//2S=v1*v2=ah
//h=v1*v2/a
//h < mindist <=> v1*v2/a<mindist <=> v1*v2<a*mindist

export function isPointCloseToLine(x: number, y: number, x0: number, y0: number, x1: number, y1: number, mindist: number) {
    if ((x0 - x) * (x0 - x) + (y0 - y) * (y0 - y) < mindist * mindist)
        return true
    if ((x1 - x) * (x1 - x) + (y1 - y) * (y1 - y) < mindist * mindist)
        return true
    if ((x1 - x0) * (x - x0) + (y1 - y0) * (y - y0) > 0 && (x0 - x1) * (x - x1) + (y0 - y1) * (y - y1) > 0) {
        if ((Math.abs((x0 - x) * (y1 - y) - (x1 - x) * (y0 - y)) ** 2) < ((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0)) * mindist * mindist)
            return true
    }
    return false
}
export function checkCollision(framesData: number[][], playerData: number[][], frame: number) {
    const preframeData = framesData[frame - 1]
    const preBalls: {[key: number]: [number, number]} = {}
    for (let i = 0; i < preframeData.length; i += 3) {
        preBalls[preframeData[i]] = [preframeData[i + 1], preframeData[i + 2]]
    }
    const [prex, prey] = playerData[frame - 1]
    const [nextx, nexty] = playerData[frame]
    const nextframeData = framesData[frame]
    for (let i = 0; i < nextframeData.length; i += 3) {
        const [id, x, y] = [nextframeData[i], nextframeData[i + 1], nextframeData[i + 2]]
        if ((id in preBalls) && isPointCloseToLine(prex, prey, preBalls[id][0], preBalls[id][1], x, y, RADIUS * 2))
            return true
        if (isPointCloseToLine(x, y, prex, prey, nextx, nexty, RADIUS * 2))
            return true
    }
    return false
}
