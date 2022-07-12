import React from 'react'

interface IProps {
    condition: boolean
    children: React.ReactElement
}

const IfComponent: React.FC<IProps> = ({condition, children}) => {
    return (
        <>
            {
                condition
                ? children
                : <></>
            }
        </>
    )
}

export default IfComponent