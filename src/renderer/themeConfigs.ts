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
  components: {
    MuiCssBaseline: {
      styleOverrides: theme => ({
        code: {
          padding: theme.spacing(1),
          borderRadius: theme.shape.borderRadius,
          color: 'lightgray',
          background: '#232931',
          display: 'block',
        },
      }),
    },
  },
})

const materialLight = createTheme({
  palette: {
    primary: {
      main: '#f15025',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: theme => ({
        code: {
          padding: theme.spacing(1),
          borderRadius: theme.shape.borderRadius,
          color: 'lightgray',
          background: '#232931',
          display: 'block',
        },
      }),
    },
  },
})

const themeConfigs: Record<Themes, Theme> = {
  default: OriginTheme,
  materialLight,
}

export default themeConfigs
