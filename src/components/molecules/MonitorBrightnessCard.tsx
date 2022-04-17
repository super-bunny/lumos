import React, { useCallback, useEffect, useState } from 'react'
import { DisplayInfo } from 'ddc-enhanced-rs'
import { Divider, Input, Paper, Slider, Stack, styled, Typography } from '@mui/material'
import DisplayEnhanced from '../../classes/DisplayEnhanced'

export type Monitor = DisplayInfo

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
  const [brightness, setBrightness] = useState(0)
  const [loading, setLoading] = useState(true)

  const setBrightnessInRange = useCallback((value: number) => {
    setBrightness(Math.max(0, Math.min(100, value || 0)))
  }, [setBrightness])

  const addBrightnessInRange = useCallback((valueToAdd: number) => {
    setBrightness(brightness => Math.max(0, Math.min(100, (brightness + valueToAdd) || 0)))
  }, [setBrightness])

  // Retrieve monitor brightness
  useEffect(() => {
    setBrightness(new DisplayEnhanced(monitor.uuid).getBrightnessPercentage())
    setLoading(false)
  }, [])

  // Set monitor brightness
  useEffect(() => {
    console.info(`Set ${ monitor.model_name } monitor brightness to:`, brightness)
    try {
      new DisplayEnhanced(monitor.uuid).setBrightnessPercentage(brightness)
    } catch (e) {
      console.error(e)
    }
  }, [brightness])

  return (
    <Paper
      onWheel={ event => addBrightnessInRange(Math.sign(event.deltaY) * BRIGHTNESS_STEP) }
      sx={ { width: 300, p: 2, textAlign: 'center' } }
    >
      <Typography variant={ 'h4' } textAlign={ 'center' } noWrap>{ monitor.model_name }</Typography>

      <Divider sx={ { my: 1 } }/>

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
    </Paper>
  )
}