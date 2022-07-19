import { contextBridge, ipcRenderer, shell } from 'electron'
import { IpcEvents } from './contextBridge'
import { VCPValue } from 'ddc-rs'
import { DisplayInfo } from './classes/AbstractDisplay'
import ElectronStore from 'electron-store'
import Settings from '../types/Settings'

export type StoreOptions = Pick<ElectronStore.Options<Settings>, 'name'>

contextBridge.exposeInMainWorld('lumos', {
  display: {
    getVcpValue: (id: string, featureCode: number): Promise<VCPValue> => {
      return ipcRenderer.invoke(IpcEvents.GET_VCP_VALUE, id, featureCode)
    },
    setVcpValue: (id: string, featureCode: number, value: number): Promise<void> => {
      return ipcRenderer.invoke(IpcEvents.SET_VCP_VALUE, id, featureCode, value)
    },
    supportDDC: (id: string): Promise<boolean> => {
      return ipcRenderer.invoke(IpcEvents.SUPPORT_DDC, id)
    },
    list: (): Promise<Array<DisplayInfo>> => ipcRenderer.invoke(IpcEvents.LIST_DISPLAYS),
  },
  store: {
    get: (options?: StoreOptions): Promise<{ store: Settings, path: string }> => ipcRenderer.invoke(IpcEvents.GET_STORE, options),
    set: (
      data: any,
      options?: StoreOptions,
    ): Promise<void> => ipcRenderer.invoke(IpcEvents.SET_STORE_DATA, data, options),
  },
  getEnv: (): Promise<Record<string, string>> => ipcRenderer.invoke(IpcEvents.GET_NODE_ENV),
  showItemInFolder: (path: string) => shell.showItemInFolder(path),
  openInBrowser: (url: string) => shell.openExternal(url),
})
