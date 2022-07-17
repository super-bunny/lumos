import React from 'react'
import { Themes } from '../types/Settings'

const themeContext = React.createContext({
  theme: Themes.DEFAULT,
  setTheme: (theme: Themes) => {
    console.log('centext setTheme:', theme)
  },
})

export default themeContext
