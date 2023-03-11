import React, { useCallback, useEffect, useState } from 'react'
import { Alert, Button, Grow, Stack, SxProps, Typography } from '@mui/material'
import MonitorBrightnessCard from '../molecules/MonitorBrightnessCard'
import Loader from '../atoms/Loader'
import GenericDisplay from '../../../shared/classes/GenericDisplay'
import IpcBackendClient from '../../classes/IpcBackendClient'
import useSettingsStore from '../../hooks/useSettingsStore'

export interface Props {
  sx?: SxProps
}

export default function MonitorList({ sx }: Props) {
  const [monitors, setMonitors] = useState<Array<GenericDisplay>>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>()

  const { settingsStore } = useSettingsStore()

  const getMonitors = useCallback(async (useCache?: boolean) => {
    console.info('Getting monitor list...')
    setLoading(true)
    setError(null)

    try {
      const monitors = await GenericDisplay.list(new IpcBackendClient(), { useCache })
      console.info('Monitor list:', monitors)
      setMonitors(GenericDisplay.filterDuplicateDisplay(monitors))
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
          { monitors?.map((monitor, index) => (
            <Grow
              in={ true }
              appear={ settingsStore?.settings.enableAnimations ?? false }
              timeout={ 500 + (300 * (index + 1)) }
              key={ monitor.info.index }
            >
              <div>
                <MonitorBrightnessCard monitor={ monitor }/>
              </div>
            </Grow>)) }
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
