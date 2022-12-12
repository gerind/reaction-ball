import React from 'react'

interface IProps {
  cond: boolean
  children: React.ReactElement
}

const If: React.FC<IProps> = ({cond, children}) => {
  return (
    <>
      {
        cond
        ? children
        : <></>
      }
    </>
  )
}

export default If