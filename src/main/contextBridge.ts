import { ipcMain } from 'electron'
import DisplayManager from './classes/DisplayManager'
import ElectronStore from 'electron-store'
import Settings from '../types/Settings'
import { IpcEvents } from '../types/Ipc'

export interface SetupIpcArgs {
  displayManager: DisplayManager
  sessionJwt: string
  httpApiPort: number
}

export default function setupIpc({ displayManager, sessionJwt, httpApiPort }: SetupIpcArgs): void {
  ipcMain.handle(IpcEvents.LIST_DISPLAYS, () => {
    displayManager.refresh()
    return displayManager.list.map(display => display.info)
  })
  ipcMain.handle(IpcEvents.SUPPORT_DDC, (event, id: string) => {
    return displayManager.supportDDCById(id)
  })
  ipcMain.handle(IpcEvents.GET_VCP_VALUE, (event, id: string, featureCode: number) => {
    return displayManager.getVcpValueById(id, featureCode)
  })
  ipcMain.handle(IpcEvents.SET_VCP_VALUE, (event, id: string, featureCode: number, value: number) => {
    return displayManager.setVcpValueById(id, featureCode, value)
  })

  ipcMain.handle(IpcEvents.GET_STORE, (event, options) => {
    const store = new ElectronStore<Settings>(options)
    return {
      store: store.store,
      path: store.path,
    }
  })
  ipcMain.handle(IpcEvents.SET_STORE_DATA, (event, data, options) => {
    const store = new ElectronStore<Settings>(options)
    store.set(data)
  })


  ipcMain.handle(IpcEvents.GET_NODE_ENV, () => ({
    MOCK_DISPLAYS: process.env.MOCK_DISPLAYS,
  }))

  ipcMain.handle(IpcEvents.GET_SESSION_JWT, () => sessionJwt)
  ipcMain.handle(IpcEvents.GET_HTTP_API_CONFIG, () => ({
    httpApiPort,
  }))
}