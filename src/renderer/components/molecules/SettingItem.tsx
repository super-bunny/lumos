import React, { ReactNode } from 'react'
import { Stack, Typography } from '@mui/material'

export interface Props {
  label: ReactNode
  labelFor?: string
  description?: ReactNode
  action?: ReactNode
}

export default function SettingItem({ label, labelFor, description, action }: Props) {
  return (
    <Stack>
      <Stack direction={ 'row' } alignItems={ 'center' } justifyContent={ 'space-between' }>
        <label htmlFor={ labelFor } style={ { flexGrow: 1 } }>{ label }</label>
        { action }
      </Stack>

      <Typography variant={ 'body2' } color={ 'text.secondary' } whiteSpace={ 'pre-line' }>{ description }</Typography>
    </Stack>
  )
}