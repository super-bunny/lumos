import { DisplayInfo, VCPValue } from '../../types/EnhancedDDCDisplay'
import BackendClientCache from './BackendClientCache'

export default abstract class BackendClient {
  cache: BackendClientCache | null = null

  hasCache(): boolean {
    return this.cache !== null
  }

  // Reset/init cache
  public resetCache(): this {
    this.cache = new BackendClientCache()
    return this
  }

  public destroyCache(): this {
    this.cache = null
    return this
  }

  abstract supportDDC(id: string): Promise<boolean>

  abstract getVcpValue(id: string, featureCode: number): Promise<VCPValue>

  abstract setVcpValue(id: string, featureCode: number, value: number): Promise<void>

  abstract list(): Promise<Array<DisplayInfo>>

  abstract clone(): BackendClient
}