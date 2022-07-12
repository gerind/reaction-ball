import React, { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '..'
import { ITop } from '../App'

interface IProps {
    onStart: () => void
    top: ITop
}

const Menu: React.FC<IProps> = ({ onStart, top }) => {
    
    const {savedInterval: setInterval, savedTimeout: setTimeout} = useContext(GlobalContext)

    const [inputValue, changeInputValue] = useState(localStorage.getItem('name') || '')

    function onInput(event: React.FormEvent<HTMLInputElement>) {
        const value = (event.target as HTMLInputElement).value
        if (/^[0-9a-zA-Z]{0,20}$/.test(value)) {
            changeInputValue(value.trim())
            localStorage.setItem('name', value.trim())
        }
    }

    return (
        <>
            <div className="left">
                {
                    top.map(({name, score}, index) => <div className="row">
                        <span className="index">{index + 1}.</span>
                        <span className="name">{name}</span>
                        <span className="score">{score}</span>
                    </div>)
                }
            </div>
            <div className="right">
                <input value={inputValue} type="text" className="name" placeholder="Player" onInput={onInput} />
                <div className="button" onClick={() => onStart()}>Играть</div>
                <div className="button" onClick={() => {
                    if (document.fullscreenElement === document.documentElement)
                        document.exitFullscreen()
                    else
                        document.documentElement.requestFullscreen()
                }}>Полноэкранный режим</div>
            </div>
        </>
    )
}

export default Menu