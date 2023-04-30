import { Alert, Box, Button, Collapse, Grid, Link, Stack, styled, SxProps, Tab, Tabs } from '@mui/material'
import React, { useMemo } from 'react'
import { TabContext, TabPanel } from '@mui/lab'
import SettingsType from '../../../types/Settings'
import Center from '../atoms/Center'
import Loader from '../atoms/Loader'
import InterfaceSettings from '../molecules/Settings/InterfaceSettings'
import ApplicationSettings from '../molecules/Settings/ApplicationSettings'
import ExperimentalSettings from '../molecules/Settings/ExperimentalSettings'
import useSettingsStore from '../../hooks/useSettingsStore'
import GlobalShortcutsSettings from '../molecules/Settings/GlobalShortcutsSettings'
import AdvancedSettings from '../molecules/Settings/AdvancedSettings'
import PrivacySettings from '../molecules/Settings/PrivacySettings'
import Debug from '../molecules/Settings/Debug'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

export interface Props {
  sx?: SxProps
}

enum SETTINGS_TABS {
  APPLICATION = '/settings/application',
  INTERFACE = '/settings/interface',
  PRIVACY = '/settings/privacy',
  GLOBAL_SHORTCUT = '/settings/global_shortcut',
  EXPERIMENTAL = '/settings/experimental',
  ADVANCED = '/settings/advanced',
  DEBUG = '/settings/debug',
}

function checkIfRestartNeeded(settings: SettingsType) {
  if (window.lumos.initSettings.enableHttpApi !== settings.enableHttpApi) return true
  else if (window.lumos.initSettings.enableErrorReporting !== settings.enableErrorReporting) return true
  else if (window.lumos.initSettings.concurrentDdcRequest !== settings.concurrentDdcRequest) return true
  else if (window.lumos.initSettings.httpApi?.enableAuthentification !== settings.httpApi?.enableAuthentification) return true

  return false
}

const SettingsTabPanel = styled(TabPanel)`
  padding: 0;
`

export default function Settings({ sx }: Props) {
  const { settingsStore, isLoading, updateSettings } = useSettingsStore()
  const { settings, path } = settingsStore ?? {}

  const navigate = useNavigate()
  const location = useLocation()

  const needRestart = useMemo(() => settings ? checkIfRestartNeeded(settings) : false, [settings])

  if (location.pathname === '/settings') return <Navigate to={ SETTINGS_TABS.APPLICATION } replace/>

  if (isLoading) {
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
              onClick={ () => window.lumos.showItemInFolder(path!) }
              href={ '#' }
            >{ path }</Link>
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
        <TabContext value={ location.pathname }>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={ location.pathname }
            onChange={ (event, value) => navigate(value) }
            sx={ { borderRight: 1, borderColor: 'divider', flexShrink: 0 } }
          >
            <Tab label="Application" value={ SETTINGS_TABS.APPLICATION }/>
            <Tab label="Interface" value={ SETTINGS_TABS.INTERFACE }/>
            <Tab label="Privacy" value={ SETTINGS_TABS.PRIVACY }/>
            <Tab label="Global shortcuts" value={ SETTINGS_TABS.GLOBAL_SHORTCUT }/>
            <Tab label="Experimental" value={ SETTINGS_TABS.EXPERIMENTAL }/>
            <Tab label="Advanced" value={ SETTINGS_TABS.ADVANCED }/>
            { settings?.developerMode && <Tab label="Debug" value={ SETTINGS_TABS.DEBUG }/> }
          </Tabs>


          <Box px={ 4 } py={ 1 } flexGrow={ 1 } overflow={ 'auto' }>
            <SettingsTabPanel value={ SETTINGS_TABS.APPLICATION }>
              <ApplicationSettings settings={ settings! } onChange={ updateSettings }/>
            </SettingsTabPanel>

            <SettingsTabPanel value={ SETTINGS_TABS.INTERFACE }>
              <InterfaceSettings settings={ settings! } onChange={ updateSettings }/>
            </SettingsTabPanel>

            <SettingsTabPanel value={ SETTINGS_TABS.PRIVACY }>
              <PrivacySettings settings={ settings! } onChange={ updateSettings }/>
            </SettingsTabPanel>

            <SettingsTabPanel value={ SETTINGS_TABS.GLOBAL_SHORTCUT }>
              <GlobalShortcutsSettings settings={ settings! } onChange={ updateSettings }/>
            </SettingsTabPanel>

            <SettingsTabPanel value={ SETTINGS_TABS.EXPERIMENTAL }>
              <ExperimentalSettings settings={ settings! } onChange={ updateSettings }/>
            </SettingsTabPanel>

            <SettingsTabPanel value={ SETTINGS_TABS.ADVANCED }>
              <AdvancedSettings settings={ settings! } onChange={ updateSettings }/>
            </SettingsTabPanel>

            <SettingsTabPanel value={ SETTINGS_TABS.DEBUG }>
              <Debug settings={ settings! } onChange={ updateSettings }/>
            </SettingsTabPanel>
          </Box>
        </TabContext>
      </Box>
    </Stack>
  )
}