import React from 'react'
import { CircularProgress, Fade, Stack, Typography } from '@mui/material'
import useSettingsStore from '../../hooks/useSettingsStore'

export interface Props {
  title?: string | JSX.Element;
}

export default function Loader({ title }: Props) {
  const { settingsStore } = useSettingsStore()

  return (
    <Fade in={ true } appear={ settingsStore?.settings.enableAnimations ?? false } timeout={ 500 }>
      <Stack direction={ 'column' } alignItems={ 'center' } spacing={ 1 }>
        <CircularProgress/>
        { title && typeof title === 'string' ? (
          <Typography sx={ { color: 'gray' } }>{ title }</Typography>
        ) : title }
      </Stack>
    </Fade>
  )
}
