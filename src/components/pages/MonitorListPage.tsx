import * as React from 'react'
import { Box } from '@mui/material'
import MonitorList from '../MonitorList'
import Center from '../atoms/Center'

export default function MonitorListPage() {
  return (
    <Box height={ 1 } p={ 8 }>
      <Center>
        <MonitorList sx={ { flexGrow: 'grow' } }/>
      </Center>
    </Box>
  )
}
