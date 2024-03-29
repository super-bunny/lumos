import React, { useEffect, useState } from 'react'
import { bindMenu, bindTrigger, usePopupState } from 'material-ui-popup-state/hooks'
import InfoRounded from '@mui/icons-material/InfoRounded'
import MoreVert from '@mui/icons-material/MoreVert'
import Update from '@mui/icons-material/Update'
import { Badge, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Tooltip } from '@mui/material'
import packageJson from '../../../../package.json'
import openInBrowser from '../../utils/openInBrowser'
import AppVersionManager, { GithubRelease } from '../../classes/AppVersionManager'
import useSettingsStore from '../../hooks/useSettingsStore'
import FiberNewIcon from '@mui/icons-material/FiberNew'
import ChangelogDialog from './dialogs/ChangelogDialog'

export default function HeaderExtraMenu() {
  const { settingsStore } = useSettingsStore()
  const { version } = packageJson
  const popupState = usePopupState({ variant: 'popover', popupId: 'header-extra-menu' })
  const [newRelease, setNewRelease] = useState<GithubRelease | null>(null)

  const [changelogDialogOpen, setChangelogDialogOpen] = useState<boolean>(false)

  useEffect(() => {
    if (!settingsStore?.settings) return

    new AppVersionManager(version, settingsStore.settings.updater?.channel)
      .getUpdate()
      .then(update => setNewRelease(update))
      .catch(error => console.error('Can not check for update: ', error))
  }, [settingsStore?.settings, version])

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

        <MenuItem
          onClick={ () => {
            setChangelogDialogOpen(true)
            popupState.close()
          } }
        >
          <ListItemIcon>
            <FiberNewIcon fontSize="small"/>
          </ListItemIcon>
          <ListItemText>What's new?</ListItemText>
        </MenuItem>

        <MenuItem onClick={ () => openInBrowser('https://github.com/super-bunny/lumos/releases') }>
          <ListItemIcon>
            <InfoRounded fontSize="small"/>
          </ListItemIcon>
          <ListItemText>Version v{ version }</ListItemText>
        </MenuItem>
      </Menu>

      <ChangelogDialog open={ changelogDialogOpen } onClose={ () => setChangelogDialogOpen(false) }/>
    </div>
  )
}
