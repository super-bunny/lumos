import React from 'react'
import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'

export default function app() {
  return (
    <Box height={ 1 } overflow={ 'auto' }>
      <Outlet/>
    </Box>
  )
}
