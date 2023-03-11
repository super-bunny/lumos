import React, { useEffect, useState } from 'react'
import GenericDisplay from '../../../shared/classes/GenericDisplay'
import IpcBackendClient from '../../classes/IpcBackendClient'
import { FormControl, FormHelperText, InputLabel, MenuItem, Select, SxProps } from '@mui/material'

export interface Props {
  label?: string
  helperText?: string
  monitor?: GenericDisplay
  onChange?: (monitor: GenericDisplay) => void
  disabled?: boolean
  sx?: SxProps
}

export default function MonitorSelect({ label = 'Monitor', helperText, monitor, onChange, disabled, sx }: Props) {
  const [monitors, setMonitors] = useState<Array<GenericDisplay>>()

  useEffect(() => {
    GenericDisplay.list(new IpcBackendClient(), { useCache: true })
      .then(monitors => {
        setMonitors(GenericDisplay.filterDuplicateDisplay(monitors))
      })
  }, [])

  return (
    <FormControl fullWidth sx={ sx }>
      <InputLabel>{ label }</InputLabel>

      <Select
        value={ monitor?.info.displayId ?? '' }
        onChange={ (event) => {
          const monitor = monitors?.find(monitor => monitor.info.displayId === event.target.value)
          if (monitor) onChange?.(monitor)
        } }
        disabled={ disabled }
        label={ label }
      >
        { monitors?.map(monitor => (
          <MenuItem
            value={ monitor.info.displayId }
            key={ monitor.info.displayId }
          >{ monitor.getDisplayName() }</MenuItem>
        )) }
      </Select>

      { helperText && <FormHelperText>{ helperText }</FormHelperText> }
    </FormControl>
  )
}