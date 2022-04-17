import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import MonitorListPage from './pages/MonitorListPage'
import App from '../app'

export default function Router() {
  return (
    <MemoryRouter>
      <Routes>
        <Route path="/" element={ <App/> }>
          <Route index element={ <MonitorListPage/> }/>
        </Route>
      </Routes>
    </MemoryRouter>
  )
}
