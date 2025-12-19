import { IpcEvents } from '../../types/Ipc'
import type { IpcDisplayUpdateArgs } from '../../main/utils/ipc'
import VCPFeatures from '../../types/VCPFeatures'
import { Continuous } from '../../types/EnhancedDDCDisplay'
import GenericDisplay from '../../shared/classes/GenericDisplay'
import { mutate } from 'swr'
import getSwrKeyForDisplay from './getSwrKeyForDisplay'

export default function setupIpcEventsHandlers(): void {
  window.lumos.ipc.on(IpcEvents.PING, message => console.info('Received ping from the main process:', message))

  window.lumos.ipc.on(IpcEvents.UPDATE_DOWNLOADED, () => console.info('[Auto Updater] Update downloaded.'))

  window.lumos.ipc.on(IpcEvents.DISPLAY_UPDATE, ({
    displayId,
    vcpFeature,
    vcpValue,
  }: IpcDisplayUpdateArgs) => {
    if (vcpFeature === VCPFeatures.ImageAdjustment.Luminance) {
      if (vcpValue) {
        try {
          const luminance = vcpValue as Continuous
          const percentage = GenericDisplay.getVcpContinuousValuePercentage(luminance)
          mutate(getSwrKeyForDisplay(displayId, 'getBrightnessPercentage'), percentage, { revalidate: false })
            .catch((error: any) => {
              console.error('Failed to mutate getBrightnessPercentage from display update event:', error)
            })
        } catch (error) {
          console.error('Failed to process luminance value from display update event:', error)
        }
      } else {
        mutate(getSwrKeyForDisplay(displayId, 'getBrightnessPercentage'))
          .catch((error: any) => {
            console.error('Failed to mutate getBrightnessPercentage from display update event:', error)
          })
      }
    }
  })
}