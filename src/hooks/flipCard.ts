import React, { useCallback, useMemo, useState } from 'react'

export function useFlipCard() {
  const [animationInProgress, changeAnimationProgress] = useState(false)
  const [deg, changeDeg] = useState(-360)
  const startAnimation = useCallback(() => {
    changeAnimationProgress(true)
    changeDeg(deg => deg + 180)
  }, [])
  const cancelAnimation = useCallback(() => {
    changeAnimationProgress(false)
  }, [])
  const frontStyles: React.CSSProperties = useMemo(() => {
    return {
      backfaceVisibility: 'hidden',
      transition: 'transform 0.5s ease-out',
      transform: `perspective(1100px) rotate3d(-1, 1, 0, ${deg}deg)`,
    }
  }, [deg])
  const backStyles: React.CSSProperties = useMemo(() => {
    return {
      backfaceVisibility: 'hidden',
      transition: 'transform 0.5s ease-out',
      transform: `perspective(1100px) rotate3d(-1, 1, 0, ${deg - 180}deg)`,
    }
  }, [deg])
  return {
    frontStyles,
    backStyles,
    animationInProgress,
    startAnimation,
    onTransitionEnd: cancelAnimation,
  }
}
