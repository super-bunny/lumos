import React, { useCallback, useEffect, useState } from 'react'
import { Divider, Input, Paper, Slider, Stack, styled, Typography } from '@mui/material'
import EnhancedDisplay from '../../classes/EnhancedDisplay'
import Center from '../atoms/Center'

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
  const [supportDDC, setSupportDDC] = useState<boolean>()
  const [brightness, setBrightness] = useState(0)
  const [loading, setLoading] = useState(true)

  const setBrightnessInRange = useCallback((value: number) => {
    setBrightness(Math.max(0, Math.min(100, value || 0)))
  }, [setBrightness])

  const addBrightnessInRange = useCallback((valueToAdd: number) => {
    setBrightness(brightness => Math.max(0, Math.min(100, (brightness + valueToAdd) || 0)))
  }, [setBrightness])

  // Check if monitor support DDC protocol and retrieve monitor brightness if supported
  useEffect(() => {
    const supportDDC = monitor.supportDDC()

    if (!supportDDC) {
      setSupportDDC(false)
      return
    }

    setSupportDDC(true)
    setBrightness(monitor.getBrightnessPercentage())
    setLoading(false)
  }, [])

  // Set monitor brightness
  useEffect(() => {
    console.info(`Set ${ monitor.getDisplayName() } monitor brightness to:`, brightness)
    try {
      monitor.setBrightnessPercentage(brightness)
    } catch (e) {
      console.error(`Unable to set brightness of monitor: ${ monitor.getDisplayName() }.`, e)
    }
  }, [brightness])

  return (
    <Paper
      onWheel={ event => addBrightnessInRange(Math.sign(event.deltaY) * BRIGHTNESS_STEP) }
      sx={ { width: 320, height: 320, p: 2, textAlign: 'center' } }
    >
      <Stack height={ 1 } direction={ 'column' }>
        <Typography
          variant={ 'h4' }
          textAlign={ 'center' }
          noWrap
        >{ monitor.getDisplayName() }</Typography>

        <Divider sx={ { my: 1 } }/>

        { !supportDDC && (
          <Center>
            <Typography fontSize={ '1.5em' } noWrap sx={ { color: 'gray' } }>Monitor not supported</Typography>
          </Center>
        ) }

        { supportDDC && (
          <>
            <Typography variant={ 'overline' } fontSize={ '1.2em' } textAlign={ 'center' }>Brightness</Typography>

            <StyledInput
              disabled={ loading }
              value={ brightness.toString() }
              onChange={ event => setBrightnessInRange(parseInt(event.target.value)) }
              inputProps={ { inputMode: 'numeric', pattern: '[0-9]*' } }
              endAdornment={ <Typography variant={ 'caption' } color={ 'initial' } fontSize={ 20 }>%</Typography> }
              color={ 'primary' }
              sx={ { fontSize: 80, color: theme => theme.palette.primary.main } }
            />

            <Stack mt={ 2 } direction="row" alignItems={ 'center' } spacing={ 2 } sx={ { mb: 1 } }>
              <Slider
                disabled={ loading }
                value={ brightness }
                onChange={ (event, value) => setBrightness(value as number) }
                valueLabelDisplay="auto"
              />
            </Stack>
          </>
        ) }
      </Stack>
    </Paper>
  )
}
