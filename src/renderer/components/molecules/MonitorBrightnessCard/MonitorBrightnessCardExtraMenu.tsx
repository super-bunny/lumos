import React, { CSSProperties, useCallback, useMemo } from 'react'
import { bindMenu, bindTrigger, usePopupState } from 'material-ui-popup-state/hooks'
import MoreVert from '@mui/icons-material/MoreVert'
import { Checkbox, Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from '@mui/material'
import MonitorIcon from '@mui/icons-material/Monitor'
import { Monitor } from './MonitorBrightnessCard'
import { useSnackbar } from 'notistack'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import useSwr from 'swr'
import { useConfirm } from 'material-ui-confirm'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import useSettingsStore from '../../../hooks/useSettingsStore'
import InfoIcon from '@mui/icons-material/Info'
import EditIcon from '@mui/icons-material/Edit'
import MonitorAliasDialog from '../dialogs/MonitorAliasDialog'
import BetaTag from '../../atoms/BetaTag'

export interface Props {
  monitor: Monitor
  className?: string
  style?: CSSProperties
}

export default function MonitorBrightnessCardExtraMenu({ monitor, className, style }: Props) {
  const confirm = useConfirm()
  const popupState = usePopupState({ variant: 'popover', popupId: 'MonitorBrightnessCardExtraMenu' })
  const aliasDialogState = usePopupState({ variant: 'dialog', popupId: 'MonitorAliasDialog' })
  const { enqueueSnackbar } = useSnackbar()
  const { settingsStore: { settings } = {}, updateSettings } = useSettingsStore()
  const developerMode = settings?.developerMode

  const { data: supportDDC } = useSwr(
    `${ monitor.info.displayId }-supportDDC`,
    () => monitor.supportDDC(false)
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

  const powerOffOnShutdown = useMemo<boolean | undefined>(() => {
    return settings?.powerOffMonitorOnShutdown?.[monitor.info.displayId]
  }, [monitor.info.displayId, settings])

  const setPowerOffOnShutdown = useCallback((value: boolean) => {
    if (!settings) return
    updateSettings({
      powerOffMonitorOnShutdown: {
        ...settings?.powerOffMonitorOnShutdown,
        [monitor.info.displayId]: value,
      },
    })
  }, [monitor.info.displayId, settings, updateSettings])

  return (
    <div className={ className } style={ style }>
      <MonitorAliasDialog
        monitor={ monitor }
        open={ aliasDialogState.isOpen }
        onClose={ aliasDialogState.close }
      />

      <IconButton color="inherit" { ...bindTrigger(popupState) } size={ 'small' }>
        <MoreVert/>
      </IconButton>

      <Menu { ...bindMenu(popupState) } PaperProps={ { style: { minWidth: 200, maxWidth: 330 } } }>
        <MenuItem disabled>
          <ListItemIcon>
            <MonitorIcon/>
          </ListItemIcon>
          <ListItemText>
            <Typography noWrap>{ monitor.info.displayId }</Typography>
          </ListItemText>
        </MenuItem>

        { developerMode && (
          <MenuItem disabled>
            <ListItemIcon>
              <InfoIcon/>
            </ListItemIcon>
            <ListItemText>MCCS { supportDDC === true ? `v${ vcpVersionStr }` : 'unsupported' }</ListItemText>
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

        { developerMode && (
          <MenuItem
            disabled={ !monitor.info.capabilities }
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

        <MenuItem
          { ...bindTrigger(aliasDialogState) }
          onClick={ event => {
            bindTrigger(aliasDialogState).onClick(event)
            popupState.close()
          } }
        >
          <ListItemIcon>
            <EditIcon/>
          </ListItemIcon>
          <ListItemText>Rename</ListItemText>
        </MenuItem>

        <MenuItem
          disabled={ !settings }
          onClick={ () => {
            setPowerOffOnShutdown(!powerOffOnShutdown)
          } }
        >
          <ListItemIcon>
            <Checkbox checked={ powerOffOnShutdown ?? false } style={ { padding: 0 } }/>
          </ListItemIcon>
          <ListItemText>Turn off on shutdown</ListItemText>
          <BetaTag/>
        </MenuItem>
      </Menu>
    </div>
  )
}
