import React from 'react'
import PageTemplate from './components/templates/PageTemplate'
import { Themes } from '../types/Settings'
import { CssBaseline, ThemeProvider } from '@mui/material'
import themeConfigs from './themeConfigs'
import { useAppSelector } from './store/store'

export default function App() {
  const themeContext = useAppSelector(state => state.theme)

  return (
    <ThemeProvider theme={ themeConfigs[themeContext] ?? themeConfigs[Themes.DEFAULT] }>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */ }
      <CssBaseline/>
      <PageTemplate/>
    </ThemeProvider>
  )
}
