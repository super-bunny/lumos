import React from 'react'
import { Box, Stack } from '@mui/material'
import { Outlet } from 'react-router-dom'
import Header from '../molecules/Header'

export default function app() {
  return (
    <Stack height={ 1 } direction={ 'column' } overflow={ 'hidden' }>
      <Header/>
      <Box flexGrow={ 1 } overflow={ 'auto' }>
        <Outlet/>
      </Box>
    </Stack>
  )
}
