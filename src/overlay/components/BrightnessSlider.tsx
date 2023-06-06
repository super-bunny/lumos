import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Slider, Stack, Typography } from '@mui/material'
import { IpcEvents } from '../../types/Ipc'
import { IpcDisplayUpdateArgs } from '../../main/utils/ipc'
import VCPFeatures from '../../types/VCPFeatures'
import { VcpValueType } from '../../types/EnhancedDDCDisplay'
import BrightnessMediumIcon from '@mui/icons-material/BrightnessMedium'
import { useAppSelector } from '../store/store'
import asyncTimeout from '../../shared/utils/asyncTimeout'
import useSettingsStore from '../../renderer/hooks/useSettingsStore'

const TIMEOUT = 2000
const root = document.getElementById('root')

function showWindow(animate: boolean) {
  return window.lumos.setWindowVisibility(true)
    .then(() => {
      if (root) {
        root.className = animate ? 'shown' : ''
      }
    })
}

async function hideWindow(animate: boolean) {
  if (animate) {
    if (root) root.className = 'hidden'
    await asyncTimeout(400)
  }
  return window.lumos.setWindowVisibility(false)
}

export default function BrightnessSlider() {
  const { settingsStore } = useSettingsStore()
  const enableAnimations = useMemo<boolean>(() => settingsStore?.settings.enableAnimations !== false, [settingsStore])

  const { displayId } = useAppSelector(state => state.overlayInfo) ?? {}
  const [brightness, setBrightness] = useState<number>(0)
  const [hideTimeoutId, setHideTimeoutId] = useState<number>()

  const { showDisplayId = false } = window.lumos.initSettings.overlay

  const handleBrightnessChange = useCallback((brightness: number) => showWindow(enableAnimations)
    .then(() => {
      setBrightness(brightness)
    })
    .then(() => {
      if (window.lumos.env.FORCE_SHOW_OVERLAY === 'true') return
      if (hideTimeoutId) clearTimeout(hideTimeoutId)

      const timeoutId = window.setTimeout(() => {
        if (window.lumos.env.NODE_ENV === 'development' && window.lumos.env.PROD_OVERLAY !== 'true') return
        return hideWindow(enableAnimations)
      }, TIMEOUT)

      setHideTimeoutId(timeoutId)
    }), [enableAnimations, hideTimeoutId])

  useEffect(() => {
    const listener = window.lumos.ipc.on(IpcEvents.DISPLAY_UPDATE, ({
      displayId: eventDisplayId,
      vcpFeature,
      vcpValue,
    }: IpcDisplayUpdateArgs) => {
      console.debug('Received display update:', eventDisplayId, vcpFeature, vcpValue)

      if (
        eventDisplayId !== displayId
        || vcpFeature !== VCPFeatures.ImageAdjustment.Luminance
        || vcpValue?.type !== VcpValueType.Continuous
        || vcpValue === undefined
      ) {
        console.debug('Display update ignored:', eventDisplayId, vcpFeature, vcpValue)
        return
      }

      handleBrightnessChange(Math.round(vcpValue.currentValue * 100 / vcpValue.maximumValue)).then()
    })

    return () => window.lumos.ipc.removeListener(IpcEvents.DISPLAY_UPDATE, listener)
  }, [displayId, handleBrightnessChange])

  return (
    <Stack alignItems={ 'stretch' } justifyContent={ 'center' } style={ { height: '100%', position: 'relative' } }>
      <div style={ { width: '100%', position: 'absolute', top: 0 } }>
        { showDisplayId && (
          <Typography
            mx={ 'auto' }
            width={ 0.5 }
            variant={ 'body2' }
            fontSize={ 'small' }
            lineHeight={ 'normal' }
            component={ 'div' }
            textAlign={ 'center' }
            color={ 'textSecondary' }
            style={ { overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' } }
          >{ displayId }
          </Typography>
        ) }
      </div>

      <Stack direction={ 'row' } alignItems={ 'center' } spacing={ 2 }>
        <BrightnessMediumIcon color={ 'primary' } fontSize={ 'small' }/>
        <Slider value={ brightness } size={ 'small' }/>
        <Typography variant={ 'subtitle1' } color={ 'body' }>{ brightness }</Typography>
      </Stack>
    </Stack>
  )
}