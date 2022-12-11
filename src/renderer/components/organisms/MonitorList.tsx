import React, { useCallback, useEffect, useState } from 'react'
import { Alert, Button, Stack, SxProps, Typography } from '@mui/material'
import MonitorBrightnessCard from '../molecules/MonitorBrightnessCard'
import Loader from '../atoms/Loader'
import { Backends } from '../../../main/classes/AbstractDisplay'
import GenericDisplay from '../../classes/GenericDisplay'
import IpcBackendClient from '../../classes/IpcBackendClient'

export interface Props {
  sx?: SxProps
}

export default function MonitorList({ sx }: Props) {
  const [monitors, setMonitors] = useState<Array<GenericDisplay>>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>()

  const getMonitors = useCallback(async (useCache?: boolean) => {
    console.info('Getting monitor list...')
    setLoading(true)
    setError(null)

    try {
      const monitors = await GenericDisplay.list(new IpcBackendClient(), { useCache })
      console.info('Monitor list:', monitors)
      const backendList = monitors.map(display => display.info.backend)

      // If nvapi backend is detected filter out all other backend to avoid duplicate monitors
      if (backendList.includes(Backends.NV_API)) {
        const filteredMonitors = monitors
          .filter(display => display.info.backend === Backends.NV_API)

        setMonitors(filteredMonitors)
      } else {
        setMonitors(monitors)
      }
    } catch (e) {
      console.error(e)
      setError('An error occurred during the monitor list retrieval')
    }

    setLoading(false)
    console.info('Monitor list retrieved')
  }, [])

  useEffect(() => {
    getMonitors(true)
  }, [getMonitors])

  return (
    <Stack direction={ 'column' } alignItems={ 'center' } spacing={ 1 } sx={ sx }>
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

      { !loading &&
        <Button onClick={ () => getMonitors(false) } variant={ 'text' }>{ error ? 'Retry' : 'Refresh' }</Button> }
    </Stack>
  )
}
