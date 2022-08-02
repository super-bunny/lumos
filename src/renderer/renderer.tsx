import './index.css'
import React from 'react'
import { createRoot } from 'react-dom/client'
import Router from './components/Router'
import store from './store/store'
import { Provider } from 'react-redux'

const root = createRoot(document.getElementById('root')!)

root.render(
  <Provider store={ store }>
    <Router/>
  </Provider>,
)

window.lumos.getEnv()
  .then(env => console.debug('Env:', env))
window.lumos.sessionJwt()
  .then(jwt => console.info('Session jwt:', jwt))

console.log('👋 This message is being logged by "renderer.js", included via webpack')
