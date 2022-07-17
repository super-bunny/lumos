import React from 'react'
import { CircularProgress, Stack, Typography } from '@mui/material'

export interface Props {
  title?: string | JSX.Element;
}

export default function Loader({ title }: Props) {
  return (
    <Stack direction={ 'column' } alignItems={ 'center' } spacing={ 1 }>
      <CircularProgress/>
      { title && typeof title === 'string' ? (
        <Typography noWrap sx={ { color: 'gray' } }>{ title }</Typography>
      ) : title }
    </Stack>
  )
}
