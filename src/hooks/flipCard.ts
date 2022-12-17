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
  const onTransitionEnd = useCallback(() => {
    cancelAnimation()
  }, [cancelAnimation])
  const frontStyles: React.CSSProperties = useMemo(() => {
    return {
      backfaceVisibility: 'hidden',
      transition: 'transform 0.6s linear',
      transform: `perspective(1100px) rotateY(${deg}deg)`,
    }
  }, [deg])
  const backStyles: React.CSSProperties = useMemo(() => {
    return {
      backfaceVisibility: 'hidden',
      transition: 'transform 0.6s linear',
      transform: `perspective(1100px) rotateY(${deg - 180}deg)`,
    }
  }, [deg])
  return {
    frontStyles,
    backStyles,
    animationInProgress,
    startAnimation,
    onTransitionEnd,
  }
}
