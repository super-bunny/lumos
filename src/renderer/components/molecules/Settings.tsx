import React, { useCallback, useEffect, useState } from 'react'
import SettingsType, { Themes } from '../../../types/Settings'
import { Alert, FormControl, Grid, InputLabel, Link, MenuItem, Select, SxProps } from '@mui/material'
import { useAppDispatch } from '../../store/store'
import { setTheme } from '../../store/slices/themeSlice'
import Loader from '../atoms/Loader'
import Center from '../atoms/Center'

export interface Props {
  sx?: SxProps
}

export default function Settings({ sx }: Props) {
  const dispatch = useAppDispatch()
  const [config, setConfig] = useState<SettingsType>()
  const [storePath, setStorePath] = useState<string>()
  const [loading, setLoading] = useState(true)

  const editConfig = useCallback(async (newConfig: SettingsType) => {
    setConfig(newConfig)
    return window.lumos.store.set(newConfig)
  }, [])

  useEffect(() => {
    setLoading(true)
    window.lumos.store.get()
      .then(store => {
        setConfig(store.store)
        setStorePath(store.path)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Center>
        <Loader title={ 'Loading monitor list' }/>
      </Center>
    )
  }

  return (
    <Grid container gap={ 2 }>
      <Grid item xs={ 12 }>
        <Alert severity="info">
          <span>Settings are saved in </span>
          <Link
            onClick={ () => window.lumos.showItemInFolder(storePath!) }
            href={ '#' }
          >{ storePath }</Link>
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
