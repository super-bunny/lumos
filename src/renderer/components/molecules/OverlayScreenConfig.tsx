import React, { useCallback, useMemo, useState } from 'react'
import { Button, Paper, Stack, Typography } from '@mui/material'
import ScreenSelector from './ScreenSelector'
import MonitorSelect from '../atoms/MonitorSelect'
import useSettingsStore from '../../hooks/useSettingsStore'
import { useSnackbar } from 'notistack'
import GenericDisplay from '../../../shared/classes/GenericDisplay'

export default function OverlayScreenConfig() {
  const { enqueueSnackbar } = useSnackbar()
  const { settingsStore, updateSettings } = useSettingsStore({ swrConfig: { suspense: true } })

  const [selectedDisplay, setSelectedDisplay] = useState<Electron.Display>()

  const selectedMonitorId = useMemo<string | undefined>(() => {
    if (!selectedDisplay || !settingsStore) return undefined
    return settingsStore.settings.overlay.electronDisplayBindings[selectedDisplay.id.toString()] ?? undefined
  }, [selectedDisplay, settingsStore])

  const setOverlayMonitor = useCallback((electronDisplay: Electron.Display, monitor: GenericDisplay | null) => {
    if (!settingsStore) return

    return updateSettings({
      overlay: {
        ...settingsStore.settings.overlay,
        electronDisplayBindings: {
          ...settingsStore.settings.overlay.electronDisplayBindings,
          [electronDisplay.id.toString()]: monitor ? monitor.info.displayId : null,
        },
      },
    })
      .then(() => enqueueSnackbar('Overlay bound monitor updated', { variant: 'success' }))
      .catch(error => enqueueSnackbar(`Failed to update overlay bound monitor: ${ error.message }`, { variant: 'error' }))
  }, [enqueueSnackbar, settingsStore, updateSettings])

  return (
    <Stack spacing={ 2 }>
      <div>
        <Typography>Overlay screen binding</Typography>

        <Typography variant={ 'body2' } color={ 'text.secondary' } whiteSpace={ 'pre-line' }>
          To make overlay working, you need to bind each of your virtual screen to a physical monitor.
        </Typography>
      </div>

      <Paper variant={ 'elevation' } sx={ { p: 2 } }>
        <ScreenSelector selectedScreenId={ selectedDisplay?.id } onScreenSelect={ setSelectedDisplay }/>
      </Paper>

      { !selectedDisplay &&
        <Typography textAlign={ 'center' }>Select a screen to bind a physical monitor</Typography> }

      { selectedDisplay && (
        <>
          <Typography>Screen { selectedDisplay.label }</Typography>

          <Stack direction={ 'row' } spacing={ 2 }>
            <MonitorSelect
              monitorId={ selectedMonitorId }
              onChange={ monitor => {
                setOverlayMonitor(selectedDisplay!, monitor)
              } }
            />

            <Button onClick={ () => setOverlayMonitor(selectedDisplay!, null) }>Clear</Button>
          </Stack>
        </>
      ) }
    </Stack>
  )
}