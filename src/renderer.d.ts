import { VCPValue } from 'ddc-rs'
import { DisplayInfo } from './main/classes/AbstractDisplay'
import Settings from './types/Settings'
import { StoreOptions } from './main/preload'

export interface LumosApi {
  display: {
    getVcpValue: (id: string, featureCode: number) => Promise<VCPValue>
    setVcpValue: (id: string, featureCode: number, value: number) => Promise<void>
    supportDDC: (id: string) => Promise<boolean>
    list: () => Promise<Array<DisplayInfo>>
  }

  store: {
    get: (options?: StoreOptions) => Promise<{ store: Settings, path: string }>
    set: (
      data: any,
      options?: StoreOptions,
    ) => Promise<void>
  }

  getEnv: () => Promise<Record<string, string>>
  showItemInFolder: (path: string) => void
  openInBrowser: (url: string) => void
}

declare global {
  interface Window {
    lumos: LumosApi
  }
}
