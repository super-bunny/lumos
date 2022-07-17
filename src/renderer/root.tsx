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
