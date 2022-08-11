import React, { useContext, useEffect, useRef  } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { GlobalContext } from '..'
import { changeMainColorAction, changeMainPageAction, changeNameAction, clearLocalTopAction, IState, ITop, ITopType, toggleTopAction, turnEffectsAction } from '../core/store'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee, faArrowRightArrowLeft, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import IfComponent from './IfComponent'

const Menu: React.FC = () => {
    
    const {savedInterval: setInterval, savedTimeout: setTimeout} = useContext(GlobalContext)

    const dispatch = useDispatch()

    const mainColor = useSelector<IState, string>(state => state.maincolor)
    const name = useSelector<IState, string>(state => state.name)
    const top = useSelector<IState, ITop>(state => state.top)
    const localtop = useSelector<IState, ITop>(state => state.localtop)
    const effects = useSelector<IState, boolean>(state => state.effectsOn)
    const choosentoptype = useSelector<IState, ITopType>(state => state.choosentop)

    const choosentop = choosentoptype === 'local' ? localtop : top

    useEffect(() => {
        localStorage.setItem('name', name)
    }, [name])
    useEffect(() => {
        localStorage.setItem('maincolor', mainColor)
    }, [mainColor])
    useEffect(() => {
        localStorage.setItem('effects', effects ? 'yes' : 'no')
    }, [effects])

    function onInput(event: React.FormEvent<HTMLInputElement>) {
        const value = (event.target as HTMLInputElement).value
        dispatch(changeNameAction(value))
    }

    const colorRef = useRef<HTMLInputElement>(null)

    return (
        <>
            <div className="left">
                <div className="row">
                    <IfComponent condition={choosentoptype === 'local'}>
                        <FontAwesomeIcon icon={faTrashCan} className={'clearlocal'} onClick={() => {
                            dispatch(clearLocalTopAction())
                        }} />
                    </IfComponent>
                    {choosentoptype === 'global' ? 'Общий рейтинг' : 'Локальный рейтинг'}
                    <FontAwesomeIcon icon={faArrowRightArrowLeft} className="togglerating" onClick={() => {
                        dispatch(toggleTopAction())
                    }}/>
                </div>
                {
                    choosentop.map(({name, score}, index) => <div className="row">
                        <span className="index">{index + 1}.</span>
                        <span className="name">{name}</span>
                        <span className="score">{score}</span>
                    </div>)
                }
            </div>
            <div className="right">
                <input value={name} type="text" className="name" placeholder="Player" onInput={onInput} />
                <div className="button" onClick={() => {
                    dispatch(changeMainPageAction('game'))
                }}>Играть</div>
                <div className="button" onClick={() => {
                    if (document.fullscreenElement === document.documentElement)
                        document.exitFullscreen()
                    else
                        document.documentElement.requestFullscreen()
                }}>Полноэкранный режим</div>
                <div className="button" onClick={() => {
                    dispatch(turnEffectsAction())
                }}>{effects ? 'Эффекты вкл.' : 'Эффекты выкл.'}</div>
                <div className="button" onClick={() => {
                    colorRef.current!.click()
                }}>
                    <input className="color" type="color" value={mainColor} ref={colorRef} onChange={event => {
                        const target = event.target as HTMLInputElement
                        dispatch(changeMainColorAction(target.value))
                    }}/>
                    Цвет фона
                </div>
                <div className="button" onClick={() => {
                    dispatch(changeMainPageAction('songs'))
                }}>
                    Выбор песни
                </div>
            </div>
        </>
    )
}

export default React.memo(Menu)