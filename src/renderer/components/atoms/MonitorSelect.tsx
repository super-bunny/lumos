import React from 'react'
import GenericDisplay from '../../../shared/classes/GenericDisplay'
import {
  Box,
  Checkbox, Chip,
  FormControl,
  FormControlProps,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  SxProps,
} from '@mui/material'
import useMonitors from '../../hooks/useMonitors'

export interface Props {
  label?: string
  helperText?: string
  // Monitor id
  value?: string
  onChange?: (monitor: GenericDisplay) => void
  disabled?: boolean
  multiple?: false
  size?: FormControlProps['size']
  sx?: SxProps
}

export interface MultipleProps extends Omit<Props, 'value' | 'onChange' | 'multiple'> {
  // Array of monitor id
  value?: Array<string>
  onChange?: (monitors: Array<GenericDisplay>) => void
  multiple: true
}

export default function MonitorSelect({
  multiple,
  label = multiple ? 'Monitors' : 'Monitor',
  helperText,
  value,
  onChange,
  disabled,
  size,
  sx,
}: Props | MultipleProps) {
  const { monitors } = useMonitors()

  return (
    <FormControl size={ size } disabled={ monitors === undefined || disabled } fullWidth sx={ sx }>
      <InputLabel>{ label }</InputLabel>

      <Select
        value={ value ?? '' }
        onChange={ (event) => {
          if (multiple && Array.isArray(event.target.value)) {
            const selectedMonitors: Array<GenericDisplay> = event.target.value
              .map(value => monitors?.find(monitor => monitor.info.displayId === value))
              .filter(value => value !== undefined) as Array<GenericDisplay>

            onChange?.(selectedMonitors)
            return
          } else if (!multiple) {
            const monitor = monitors?.find(monitor => monitor.info.displayId === event.target.value)
            if (monitor) {
              onChange?.(monitor)
            }
          }
        } }
        renderValue={ (selected) => {
          if (Array.isArray(selected)) {
            const selectedMonitors: Array<GenericDisplay> = selected
              .map(value => monitors?.find(monitor => monitor.info.displayId === value))
              .filter(value => value !== undefined) as Array<GenericDisplay>
            return (
              <Box sx={ { display: 'flex', flexWrap: 'wrap', gap: 0.5 } }>
                { selectedMonitors.map(monitor => (
                  <Chip key={ monitor.info.displayId } label={ monitor.getDisplayName() }/>
                )) }
              </Box>
            )
          }

          const monitor = monitors?.find(monitor => monitor.info.displayId === selected)
          return monitor?.getDisplayName() ?? selected
        } }
        label={ label }
        multiple={ multiple }
      >
        { monitors?.map(monitor => (
          <MenuItem
            value={ monitor.info.displayId }
            key={ monitor.info.displayId }
          >
            { multiple && <Checkbox checked={ value?.includes(monitor.info.displayId) ?? false }/> }
            <ListItemText primary={ monitor.getDisplayName() }/>
          </MenuItem>
        )) }
      </Select>

      { helperText && <FormHelperText>{ helperText }</FormHelperText> }
    </FormControl>
  )
}