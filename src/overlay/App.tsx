import React from 'react'
import { CssBaseline, ThemeProvider } from '@mui/material'
import BrightnessSlider from './components/BrightnessSlider'
import themeConfigs from '../renderer/themeConfigs'
import { useAppSelector } from './store/store'
import Layout from './components/Layout'
import constants from '../shared/utils/contants'

export default function App() {
  const themeContext = useAppSelector(state => state.theme)

  return (
    <ThemeProvider theme={ themeConfigs[themeContext] ?? themeConfigs[constants.defaultTheme] }>
      <CssBaseline/>
      <Layout>
        <BrightnessSlider/>
      </Layout>
    </ThemeProvider>
  )
}
