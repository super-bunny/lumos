import React, { ReactNode } from 'react'
import { Stack, Typography } from '@mui/material'

export interface Props {
  label: ReactNode
  labelFor?: string
  description?: ReactNode
  action?: ReactNode
  fullLineAction?: boolean
}

export default function SettingItem({ label, labelFor, description, action, fullLineAction }: Props) {
  return (
    <Stack gap={ fullLineAction ? 1 : 0 }>
      <Stack
        direction={ fullLineAction ? 'column' : 'row' }
        alignItems={ fullLineAction ? 'flex-start' : 'center' }
        gap={ fullLineAction ? 1 : 0 }
        justifyContent={ 'space-between' }
      >
        <Typography component={ 'label' } htmlFor={ labelFor } style={ { flexGrow: 1 } }>{ label }</Typography>
        { action }
      </Stack>

      <Typography variant={ 'body2' } color={ 'text.secondary' } whiteSpace={ 'pre-line' }>{ description }</Typography>
    </Stack>
  )
}