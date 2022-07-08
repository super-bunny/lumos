import React, { useCallback, useEffect, useState } from 'react'
import { DisplayManager } from 'ddc-rs'
import { Alert, Button, Stack, SxProps, Typography } from '@mui/material'
import MonitorBrightnessCard from './molecules/MonitorBrightnessCard'
import EnhancedDisplay from '../classes/EnhancedDisplay'
import Loader from './atoms/Loader'

export interface Props {
  sx?: SxProps
}

export default function MonitorList({ sx }: Props) {
  const [monitors, setMonitors] = useState<Array<EnhancedDisplay>>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>()

  const getMonitors = useCallback(() => {
    console.info('Getting monitor list...')
    setLoading(true)

    try {
      const monitors = new DisplayManager().list()
      setMonitors(monitors.map(display => new EnhancedDisplay(display)))
    } catch (e) {
      console.error(e)
      setError('An error occurred during the monitor list retrieval')
    }

    setLoading(false)
    console.info('Monitor list retrieved')
  }, [])

  useEffect(() => {
    getMonitors()
  }, [])

  return (
    <Stack
      direction={ 'row' }
      alignItems={ 'center' }
      justifyContent={ 'center' }
      flexWrap={ 'wrap' }
      gap={ 4 }
      sx={ sx }
    >
      { loading && <Loader title={ 'Loading monitor list' }/> }

      { !loading && monitors?.map(monitor => <MonitorBrightnessCard
        key={ monitor.info.index }
        monitor={ monitor }
      />) }

      { !loading && monitors?.length === 0 && (
        <Stack direction={ 'column' } alignItems={ 'center' } spacing={ 1 }>
          <Typography fontSize={ '1.5em' } noWrap sx={ { color: 'gray' } }>No supported monitors found</Typography>
          <Button onClick={ getMonitors } variant={ 'text' }>Refresh</Button>
        </Stack>
      ) }

      { !loading && error && (
        <Stack direction={ 'column' } alignItems={ 'center' } spacing={ 1 }>
          <Alert severity={ 'error' }>{ error }</Alert>
          <Button onClick={ getMonitors } variant={ 'text' }>Retry</Button>
        </Stack>
      ) }
    </Stack>
  )
}
