import React from 'react'
import SettingsType from '../../../../types/Settings'
import { Divider, FormControlLabel, Grid, Stack, Switch, SxProps } from '@mui/material'
import InfoIcon from '../../atoms/InfoIcon'
import SettingItem from '../SettingItem'

export interface Props {
  settings: SettingsType
  onChange?: (settings: SettingsType) => void
  sx?: SxProps
}

export default function ExperimentalSettings({ settings, onChange, sx }: Props) {
  return (
    <Grid container gap={ 2 } sx={ sx }>
      <Grid item xs={ 12 }>
        <Stack gap={ 2 } divider={ <Divider/> }>
          <SettingItem
            labelFor={ 'enable-http-api' }
            label={ 'Enable HTTP API' }
            description={ 'Experimental HTTP API that allow third party app/tools to use the Lumos app backend to ' +
              'control your monitors via the DDC/CI protocol.\nThis settings need an application restart to apply.' }
            action={
              <Switch
                checked={ settings.enableHttpApi }
                onChange={ (event) => onChange?.({ ...settings, enableHttpApi: event.target.checked } as SettingsType) }
                id={ 'enable-http-api' }
              />
            }
          />
        </Stack>
      </Grid>
    </Grid>
  )
}
