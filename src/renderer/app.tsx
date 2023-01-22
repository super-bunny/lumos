import React from 'react'
import PageTemplate from './components/templates/PageTemplate'
import { Themes } from '../types/Settings'
import { CssBaseline, ThemeProvider } from '@mui/material'
import themeConfigs from './themeConfigs'
import { useAppSelector } from './store/store'
import { ConfirmProvider } from 'material-ui-confirm'
import { SnackbarProvider } from 'notistack'

export default function App() {
  const themeContext = useAppSelector(state => state.theme)

  return (
    <ThemeProvider theme={ themeConfigs[themeContext] ?? themeConfigs[Themes.DEFAULT] }>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */ }
      <CssBaseline/>
      <SnackbarProvider>
        <ConfirmProvider>
          <PageTemplate/>
        </ConfirmProvider>
      </SnackbarProvider>
    </ThemeProvider>
  )
}
