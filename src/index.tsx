import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.scss'
import App from './App'
import reportWebVitals from './reportWebVitals'

const savedInterval = window.setInterval
const savedTimeout = window.setTimeout

export const GlobalContext = React.createContext<{
  savedInterval: typeof savedInterval,
  savedTimeout: typeof savedTimeout
}>({
  savedInterval, savedTimeout
})

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)
root.render(
  <GlobalContext.Provider value={{
    savedInterval, savedTimeout
  }}>
    <App />
  </GlobalContext.Provider>
)

reportWebVitals()
