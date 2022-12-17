import React, { useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowRightArrowLeft,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons'
import { useDataSelector } from '../hooks/dataSelector'
import { useDataActions } from '../hooks/actions'
import { classes } from '../core/utils'

const Menu: React.FC = () => {
  const mainColor = useDataSelector(data => data.mainColor)
  const name = useDataSelector(data => data.name)
  const top = useDataSelector(data => data.top)
  const localtop = useDataSelector(data => data.localTop)
  const choosenTopType = useDataSelector(data => data.choosenTop)

  const {
    changeName,
    clearLocalTop,
    toggleTop,
    changeMainPage,
    changeMainColor,
    changeGameStage,
  } = useDataActions()

  function onInput(event: React.FormEvent<HTMLInputElement>) {
    const value = (event.target as HTMLInputElement).value
    changeName(value)
  }

  const colorRef = useRef<HTMLInputElement>(null)

  return (
    <>
      <div
        className={classes({
          left: true,
          back: false,
          active: choosenTopType === 'local',
        })}
      >
        <div className="row">
          Общий рейтинг
          <FontAwesomeIcon
            icon={faArrowRightArrowLeft}
            className="togglerating"
            onClick={() => {
              toggleTop()
            }}
          />
        </div>
        {top.map(({ name, score }, index) => (
          <div className="row">
            <span className="index">{index + 1}.</span>
            <span className="name">{name}</span>
            <span className="score">{score}</span>
          </div>
        ))}
      </div>
      <div
        className={classes({
          left: true,
          back: true,
          active: choosenTopType === 'local',
        })}
      >
        <div className="row">
          <FontAwesomeIcon
            icon={faTrashCan}
            className={'clearlocal'}
            onClick={() => {
              clearLocalTop()
            }}
          />
          Локальный рейтинг
          <FontAwesomeIcon
            icon={faArrowRightArrowLeft}
            className="togglerating"
            onClick={() => {
              toggleTop()
            }}
          />
        </div>
        {localtop.map(({ name, score }, index) => (
          <div className="row">
            <span className="index">{index + 1}.</span>
            <span className="name">{name}</span>
            <span className="score">{score}</span>
          </div>
        ))}
      </div>
      <div className="right">
        <input
          value={name}
          type="text"
          className="name"
          placeholder="Player"
          onInput={onInput}
        />
        <div
          className="button"
          onClick={() => {
            changeMainPage('game')
            changeGameStage('preload')
          }}
        >
          Играть
        </div>
        <div
          className="button"
          onClick={() => {
            if (document.fullscreenElement === document.documentElement)
              document.exitFullscreen()
            else document.documentElement.requestFullscreen()
          }}
        >
          Полноэкранный режим
        </div>
        <div
          className="button"
          onClick={() => {
            colorRef.current!.click()
          }}
        >
          <input
            className="color"
            type="color"
            value={mainColor}
            ref={colorRef}
            onChange={event => {
              const target = event.target as HTMLInputElement
              changeMainColor(target.value)
            }}
          />
          Цвет фона
        </div>
        <div
          className="button"
          onClick={() => {
            changeMainPage('songs')
          }}
        >
          Выбор песни
        </div>
      </div>
    </>
  )
}

export default React.memo(Menu)
