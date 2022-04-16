import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { CssBaseline, ThemeProvider } from '@mui/material'
import theme from './theme'

const root = createRoot(document.getElementById('root'))

root.render(
  <ThemeProvider theme={ theme }>
    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */ }
    <CssBaseline/>
    <h2>Hello from React!</h2>
  </ThemeProvider>,
)
