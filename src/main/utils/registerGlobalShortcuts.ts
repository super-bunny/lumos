import Settings from '../../types/Settings'
import DisplayManager from '../classes/DisplayManager'
import { sendIpcDisplayUpdate } from './ipc'
import { VCPFeatures } from 'ddc-rs'
import { BrowserWindow, globalShortcut } from 'electron'

export default function registerGlobalShortcuts(
  shortcuts: Settings['globalShortcuts'],
  displayManager: DisplayManager,
  browserWindow?: BrowserWindow,
) {
  const globalShortcutHandlers: Record<keyof Settings['globalShortcuts'] | string, (...matches: Array<string>) => void> = {
    '^dimAllDisplays$': () => {
      displayManager.list.forEach((display) => {
        if (!display.supportDDC()) return
        const brightnessPercentage = display.getBrightnessPercentage(true)
        display.setBrightnessPercentage(brightnessPercentage - 5)

        browserWindow && sendIpcDisplayUpdate(browserWindow, {
          displayId: display.info.displayId,
          vcpFeature: VCPFeatures.ImageAdjustment.Luminance,
        })
      })
    },
    '^brightAllDisplays$': () => {
      displayManager.list.forEach((display) => {
        if (!display.supportDDC()) return
        const brightnessPercentage = display.getBrightnessPercentage(true)
        display.setBrightnessPercentage(brightnessPercentage + 5)

        browserWindow && sendIpcDisplayUpdate(browserWindow, {
          displayId: display.info.displayId,
          vcpFeature: VCPFeatures.ImageAdjustment.Luminance,
        })
      })
    },
    '^dimDisplay(.*)$': (key, displayId) => {
      const display = displayManager.list.find((display) => display.info.displayId === displayId)

      if (!display || !display.supportDDC()) return

      const brightnessPercentage = display.getBrightnessPercentage(true)
      display.setBrightnessPercentage(brightnessPercentage - 5)

      browserWindow && sendIpcDisplayUpdate(browserWindow, {
        displayId: display.info.displayId,
        vcpFeature: VCPFeatures.ImageAdjustment.Luminance,
      })
    },
    '^brightDisplay(.*)$': (key, displayId) => {
      const display = displayManager.list.find((display) => display.info.displayId === displayId)

      if (!display || !display.supportDDC()) return

      const brightnessPercentage = display.getBrightnessPercentage(true)
      display.setBrightnessPercentage(brightnessPercentage + 5)

      browserWindow && sendIpcDisplayUpdate(browserWindow, {
        displayId: display.info.displayId,
        vcpFeature: VCPFeatures.ImageAdjustment.Luminance,
      })
    },
  }

  for (const [regExpStr, handler] of Object.entries(globalShortcutHandlers)) {
    const regExp = new RegExp(regExpStr)
    const shortcut = Object.entries(shortcuts).find(([key, value]) => regExp.test(key))
    const [key, accelerator] = shortcut ?? []

    if (!key || !accelerator) continue

    const regExpResult = regExp.exec(key)

    try {
      const success = globalShortcut.register(accelerator, () => {
        console.info(`Global shortcut "${ key }" (${ accelerator }) triggered`)
        handler(...regExpResult!)
      })

      if (!success) {
        console.error(`Failed to register global shortcut: "${ key }" (${ accelerator }). Keybinding already used by other applications`)
      }
    } catch (error) {
      console.error(`Failed to register global shortcut: "${ key }" (${ accelerator }). ${ (error as Error).message }`)
    }
  }
}
