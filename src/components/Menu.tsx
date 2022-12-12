import React, { useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightArrowLeft, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import If from './If'
import { useDataSelector } from '../hooks/dataSelector'
import { useActions } from '../hooks/actions'

const Menu: React.FC = () => {

  const mainColor = useDataSelector(data => data.maincolor)
  const name = useDataSelector(data => data.name)
  const top = useDataSelector(data => data.top)
  const localtop = useDataSelector(data => data.localtop)
  const choosentoptype = useDataSelector(data => data.choosentop)

  const { changeName, clearLocalTop, toggleTop, changeMainPage, changeMainColor } = useActions()

  const choosentop = choosentoptype === 'local' ? localtop : top

  function onInput(event: React.FormEvent<HTMLInputElement>) {
    const value = (event.target as HTMLInputElement).value
    changeName(value)
  }

  const colorRef = useRef<HTMLInputElement>(null)

  return (
    <>
      <div className="left">
        <div className="row">
          <If cond={choosentoptype === 'local'}>
            <FontAwesomeIcon icon={faTrashCan} className={'clearlocal'} onClick={() => {
              clearLocalTop()
            }} />
          </If>
          {choosentoptype === 'global' ? 'Общий рейтинг' : 'Локальный рейтинг'}
          <FontAwesomeIcon icon={faArrowRightArrowLeft} className="togglerating" onClick={() => {
            toggleTop()
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
          changeMainPage('game')
        }}>Играть</div>
        <div className="button" onClick={() => {
          if (document.fullscreenElement === document.documentElement)
            document.exitFullscreen()
          else
            document.documentElement.requestFullscreen()
        }}>Полноэкранный режим</div>
        <div className="button" onClick={() => {
          colorRef.current!.click()
        }}>
          <input className="color" type="color" value={mainColor} ref={colorRef} onChange={event => {
            const target = event.target as HTMLInputElement
            changeMainColor(target.value)
          }}/>
          Цвет фона
        </div>
        <div className="button" onClick={() => {
          changeMainPage('songs')
        }}>
          Выбор песни
        </div>
      </div>
    </>
  )
}

export default React.memo(Menu)