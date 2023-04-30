import React, { ReactElement, useCallback, useEffect, useMemo, useState } from 'react'
import SettingsType from '../../../../types/Settings'
import Settings, { GlobalShortcutsStaticActions } from '../../../../types/Settings'
import {
  Alert,
  Button,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  SxProps,
  Typography,
} from '@mui/material'
import ShortcutInput from '../../atoms/ShortcutInput'
import GenericDisplay from '../../../../shared/classes/GenericDisplay'
import MonitorSelect from '../../atoms/MonitorSelect'
import InfoIcon from '../../atoms/InfoIcon'
import DeleteIcon from '@mui/icons-material/Delete'
import { useConfirm } from 'material-ui-confirm'
import useMonitors from '../../../hooks/useMonitors'

type GlobalShortcutInfo = {
  label: string
  description?: string
  displayId?: string
}

enum GlobalShortcutRegExp {
  DIM_ALL_DISPLAYS = '^dimAllDisplays$',
  BRIGHT_ALL_DISPLAYS = '^brightAllDisplays$',
  DIM_DISPLAY = '^dimDisplay(.*)$',
  BRIGHT_DISPLAY = 'brightDisplay(.*)$',
}

enum GlobalShortcutType {
  STATIC = 'STATIC',
  DISPLAY = 'DISPLAY',
}

interface Action {
  label: string
  regExp: GlobalShortcutRegExp
  keyGetter: (displayId?: string) => string
  type: GlobalShortcutType
  unique: boolean
}

export interface Props {
  settings: SettingsType
  onChange?: (settings: SettingsType) => void
  sx?: SxProps
}

const Shortcut = ({
  label,
  accelerator,
  invalid,
  onChange,
  onDelete,
  sx,
}: {
  label: ReactElement,
  accelerator: string,
  onChange?: (accelerator: string) => void,
  onDelete?: () => void,
  invalid?: boolean,
  sx?: SxProps
}) => {
  const confirm = useConfirm()

  const deleteHandler = useCallback(() => {
    if (invalid) return onDelete?.()

    confirm({
      title: <span>Delete <b>{ label }</b> shortcut?</span>,
      confirmationButtonProps: { color: 'error', autoFocus: true },
      cancellationButtonProps: { color: 'inherit' },
      confirmationText: 'Delete',
    })
      .then(() => onDelete?.())
      .catch(() => undefined)
  }, [confirm, invalid, label, onDelete])

  return (
    <Stack direction="row" alignItems={ 'center' } justifyContent={ 'space-between' } gap={ 2 } sx={ sx }>
      <Stack>
        { label }
        { invalid && (
          <Stack direction="row" alignItems={ 'center' } gap={ 1 }>
            <Typography sx={ { color: theme => theme.palette.warning.main } }>Invalid shortcut</Typography>
            <InfoIcon message={ 'This shortcut have been found in your config file but it is not recognized by the application' }/>
          </Stack>
        ) }
      </Stack>

      <Stack direction="row" alignItems={ 'center' } gap={ 2 }>
        <ShortcutInput value={ accelerator } onChange={ onChange }/>

        { onDelete && (
          <IconButton onClick={ deleteHandler } color={ 'error' } aria-label="delete shortcut">
            <DeleteIcon/>
          </IconButton>
        ) }
      </Stack>
    </Stack>
  )

}
const globalShortcutInfo: Record<
  keyof Settings['globalShortcuts'] | string,
  (monitors: Array<GenericDisplay>, ...matches: Array<string>) => {
    label: string
    description?: string
  }
> = {
  '^dimAllDisplays$': () => ({ label: 'Dim all displays' }),
  '^brightAllDisplays$': () => ({ label: 'Brighten all displays' }),
  '^dimDisplay(.*)$': (monitors, key, displayId) => {
    const monitor = monitors.find(monitor => monitor.info.displayId === displayId)
    return {
      label: `Dim display ${ monitor?.getDisplayName() ?? displayId }`,
      displayId,
    }
  },
  'brightDisplay(.*)$': (monitors, key, displayId) => {
    const monitor = monitors.find(monitor => monitor.info.displayId === displayId)
    return {
      label: `Brighten display ${ monitor?.getDisplayName() ?? displayId }`,
      displayId,
    }
  },
}

const getActionInfo = (
  action: GlobalShortcutsStaticActions | string,
  monitors: Array<GenericDisplay>,
): GlobalShortcutInfo | undefined => {
  for (const [regExpStr, infoGetter] of Object.entries(globalShortcutInfo)) {
    const regExp = new RegExp(regExpStr)
    const regExpResult = regExp.exec(action)

    if (regExpResult === null) continue

    return infoGetter(monitors, ...regExpResult)
  }

  return undefined
}

const actions: Array<Action> = [
  {
    label: 'Dim all displays',
    keyGetter: () => 'dimAllDisplays',
    regExp: GlobalShortcutRegExp.DIM_ALL_DISPLAYS,
    type: GlobalShortcutType.STATIC,
    unique: true,
  },
  {
    label: 'Brighten all displays',
    keyGetter: () => 'brightAllDisplays',
    regExp: GlobalShortcutRegExp.BRIGHT_ALL_DISPLAYS,
    type: GlobalShortcutType.STATIC,
    unique: true,
  },
  {
    label: 'Dim display ...',
    keyGetter: (displayId) => `dimDisplay${ displayId }`,
    regExp: GlobalShortcutRegExp.DIM_DISPLAY,
    type: GlobalShortcutType.DISPLAY,
    unique: false,
  },
  {
    label: 'Brighten display ...',
    keyGetter: (displayId) => `brightDisplay${ displayId }`,
    regExp: GlobalShortcutRegExp.BRIGHT_DISPLAY,
    type: GlobalShortcutType.DISPLAY,
    unique: false,
  },
]

export default function GlobalShortcutsSettings({ settings, onChange, sx }: Props) {
  const [newAction, setNewAction] = useState<Action>()
  const [newActionMonitor, setNewActionMonitor] = useState<GenericDisplay>()
  const [newActionAccelerator, setNewActionAccelerator] = useState<string>()

  const { monitors } = useMonitors()

  const remainingActions = useMemo(() => {
    const currentGlobalShortcutsActions = Object.keys(settings.globalShortcuts)
    return actions.filter(action => !(currentGlobalShortcutsActions.find(key => new RegExp(action.regExp).test(key)) && action.unique))
  }, [settings.globalShortcuts])

  const addShortcut = useCallback(() => {
    if (!newAction || (newAction.type === GlobalShortcutType.DISPLAY && !newActionMonitor) || !newActionAccelerator) return

    onChange?.({
      ...settings,
      globalShortcuts: {
        ...settings.globalShortcuts,
        [newAction.keyGetter(newActionMonitor?.info?.displayId)]: newActionAccelerator,
      },
    })

    setNewAction(undefined)
    setNewActionAccelerator(undefined)
    setNewActionMonitor(undefined)
    setNewActionAccelerator(undefined)
  }, [newAction, newActionAccelerator, newActionMonitor, onChange, settings])

  useEffect(() => {
    window.lumos.unregisterAllShortcuts()
      .then(() => console.info('Global shortcuts unregistered'))
    return () => {
      window.lumos.registerAllShortcuts()
        .then(() => console.info('Global shortcuts unregistered'))
    }
  }, [])

  return (
    <Grid container gap={ 2 } sx={ sx }>
      <Grid item xs={ 12 }>
        <Alert severity={ 'warning' }>Global shortcuts are disabled while on this page</Alert>
      </Grid>

      <Grid item xs={ 12 } mb={ 2 }>
        <Typography mb={ 3 }>Add a shortcut</Typography>

        <Grid container alignItems={ 'center' } spacing={ 2 }>
          <Grid item xs={ 4 }>
            <FormControl fullWidth>
              <InputLabel>Action</InputLabel>
              <Select
                onChange={ (event) => {
                  const action = actions.find(action => action.regExp === event.target.value)
                  if (action) setNewAction(action)
                } }
                value={ newAction?.regExp ?? '' }
                disabled={ remainingActions.length === 0 }
                label="Action"
              >
                { remainingActions.map(action => (
                  <MenuItem value={ action.regExp } key={ action.keyGetter() }>{ action.label }</MenuItem>
                )) }
              </Select>
            </FormControl>
          </Grid>

          { newAction?.type === GlobalShortcutType.DISPLAY && (
            <Grid item xs={ 4 }>
              <MonitorSelect
                label={ 'Target monitor' }
                monitorId={ newActionMonitor?.info.displayId }
                onChange={ monitor => setNewActionMonitor(monitor) }
              />
            </Grid>
          ) }

          <Grid item>
            <ShortcutInput
              value={ newActionAccelerator ?? '' }
              onChange={ setNewActionAccelerator }
              disabled={ !newAction }
            />
          </Grid>

          <Grid item>
            <Button
              onClick={ addShortcut }
              disabled={ !newAction || (newAction.type === GlobalShortcutType.DISPLAY && !newActionMonitor) || !newActionAccelerator }
              size={ 'large' }
              variant={ 'contained' }
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={ 12 }>
        <Typography mb={ 3 }>Shortcuts</Typography>

        <Stack gap={ 1 } divider={ <Divider flexItem/> }>
          { Object.entries(settings.globalShortcuts)
            .filter(([key, accelerator]) => accelerator !== undefined)
            .map(([key, accelerator]) => {
              const actionInfo = getActionInfo(key, monitors ?? [])

              return (
                <Shortcut
                  label={ <span>{ actionInfo?.label ?? <code>{ key }</code> }</span> }
                  accelerator={ accelerator! }
                  invalid={ actionInfo === undefined }
                  onChange={ accelerator => onChange?.({
                    ...settings,
                    globalShortcuts: {
                      ...settings.globalShortcuts,
                      [key]: accelerator,
                    },
                  }) }
                  onDelete={ () => {
                    const globalShortcuts = { ...settings.globalShortcuts }
                    delete globalShortcuts[key]
                    onChange?.({ ...settings, globalShortcuts })
                  } }
                  key={ key }
                  sx={ {
                    p: 2,
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  } }
                />
              )
            }) }
        </Stack>
      </Grid>
    </Grid>
  )
}
