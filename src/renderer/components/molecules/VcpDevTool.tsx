import React, { useCallback, useMemo, useState } from 'react'
import { Button, Collapse, IconButton, Stack, Switch, TextField, Typography } from '@mui/material'
import MonitorSelect from '../atoms/MonitorSelect'
import GenericDisplay from '../../../shared/classes/GenericDisplay'
import { VCPValue } from '../../../types/EnhancedDDCDisplay'
import { useSnackbar } from 'notistack'
import DeleteIcon from '@mui/icons-material/Delete'

export default function VcpDevTool() {
  const { enqueueSnackbar } = useSnackbar()

  const [setMode, setSetMode] = useState<boolean>(false)
  const [monitor, setMonitor] = useState<GenericDisplay>()
  const [vcpFeature, setVcpFeature] = useState<number | null>(null)
  const [vcpValue, setVcpValue] = useState<number | null>(null)
  const [result, setResult] = useState<VCPValue>()

  const disabled = useMemo(() => !monitor || vcpFeature === null || (setMode && vcpValue === null), [
    monitor,
    setMode,
    vcpFeature,
    vcpValue,
  ])

  const handleSetMode = useCallback((setMode: boolean) => {
    setSetMode(setMode)
    if (setMode) setResult(undefined)
  }, [])

  const sendVcp = useCallback(async () => {
    if (disabled) return

    const promise = setMode
      ? window.lumos.display.setVcpValue(monitor!.info.displayId, vcpFeature!, vcpValue!).then()
      : window.lumos.display.getVcpValue(monitor!.info.displayId, vcpFeature!).then()

    promise
      .then(result => {
        if (result) setResult(result)
        enqueueSnackbar('VCP code send successfully', { variant: 'success' })
      })
      .catch(error => {
        console.error(error)
        enqueueSnackbar(error.message, { variant: 'error' })
      })
  }, [disabled, enqueueSnackbar, monitor, setMode, vcpFeature, vcpValue])

  return (
    <Stack spacing={ 1 }>
      <Stack direction={ 'row' } alignItems={ 'center' } spacing={ 1 }>
        <Stack direction={ 'row' } alignItems={ 'center' }>
          <Typography variant={ 'body2' }>Get</Typography>
          <Switch checked={ setMode } onChange={ (event, checked) => handleSetMode(checked) }/>
          <Typography variant={ 'body2' }>Set</Typography>
        </Stack>

        <MonitorSelect monitor={ monitor } onChange={ setMonitor } size={ 'small' }/>

        <TextField
          value={ vcpFeature?.toString(16) ?? '' }
          onChange={ (event) => setVcpFeature(event.target.value ? parseInt(event.target.value, 16) : 0) }
          label={ 'VCP feature' }
          inputProps={ { inputMode: 'numeric', pattern: '[0-9]*' } }
          InputProps={ { startAdornment: '0x' } }
          size={ 'small' }
        />

        <TextField
          disabled={ !setMode }
          value={ vcpValue?.toString(16) ?? '' }
          onChange={ (event) => setVcpValue(event.target.value ? parseInt(event.target.value, 16) : 0) }
          label={ 'VCP value' }
          inputProps={ { inputMode: 'numeric', pattern: '[0-9]*' } }
          InputProps={ { startAdornment: '0x' } }
          size={ 'small' }
        />

        <Button
          disabled={ disabled }
          onClick={ sendVcp }
          variant={ 'contained' }
          color={ 'primary' }
          size={ 'small' }
        >Send</Button>
      </Stack>

      <Collapse in={ !!result && !setMode }>
        <Stack direction={ 'row' } spacing={ 1 }>
          <code style={ { flexGrow: 1 } }>{ JSON.stringify(result) }</code>

          <IconButton size={ 'small' } onClick={ () => setResult(undefined) }>
            <DeleteIcon color={ 'error' }/>
          </IconButton>
        </Stack>
      </Collapse>
    </Stack>
  )
}