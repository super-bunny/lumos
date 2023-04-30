import { contextBridge, ipcRenderer, shell } from 'electron'
import SettingsType from '../types/Settings'
import { IpcEvents } from '../types/Ipc'
import SettingsStore from './classes/SettingsStore'
import { envVarAllowSentry } from '../shared/utils/sentry'
import type { GetVcpValueOptions } from '../shared/classes/GenericDisplay'
import { DisplayInfo, VCPValue } from '../types/EnhancedDDCDisplay'

export type IpcWrappedListener = (event: Electron.IpcRendererEvent, ...args: Array<any>) => void

const settings = new SettingsStore()
const env = {
  MOCK_DISPLAYS: process.env.MOCK_DISPLAYS,
  NODE_ENV: process.env.NODE_ENV,
  ROUTER_INITIAL_ENTRY: process.env.ROUTER_INITIAL_ENTRY,
}
const sentryEnabled = envVarAllowSentry()
const validListenableIpcChannels = [IpcEvents.PING, IpcEvents.DISPLAY_UPDATE]

export const LumosApi = {
  display: {
    getVcpValue: (id: string, featureCode: number, options?: GetVcpValueOptions): Promise<VCPValue> => {
      return ipcRenderer.invoke(IpcEvents.GET_VCP_VALUE, id, featureCode, options)
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
  ipc: {
    on: (channel: IpcEvents, listener: (...args: Array<any>) => void): IpcWrappedListener => {
      if (!validListenableIpcChannels.includes(channel)) {
        throw new Error(`Invalid channel: ${ channel }`)
      }
      // Deliberately strip event as it includes `sender`
      const listenerWrapper: IpcWrappedListener = (event, ...args) => listener(...args)
      ipcRenderer.on(channel, listenerWrapper)
      return listenerWrapper
    },
    removeListener: (channel: IpcEvents, listener: (...args: Array<any>) => void) => {
      if (!validListenableIpcChannels.includes(channel)) {
        throw new Error(`Invalid channel: ${ channel }`)
      }
      ipcRenderer.removeListener(channel, listener)
    },
  },
  initTheme: settings.store.theme,
  initSettings: settings.store,
  getEnv: (): Promise<Record<string, string>> => ipcRenderer.invoke(IpcEvents.GET_NODE_ENV),
  showItemInFolder: (path: string) => shell.showItemInFolder(path),
  openInBrowser: (url: string) => shell.openExternal(url),
  sessionJwt: (): Promise<string> => ipcRenderer.invoke(IpcEvents.GET_SESSION_JWT),
  getHttpApiConfig: (): Promise<{ httpApiPort: number }> => ipcRenderer.invoke(IpcEvents.GET_HTTP_API_CONFIG),
  env,
  sentryEnabled,
  restartApp: () => ipcRenderer.invoke(IpcEvents.RESTART_APP),
  registerAllShortcuts: () => ipcRenderer.invoke(IpcEvents.REGISTER_ALL_SHORTCUTS),
  unregisterAllShortcuts: () => ipcRenderer.invoke(IpcEvents.UNREGISTER_ALL_SHORTCUTS),
  forceTriggerAutoMonitorsPowerOff: () => ipcRenderer.invoke(IpcEvents.FORCE_TRIGGER_AUTO_MONITORS_POWER_OFF),
  openDevTools: () => ipcRenderer.invoke(IpcEvents.OPEN_DEV_TOOLS),
  getElectronDisplays: (): Promise<Array<Electron.Display>> => ipcRenderer.invoke(IpcEvents.GET_ELECTRON_DISPLAYS),
  ipcRenderer,
}

contextBridge.exposeInMainWorld('lumos', LumosApi)
