import React, { useCallback, useEffect, useState } from 'react'
import { DisplayManager } from 'ddc-rs'
import { Alert, Button, Stack, SxProps, Typography } from '@mui/material'
import MonitorBrightnessCard from './molecules/MonitorBrightnessCard'
import EnhancedDisplay from '../classes/EnhancedDisplay'
import Loader from './atoms/Loader'
import Center from './atoms/Center'

export interface Props {
  sx?: SxProps
}

export default function MonitorList({ sx }: Props) {
  const [monitors, setMonitors] = useState<Array<EnhancedDisplay>>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>()

  const getMonitors = useCallback(() => {
    console.info('Getting monitor list...')
    setLoading(true)
    setError(null)

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
    <Center sx={ sx }>
      <Stack direction={ 'column' } alignItems={ 'center' } spacing={ 1 }>
        { loading && <Loader title={ 'Loading monitor list' }/> }

        { !loading && (
          <Stack
            direction={ 'row' }
            alignItems={ 'center' }
            justifyContent={ 'center' }
            flexWrap={ 'wrap' }
            gap={ 4 }
          >
            { monitors?.map(monitor => <MonitorBrightnessCard
              key={ monitor.info.index }
              monitor={ monitor }
            />) }
          </Stack>
        ) }

        { !loading && monitors?.length === 0 && (
          <Typography fontSize={ '1.5em' } noWrap sx={ { color: 'gray' } }>No supported monitors found</Typography>
        ) }

        { !loading && error && (
          <Alert severity={ 'error' }>{ error }</Alert>
        ) }

        { !loading && <Button onClick={ getMonitors } variant={ 'text' }>{ error ? 'Retry' : 'Refresh' }</Button> }
      </Stack>
    </Center>
  )
}
