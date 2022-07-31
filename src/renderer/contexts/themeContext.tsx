import React from 'react'
import { Themes } from '../../types/Settings'

const themeContext = React.createContext({
  theme: Themes.DEFAULT,
  setTheme: (theme: Themes) => {
  },
})

export default themeContext
