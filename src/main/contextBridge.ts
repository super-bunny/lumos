import { ipcMain } from 'electron'
import DisplayManager from './classes/DisplayManager'
import ElectronStore from 'electron-store'
import Settings from '../types/Settings'

export enum IpcEvents {
  LIST_DISPLAYS = 'LIST_DISPLAYS',
  SUPPORT_DDC = 'SUPPORT_DDC',
  GET_VCP_VALUE = 'GET_VCP_VALUE',
  SET_VCP_VALUE = 'SET_VCP_VALUE',
  // Store
  GET_STORE = 'GET_STORE',
  SET_STORE_DATA = 'SET_STORE_DATA',
  // Node
  GET_NODE_ENV = 'GET_NODE_ENV',
}

export default function setupIpc(displayManager: DisplayManager): void {
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
}
