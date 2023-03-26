import React from 'react'
import SettingsType from '../../../../types/Settings'
import {
  Button,
  Collapse,
  Divider,
  Fade,
  FormControlLabel,
  Grid,
  Grow, Slide,
  Stack,
  Switch,
  SxProps,
  Zoom,
} from '@mui/material'
import InfoIcon from '../../atoms/InfoIcon'
import { useSnackbar } from 'notistack'
import GenericDisplay from '../../../../shared/classes/GenericDisplay'
import IpcBackendClient from '../../../classes/IpcBackendClient'
import SettingItem from '../SettingItem'

export interface Props {
  settings: SettingsType
  onChange?: (settings: SettingsType) => void
  sx?: SxProps
}

export default function AdvancedSettings({ settings, onChange, sx }: Props) {
  const { enqueueSnackbar } = useSnackbar()

  return (
    <Grid container gap={ 2 } sx={ sx }>
      <Grid item xs={ 12 }>
        <Stack gap={ 2 } divider={ <Divider/> }>
          <SettingItem
            labelFor={ 'developer-mode' }
            label={ 'Developer mode' }
            description={ 'Show additional info and actions useful for developers in the application interface' }
            action={
              <Switch
                checked={ settings.developerMode }
                onChange={ (event) =>
                  onChange?.({ ...settings, developerMode: event.target.checked } as SettingsType)
                }
                id={ 'developer-mode' }
              />
            }
          />
        </Stack>
      </Grid>

      { settings.developerMode && (
        <>
          <Grid item xs={ 12 }>
            <Divider>DEBUG ZONE</Divider>
          </Grid>

          <Grid item xs={ 12 }>
            <Stack gap={ 2 } divider={ <Divider/> }>
              <SettingItem
                label={ 'Auto monitor power off' }
                description={ 'Test if your monitor wil power off monitor on system shutdown.' }
                action={
                  <Button
                    onClick={ () => {
                      window.lumos.forceTriggerAutoMonitorsPowerOff()
                        .then(() => enqueueSnackbar('Auto monitor power off triggered', { variant: 'success' }))
                        .catch((error) => enqueueSnackbar(`Fail to trigger auto monitor power off: ${ error }`, { variant: 'error' }))
                    } }
                    variant={ 'contained' }
                    color={ 'secondary' }
                    size={ 'small' }
                  >Run</Button>
                }
              />

              <SettingItem
                label={ 'List monitors to console' }
                description={ 'This will list monitors and print them to the developer tools console without any filtering.' }
                action={
                  <Button
                    onClick={ () => {
                      enqueueSnackbar('Retrieving monitors...', { variant: 'info' })
                      GenericDisplay.list(new IpcBackendClient())
                        .then(monitors => {
                          enqueueSnackbar('Monitors retrieved, checkout the developer tools console', { variant: 'success' })
                          console.info('[Debug] monitor list', monitors)
                        })
                        .catch((error) => {
                          enqueueSnackbar('Fail to retrieve monitors', { variant: 'error' })
                          console.error(error)
                        })
                        .then(() => window.lumos.openDevTools())
                        .catch((error) => {
                          enqueueSnackbar('Fail to open developer tools', { variant: 'error' })
                          console.error(error)
                        })
                    } }
                    variant={ 'contained' }
                    color={ 'secondary' }
                    size={ 'small' }
                  >Run</Button>
                }
              />
            </Stack>
          </Grid>
        </>
      ) }
    </Grid>
  )
}
