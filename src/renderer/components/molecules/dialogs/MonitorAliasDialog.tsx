import * as React from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import GenericDisplay from '../../../../shared/classes/GenericDisplay'
import useSettingsStore from '../../../hooks/useSettingsStore'
import { useSnackbar } from 'notistack'

export interface Props {
  monitor: GenericDisplay
  open: boolean
  onClose?: () => void
  onRename?: (name: string | null) => void
}

export default function MonitorAliasDialog({ monitor, open, onClose, onRename }: Props) {
  const { enqueueSnackbar } = useSnackbar()
  const { settingsStore: { settings } = {}, updateSettings } = useSettingsStore()

  const [name, setName] = useState<string>('')

  const alias = useMemo<string | null | undefined>(() => settings?.monitorAliases?.[monitor.info.displayId], [
    monitor, settings,
  ])

  const setMonitorAlias = useCallback((alias: string | null) => {
    if (!settings) throw new Error('Settings not loaded')
    return updateSettings({
      monitorAliases: {
        ...settings?.monitorAliases,
        [monitor.info.displayId]: alias,
      },
    })
  }, [monitor.info.displayId, settings, updateSettings])
  const handleClose = useCallback(() => {
      onClose?.()
    }
    , [onClose])
  const handleRename = useCallback((name: string | null) => {
      setMonitorAlias(name)
        .then(() => {
          onRename?.(name)
          handleClose()
          if (name === null) setName('')
          enqueueSnackbar(name === null ? 'Monitor name reset' : 'Monitor renamed', { variant: 'success' })
        })
        .catch(error => {
          enqueueSnackbar(name === null ? `Failed to reset monitor name: ${ error.message }` : `Failed to rename monitor: ${ error.message }`, { variant: 'error' })
        })
    }
    , [enqueueSnackbar, handleClose, onRename, setMonitorAlias])

  useEffect(() => {
    if (alias) setName(alias)
  }, [alias])

  return (
    <Dialog open={ open } onClose={ handleClose } maxWidth={ 'sm' } fullWidth>
      <DialogTitle>Rename monitor <i>{ monitor.info.displayId }</i></DialogTitle>

      <DialogContent>
        <DialogContentText>
          This will rename this monitor everywhere in the app.
        </DialogContentText>

        <TextField
          value={ name }
          onChange={ event => setName(event.target.value) }
          placeholder={ monitor.getDisplayName() }
          label={ 'Monitor name' }
          margin={ 'normal' }
          autoFocus
          fullWidth
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={ handleClose } color={ 'error' } style={ { marginRight: 'auto' } }>Cancel</Button>
        <Button disabled={ !alias } onClick={ () => handleRename(null) } color={ 'secondary' }>Reset</Button>
        <Button disabled={ name.length === 0 } onClick={ () => handleRename(name) }>Rename</Button>
      </DialogActions>
    </Dialog>
  )
}
