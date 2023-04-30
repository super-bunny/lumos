import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import MonitorListPage from './pages/MonitorListPage'
import App from '../app'
import SettingsPage from './pages/SettingsPage'

export default function Router() {
  const initialEntry = window.lumos.env.ROUTER_INITIAL_ENTRY

  return (
    <MemoryRouter initialEntries={ initialEntry ? [initialEntry] : undefined }>
      <Routes>
        <Route path="/" element={ <App/> }>
          <Route path={ '/settings/*' } element={ <SettingsPage/> }/>
          <Route index element={ <MonitorListPage/> }/>
        </Route>
      </Routes>
    </MemoryRouter>
  )
}
