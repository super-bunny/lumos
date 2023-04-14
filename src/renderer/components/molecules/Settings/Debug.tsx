import React from 'react'
import SettingsType from '../../../../types/Settings'
import { Button, Divider, Grid, Stack, SxProps } from '@mui/material'
import { useSnackbar } from 'notistack'
import GenericDisplay from '../../../../shared/classes/GenericDisplay'
import IpcBackendClient from '../../../classes/IpcBackendClient'
import SettingItem from '../SettingItem'
import VcpDevTool from '../VcpDevTool'

export interface Props {
  settings: SettingsType
  onChange?: (settings: SettingsType) => void
  sx?: SxProps
}

export default function Debug({ settings, onChange, sx }: Props) {
  const { enqueueSnackbar } = useSnackbar()

  return (
    <Grid container gap={ 2 } sx={ sx }>
      <Grid item xs={ 12 }>
        <Stack gap={ 2 } divider={ <Divider/> }>
          <Stack spacing={ 2 }>
            <SettingItem
              label={ 'VCP debug tool' }
              description={ 'Send VCP command to get/set a VCP feature on a monitor.' }
            />
            <VcpDevTool/>
          </Stack>

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
                      console.info('[Debug] Monitor list', monitors)
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

          <SettingItem
            label={ 'List Electron monitors to console' }
            description={ 'This will list monitors from the Electron API and print them to the developer tools console.' }
            action={
              <Button
                onClick={ () => {
                  enqueueSnackbar('Retrieving Electron monitors...', { variant: 'info' })
                  window.lumos.getElectronDisplays()
                    .then(monitors => {
                      enqueueSnackbar('Electron monitors retrieved, checkout the developer tools console', { variant: 'success' })
                      console.info('[Debug] Electron monitor list', monitors)
                    })
                    .catch((error) => {
                      enqueueSnackbar('Fail to retrieve Electron monitors', { variant: 'error' })
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

          <SettingItem
            label={ 'Copy HTTP API session token to clipboard' }
            action={
              <Button
                onClick={ () => {
                  window.lumos.sessionJwt()
                    .then(jwt => navigator.clipboard.writeText(jwt))
                    .then(() => enqueueSnackbar('Session JWT copied to clipboard', { variant: 'success' }))
                    .catch((error) => {
                      enqueueSnackbar('Fail to retrieve session JWT', { variant: 'error' })
                      console.error(error)
                    })
                } }
                variant={ 'contained' }
                color={ 'secondary' }
                size={ 'small' }
              >Copy to clipboard</Button>
            }
          />
        </Stack>
      </Grid>
    </Grid>
  )
}
