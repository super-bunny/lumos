import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Box, Divider, Input, Paper, Slider, Stack, styled, Typography } from '@mui/material'
import EnhancedDisplay from '../../classes/EnhancedDisplay'
import Center from '../atoms/Center'
import Loader from '../atoms/Loader'

export type Monitor = EnhancedDisplay

export interface Props {
  monitor: Monitor
}

const BRIGHTNESS_STEP = 10

const StyledInput = styled(Input)({
  '& > input': {
    marginRight: '-20px',
    textAlign: 'center',
  },
})

export default function MonitorBrightnessCard({ monitor }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  const [supportDDC, setSupportDDC] = useState<boolean>()
  const [brightness, setBrightnessState] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  const setMonitorBrightness = useCallback((brightnessPercentage: number) => {
    console.info(`Set ${ monitor.getDisplayName() } monitor brightness to:`, brightnessPercentage)

    try {
      monitor.setBrightnessPercentage(brightnessPercentage)
    } catch (e) {
      console.error(`Unable to set brightness of monitor: ${ monitor.getDisplayName() }.`, e)
    }
  }, [monitor])

  const setBrightness = useCallback((brightness: number) => {
    setBrightnessState(brightness)
    setMonitorBrightness(brightness)
  }, [setMonitorBrightness])

  const setBrightnessInRange = useCallback((value: number) => {
    setBrightness(Math.max(0, Math.min(100, value || 0)))
  }, [setBrightness])

  const addBrightnessInRange = useCallback((valueToAdd: number) => {
    setBrightness(Math.max(0, Math.min(100, (brightness + valueToAdd) || 0)))
  }, [brightness, setBrightness])

  // Check if monitor support DDC protocol and retrieve monitor brightness if supported
  useEffect(() => {
    const supportDDC = monitor.supportDDC()

    if (!supportDDC) {
      setSupportDDC(false)
      setLoading(false)
      return
    }

    setBrightnessState(monitor.getBrightnessPercentage())
    setSupportDDC(true)
    setLoading(false)
  }, [monitor])

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
    <Paper ref={ ref } sx={ { width: 320, height: 320, p: 2, pb: 1, textAlign: 'center' } }>
      <Stack height={ 1 } direction={ 'column' }>
        <Typography
          variant={ 'h4' }
          textAlign={ 'center' }
          noWrap
        >{ monitor.getDisplayName() }</Typography>

        <Divider sx={ { my: 1 } }/>

        { loading && (
          <Center>
            <Loader title={ 'Loading monitor brightness...' }/>
          </Center>
        ) }

        { !loading && !supportDDC && (
          <Center>
            <Typography fontSize={ '1.5em' } noWrap sx={ { color: 'gray' } }>Monitor not supported</Typography>
          </Center>
        ) }

        { !loading && supportDDC && (
          <>
            <Typography
              mt={ 1 }
              variant={ 'overline' }
              fontSize={ '1.2em' }
              lineHeight={ '1.2em' }
              textAlign={ 'center' }
            >Brightness</Typography>

            <StyledInput
              disabled={ loading }
              value={ brightness.toString() }
              onChange={ event => setBrightnessInRange(parseInt(event.target.value)) }
              inputProps={ { inputMode: 'numeric', pattern: '[0-9]*' } }
              endAdornment={ <Typography variant={ 'caption' } color={ 'initial' } fontSize={ 20 }>%</Typography> }
              color={ 'primary' }
              sx={ { fontSize: 80, color: theme => theme.palette.primary.main } }
            />

            <Box mt={ 2 } mb={ 1 }>
              <Slider
                disabled={ loading }
                value={ brightness }
                onChange={ (event, value) => setBrightness(value as number) }
                min={ 0 }
                max={ 100 }
                valueLabelDisplay="auto"
              />
            </Box>

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
