import React, { useEffect, useState } from 'react'
import PageTemplate from './components/templates/PageTemplate'
import { CssBaseline, ThemeProvider } from '@mui/material'
import themeConfigs from './themeConfigs'
import { useAppSelector } from './store/store'
import { ConfirmProvider } from 'material-ui-confirm'
import { SnackbarProvider } from 'notistack'
import UpdaterContext, { UpdaterContextState } from './context/UpdaterContext'
import { IpcEvents } from '../types/Ipc'
import constants from '../shared/utils/contants'

export default function App() {
  const themeContext = useAppSelector(state => state.theme)
  const [updaterState, setUpdaterState] = useState<UpdaterContextState>({ updateAvailable: false })

  // Handle update downloaded event
  useEffect(() => {
    const callback = () => setUpdaterState({ updateAvailable: true })
    window.lumos.ipc.on(IpcEvents.UPDATE_DOWNLOADED, callback)
    return () => window.lumos.ipc.removeListener(IpcEvents.UPDATE_DOWNLOADED, callback)
  }, [])

  return (
    <UpdaterContext.Provider value={ updaterState }>
      <ThemeProvider theme={ themeConfigs[themeContext] ?? themeConfigs[constants.defaultTheme] }>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */ }
        <CssBaseline/>
        <SnackbarProvider>
          <ConfirmProvider>
            <PageTemplate/>
          </ConfirmProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </UpdaterContext.Provider>
  )
}
