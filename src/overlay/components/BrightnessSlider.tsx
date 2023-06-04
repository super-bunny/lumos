import React, { useEffect, useState } from 'react'
import { Slider, Stack, Typography } from '@mui/material'
import { IpcEvents } from '../../types/Ipc'
import { IpcDisplayUpdateArgs } from '../../main/utils/ipc'
import VCPFeatures from '../../types/VCPFeatures'
import { VcpValueType } from '../../types/EnhancedDDCDisplay'
import BrightnessMediumIcon from '@mui/icons-material/BrightnessMedium'
import { useAppSelector } from '../store/store'

export interface Props {
}

const TIMEOUT = 2000

export default function BrightnessSlider({}: Props) {
  const { displayId } = useAppSelector(state => state.overlayInfo) ?? {}
  const [brightness, setBrightness] = useState<number>(0)
  const [hideTimeoutId, setHideTimeoutId] = useState<number>()

  useEffect(() => {
    const listener = window.lumos.ipc.on(IpcEvents.DISPLAY_UPDATE, ({
      displayId: eventDisplayId,
      vcpFeature,
      vcpValue,
    }: IpcDisplayUpdateArgs) => {
      console.debug('Received display update:', displayId, vcpFeature, vcpValue)

      if (
        eventDisplayId !== displayId
        || vcpFeature !== VCPFeatures.ImageAdjustment.Luminance
        || vcpValue?.type !== VcpValueType.Continuous
        || !vcpValue
      ) return

      window.lumos.setWindowVisibility(true)
        .then(() => {
          setBrightness(Math.round(vcpValue.currentValue * 100 / vcpValue.maximumValue))
        })
        .then(() => {
          if (window.lumos.env.FORCE_SHOW_OVERLAY === 'true') return
          if (hideTimeoutId) clearTimeout(hideTimeoutId)

          const timeoutId = window.setTimeout(() => {
            if (window.lumos.env.NODE_ENV === 'development' && window.lumos.env.PROD_OVERLAY !== 'true') return
            return window.lumos.setWindowVisibility(false)
          }, TIMEOUT)

          setHideTimeoutId(timeoutId)
        })
    })

    return () => window.lumos.ipc.removeListener(IpcEvents.DISPLAY_UPDATE, listener)
  }, [displayId, hideTimeoutId])

  return (
    <Stack alignItems={ 'stretch' } justifyContent={ 'center' } style={ { height: '100%', position: 'relative' } }>
      <div style={ { width: '100%', position: 'absolute', top: 0 } }>
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
      </div>

      <Stack direction={ 'row' } alignItems={ 'center' } spacing={ 2 }>
        <BrightnessMediumIcon color={ 'primary' } fontSize={ 'small' }/>
        <Slider value={ brightness } size={ 'small' }/>
        <Typography variant={ 'h6' } color={ 'body' }>{ brightness }</Typography>
      </Stack>
    </Stack>
  )
}