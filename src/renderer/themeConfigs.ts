import { createTheme } from '@mui/material/styles'
import { Themes } from '../types/Settings'
import { Theme } from '@emotion/react'


export const OriginTheme = createTheme({
  typography: {
    fontFamily: 'Orbitron',
    body1: {
      fontFamily: 'unset',
    },
    body2: {
      fontFamily: 'unset',
    },
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#f15025',
    },
    secondary: {
      main: '#0FA3B1',
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
        '*::-webkit-scrollbar-track': {
          borderRadius: 1000,
          backgroundColor: 'rgba(0,0,0,.5)',
        },
        '*::-webkit-scrollbar': {
          width: 8,
          backgroundColor: 'transparent',
        },
        '*::-webkit-scrollbar-thumb': {
          borderRadius: 1000,
          backgroundColor: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
          },
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
    secondary: {
      main: '#0FA3B1',
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
        '*::-webkit-scrollbar-track': {
          borderRadius: 1000,
          backgroundColor: 'rgba(0,0,0,.1)',
        },
        '*::-webkit-scrollbar': {
          width: 8,
          backgroundColor: 'transparent',
        },
        '*::-webkit-scrollbar-thumb': {
          borderRadius: 1000,
          backgroundColor: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
          },
        },
      }),
    },
  },
})

const materialDark = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#f15025',
    },
    secondary: {
      main: '#0FA3B1',
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
        '*::-webkit-scrollbar-track': {
          borderRadius: 1000,
          backgroundColor: 'rgba(0,0,0,.5)',
        },
        '*::-webkit-scrollbar': {
          width: 8,
          backgroundColor: 'transparent',
        },
        '*::-webkit-scrollbar-thumb': {
          borderRadius: 1000,
          backgroundColor: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
          },
        },
      }),
    },
  },
})

const themeConfigs: Record<Themes, Theme> = {
  materialLight,
  materialDark,
  origin: OriginTheme,
}

export default themeConfigs
