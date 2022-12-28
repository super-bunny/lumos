import { Chip, Stack, SxProps } from '@mui/material'
import React, { useMemo } from 'react'

export interface Props {
  accelerator: string
  sx?: SxProps
}

export default function ShortcutAccelerator({ accelerator, sx }: Props) {
  const keys = useMemo(() => accelerator.split('+'), [accelerator])

  return (
    <Stack
      direction={ 'row' }
      alignItems={ 'center' }
      divider={ <span>+</span> }
      gap={ 0.5 }
      sx={ sx }
    >
      { keys.map((key, index) => (
        <Chip
          label={ key.toUpperCase() }
          size={ 'small' }
          sx={ { borderRadius: 1, boxShadow: 1 } }
          key={ index }
          style={ { cursor: 'inherit' } }
        />
      )) }
    </Stack>
  )
}