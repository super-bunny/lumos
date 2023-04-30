import React from 'react'
import { CssBaseline, ThemeProvider } from '@mui/material'
import BrightnessSlider from './components/BrightnessSlider'
import themeConfigs from '../renderer/themeConfigs'
import { Themes } from '../types/Settings'
import { useAppSelector } from './store/store'
import Layout from './components/Layout'

export default function App() {
  const themeContext = useAppSelector(state => state.theme)

  return (
    <ThemeProvider theme={ themeConfigs[themeContext] ?? themeConfigs[Themes.DEFAULT] }>
      <CssBaseline/>
      <Layout>
        <BrightnessSlider/>
      </Layout>
    </ThemeProvider>
  )
}
