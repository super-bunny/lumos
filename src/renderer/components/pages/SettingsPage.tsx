import * as React from 'react'
import { Button, Container, Stack, Typography } from '@mui/material'
import Settings from '../organisms/Settings'
import { useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

export default function SettingsPage() {
  const navigate = useNavigate()
  return (
    <Container maxWidth={ 'lg' } sx={ { height: 1, py: 4, flexGrow: 1 } }>
      <Stack height={ 1 }>
        <Stack mb={ 4 } direction={ 'row' } justifyContent={ 'space-between' } gap={ 1 }>
          <Typography variant={ 'h4' }>Settings</Typography>

          <Button onClick={ () => navigate('/') } startIcon={ <ArrowBackIcon/> }>Go back to home</Button>
        </Stack>

        <Settings sx={ { flexGrow: 1, overflow: 'hidden' } }/>
      </Stack>
    </Container>
  )
}
