import React from 'react'
import SettingsType from '../../../../types/Settings'
import { Divider, Grid, Stack, Switch, SxProps } from '@mui/material'
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

          <SettingItem
            labelFor={ 'enable-http-api-auth' }
            label={ 'Enable HTTP API authentification' }
            action={
              <Switch
                disabled={ !settings.enableHttpApi }
                checked={ settings.httpApi?.enableAuthentification ?? true }
                onChange={ (event) => onChange?.({
                  ...settings,
                  httpApi: { ...settings.httpApi, enableAuthentification: event.target.checked },
                }) }
                id={ 'enable-http-api-auth' }
              />
            }
          />
        </Stack>
      </Grid>
    </Grid>
  )
}
