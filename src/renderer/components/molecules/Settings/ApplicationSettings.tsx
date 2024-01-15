import React from 'react'
import SettingsType from '../../../../types/Settings'
import {
  Chip,
  Collapse,
  Divider,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Stack,
  Switch,
  SxProps,
  Typography,
} from '@mui/material'
import SettingItem from '../SettingItem'
import usePlatform from '../../../hooks/usePlatform'
import { UpdateChannels } from '../../../../types/UpdateChannels'

export interface Props {
  settings: SettingsType
  onChange?: (settings: SettingsType) => void
  sx?: SxProps
}

export default function ApplicationSettings({ settings, onChange, sx }: Props) {
  const { isWindows, isMac } = usePlatform()

  return (
    <Grid container gap={ 2 } sx={ sx }>
      <Grid item xs={ 12 }>
        <Stack gap={ 0 } divider={ <Divider sx={ { mt: 2, mb: 4 } }/> }>
          <div>
            <Typography mb={ 2 } variant={ 'h5' }>Application</Typography>

            <Stack gap={ 2 } divider={ <Divider/> }>
              <SettingItem
                label={ 'Run on startup' }
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
                label={ 'Start in background on startup' }
                labelFor={ 'minimize-app-on-startup' }
                action={
                  <Switch
                    checked={ settings.minimizeAppOnStartup }
                    onChange={ (event) =>
                      onChange?.({ ...settings, minimizeAppOnStartup: event.target.checked })
                    }
                    id={ 'minimize-app-on-startup' }
                  />
                }
              />

              <SettingItem
                label={ 'Minimize in task bar on close' }
                labelFor={ 'minimize-app-on-window-close' }
                action={
                  <Switch
                    checked={ settings.minimizeAppOnWindowClose }
                    onChange={ (event) =>
                      onChange?.({ ...settings, minimizeAppOnWindowClose: event.target.checked })
                    }
                    id={ 'minimize-app-on-window-close' }
                  />
                }
              />
            </Stack>
          </div>

          { (isWindows || isMac || true) && (
            <div>
              <Typography mb={ 2 } variant={ 'h5' }>Update</Typography>

              <Stack gap={ 2 }>
                <SettingItem
                  label={ 'Auto update' }
                  labelFor={ 'auto-update' }
                  action={
                    <Switch
                      checked={ settings.updater?.enable }
                      onChange={ (event) =>
                        onChange?.({
                          ...settings,
                          updater: { ...settings.updater, enable: event.target.checked },
                        })
                      }
                      id={ 'auto-update' }
                    />
                  }
                />

                <Collapse in={ settings.updater?.enable }>
                  <SettingItem
                    label={ 'Update channel' }
                    description={ 'Choose between stable and pre-release (unstable) update channel.' }
                    action={
                      <FormControl size={ 'small' }>
                        <Select
                          value={ settings.updater?.channel ?? UpdateChannels.STABLE }
                          onChange={ (event) => {
                            onChange?.({
                              ...settings,
                              updater: { ...settings.updater, channel: event.target.value as UpdateChannels },
                            })
                          } }
                        >
                          <MenuItem value={ UpdateChannels.STABLE }>Stable</MenuItem>
                          <MenuItem value={ UpdateChannels.ALPHA }>Pre-release</MenuItem>
                        </Select>
                      </FormControl>
                    }
                  />
                </Collapse>
              </Stack>
            </div>
          ) }
        </Stack>
      </Grid>
    </Grid>
  )
}
