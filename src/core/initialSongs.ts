export interface ISong {
  url: string
  name: string
}

export type ISongs = {
  songs: ISong[]
  choosen: number
}

export function getInitialSongs(): ISongs {
  return {
    songs: [
      {
        url: '/thebeginning.mp3',
        name: 'ONE OK ROCK - The Beginning (Nighcore Edition)',
      },
      {
        url: '/breakbeatbark.mp3',
        name: 'Yuna (CV:Sayaka Kanda) - Break Beat Bark',
      },
      {
        url: '/chittychittybangbang.mp3',
        name: 'QUEENDOM - Chitty Chitty Bang Bang',
      },
    ],
    choosen: +(localStorage.getItem('choosen') || 0),
  }
}
