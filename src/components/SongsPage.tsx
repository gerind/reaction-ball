import React from 'react'
import { useActions } from '../hooks/actions'
import { useDataSelector } from '../hooks/dataSelector'

const SongsPage: React.FC = () => {

  const { chooseSong, changeMainPage } = useActions()
  const songsData = useDataSelector(data => data.songs)
  const songs = songsData.songs
  const choosen = songsData.choosen

  function chooseSongFabric(index: number) {
    return () => {
      chooseSong(index)
      localStorage.setItem('choosen', index.toString())
    }
  }

  return <div className="songs">
    <div className="song">
      <div className="button" onClick={() => changeMainPage('menu')}>Назад</div>
    </div>
    {
      songs.map(({url, name}, index) => {
        const disabled = choosen === index
        return <div className="song">
          {index + 1}. {name} <div className={`button${disabled ? ' disabled' : ''}`} onClick={chooseSongFabric(index)}>
            {disabled ? 'Выбрано' : 'Выбрать'}
          </div>
        </div>
      })
    }
  </div>
}

export default React.memo(SongsPage)
