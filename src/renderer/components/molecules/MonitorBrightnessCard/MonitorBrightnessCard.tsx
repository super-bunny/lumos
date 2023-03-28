import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Divider, IconButton, Input, Paper, Slider, Stack, styled, Tooltip, Typography } from '@mui/material'
import Center from '../../atoms/Center'
import Loader from '../../atoms/Loader'
import GenericDisplay from '../../../../shared/classes/GenericDisplay'
import RefreshIcon from '@mui/icons-material/Refresh'
import { IpcEvents } from '../../../../types/Ipc'
import type { IpcDisplayUpdateArgs } from '../../../../main/utils/ipc'
import VCPFeatures from '../../../../types/VCPFeatures'
import MonitorBrightnessCardExtraMenu from './MonitorBrightnessCardExtraMenu'
import { useSnackbar } from 'notistack'
import useSettingsStore from '../../../hooks/useSettingsStore'
import useSwr from 'swr'

export type Monitor = GenericDisplay

export interface Props {
  monitor: Monitor
}

const BRIGHTNESS_STEP = 10

const StyledInput = styled(Input)({
  '& > input': {
    height: '1.2em',
    marginRight: '-20px',
    textAlign: 'center',
  },
  '&:before': {
    display: 'none',
  },
})

export default function MonitorBrightnessCard({ monitor }: Props) {
  const { enqueueSnackbar } = useSnackbar()
  const ref = useRef<HTMLDivElement>(null)

  const { settingsStore } = useSettingsStore()
  const developerMode = settingsStore?.settings?.developerMode

  const { data: supportDDC, isLoading: supportDDCLoading, mutate: mutateSupportDDC } = useSwr([
      `${ monitor.info.displayId }-supportDDC`,
    ], () => monitor.supportDDC(true)
    , {
      revalidateOnReconnect: false,
      revalidateOnFocus: false,
      revalidateIfStale: false,
      errorRetryInterval: 500,
      errorRetryCount: 3,
      onError: error => {
        console.error(`Error while checking if monitor ${ monitor.getDisplayName() } support DDC:`, error)
      },
    })
  const { data: brightness, isLoading: brightnessLoading, mutate: mutateBrightness } = useSwr([
      supportDDC === true ? `${ monitor.info.displayId }-getBrightnessPercentage` : null,
    ], () => monitor.getBrightnessPercentage(false)
    , {
      revalidateOnReconnect: false,
      revalidateOnFocus: true,
      revalidateIfStale: false,
      errorRetryInterval: 500,
      errorRetryCount: 3,
      onError: error => {
        console.error(`Error while getting brightness of monitor ${ monitor.getDisplayName() }:`, error)
      },
    })

  const loading = brightnessLoading || supportDDCLoading

  const setMonitorBrightness = useCallback(async (brightnessPercentage: number) => {
    console.info(`Set ${ monitor.getDisplayName() } monitor brightness to:`, brightnessPercentage)

    return monitor.setBrightnessPercentage(brightnessPercentage)
      .catch(error => {
        console.error(`Unable to set brightness of monitor: ${ monitor.getDisplayName() }.`, error)
        enqueueSnackbar(`Unable to set brightness of monitor: ${ monitor.getDisplayName() }`, {
          variant: 'error',
          preventDuplicate: true,
        })
      })
  }, [enqueueSnackbar, monitor])

  const setBrightness = useCallback(async (brightness: number) => {
    await mutateBrightness(brightness, { revalidate: false })
    await setMonitorBrightness(brightness)
  }, [mutateBrightness, setMonitorBrightness])

  const setBrightnessInRange = useCallback((value: number) => (
    setBrightness(Math.max(0, Math.min(100, value || 0)))
  ), [setBrightness])

  const addBrightnessInRange = useCallback(async (valueToAdd: number) => {
    if (brightness === undefined) return
    return setBrightness(Math.max(0, Math.min(100, (brightness + valueToAdd) || 0)))
  }, [brightness, setBrightness])

  const refreshBrightness = useCallback(() => mutateBrightness(), [mutateBrightness])

  // Refresh brightness on monitor update event from main process
  useEffect(() => {
    const listener = window.lumos.ipc.on(IpcEvents.DISPLAY_UPDATE, ({
      displayId,
      vcpFeature,
    }: IpcDisplayUpdateArgs) => {
      if (displayId === monitor.info.displayId && vcpFeature === VCPFeatures.ImageAdjustment.Luminance) {
        refreshBrightness()
      }
    })

    return () => window.lumos.ipc.removeListener(IpcEvents.DISPLAY_UPDATE, listener)
  }, [monitor.info.displayId, refreshBrightness])

  // Register scroll event to set monitor brightness
  useEffect(() => {
    const refCopy = ref.current

    const callback = (event: WheelEvent) => {
      if (loading || !supportDDC) return
      event.preventDefault()
      addBrightnessInRange(Math.sign(event.deltaY) * BRIGHTNESS_STEP * -1)
    }

    refCopy?.addEventListener('wheel', callback)

    return () => refCopy?.removeEventListener('wheel', callback)
  }, [loading, supportDDC, addBrightnessInRange])

  return (
    <Paper ref={ ref } sx={ { width: 250, height: 250, p: 2, pb: 1, textAlign: 'center' } }>
      <Stack height={ 1 }>
        <Stack alignItems={ 'center' } justifyContent={ 'center' } style={ { position: 'relative' } }>
          <Typography
            width={ 0.9 }
            variant={ 'h5' }
            textAlign={ 'center' }
            noWrap
            data-sentry-mask
          >{ monitor.getDisplayName() }</Typography>

          <MonitorBrightnessCardExtraMenu
            monitor={ monitor }
            style={ { position: 'absolute', top: 0, bottom: 0, right: -14 } }
          />
        </Stack>

        <Divider sx={ { my: 1 } }/>

        { loading && (
          <Center sx={ { height: 'auto', flexGrow: 1 } }>
            <Loader title={ 'Loading monitor brightness...' }/>
          </Center>
        ) }

        { !loading && !supportDDC && (
          <Center sx={ { height: 'auto', flexDirection: 'column', flexGrow: 1, position: 'relative' } }>
            <Typography fontSize={ '1.2em' } sx={ { color: 'gray' } }>Monitor not supported</Typography>
            <Button onClick={ () => mutateSupportDDC(undefined, { revalidate: true }) } size={ 'small' }>Retry</Button>
            { developerMode && (
              <Typography
                variant={ 'body2' }
                fontSize={ '0.8em' }
                color={ 'gray' }
                style={ { position: 'absolute', bottom: 0, left: 0, right: 0 } }
              >{ monitor.info.backend.toUpperCase() }</Typography>
            ) }
          </Center>
        ) }

        { !loading && supportDDC && (
          <>
            <Stack direction={ 'row' } alignItems={ 'center' } justifyContent={ 'center' } gap={ 0 }>
              <Typography
                variant={ 'overline' }
                fontSize={ '1em' }
                lineHeight={ '1em' }
                textAlign={ 'center' }
              >Brightness</Typography>

              <Tooltip title={ 'Refresh brightness for this monitor' } enterDelay={ 500 } placement={ 'top' }>
                <IconButton
                  onClick={ () => {
                    refreshBrightness()
                      .catch(() => enqueueSnackbar('Fail to refresh brightness', { variant: 'error' }))
                  } }
                  color={ 'primary' }
                  style={ { padding: 0, marginLeft: 8, marginRight: -32 } }
                >
                  <RefreshIcon/>
                </IconButton>
              </Tooltip>
            </Stack>

            <StyledInput
              disabled={ loading }
              value={ brightness?.toString() }
              onChange={ event => setBrightnessInRange(parseInt(event.target.value)) }
              onWheelCapture={ event => {
                if (event.target === document.activeElement) {
                  event.stopPropagation()
                  addBrightnessInRange(Math.sign(event.deltaY) * -1)
                }
              } }
              inputProps={ { inputMode: 'numeric', pattern: '[0-9]*' } }
              endAdornment={ <Typography variant={ 'caption' } color={ 'gray' } fontSize={ '0.3em' }>%</Typography> }
              color={ 'primary' }
              sx={ { height: '105px', fontSize: 65, color: theme => theme.palette.primary.main } }
            />

            <Slider
              disabled={ loading }
              value={ brightness }
              onChange={ (event, value) => setBrightness(value as number) }
              min={ 0 }
              max={ 100 }
              valueLabelDisplay="auto"
            />

            { developerMode && (
              <Typography
                variant={ 'body2' }
                fontSize={ '0.8em' }
                color={ 'gray' }
              >{ monitor.info.backend.toUpperCase() }</Typography>
            ) }
          </>
        ) }
      </Stack>
    </Paper>
  )
}
