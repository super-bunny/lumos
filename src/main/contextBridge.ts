import { app, globalShortcut, ipcMain } from 'electron'
import DisplayManager from './classes/DisplayManager'
import SettingsType from '../types/Settings'
import { IpcEvents } from '../types/Ipc'
import SettingsStore, { defaultSettings } from './classes/SettingsStore'
import setupAutoStartup from './utils/setupAutoStartup'
import { GetVcpValueOptions } from './classes/EnhancedDisplay'

export interface SetupIpcArgs {
  displayManager: DisplayManager
  sessionJwt: string
  httpApiPort: number
  onRegisterGlobalShortcuts: () => void
}

const settingsStore = new SettingsStore()

export default function setupIpc({
  displayManager,
  sessionJwt,
  httpApiPort,
  onRegisterGlobalShortcuts,
}: SetupIpcArgs): void {
  ipcMain.on(IpcEvents.GET_USER_DATA_PATH_SYNC, event => {
    event.returnValue = app.getPath('userData')
  })

  ipcMain.handle(IpcEvents.LIST_DISPLAYS, async () => {
    await displayManager.refresh()
    return displayManager.list.map(display => display.info)
  })
  ipcMain.handle(IpcEvents.SUPPORT_DDC, (event, id: string) => {
    return displayManager.supportDDCById(id)
  })
  ipcMain.handle(IpcEvents.GET_VCP_VALUE, (event, id: string, featureCode: number, options?: GetVcpValueOptions) => {
    return displayManager.getVcpValueById(id, featureCode, options)
  })
  ipcMain.handle(IpcEvents.SET_VCP_VALUE, (event, id: string, featureCode: number, value: number) => {
    return displayManager.setVcpValueById(id, featureCode, value)
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
}
