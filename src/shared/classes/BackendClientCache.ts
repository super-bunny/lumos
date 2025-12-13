import { VCPValue, VcpValueType } from '../../types/EnhancedDDCDisplay'

export type CacheDisplayData = Record<number | string, any>
export type CacheData = Record<string, CacheDisplayData>

export default class BackendClientCache {
  constructor(public data: CacheData = {}) {
  }

  reset(): void {
    this.data = {}
  }

  display(id: string): CacheDisplayData {
    if (!this.data[id]) this.data[id] = {}
    return this.data[id]
  }

  // TODO: support table type vcp values
  setValue(displayId: string, featureCode: number, value: number): boolean {
    const displayCache = this.display(displayId)
    const cachedValue: VCPValue | undefined = displayCache[featureCode]

    if (!cachedValue) return false

    try {
      switch (cachedValue.type) {
        case VcpValueType.Continuous:
        case VcpValueType.NonContinuous:
          cachedValue.currentValue = value
          return true
        default:
          return false
      }
    } catch (error) {
      console.error('Fail to set cache value: ', error)
      return false
    }
  }
}