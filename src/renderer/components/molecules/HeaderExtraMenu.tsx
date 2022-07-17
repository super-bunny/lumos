import React from 'react'
import { bindMenu, bindTrigger, usePopupState } from 'material-ui-popup-state/hooks'
import { InfoRounded, MoreVert } from '@mui/icons-material'
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material'
import { version } from '../../../../package.json'
import openInBrowser from '../../utils/openInBrowser'

export default function HeaderExtraMenu() {
  const popupState = usePopupState({ variant: 'popover', popupId: 'demoMenu' })

  return (
    <div>
      <IconButton color="inherit" { ...bindTrigger(popupState) }>
        <MoreVert/>
      </IconButton>

      <Menu { ...bindMenu(popupState) }>
        <MenuItem onClick={ () => openInBrowser('https://github.com/super-bunny/lumos/releases') }>
          <ListItemIcon>
            <InfoRounded fontSize="small"/>
          </ListItemIcon>
          <ListItemText>Version v{ version }</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  )
}
