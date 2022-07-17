import React, { useEffect } from 'react'
import PageTemplate from './components/templates/PageTemplate'
import SettingsType, { Themes } from './types/Settings'
import { CssBaseline, ThemeProvider } from '@mui/material'
import themeConfigs from './themeConfigs'
import Store from 'electron-store'
import { useAppDispatch, useAppSelector } from './store/store'
import { setTheme } from './store/slices/themeSlice'

export default function App() {
  const themeContext = useAppSelector(state => state.theme)
  const dispatch = useAppDispatch()

  console.log('themeContext:', themeContext)

  useEffect(() => {
    const { store: { theme } } = new Store<SettingsType>()

    if (!theme || !Object.values(Themes).includes(theme)) {
      return
    }

    dispatch(setTheme(theme))
  }, [dispatch])

  return (
    <ThemeProvider theme={ themeConfigs[themeContext] ?? Themes.DEFAULT }>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */ }
      <CssBaseline/>
      <PageTemplate/>
    </ThemeProvider>
  )
}
