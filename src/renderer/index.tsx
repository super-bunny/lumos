import './index.css'
import React from 'react'
import { createRoot } from 'react-dom/client'
import Router from './components/Router'
import store from './store/store'
import { Provider } from 'react-redux'
import * as Sentry from '@sentry/electron/renderer'
import { sentryBaseDefaultOptions } from '../shared/utils/sentry'
import { init as reactInit, Replay } from '@sentry/react'
import { IpcEvents } from '../types/Ipc'
import setupIpcEventsHandlers from './utils/setupIpcEventsHandlers'

if (window.lumos.sentryEnabled) {
  Sentry.init({
    ...sentryBaseDefaultOptions,
    beforeSend: event => {
      if (!window.lumos.initSettings.enableErrorReporting) {
        console.info('An error as been captured but not sent to Sentry because error reporting is disabled.')
        return null
      }
      return event
    },
    beforeBreadcrumb: (breadcrumb) => {
      if (breadcrumb.category === 'console' && breadcrumb.message?.includes('jwt'))
        return null
      else if (breadcrumb.category === 'console' && breadcrumb.message?.startsWith('Monitor list:'))
        return null

      return breadcrumb
    },
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,
    integrations: [
      new Replay({
        maskAllText: false,
        maskAllInputs: false,
        blockAllMedia: true,
      }),
    ],
  }, reactInit)
}

const root = createRoot(document.getElementById('root')!)

root.render(
  <Provider store={ store }>
    <Router/>
  </Provider>,
)

console.debug('Sentry enabled:', window.lumos.sentryEnabled)
console.debug('Env:', window.lumos.env)
window.lumos.sessionJwt()
  .then(jwt => console.info('Session jwt:', jwt))

setupIpcEventsHandlers()