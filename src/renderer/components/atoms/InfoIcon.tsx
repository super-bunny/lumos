import React from 'react'
import { SvgIconProps, Tooltip, TooltipProps } from '@mui/material'
import InfoMaterialIcon from '@mui/icons-material/Info'

export interface Props {
  // Tooltip message. Shortcut for "title" Tooltip prop.
  message: string
  TooltipProps?: TooltipProps
  IconProps?: SvgIconProps
}

// Info icon (i) that show the given message in a tooltip on hover.
export default function InfoIcon({ message, TooltipProps, IconProps }: Props) {
  return (
    <Tooltip title={ message } placement={ 'top' } { ...TooltipProps }>
      <InfoMaterialIcon fontSize={ 'small' } sx={ { color: 'grey' } } { ...IconProps }/>
    </Tooltip>
  )
}