import SettingsStore from '../classes/SettingsStore'
import GenericDisplayManager from '../classes/GenericDisplayManager'
import { PowerMode } from '../../types/VCPFeatures'

// Walk through all monitor and power off them if they are enabled in the powerOffMonitorOnShutdown setting
export default async function autoShutdownMonitors(settings: SettingsStore, displayManager: GenericDisplayManager) {
  if (!settings.store.powerOffMonitorOnShutdown) return

  const promiseList = displayManager.list.map(display => {
    if (settings.store.powerOffMonitorOnShutdown?.[display.info.displayId] !== true) return undefined
    return display.setPowerMode(PowerMode.OFF)
      .then(() => display.setPowerMode(PowerMode.POWER_OFF))
  })

  return Promise.allSettled(promiseList)
}