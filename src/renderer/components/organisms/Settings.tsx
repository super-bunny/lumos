import { Alert, Box, Button, Collapse, Grid, Link, Stack, styled, SxProps, Tab, Tabs } from '@mui/material'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { TabContext, TabPanel } from '@mui/lab'
import SettingsType from '../../../types/Settings'
import Center from '../atoms/Center'
import Loader from '../atoms/Loader'
import InterfaceSettings from '../molecules/Settings/InterfaceSettings'
import ApplicationSettings from '../molecules/Settings/ApplicationSettings'
import ExperimentalSettings from '../molecules/Settings/ExperimentalSettings'

export interface Props {
  sx?: SxProps
}

enum SETTINGS_TABS {
  APPLICATION = 'application',
  INTERFACE = 'interface',
  EXPERIMENTAL = 'experimental',
}

function checkIfNeedRestart(settings: SettingsType) {
  if (window.lumos.initSettings.enableHttpApi !== settings.enableHttpApi) return true

  return false
}

const SettingsTabPanel = styled(TabPanel)`
  padding: 0;
`

export default function Settings({ sx }: Props) {
  const [tabIndex, setTabIndex] = useState<SETTINGS_TABS>(SETTINGS_TABS.APPLICATION)
  const [settings, setSettings] = useState<SettingsType>()
  const [storePath, setStorePath] = useState<string>()
  const [loading, setLoading] = useState(true)

  const needRestart = useMemo(() => settings ? checkIfNeedRestart(settings) : false, [settings])

  const saveSettings = useCallback(async (newConfig: SettingsType) => {
    setSettings(newConfig)
    return window.lumos.store.setSettings(newConfig)
  }, [])

  useEffect(() => {
    setLoading(true)
    window.lumos.store.getSettings()
      .then(store => {
        setSettings(store.settings)
        setStorePath(store.path)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Center>
        <Loader title={ 'Loading settings' }/>
      </Center>
    )
  }

  return (
    <Stack gap={ 4 } sx={ sx }>
      <Stack gap={ 1 }>
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
          <Collapse in={ needRestart }>
            <Alert
              severity="warning"
              action={
                <Button onClick={ () => window.lumos.restartApp() } color={ 'error' }>Restart</Button>
              }
            >You need to restart the app to apply settings</Alert>
          </Collapse>
        </Grid>
      </Stack>

      <Box display={ 'flex' } overflow={ 'hidden' }>
        <TabContext value={ tabIndex }>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={ tabIndex }
            onChange={ (event, value) => setTabIndex(value) }
            sx={ { borderRight: 1, borderColor: 'divider', flexShrink: 0 } }
          >
            <Tab label="Application" value={ SETTINGS_TABS.APPLICATION }/>
            <Tab label="Interface" value={ SETTINGS_TABS.INTERFACE }/>
            <Tab label="Experimental" value={ SETTINGS_TABS.EXPERIMENTAL }/>
          </Tabs>


          <Box px={ 4 } py={ 1 } flexGrow={ 1 } overflow={ 'auto' }>
            <SettingsTabPanel value={ SETTINGS_TABS.APPLICATION }>
              <ApplicationSettings settings={ settings! } onChange={ saveSettings }/>
            </SettingsTabPanel>

            <SettingsTabPanel value={ SETTINGS_TABS.INTERFACE }>
              <InterfaceSettings settings={ settings! } onChange={ saveSettings }/>
            </SettingsTabPanel>

            <SettingsTabPanel value={ SETTINGS_TABS.EXPERIMENTAL }>
              <ExperimentalSettings settings={ settings! } onChange={ saveSettings }/>
            </SettingsTabPanel>
          </Box>
        </TabContext>
      </Box>
    </Stack>
  )
}