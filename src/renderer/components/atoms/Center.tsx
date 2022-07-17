import React, { PropsWithChildren } from 'react'
import { Box, SxProps } from '@mui/material'

export interface Props {
  sx?: SxProps
}

export default function Center({ sx, children }: PropsWithChildren<Props>) {
  return (
    <Box
      height={ 1 }
      width={ 1 }
      display={ 'flex' }
      justifyContent={ 'center' }
      alignItems={ 'center' }
      sx={ sx }
    >{ children }</Box>
  )
}
