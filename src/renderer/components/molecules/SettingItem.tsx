import React, { ReactNode } from 'react'
import { Stack, Typography } from '@mui/material'

export interface Props {
  label: string
  description?: string
  action: ReactNode
}

export default function SettingItem({ label, description, action }: Props) {
  return (
    <Stack>
      <Stack direction={ 'row' } alignItems={ 'center' } justifyContent={ 'space-between' }>
        <Typography >{ label }</Typography>
        { action }
      </Stack>

      <Typography variant={ 'body2' } color={'text.secondary'}>{ description }</Typography>
    </Stack>
  )
}