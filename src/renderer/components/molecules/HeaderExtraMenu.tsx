import React, { useEffect, useState } from 'react'
import { bindMenu, bindTrigger, usePopupState } from 'material-ui-popup-state/hooks'
import InfoRounded from '@mui/icons-material/InfoRounded'
import MoreVert from '@mui/icons-material/MoreVert'
import Update from '@mui/icons-material/Update'
import { Badge, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Tooltip } from '@mui/material'
import packageJson from '../../../../package.json'
import openInBrowser from '../../utils/openInBrowser'
import AppVersionManager, { GithubRelease } from '../../classes/AppVersionManager'

export default function HeaderExtraMenu() {
  const { version } = packageJson
  const popupState = usePopupState({ variant: 'popover', popupId: 'demoMenu' })
  const [newRelease, setNewRelease] = useState<GithubRelease | null>(null)

  useEffect(() => {
    new AppVersionManager(version)
      .getUpdate()
      .then(update => setNewRelease(update))
      .catch(error => console.error('Can not check for update: ', error))
  }, [version])

  return (
    <div>
      <IconButton color="inherit" { ...bindTrigger(popupState) }>
        <Badge color="warning" variant="dot" invisible={ newRelease === null }>
          <MoreVert/>
        </Badge>
      </IconButton>

      <Menu { ...bindMenu(popupState) }>
        { newRelease && (
          <Tooltip title={ 'Go to release page' } placement={ 'top' } enterDelay={ 500 } disableInteractive>
            <MenuItem onClick={ () => openInBrowser(newRelease?.html_url) }>
              <ListItemIcon>
                <Badge color="warning" variant="dot">
                  <Update fontSize="small"/>
                </Badge>
              </ListItemIcon>
              <ListItemText>Update available</ListItemText>
            </MenuItem>
          </Tooltip>
        ) }

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
