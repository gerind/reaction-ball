import React, { useContext, useEffect, useRef, useState } from 'react'
import { GlobalContext } from '..'
import { ITop } from '../App'

interface IProps {
    onStart: () => void
    onChangeColor: (newColor: string) => void
    top: ITop
}

const Menu: React.FC<IProps> = ({ onStart, onChangeColor, top }) => {
    
    const {savedInterval: setInterval, savedTimeout: setTimeout} = useContext(GlobalContext)

    const [inputValue, changeInputValue] = useState(localStorage.getItem('name') || '')

    const [effects, changeEffects] = useState<string>(localStorage.getItem('effects') || 'yes')

    function onInput(event: React.FormEvent<HTMLInputElement>) {
        const value = (event.target as HTMLInputElement).value
        if (/^[0-9a-zA-Z]{0,20}$/.test(value)) {
            changeInputValue(value.trim())
            localStorage.setItem('name', value.trim())
        }
    }

    const colorRef = useRef<HTMLInputElement>(null)

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
                <div className="button" onClick={() => {
                    const next = effects === 'yes' ? 'no' : 'yes'
                    changeEffects(next)
                    localStorage.setItem('effects', next)
                }}>{effects === 'yes' ? 'Эффекты вкл.' : 'Эффекты выкл.'}</div>
                <div className="button" onClick={() => {
                    colorRef.current!.click()
                }}>
                    <input className="color" type="color" value="#888888" ref={colorRef} onInput={event => {
                        const target = event.target as HTMLInputElement
                        onChangeColor(target.value)
                    }}/>
                    Цвет фона
                </div>
            </div>
        </>
    )
}

export default Menu