import React from 'react'
import { AppBar, IconButton, Stack, Toolbar, Tooltip } from '@mui/material'
import HeaderExtraMenu from './HeaderExtraMenu'
import { Home, Settings } from '@mui/icons-material'
import { useLocation, useNavigate } from 'react-router-dom'
import UpdateButton from '../atoms/UpdateButton'

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <AppBar position="static">
      <Toolbar variant="dense" disableGutters>
        <Stack ml={ 2 } gap={ 1 } flexGrow={ 1 }>
          {/* Empty left part for now */ }
        </Stack>

        <Stack direction={ 'row' }>
          <UpdateButton/>

          { location.pathname === '/' && (
            <Tooltip title={ 'Settings' }>
              <IconButton
                onClick={ () => navigate('/settings') }
                color="inherit"
              >
                <Settings/>
              </IconButton>
            </Tooltip>
          ) }

          { location.pathname === '/settings' && (
            <Tooltip title={ 'Home' }>
              <IconButton
                onClick={ () => navigate('/') }
                color="inherit"
              >
                <Home/>
              </IconButton>
            </Tooltip>
          ) }

          <HeaderExtraMenu/>
        </Stack>
      </Toolbar>
    </AppBar>
  )
}
