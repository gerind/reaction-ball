import React, { useEffect, useContext } from 'react'
import { GlobalContext } from '..'
import { useDataActions, useGameActions } from '../hooks/actions'
import { useDataSelector } from '../hooks/dataSelector'

export type IResponseType = Array<string | Array<number>>

const GamePreload: React.FC = () => {
  const { savedTimeout: setTimeout } = useContext(GlobalContext)

  const { changeAudio, changeGameStage } = useDataActions()
  const { changeGameToken, changeFrames } = useGameActions()

  const songs = useDataSelector(data => data.songs)
  const songUrl = songs.songs[songs.choosen].url
  const name = useDataSelector(data => data.name || 'Player')

  useEffect(() => {
    setTimeout(
      () =>
        fetch(`/gamestart?name=${name}`)
          .then(res => res.json())
          .then((json: IResponseType) => {
            if (!Array.isArray(json)) {
              window.location.reload()
              return
            }
            const audio = new Audio(songUrl)
            changeAudio(audio)
            audio.oncanplaythrough = () => {
              audio.oncanplaythrough = null
              audio.play()
              changeGameToken(json[0] as string)
              changeFrames(json.slice(2) as Array<Array<number>>)
              changeGameStage('game')
            }
          }),
      888
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="preload">
      Загрузка...
      <br />
      Держите курсор в центре экрана
    </div>
  )
}

export default GamePreload
