import React from 'react'
import { createRoot } from 'react-dom/client'
import { CssBaseline, ThemeProvider } from '@mui/material'
import Router from './components/Router'
import theme from './theme'

const root = createRoot(document.getElementById('root')!)

root.render(
  <ThemeProvider theme={ theme }>
    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */ }
    <CssBaseline/>
    <Router/>
  </ThemeProvider>,
)
