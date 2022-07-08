import React from 'react'
import { DisplayManager } from 'ddc-rs'
import { Stack, SxProps, Typography } from '@mui/material'
import MonitorBrightnessCard from './molecules/MonitorBrightnessCard'
import EnhancedDisplay from '../classes/EnhancedDisplay'

export interface Props {
  sx?: SxProps
}

export default function MonitorList({ sx }: Props) {
  const monitors = new DisplayManager().list()

  return (
    <Stack
      direction={ 'row' }
      alignItems={ 'center' }
      justifyContent={ 'center' }
      flexWrap={ 'wrap' }
      gap={ 4 }
      sx={ sx }
    >
      { monitors.map(monitor => <MonitorBrightnessCard
        key={ monitor.index }
        monitor={ new EnhancedDisplay(monitor) }
      />) }
      { monitors.length === 0 &&
        <Typography fontSize={ '1.5em' } noWrap sx={ { color: 'gray' } }>No supported monitors found</Typography> }
    </Stack>
  )
}
