import React, { Suspense, useMemo } from 'react'
import SettingsType, { Themes } from '../../../../types/Settings'
import { Collapse, Divider, FormControl, Grid, MenuItem, Select, Stack, Switch, SxProps } from '@mui/material'
import { useAppDispatch } from '../../../store/store'
import { setTheme } from '../../../store/slices/themeSlice'
import getThemeLabel from '../../../../shared/utils/labelGetters/getThemeLabel'
import SettingItem from '../SettingItem'
import OverlayScreenConfig from '../OverlayScreenConfig'
import BetaTag from '../../atoms/BetaTag'
import Loader from '../../atoms/Loader'

export interface Props {
  settings: SettingsType
  onChange?: (settings: SettingsType) => void
  sx?: SxProps
}

export default function InterfaceSettings({ settings, onChange, sx }: Props) {
  const dispatch = useAppDispatch()

  const currentTheme = useMemo(() => {
    const themes = Object.values(Themes)
    if (settings.theme && themes.includes(settings.theme)) return settings.theme
    return Themes.DEFAULT
  }, [settings.theme])

  return (
    <Grid container gap={ 2 } sx={ sx }>
      <Grid item xs={ 12 }>
        <Stack gap={ 2 } divider={ <Divider/> }>
          <SettingItem
            label={ 'Theme' }
            action={
              <FormControl size={ 'small' }>
                <Select
                  value={ currentTheme }
                  onChange={ (event) => {
                    dispatch(setTheme(event.target.value as Themes))
                    onChange?.({ ...settings, theme: event.target.value as Themes })
                  } }
                >
                  { Object.entries(Themes).map(([key, value]) => (
                    <MenuItem value={ value } key={ value }>{ getThemeLabel(value as Themes) }</MenuItem>
                  )) }
                </Select>
              </FormControl>
            }
          />

          <SettingItem
            label={ 'Enable animations' }
            labelFor={ 'enable-animations' }
            action={
              <Switch
                checked={ settings.enableAnimations }
                onChange={ (event) =>
                  onChange?.({ ...settings, enableAnimations: event.target.checked })
                }
                id={ 'enable-animations' }
              />
            }
          />

          <Stack spacing={ 2 }>
            <SettingItem
              label={ <span>Enable overlay <BetaTag/></span> }
              description={
                <span>
              Display an overlay with current monitor brightness level on brightness change from global shortcuts.
              <br/>
              This settings need an application restart to apply.
            </span>
              }
              labelFor={ 'enable-overlay' }
              action={
                <Switch
                  checked={ settings.overlay.enable }
                  onChange={ (event) =>
                    onChange?.({
                      ...settings,
                      overlay: { ...settings.overlay, enable: event.target.checked },
                    })
                  }
                  id={ 'enable-overlay' }
                />
              }
            />

            <Collapse in={ settings.overlay.enable }>
              <Suspense fallback={ <Loader/> }>
                <OverlayScreenConfig/>
              </Suspense>
            </Collapse>
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  )
}
