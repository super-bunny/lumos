import { contextBridge, ipcRenderer, shell } from 'electron'
import { VCPValue } from 'ddc-rs'
import { DisplayInfo } from './classes/AbstractDisplay'
import ElectronStore from 'electron-store'
import Settings from '../types/Settings'
import SettingsType from '../types/Settings'
import { IpcEvents } from '../types/Ipc'
import SettingsStore from './classes/SettingsStore'

export type StoreOptions = Pick<ElectronStore.Options<Settings>, 'name'>

const settings = new SettingsStore()
const env = {
  MOCK_DISPLAYS: process.env.MOCK_DISPLAYS,
}

export const LumosApi = {
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
    getSettings: (): Promise<{ settings: SettingsType, path: string }> => ipcRenderer.invoke(IpcEvents.GET_SETTINGS),
    setSettings: (
      settings: SettingsType,
    ): Promise<void> => ipcRenderer.invoke(IpcEvents.SET_SETTINGS, settings),
  },
  initTheme: settings.store.theme,
  initSettings: settings.store,
  getEnv: (): Promise<Record<string, string>> => ipcRenderer.invoke(IpcEvents.GET_NODE_ENV),
  showItemInFolder: (path: string) => shell.showItemInFolder(path),
  openInBrowser: (url: string) => shell.openExternal(url),
  sessionJwt: (): Promise<string> => ipcRenderer.invoke(IpcEvents.GET_SESSION_JWT),
  getHttpApiConfig: (): Promise<{ httpApiPort: number }> => ipcRenderer.invoke(IpcEvents.GET_HTTP_API_CONFIG),
  env,
  restartApp: () => ipcRenderer.invoke(IpcEvents.RESTART_APP),
}

contextBridge.exposeInMainWorld('lumos', LumosApi)
