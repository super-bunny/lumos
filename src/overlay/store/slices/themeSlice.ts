import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Themes } from '../../../types/Settings'
import constants from '../../../shared/utils/contants'

const themeSlice = createSlice({
  name: 'theme',
  initialState: window.lumos.initTheme ?? constants.defaultTheme,
  reducers: {
    setTheme: (state, action: PayloadAction<Themes>) => action.payload,
  },
})

export const { setTheme } = themeSlice.actions

export default themeSlice
