import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.scss'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { isMobileDevice } from './core/utils'
import NoMobile from './components/NoMobile'

const savedInterval = window.setInterval
const savedTimeout = window.setTimeout

export const GlobalContext = React.createContext<{
  savedInterval: typeof savedInterval
  savedTimeout: typeof savedTimeout
}>({
  savedInterval,
  savedTimeout,
})

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

if (isMobileDevice()) root.render(<NoMobile />)
else
  root.render(
    <Provider store={store}>
      <GlobalContext.Provider
        value={{
          savedInterval,
          savedTimeout,
        }}
      >
        <App />
      </GlobalContext.Provider>
    </Provider>
  )

reportWebVitals()
