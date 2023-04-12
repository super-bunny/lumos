import React from 'react'
import SettingsType from '../../../../types/Settings'
import { Divider, Grid, Stack, Switch, SxProps } from '@mui/material'
import { useSnackbar } from 'notistack'
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
            labelFor={ 'ignore-win-api' }
            label={ 'Ignore monitors from Windows API' }
            description={ 'Lumos use different ways to control your monitors (API). Windows provides its own API, but it can cause duplicates if some of your monitors are connected on a non CPU integrated graphic card.' }
            action={
              <Switch
                checked={ settings.ignoreWinApi }
                onChange={ (event) =>
                  onChange?.({ ...settings, ignoreWinApi: event.target.checked })
                }
                id={ 'ignore-win-api' }
              />
            }
          />

          <SettingItem
            labelFor={ 'concurrent-ddc-request' }
            label={ 'Concurrent DDC request' }
            description={ 'Allow more than one DDC request at once. In some cases disabling this can avoid unexpected error in communication with monitors.\nEnabled by default.' }
            action={
              <Switch
                checked={ settings.concurrentDdcRequest }
                onChange={ (event) =>
                  onChange?.({ ...settings, concurrentDdcRequest: event.target.checked })
                }
                id={ 'concurrent-ddc-request' }
              />
            }
          />

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
    </Grid>
  )
}
