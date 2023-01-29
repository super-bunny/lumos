import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Divider, IconButton, Input, Paper, Slider, Stack, styled, Tooltip, Typography } from '@mui/material'
import Center from '../../atoms/Center'
import Loader from '../../atoms/Loader'
import GenericDisplay from '../../../classes/GenericDisplay'
import RefreshIcon from '@mui/icons-material/Refresh'
import { IpcEvents } from '../../../../types/Ipc'
import type { IpcDisplayUpdateArgs } from '../../../../main/utils/ipc'
import VCPFeatures from '../../../../types/VCPFeatures'
import MonitorBrightnessCardExtraMenu from './MonitorBrightnessCardExtraMenu'
import { useSnackbar } from 'notistack'

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

  const [supportDDC, setSupportDDC] = useState<boolean>()
  const [brightness, setBrightnessState] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  const setMonitorBrightness = useCallback(async (brightnessPercentage: number) => {
    console.info(`Set ${ monitor.getDisplayName() } monitor brightness to:`, brightnessPercentage)

    try {
      await monitor.setBrightnessPercentage(brightnessPercentage)
    } catch (e) {
      console.error(`Unable to set brightness of monitor: ${ monitor.getDisplayName() }.`, e)
    }
  }, [monitor])

  const setBrightness = useCallback(async (brightness: number) => {
    setBrightnessState(brightness)
    await setMonitorBrightness(brightness)
  }, [setMonitorBrightness])

  const setBrightnessInRange = useCallback(async (value: number) => {
    await setBrightness(Math.max(0, Math.min(100, value || 0)))
  }, [setBrightness])

  const addBrightnessInRange = useCallback(async (valueToAdd: number) => {
    await setBrightness(Math.max(0, Math.min(100, (brightness + valueToAdd) || 0)))
  }, [brightness, setBrightness])

  // Check if monitor support DDC protocol and retrieve monitor brightness if supported
  const refreshBrightness = useCallback(async (useCache: boolean = true) => {
    setLoading(true)
    await monitor.supportDDC()
      .then(supportDDC => {
        setSupportDDC(supportDDC)
        return supportDDC
      }, error => {
        console.error(`Error while checking if monitor ${ monitor.getDisplayName() } support DDC:`, error)
        throw error
      })
      .then(async supportDDC => {
        if (!supportDDC) return
        const brightness = await monitor.getBrightnessPercentage(useCache)
        setBrightnessState(brightness)
      }, error => {
        console.error(`Error while getting brightness of monitor ${ monitor.getDisplayName() }:`, error)
        throw error
      })
      .finally(() => {
        setLoading(false)
      })
  }, [monitor])

  // Check if monitor support DDC protocol and retrieve monitor brightness if supported
  useEffect(() => {
    refreshBrightness()
  }, [refreshBrightness])

  useEffect(() => {
    const listener = window.lumos.ipc.on(IpcEvents.DISPLAY_UPDATE, ({
      displayId,
      vcpFeature,
    }: IpcDisplayUpdateArgs) => {
      if (displayId === monitor.info.displayId && vcpFeature === VCPFeatures.ImageAdjustment.Luminance) {
        refreshBrightness(false)
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
      <Stack height={ 1 } direction={ 'column' }>
        <Stack alignItems={ 'center' } justifyContent={ 'center' } style={ { position: 'relative' } }>
          <Typography
            width={ 0.9 }
            variant={ 'h5' }
            textAlign={ 'center' }
            noWrap
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
          <Center sx={ { height: 'auto', flexGrow: 1 } }>
            <Typography fontSize={ '1.2em' } sx={ { color: 'gray' } }>Monitor not supported</Typography>
          </Center>
        ) }

        { !loading && supportDDC && (
          <>
            <div style={ { alignSelf: 'center', position: 'relative' } }>
              <Typography
                mt={ 1 }
                variant={ 'overline' }
                fontSize={ '1em' }
                lineHeight={ '1em' }
                textAlign={ 'center' }
              >Brightness</Typography>

              <Tooltip title={ 'Refresh brightness for this monitor' } enterDelay={ 500 } placement={ 'top' }>
                <IconButton
                  onClick={ () => {
                    refreshBrightness(false)
                      .catch(() => enqueueSnackbar('Fail to refresh brightness', { variant: 'error' }))
                  } }
                  color={ 'primary' }
                  sx={ { p: 0, position: 'absolute', top: 0, right: -32 } }
                ><RefreshIcon/></IconButton>
              </Tooltip>
            </div>

            <Center sx={ { height: 'auto', flexGrow: 1 } }>
              <StyledInput
                disabled={ loading }
                value={ brightness.toString() }
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
                sx={ { fontSize: 65, color: theme => theme.palette.primary.main, flexGrow: 1 } }
              />
            </Center>

            <Slider
              disabled={ loading }
              value={ brightness }
              onChange={ (event, value) => setBrightness(value as number) }
              min={ 0 }
              max={ 100 }
              valueLabelDisplay="auto"
            />

            <Typography
              variant={ 'body2' }
              fontSize={ '0.8em' }
              color={ 'gray' }
            >{ monitor.info.backend.toUpperCase() }</Typography>
          </>
        ) }
      </Stack>
    </Paper>
  )
}
