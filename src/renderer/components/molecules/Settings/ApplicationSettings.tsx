import React from 'react'
import SettingsType from '../../../../types/Settings'
import { Divider, FormControlLabel, Grid, Stack, Switch, SxProps } from '@mui/material'
import SettingItem from '../SettingItem'

export interface Props {
  settings: SettingsType
  onChange?: (settings: SettingsType) => void
  sx?: SxProps
}

export default function ApplicationSettings({ settings, onChange, sx }: Props) {
  return (
    <Grid container gap={ 2 } sx={ sx }>
      <Grid item xs={ 12 }>
        <Stack gap={ 2 } divider={ <Divider/> }>
          <SettingItem
            label={ 'Run app on startup' }
            labelFor={ 'run-app-on-startup' }
            action={
              <Switch
                checked={ settings.runAppOnStartup }
                onChange={ (event) =>
                  onChange?.({ ...settings, runAppOnStartup: event.target.checked })
                }
                id={ 'run-app-on-startup' }
              />
            }
          />

          <SettingItem
            label={ 'Minimize app on startup' }
            labelFor={ 'minimize-app-on-startup' }
            action={
              <Switch
                checked={ settings.minimizeAppOnStartup }
                onChange={ (event) =>
                  onChange?.({ ...settings, minimizeAppOnStartup: event.target.checked } as SettingsType)
                }
                id={ 'minimize-app-on-startup' }
              />
            }
          />

          <SettingItem
            label={ 'Minimize app in task bar on close' }
            labelFor={ 'minimize-app-on-window-close' }
            action={
              <Switch
                checked={ settings.minimizeAppOnWindowClose }
                onChange={ (event) =>
                  onChange?.({ ...settings, minimizeAppOnWindowClose: event.target.checked } as SettingsType)
                }
                id={ 'minimize-app-on-window-close' }
              />
            }
          />
        </Stack>
      </Grid>
    </Grid>
  )
}
