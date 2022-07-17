import * as React from 'react'
import { Button, Container, Stack, Typography } from '@mui/material'
import Settings from '../molecules/Settings'
import { useNavigate } from 'react-router-dom'

export default function SettingsPage() {
  const navigate = useNavigate()
  return (
    <Container maxWidth={ 'md' } sx={ { py: 4, flexGrow: 1 } }>
      <Stack mb={ 4 } direction={ 'row' } justifyContent={ 'space-between' } gap={ 1 } flexGrow={ 1 }>
        <Typography variant={ 'h4' }>Settings</Typography>

        <Button onClick={ () => navigate('/') }>Go back to home</Button>
      </Stack>

      <Settings/>
    </Container>
  )
}
