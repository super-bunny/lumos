import BackendClient from '../../shared/classes/BackendClient'
import { DisplayInfo, VCPValue } from '../../types/EnhancedDDCDisplay'

export default class IpcBackendClient extends BackendClient {
  constructor(withCache = true) {
    super()
    if (withCache) this.resetCache()
  }

  clone(): IpcBackendClient {
    return new IpcBackendClient()
  }

  // This method never uses cache
  async supportDDC(id: string): Promise<boolean> {
    return window.lumos.display.supportDDC(id, this.hasCache())
  }

  async getVcpValue(id: string, featureCode: number): Promise<VCPValue> {
    return window.lumos.display.getVcpValue(id, featureCode, this.hasCache())
  }

  async setVcpValue(id: string, featureCode: number, value: number): Promise<void> {
    return window.lumos.display.setVcpValue(id, featureCode, value)
  }

  async list(): Promise<Array<DisplayInfo>> {
    return window.lumos.display.list(this.hasCache())
  }
}