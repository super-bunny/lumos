import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import App from '../app'

export default function Router() {
  return (
    <MemoryRouter>
      <Routes>
        <Route path="/" element={ <App/> }>
        </Route>
      </Routes>
    </MemoryRouter>
  )
}
