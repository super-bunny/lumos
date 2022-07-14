import React from 'react'
import { AppBar, Stack, Toolbar, Typography } from '@mui/material'
import HeaderExtraMenu from './HeaderExtraMenu'

export default function Header() {
  return (
    <AppBar position="static">
      <Toolbar variant="dense" disableGutters>
        <Stack ml={ 2 } gap={ 1 } flexGrow={ 1 }>
          <Typography variant="h6" color="inherit" component="div">
            Lumos
          </Typography>
        </Stack>

        <Stack gap={ 1 }>
          <HeaderExtraMenu/>
        </Stack>
      </Toolbar>
    </AppBar>
  )
}
