import React from 'react'
import SettingsType from '../../../../types/Settings'
import { Button, Divider, FormControlLabel, Grid, Switch, SxProps } from '@mui/material'
import InfoIcon from '../../atoms/InfoIcon'
import { useSnackbar } from 'notistack'

export interface Props {
  settings: SettingsType
  onChange?: (settings: SettingsType) => void
  sx?: SxProps
}

export default function AdvancedSettings({ settings, onChange, sx }: Props) {
  const { enqueueSnackbar } = useSnackbar()

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

      { settings.developerMode && (
        <>
          <Grid item xs={ 12 }>
            <Divider>DEVELOPER TEST ZONE</Divider>
          </Grid>

          <Grid item display={ 'flex' } alignItems={ 'center' } xs={ 12 }>
            <Button
              onClick={ () => {
                window.lumos.forceTriggerAutoMonitorsPowerOff()
                  .then(() => enqueueSnackbar('Auto monitor power off triggered', { variant: 'success' }))
                  .catch((error) => enqueueSnackbar(`Fail to trigger auto monitor power off: ${ error }`, { variant: 'error' }))
              } }
              variant={ 'contained' }
              color={ 'error' }
            >Force trigger auto monitor power off</Button>
          </Grid>
        </>
      ) }
    </Grid>
  )
}
