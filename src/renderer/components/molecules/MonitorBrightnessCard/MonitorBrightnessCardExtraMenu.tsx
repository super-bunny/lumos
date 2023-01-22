import React, { CSSProperties, useMemo } from 'react'
import { bindMenu, bindTrigger, usePopupState } from 'material-ui-popup-state/hooks'
import MoreVert from '@mui/icons-material/MoreVert'
import { Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from '@mui/material'
import MonitorIcon from '@mui/icons-material/Monitor'
import { Monitor } from './index'
import { useSnackbar } from 'notistack'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import useSwr from 'swr'
import { useConfirm } from 'material-ui-confirm'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import useSettingsStore from '../../../hooks/useSettingsStore'
import InfoIcon from '@mui/icons-material/Info'

export interface Props {
  monitor: Monitor
  className?: string
  style?: CSSProperties
}

export default function MonitorBrightnessCardExtraMenu({ monitor, className, style }: Props) {
  const confirm = useConfirm()
  const popupState = usePopupState({ variant: 'popover', popupId: 'demoMenu' })
  const { enqueueSnackbar } = useSnackbar()

  const { settingsStore } = useSettingsStore()
  const developerMode = settingsStore?.settings.developerMode

  const { data: supportDDC } = useSwr([
      `${ monitor.info.displayId }-supportDDC`,
    ], () => monitor.supportDDC(true)
    , {
      revalidateOnReconnect: false,
      revalidateOnFocus: false,
      revalidateIfStale: false,
    })
  const { data: vcpVersion } = useSwr([
      supportDDC === true ? `${ monitor.info.displayId }-getVcpVersion` : null,
    ], () => monitor.getVcpVersion()
    , {
      revalidateOnReconnect: false,
      revalidateOnFocus: false,
      revalidateIfStale: false,
    })

  const vcpVersionStr = useMemo(() => {
    if (vcpVersion === undefined) {
      return 'unknown'
    }

    return `${ vcpVersion.version }.${ vcpVersion.revision }`
  }, [vcpVersion])

  return (
    <div className={ className } style={ style }>
      <IconButton color="inherit" { ...bindTrigger(popupState) } size={ 'small' }>
        <MoreVert/>
      </IconButton>

      <Menu { ...bindMenu(popupState) } PaperProps={ { style: { minWidth: 200, maxWidth: 300 } } }>
        <MenuItem disabled>
          <ListItemIcon>
            <MonitorIcon/>
          </ListItemIcon>
          <ListItemText>
            <Typography noWrap>{ monitor.info.displayId }</Typography>
          </ListItemText>
        </MenuItem>

        { supportDDC === true && (
          <MenuItem disabled>
            <ListItemIcon>
              <InfoIcon/>
            </ListItemIcon>
            <ListItemText>VCP version { vcpVersionStr }</ListItemText>
          </MenuItem>
        ) }

        <Divider/>

        <MenuItem
          onClick={ () => {
            navigator.clipboard.writeText(monitor.info.displayId)
              .then(() => enqueueSnackbar('Monitor id copied to clipboard', { variant: 'success' }))
          } }
        >
          <ListItemIcon>
            <ContentCopyIcon/>
          </ListItemIcon>
          <ListItemText>Copy ID</ListItemText>
        </MenuItem>

        { monitor.info.capabilities && developerMode && (
          <MenuItem
            onClick={ () => {
              confirm({
                title: `${ monitor.getDisplayName() } capability string`,
                description: (
                  <code style={ { wordBreak: 'break-all' } }>{ monitor.info.capabilities }</code>
                ),
                allowClose: true,
                cancellationButtonProps: { style: { display: 'none' } },
                confirmationText: 'Close',
              })
                .then()
              popupState.close()
            } }
          >
            <ListItemIcon>
              <AssignmentTurnedInIcon/>
            </ListItemIcon>
            <ListItemText>Show capability string</ListItemText>
          </MenuItem>
        ) }
      </Menu>
    </div>
  )
}
