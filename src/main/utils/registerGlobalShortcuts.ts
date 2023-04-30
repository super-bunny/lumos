import Settings from '../../types/Settings'
import GenericDisplayManager from '../classes/GenericDisplayManager'
import { sendIpcDisplayUpdate } from './ipc'
import { BrowserWindow, globalShortcut } from 'electron'
import VCPFeatures from '../../types/VCPFeatures'
import OverlayWindowManager from '../classes/OverlayWindowManager'

export default function registerGlobalShortcuts(
  shortcuts: Settings['globalShortcuts'],
  displayManager: GenericDisplayManager,
  browserWindow: BrowserWindow,
  overlayWindowManager: OverlayWindowManager,
) {
  const globalShortcutHandlers: Record<keyof Settings['globalShortcuts'] | string, (...matches: Array<string>) => Promise<void | Array<PromiseSettledResult<void>>>> = {
    '^dimAllDisplays$': () => {
      return Promise.allSettled(
        // TODO: ignore win API displays if enabled in settings
        displayManager.list.map(async (display) => {
          if (!await display.supportDDC()) return
          const brightnessPercentage = await display.getBrightnessPercentage(true)
          return display.setBrightnessPercentage(brightnessPercentage - 5)
            .then(vcpValue => {
              sendIpcDisplayUpdate([browserWindow, ...overlayWindowManager.browserWindows], {
                displayId: display.info.displayId,
                vcpFeature: VCPFeatures.ImageAdjustment.Luminance,
                vcpValue,
              })
            })
        }),
      )
    },
    '^brightAllDisplays$': () => {
      return Promise.allSettled(
        // TODO: ignore win API displays if enabled in settings
        displayManager.list.map(async (display) => {
          if (!await display.supportDDC()) return
          const brightnessPercentage = await display.getBrightnessPercentage(true)
          return display.setBrightnessPercentage(brightnessPercentage + 5)
            .then(vcpValue => {
              sendIpcDisplayUpdate([browserWindow, ...overlayWindowManager.browserWindows], {
                displayId: display.info.displayId,
                vcpFeature: VCPFeatures.ImageAdjustment.Luminance,
                vcpValue,
              })
            })
        }))
    },
    '^dimDisplay(.*)$': async (key, displayId) => {
      const display = displayManager.getDisplayById(displayId)

      if (!display || !await display.supportDDC()) return

      const brightnessPercentage = await display.getBrightnessPercentage(true)
      const vcpValue = await display.setBrightnessPercentage(brightnessPercentage - 5)

      sendIpcDisplayUpdate([browserWindow, ...overlayWindowManager.browserWindows], {
        displayId: display.info.displayId,
        vcpFeature: VCPFeatures.ImageAdjustment.Luminance,
        vcpValue,
      })
    },
    '^brightDisplay(.*)$': async (key, displayId) => {
      const display = displayManager.getDisplayById(displayId)

      if (!display || !await display.supportDDC()) return

      const brightnessPercentage = await display.getBrightnessPercentage(true)
      const vcpValue = await display.setBrightnessPercentage(brightnessPercentage + 5)

      sendIpcDisplayUpdate([browserWindow, ...overlayWindowManager.browserWindows], {
        displayId: display.info.displayId,
        vcpFeature: VCPFeatures.ImageAdjustment.Luminance,
        vcpValue,
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
          .then(result => {
            if (!result) return

            const failReasons = result
              .map(promiseResult => promiseResult.status === 'rejected' ? promiseResult.reason : undefined)
              .filter(reason => reason)

            if (failReasons.length) {
              console.error(`Error during execution of global shortcut handler: "${ key }" (${ accelerator }). Errors: ${ failReasons.join('; ') }`)
            }
          })
          .catch(error => {
            console.error(`Failed to execute global shortcut handler: "${ key }" (${ accelerator }). ${ (error as Error).message }`)
          })
      })

      if (!success) {
        console.error(`Failed to register global shortcut: "${ key }" (${ accelerator }). Keybinding already used by other applications`)
      }
    } catch (error) {
      console.error(`Failed to register global shortcut: "${ key }" (${ accelerator }). ${ (error as Error).message }`)
    }
  }
}
