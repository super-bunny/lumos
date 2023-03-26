import React from 'react'
import SettingsType from '../../../../types/Settings'
import { Divider, FormControlLabel, Grid, Link, Stack, Switch, SxProps } from '@mui/material'
import InfoIcon from '../../atoms/InfoIcon'
import SettingItem from '../SettingItem'
import openInBrowser from '../../../utils/openInBrowser'

export interface Props {
  settings: SettingsType
  onChange?: (settings: SettingsType) => void
  sx?: SxProps
}

export default function PrivacySettings({ settings, onChange, sx }: Props) {
  return (
    <Grid container gap={ 2 } sx={ sx }>
      <Grid item xs={ 12 }>
        <Stack gap={ 2 } divider={ <Divider/> }>
          <SettingItem
            label={ 'Enable error reporting' }
            labelFor={ 'enable-error-reporting' }
            description={
              <span>
                Help developer to fix bugs by automatically sending a report when the application encounter an error.
                <br/>
                Error reports are collected thanks to a third party tool: <Link
                onClick={ () => openInBrowser('https://sentry.io/') }
                href={ '#' }
                underline="hover"
              >Sentry</Link>.
                This settings need an application restart to apply.
              </span>
            }
            action={
              <Switch
                checked={ settings.enableErrorReporting }
                onChange={ (event) =>
                  onChange?.({ ...settings, enableErrorReporting: event.target.checked } as SettingsType)
                }
                id={ 'enable-error-reporting' }
              />
            }
          />
        </Stack>
      </Grid>
    </Grid>
  )
}
