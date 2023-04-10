import React from 'react'
import GenericDisplay from '../../../shared/classes/GenericDisplay'
import { FormControl, FormControlProps, FormHelperText, InputLabel, MenuItem, Select, SxProps } from '@mui/material'
import useMonitors from '../../hooks/useMonitors'

export interface Props {
  label?: string
  helperText?: string
  monitor?: GenericDisplay
  onChange?: (monitor: GenericDisplay) => void
  disabled?: boolean
  size?: FormControlProps['size']
  sx?: SxProps
}

export default function MonitorSelect({
  label = 'Monitor',
  helperText,
  monitor,
  onChange,
  disabled,
  size,
  sx,
}: Props) {
  const { monitors } = useMonitors()

  return (
    <FormControl size={ size } fullWidth sx={ sx }>
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