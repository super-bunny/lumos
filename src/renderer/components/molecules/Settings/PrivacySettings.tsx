import React from 'react'
import SettingsType from '../../../../types/Settings'
import { FormControlLabel, Grid, Switch, SxProps } from '@mui/material'
import InfoIcon from '../../atoms/InfoIcon'

export interface Props {
  settings: SettingsType
  onChange?: (settings: SettingsType) => void
  sx?: SxProps
}

export default function PrivacySettings({ settings, onChange, sx }: Props) {
  return (
    <Grid container gap={ 2 } sx={ sx }>
      <Grid item display={ 'flex' } alignItems={ 'center' } xs={ 12 }>
        <FormControlLabel
          control={
            <Switch
              checked={ settings.enableErrorReporting }
              onChange={ (event) =>
                onChange?.({ ...settings, enableErrorReporting: event.target.checked } as SettingsType)
              }
            />
          }
          label="Enable error reporting"
        />
        <InfoIcon
          message={ 'Error reporting id handled by a third party tool (Sentry).' }
        />
      </Grid>
    </Grid>
  )
}
