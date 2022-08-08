import { ISongs } from './store'

export function getInitialSongs(): ISongs {
  return {
    songs: [
      {
        url: '/thebeginning.mp3',
        name: 'ONE OK ROCK - The Beginning (Nighcore Edition)'
      },
      {
        url: '/breakbeatbark.mp3',
        name: 'Yuna (CV:Sayaka Kanda) - Break Beat Bark'
      }
    ],
    choosen: +(localStorage.getItem('choosen') || 0)
  }
}
