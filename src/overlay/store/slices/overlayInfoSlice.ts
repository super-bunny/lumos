import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import OverlayState from '../../../types/OverlayState'

type State = OverlayState | null

const overlayInfoSlice = createSlice({
  name: 'displayId',
  initialState: null as State,
  reducers: {
    setOverlayInfo: (state, action: PayloadAction<State>) => action.payload,
  },
})

export const { setOverlayInfo } = overlayInfoSlice.actions

export default overlayInfoSlice
