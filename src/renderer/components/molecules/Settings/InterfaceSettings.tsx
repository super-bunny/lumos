import React, { useMemo } from 'react'
import SettingsType, { Themes } from '../../../../types/Settings'
import {
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  SxProps,
} from '@mui/material'
import { useAppDispatch } from '../../../store/store'
import { setTheme } from '../../../store/slices/themeSlice'
import getThemeLabel from '../../../../shared/utils/labelGetters/getThemeLabel'
import SettingItem from '../SettingItem'

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
                  onChange?.({ ...settings, enableAnimations: event.target.checked } as SettingsType)
                }
                id={ 'enable-animations' }
              />
            }
          />
        </Stack>
      </Grid>
    </Grid>
  )
}
