import React from 'react'
import { createRoot } from 'react-dom/client'
import { IpcEvents } from '../types/Ipc'
import App from './App'
import store from './store/store'
import { Provider } from 'react-redux'
import { setOverlayInfo } from './store/slices/overlayInfoSlice'
import './index.css'

const root = createRoot(document.getElementById('root')!)

root.render(
  <Provider store={ store }>
    <App/>
  </Provider>,
)

window.lumos.ipc.on(IpcEvents.PING, message => console.info('Received ping from main process:', message))

window.lumos.ipc.on(IpcEvents.SET_OVERLAY_INFO, info => {
  console.debug('Received overlay info from main process:', info)
  store.dispatch(setOverlayInfo(info))
})
