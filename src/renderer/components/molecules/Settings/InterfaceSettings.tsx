import React, { useMemo } from 'react'
import SettingsType, { Themes } from '../../../../types/Settings'
import { FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, Switch, SxProps } from '@mui/material'
import { useAppDispatch } from '../../../store/store'
import { setTheme } from '../../../store/slices/themeSlice'
import getThemeLabel from '../../../../shared/utils/labelGetters/getThemeLabel'

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
      <Grid item xs={ 12 } md={ 6 }>
        <FormControl fullWidth>
          <InputLabel id="theme-setting-label">Theme</InputLabel>
          <Select
            value={ currentTheme }
            labelId="theme-setting-label"
            label="Theme"
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
      </Grid>

      <Grid item xs={ 12 }>
        <FormControlLabel
          control={
            <Switch
              checked={ settings.enableAnimations }
              onChange={ (event) =>
                onChange?.({ ...settings, enableAnimations: event.target.checked } as SettingsType)
              }
            />
          }
          label="Enable animations"
        />
      </Grid>
    </Grid>
  )
}
