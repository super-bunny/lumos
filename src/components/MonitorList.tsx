import React from 'react'
import Display from 'ddc-enhanced-rs'
import { Stack, SxProps, Typography } from '@mui/material'
import MonitorBrightnessCard from './molecules/MonitorBrightnessCard'

export interface Props {
  sx?: SxProps
}

export default function MonitorList({ sx }: Props) {
  const monitors = Display.info()

  return (
    <Stack
      direction={ 'row' }
      alignItems={ 'center' }
      justifyContent={ 'center' }
      flexWrap={ 'wrap' }
      gap={ 4 }
      sx={ sx }
    >
      { monitors.map(monitor => <MonitorBrightnessCard key={ monitor.id } monitor={ monitor }/>) }
      { monitors.length === 0 &&
        <Typography fontSize={ '1.5em' } noWrap sx={ { color: 'gray' } }>No monitors found</Typography> }
    </Stack>
  )
}
