import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Themes } from '../../../types/Settings'

const themeSlice = createSlice({
  name: 'theme',
  initialState: Themes.DEFAULT,
  reducers: {
    setTheme: (state, action: PayloadAction<Themes>) => action.payload,
  },
})

export const { setTheme } = themeSlice.actions

export default themeSlice
