import React from 'react'
import { Alert, Button, Grow, Stack, SxProps, Typography } from '@mui/material'
import MonitorBrightnessCard from '../molecules/MonitorBrightnessCard'
import Loader from '../atoms/Loader'
import useSettingsStore from '../../hooks/useSettingsStore'
import useMonitors from '../../hooks/useMonitors'

export interface Props {
  sx?: SxProps
}

export default function MonitorList({ sx }: Props) {
  const { settingsStore } = useSettingsStore()
  const {
    monitors,
    isValidating: loading,
    error,
    refreshMonitors,
  } = useMonitors()

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
        <Button
          onClick={ () => refreshMonitors() }
          variant={ 'text' }
        >{ error ? 'Retry' : 'Refresh' }</Button> }
    </Stack>
  )
}
