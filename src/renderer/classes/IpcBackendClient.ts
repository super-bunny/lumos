import BackendClient from '../../shared/classes/BackendClient'
import { DisplayInfo, VCPValue } from '../../main/classes/AbstractDisplay'

export default class IpcBackendClient extends BackendClient {
  async supportDDC(id: string): Promise<boolean> {
    return window.lumos.display.supportDDC(id)
  }

  async getVcpValue(id: string, featureCode: number): Promise<VCPValue> {
    return window.lumos.display.getVcpValue(id, featureCode, { useCache: false })
  }

  async setVcpValue(id: string, featureCode: number, value: number): Promise<void> {
    return window.lumos.display.setVcpValue(id, featureCode, value)
  }

  async list(): Promise<Array<DisplayInfo>> {
    return window.lumos.display.list()
  }
}