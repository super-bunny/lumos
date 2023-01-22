import React from 'react'
import SettingsType from '../../../../types/Settings'
import { FormControlLabel, Grid, Switch, SxProps } from '@mui/material'
import InfoIcon from '../../atoms/InfoIcon'

export interface Props {
  settings: SettingsType
  onChange?: (settings: SettingsType) => void
  sx?: SxProps
}

export default function AdvancedSettings({ settings, onChange, sx }: Props) {
  return (
    <Grid container gap={ 2 } sx={ sx }>
      <Grid item display={ 'flex' } alignItems={ 'center' } xs={ 12 }>
        <FormControlLabel
          control={
            <Switch
              checked={ settings.developerMode }
              onChange={ (event) =>
                onChange?.({ ...settings, developerMode: event.target.checked } as SettingsType)
              }
            />
          }
          label="Developer mode"
        />

        <InfoIcon message={ 'Add additional info/actions useful for developers in application interface' }/>
      </Grid>
    </Grid>
  )
}
