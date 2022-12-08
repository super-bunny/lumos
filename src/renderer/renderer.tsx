import './index.css'
import React from 'react'
import { createRoot } from 'react-dom/client'
import Router from './components/Router'
import store from './store/store'
import { Provider } from 'react-redux'
import { mockDisplays } from './mockDisplays'

const root = createRoot(document.getElementById('root')!)

root.render(
  <Provider store={ store }>
    <Router/>
  </Provider>,
)

if (window.lumos.env.MOCK_DISPLAYS === 'true') {
  console.info('Mocking Displays')
  mockDisplays()
}

console.debug('Env:', window.lumos.env)
window.lumos.sessionJwt()
  .then(jwt => console.info('Session jwt:', jwt))

console.log('👋 This message is being logged by "renderer.js", included via webpack')
