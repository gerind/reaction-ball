import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { changeMainPageAction, chooseSongAction, ISongs, IState } from '../core/store'

const SongsPage: React.FC = () => {

  const dispatch = useDispatch()
  const songsData = useSelector<IState, ISongs>(state => state.songs)
  const songs = songsData.songs
  const choosen = songsData.choosen

  function chooseSong(index: number) {
    dispatch(chooseSongAction(index))
    localStorage.setItem('choosen', index.toString())
  }

  return <div className="songs">
    <div className="song">
      <div className="button" onClick={() => dispatch(changeMainPageAction('menu'))}>Назад</div>
    </div>
    {
      songs.map(({url, name}, index) => {
        const disabled = choosen === index
        return <div className="song">
          {index + 1}. {name} <div className={`button${disabled ? ' disabled' : ''}`} onClick={chooseSong.bind(null, index)}>
            {disabled ? 'Выбрано' : 'Выбрать'}
          </div>
        </div>
      })
    }
  </div>
}

export default React.memo(SongsPage)
