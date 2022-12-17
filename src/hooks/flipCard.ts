import React, { useMemo } from 'react'

export function useFlipCard(flipped: boolean) {
  const frontStyles: React.CSSProperties = useMemo(() => {
    return {
      backfaceVisibility: 'hidden',
      transition: 'transform 0.6s linear',
      transform: `perspective(1100px) rotateY(${flipped ? 180 : 0}deg)`,
    }
  }, [flipped])
  const backStyles: React.CSSProperties = useMemo(() => {
    return {
      backfaceVisibility: 'hidden',
      transition: 'transform 0.6s linear',
      transform: `perspective(1100px) rotateY(${flipped ? 0 : -180}deg)`,
    }
  }, [flipped])
  return {
    frontStyles,
    backStyles,
  }
}
