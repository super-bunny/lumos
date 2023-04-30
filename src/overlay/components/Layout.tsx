import React, { PropsWithChildren } from 'react'
import constants from '../constants'
import { Box, useTheme } from '@mui/material'

export default function Layout({ children }: PropsWithChildren<{}>) {
  const theme = useTheme()

  return (
    <Box
      py={ 0.5 }
      px={ 2 }
      style={ {
        height: constants.overlayHeight, width: constants.overlayWidth,
        overflow: 'hidden',
        borderRadius: '8px',
        backgroundColor: theme.palette.background.paper,
      } }
    >
      { children }
    </Box>
  )
}