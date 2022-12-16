import React from 'react'
import SettingsType from '../../../../types/Settings'
import { FormControlLabel, Grid, Switch, SxProps } from '@mui/material'

export interface Props {
  settings: SettingsType
  onChange?: (settings: SettingsType) => void
  sx?: SxProps
}

export default function ApplicationSettings({ settings, onChange, sx }: Props) {
  return (
    <Grid container gap={ 2 } sx={ sx }>
      <Grid item xs={ 12 }>
        <FormControlLabel
          control={
            <Switch
              checked={ settings.runAppOnStartup }
              onChange={ (event) =>
                onChange?.({ ...settings, runAppOnStartup: event.target.checked } as SettingsType)
              }
            />
          }
          label="Run app on startup"
        />
      </Grid>

      <Grid item xs={ 12 }>
        <FormControlLabel
          control={
            <Switch
              checked={ settings.minimizeAppOnStartup }
              onChange={ (event) =>
                onChange?.({ ...settings, minimizeAppOnStartup: event.target.checked } as SettingsType)
              }
            />
          }
          label="Minimize app on startup"
        />
      </Grid>

      <Grid item xs={ 12 }>
        <FormControlLabel
          control={
            <Switch
              checked={ settings.minimizeAppOnWindowClose }
              onChange={ (event) =>
                onChange?.({ ...settings, minimizeAppOnWindowClose: event.target.checked } as SettingsType)
              }
            />
          }
          label="Minimize app in task bar on close"
        />
      </Grid>
    </Grid>
  )
}
