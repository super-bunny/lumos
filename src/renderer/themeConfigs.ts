import { createTheme } from '@mui/material/styles'
import { Themes } from '../types/Settings'
import { Theme } from '@emotion/react'


export const OriginTheme = createTheme({
  typography: {
    fontFamily: 'Orbitron',
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#f15025',
    },
    background: {
      default: '#171717',
      paper: '#282828',
    },
    divider: '#808080',
  },
})


const defaultTheme = createTheme({})

const themeConfigs: Record<Themes, Theme> = {
  default: defaultTheme,
  origin: OriginTheme,
}

export default themeConfigs
