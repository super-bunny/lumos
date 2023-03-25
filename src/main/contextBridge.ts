import { app, BrowserWindow, globalShortcut, ipcMain } from 'electron'
import GenericDisplayManager from './classes/GenericDisplayManager'
import SettingsType from '../types/Settings'
import { IpcEvents } from '../types/Ipc'
import SettingsStore, { defaultSettings } from './classes/SettingsStore'
import setupAutoStartup from './utils/setupAutoStartup'
import { GetVcpValueOptions } from '../shared/classes/GenericDisplay'
import autoShutdownMonitors from './utils/autoShutdownMonitors'

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

  ipcMain.handle(IpcEvents.LIST_DISPLAYS, async () => {
    await displayManager.refresh()
    return displayManager.list.map(display => display.info)
  })
  ipcMain.handle(IpcEvents.SUPPORT_DDC, (event, id: string) => {
    return displayManager.getDisplayByIdOrThrow(id).supportDDC()
  })
  ipcMain.handle(IpcEvents.GET_VCP_VALUE, (event, id: string, featureCode: number, options?: GetVcpValueOptions) => {
    return displayManager.getDisplayByIdOrThrow(id).getVcpValue(featureCode, options)
  })
  ipcMain.handle(IpcEvents.SET_VCP_VALUE, (event, id: string, featureCode: number, value: number) => {
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
    setupAutoStartup(settings.runAppOnStartup ?? defaultSettings.runAppOnStartup)
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
  ipcMain.handle(IpcEvents.FORCE_TRIGGER_AUTO_MONITORS_POWER_OFF, () => {
    return autoShutdownMonitors(settingsStore, displayManager)
  })
  ipcMain.handle(IpcEvents.OPEN_DEV_TOOLS, () => {
    return onOpenDevTools()
  })
}
