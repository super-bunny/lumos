import React from 'react'
import { Chip, ChipProps } from '@mui/material'

export interface Props {
  ChipProps?: ChipProps
}

export default function BetaTag({ ChipProps }: Props) {
  return (
    <Chip
      label={ 'BETA' }
      color={ 'secondary' }
      size={ 'small' }
      sx={ { ml: 1, lineHeight: '1em', fontWeight: 'bold' } }
      { ...ChipProps }
    />
  )
}