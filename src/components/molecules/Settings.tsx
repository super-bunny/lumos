import React, { useCallback, useRef, useState } from 'react'
import Store from 'electron-store'
import ElectronStore from 'electron-store'
import SettingsType, { Themes } from '../../types/Settings'
import { Alert, FormControl, Grid, InputLabel, Link, MenuItem, Select, SxProps } from '@mui/material'
import { shell } from 'electron'
import { useAppDispatch } from '../../store/store'
import { setTheme } from '../../store/slices/themeSlice'

export interface Props {
  sx?: SxProps
}

export default function Settings({ sx }: Props) {
  const dispatch = useAppDispatch()
  const storeRef = useRef<ElectronStore<SettingsType>>(new Store<SettingsType>())
  const [config, setConfig] = useState<SettingsType>(storeRef.current.store)

  const editConfig = useCallback((newConfig: SettingsType) => {
    setConfig(newConfig)
    storeRef.current.set(newConfig)
  }, [])

  return (
    <Grid container gap={ 2 }>
      <Grid item xs={ 12 }>
        <Alert severity="info">
          <span>Settings are saved in </span>
          <Link
            onClick={ () => shell.showItemInFolder(storeRef.current.path) }
            href={ '#' }
          >{ storeRef.current.path }</Link>
        </Alert>
      </Grid>

      <Grid item xs={ 12 }>
        <FormControl fullWidth sx={ sx }>
          <InputLabel id="theme-setting-label">Theme</InputLabel>
          <Select
            value={ config?.theme ?? Themes.DEFAULT }
            labelId="theme-setting-label"
            label="Theme"
            onChange={ (event) => {
              dispatch(setTheme(event.target.value as Themes))
              editConfig({ ...config, theme: event.target.value as Themes })
            } }
          >
            { Object.entries(Themes).map(([key, value]) => (
              <MenuItem value={ value } key={ value }>{ key }</MenuItem>
            )) }
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  )
}
