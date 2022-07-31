import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Divider, Input, Paper, Slider, Stack, styled, Typography } from '@mui/material'
import Center from '../atoms/Center'
import Loader from '../atoms/Loader'
import GenericDisplay from '../../classes/GenericDisplay'

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
  useEffect(() => {
    const checkSupportDDC = async () => {
      const supportDDC = await monitor.supportDDC()

      if (!supportDDC) {
        setSupportDDC(false)
        setLoading(false)
        return
      }

      setBrightnessState(await monitor.getBrightnessPercentage())
      setSupportDDC(true)
      setLoading(false)
    }

    checkSupportDDC()
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
    <Paper ref={ ref } sx={ { width: 250, height: 250, p: 2, pb: 1, textAlign: 'center' } }>
      <Stack height={ 1 } direction={ 'column' }>
        <Typography
          variant={ 'h5' }
          textAlign={ 'center' }
          noWrap
        >{ monitor.getDisplayName() }</Typography>

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
            <Typography
              mt={ 1 }
              variant={ 'overline' }
              fontSize={ '1em' }
              lineHeight={ '1em' }
              textAlign={ 'center' }
            >Brightness</Typography>

            <Center sx={ { height: 'auto', flexGrow: 1 } }>
              <StyledInput
                disabled={ loading }
                value={ brightness.toString() }
                onChange={ event => setBrightnessInRange(parseInt(event.target.value)) }
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
