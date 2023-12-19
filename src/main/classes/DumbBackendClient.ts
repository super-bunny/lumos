import BackendClient from '../../shared/classes/BackendClient'
import { DisplayInfo, VCPValue } from '../../types/EnhancedDDCDisplay'

export default class DumbBackendClient extends BackendClient {
  getVcpValue(id: string, featureCode: number): Promise<VCPValue> {
    throw new Error('DumbBackendClient must not be used')
  }

  list(): Promise<Array<DisplayInfo>> {
    throw new Error('DumbBackendClient must not be used')
  }

  setVcpValue(id: string, featureCode: number, value: number): Promise<void> {
    throw new Error('DumbBackendClient must not be used')
  }

  supportDDC(id: string): Promise<boolean> {
    throw new Error('DumbBackendClient must not be used')
  }

}