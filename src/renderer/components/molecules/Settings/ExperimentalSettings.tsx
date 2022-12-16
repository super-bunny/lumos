import React from 'react'
import SettingsType from '../../../../types/Settings'
import { FormControlLabel, Grid, Switch, SxProps } from '@mui/material'
import InfoIcon from '../../atoms/InfoIcon'

export interface Props {
  settings: SettingsType
  onChange?: (settings: SettingsType) => void
  sx?: SxProps
}

export default function ExperimentalSettings({ settings, onChange, sx }: Props) {
  return (
    <Grid container gap={ 2 } sx={ sx }>
      <Grid item display={ 'flex' } alignItems={ 'center' } xs={ 12 }>
        <FormControlLabel
          color={ 'error' }
          control={
            <Switch
              checked={ settings.enableHttpApi }
              onChange={ (event) => onChange?.({ ...settings, enableHttpApi: event.target.checked } as SettingsType) }
            />
          }
          label="Enable HTTP API"
        />

        <InfoIcon
          message={ 'Experimental HTTP API that allow third party app/tools to use the Lumos app backend to ' +
            'control your monitors via the DDC/CI protocol.\nThis settings need app restart to apply.' }
        />
      </Grid>
    </Grid>
  )
}
