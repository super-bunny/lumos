import React from 'react'
import { AppBar, IconButton, Stack, Toolbar, Tooltip, Typography } from '@mui/material'
import HeaderExtraMenu from './HeaderExtraMenu'
import { Home, Settings } from '@mui/icons-material'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <AppBar position="static">
      <Toolbar variant="dense" disableGutters>
        <Stack ml={ 2 } gap={ 1 } flexGrow={ 1 }>
          <Typography variant="h6" color="inherit" component="div">
            Lumos
          </Typography>
        </Stack>

        <Stack direction={ 'row' }>
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
