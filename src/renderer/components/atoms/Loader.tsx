import React from 'react'
import { CircularProgress, Fade, Stack, Typography } from '@mui/material'

export interface Props {
  title?: string | JSX.Element;
}

export default function Loader({ title }: Props) {
  return (
    <Fade in={ true } exit={ true } timeout={ 500 }>
      <Stack direction={ 'column' } alignItems={ 'center' } spacing={ 1 }>
        <CircularProgress/>
        { title && typeof title === 'string' ? (
          <Typography sx={ { color: 'gray' } }>{ title }</Typography>
        ) : title }
      </Stack>
    </Fade>
  )
}
