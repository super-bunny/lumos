import React, { useCallback, useContext } from 'react'
import UpdaterContext from '../../context/UpdaterContext'
import { Fade, IconButton, Tooltip } from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import { useSnackbar } from 'notistack'

// Show an update button if an update is available else show nothing
export default function UpdateButton() {
  const { enqueueSnackbar } = useSnackbar()

  const { updateAvailable } = useContext(UpdaterContext)

  const update = useCallback(() => {
    window.lumos.quitAndInstallUpdate()
      .catch(error => enqueueSnackbar(`Failed to install update: ${ error.message }`, { variant: 'error' }))
      .then()
  }, [enqueueSnackbar])

  return (
    <Fade in={ updateAvailable }>
      <Tooltip title={ 'Update ready' }>
        <IconButton onClick={ update } color={ 'success' }>
          <DownloadIcon/>
        </IconButton>
      </Tooltip>
    </Fade>
  )
}