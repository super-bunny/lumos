import { app, BrowserWindow, globalShortcut, ipcMain, screen } from 'electron'
import GenericDisplayManager from './classes/GenericDisplayManager'
import SettingsType from '../types/Settings'
import { IpcEvents } from '../types/Ipc'
import SettingsStore, { defaultSettings } from './classes/SettingsStore'
import setupAutoStartup from './utils/setupAutoStartup'
import autoShutdownMonitors from './utils/autoShutdownMonitors'
import OverlayWindowManager from './classes/OverlayWindowManager'
import AutoUpdater from './classes/AutoUpdater'

export interface SetupIpcArgs {
  displayManager: GenericDisplayManager
  sessionJwt: string
  httpApiPort: number
  onRegisterGlobalShortcuts: () => void
  onOpenDevTools: () => void
}

const settingsStore = new SettingsStore()

export default function setupIpc({
  displayManager,
  sessionJwt,
  httpApiPort,
  onRegisterGlobalShortcuts,
  onOpenDevTools,
}: SetupIpcArgs): void {
  ipcMain.on(IpcEvents.GET_USER_DATA_PATH_SYNC, event => {
    event.returnValue = app.getPath('userData')
  })

  ipcMain.handle(IpcEvents.LIST_DISPLAYS, async (_, useCache?: boolean) => {
    if (!useCache) await displayManager.refresh()
    return displayManager.list.map(display => display.info)
  })
  ipcMain.handle(IpcEvents.SUPPORT_DDC, (_, id: string, useCache?: boolean) => {
    const display = displayManager.getDisplayByIdOrThrow(id)
    return useCache
      ? display.supportDDC()
      : display.noCache().supportDDC()
  })
  ipcMain.handle(IpcEvents.GET_VCP_VALUE, (_, id: string, featureCode: number, useCache?: boolean) => {
    const display = displayManager.getDisplayByIdOrThrow(id)
    return useCache
      ? display.getVcpValue(featureCode)
      : display.noCache().getVcpValue(featureCode)
  })
  ipcMain.handle(IpcEvents.SET_VCP_VALUE, (_, id: string, featureCode: number, value: number) => {
    return displayManager.getDisplayByIdOrThrow(id).setVcpValue(featureCode, value)
  })

  ipcMain.handle(IpcEvents.GET_SETTINGS, () => {
    return {
      settings: settingsStore.store,
      path: settingsStore.path,
    }
  })
  ipcMain.handle(IpcEvents.SET_SETTINGS, (event, settings: SettingsType) => {
    settingsStore.set(settings)

    if (settingsStore.store.runAppOnStartup !== settings.runAppOnStartup) {
      setupAutoStartup(settings.runAppOnStartup ?? defaultSettings.runAppOnStartup)
    }

    // Send settings update to all windows except the sender
    const senderBrowserWindow = BrowserWindow.fromWebContents(event.sender)
    BrowserWindow.getAllWindows()
      .filter(window => window.id !== senderBrowserWindow?.id)
      .forEach(window => {
        window.webContents.send(IpcEvents.SETTINGS_UPDATE)
      })
  })

  ipcMain.handle(IpcEvents.GET_NODE_ENV, () => ({
    MOCK_DISPLAYS: process.env.MOCK_DISPLAYS,
  }))

  ipcMain.handle(IpcEvents.GET_SESSION_JWT, () => sessionJwt)
  ipcMain.handle(IpcEvents.GET_HTTP_API_CONFIG, () => ({
    httpApiPort,
  }))
  // App
  ipcMain.handle(IpcEvents.RESTART_APP, () => {
    app.relaunch()
    app.quit()
  })
  ipcMain.handle(IpcEvents.REGISTER_ALL_SHORTCUTS, () => {
    globalShortcut.unregisterAll()
    onRegisterGlobalShortcuts()
  })
  ipcMain.handle(IpcEvents.UNREGISTER_ALL_SHORTCUTS, () => {
    globalShortcut.unregisterAll()
  })
  ipcMain.handle(IpcEvents.SET_WINDOWS_VISIBILITY, (event, show: boolean) => {
    const webContents = event.sender
    const browserWindow = BrowserWindow.fromWebContents(webContents)
    if (browserWindow) {
      show ? browserWindow.show() : browserWindow.hide()
    } else {
      console.error('IpcEvents SET_WINDOWS_VISIBILITY. Could not find browser window for webContents', webContents)
    }
  })
  ipcMain.handle(IpcEvents.SET_OVERLAY_WINDOWS_VISIBILITY, (event, show: boolean) => {
    const webContents = event.sender
    const browserWindow = BrowserWindow.fromWebContents(webContents)
    if (browserWindow) {
      show ? OverlayWindowManager.showWindow(browserWindow) : OverlayWindowManager.hideWindow(browserWindow)
    } else {
      console.error(
        'IpcEvents SET_OVERLAY_WINDOWS_VISIBILITY. Could not find browser window for webContents',
        webContents,
      )
    }
  })
  ipcMain.handle(IpcEvents.FORCE_TRIGGER_AUTO_MONITORS_POWER_OFF, () => {
    return autoShutdownMonitors(settingsStore, displayManager)
  })
  ipcMain.handle(IpcEvents.OPEN_DEV_TOOLS, () => {
    return onOpenDevTools()
  })
  ipcMain.handle(IpcEvents.GET_ELECTRON_DISPLAYS, () => {
    return screen.getAllDisplays()
  })
  ipcMain.handle(IpcEvents.QUID_AND_INSTALL_UPDATE, () => {
    return AutoUpdater.quitAndInstall()
  })
}
