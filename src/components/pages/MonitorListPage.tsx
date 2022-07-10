import * as React from 'react'
import { Box, Stack } from '@mui/material'
import MonitorList from '../MonitorList'

export default function MonitorListPage() {
  return (
    <Stack height={ 1 } direction={ 'column' }>
      <Box display={ 'flex' } height={ 1 } p={ 4 } flexGrow={ 1 } overflow={ 'auto' }>
        <MonitorList sx={ { margin: 'auto' } }/>
      </Box>
    </Stack>
  )
}
