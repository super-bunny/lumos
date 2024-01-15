import * as React from 'react'
import { Button, Container, Grow, Stack, Typography } from '@mui/material'
import Settings from '../organisms/Settings'
import { useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import useSettingsStore from '../../hooks/useSettingsStore'

export default function SettingsPage() {
  const navigate = useNavigate()

  const { settingsStore } = useSettingsStore()

  return (
    <Grow in={ true } appear={ settingsStore?.settings.enableAnimations ?? false } timeout={ 500 }>
      <Container maxWidth={ 'lg' } sx={ { height: 1, py: 2, flexGrow: 1 } }>
        <Stack height={ 1 }>
          <Stack mb={ 2 } direction={ 'row' } justifyContent={ 'space-between' } gap={ 1 }>
            <Typography variant={ 'h4' }>Settings</Typography>

            <Button onClick={ () => navigate('/') } startIcon={ <ArrowBackIcon/> }>Go back to home</Button>
          </Stack>

          <Settings sx={ { flexGrow: 1, overflow: 'hidden' } }/>
        </Stack>
      </Container>
    </Grow>
  )
}
