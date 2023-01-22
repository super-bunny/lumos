import { DisplayInfo, VCPValue, VcpValueType, Continuous } from '../../main/classes/AbstractDisplay'
import VCPFeatures from '../../types/VCPFeatures'
import BackendClient from '../../shared/classes/BackendClient'
import NodeCache from 'node-cache'

const cache = new NodeCache({ useClones: false })
const DISPLAY_LIST_CACHE_KEY = 'display-list'

export default class GenericDisplay {
  cache: Record<number | string, any> = {}

  protected constructor(public client: BackendClient, public info: DisplayInfo) {
  }

  getDisplayName(): string {
    return this.info.modelName ?? this.info.displayId
  }

  async supportDDC(useCache: boolean = true): Promise<boolean> {
    const cachedValue = this.cache['supportDDC']

    if (useCache && cachedValue) {
      console.debug(`[GENERIC DISPLAY ${ this.info.displayId }] Support DDC - CACHE HIT`)
      return cachedValue
    }

    const supportDDCPromise = this.client.supportDDC(this.info.displayId)

    this.cache['supportDDC'] = supportDDCPromise

    return supportDDCPromise
  }

  async getVcpValue(featureCode: number): Promise<VCPValue> {
    return this.client.getVcpValue(this.info.displayId, featureCode)
  }

  async setVcpValue(featureCode: number, value: number): Promise<void> {
    return this.client.setVcpValue(this.info.displayId, featureCode, value)
  }

  async getVcpValueFromCache(featureCode: number, useCache: boolean = true): Promise<VCPValue> {
    const cachedValue = this.cache[featureCode]

    if (useCache && cachedValue) {
      console.debug(`[GENERIC DISPLAY ${ this.info.displayId }] Get VCP feature: ${ featureCode } - CACHE HIT`)
      return cachedValue
    }

    const value = await this.getVcpValue(featureCode)

    this.cache[featureCode] = value

    return value
  }

  async getVcpVersion() {
    const value = await this.getVcpValue(VCPFeatures.DisplayControl.Version)

    if (value.type !== VcpValueType.Continuous) {
      throw new Error('VCP Version value type not supported')
    }

    return {
      version: value.currentValue >> 8, // High order byte of value is the version
      revision: value.currentValue & 0xFF, // Low order byte of value is the revision
      rawValue: value.currentValue,
    }
  }

  async getVcpLuminance(useCache?: boolean): Promise<Continuous> {
    const value = await this.getVcpValueFromCache(VCPFeatures.ImageAdjustment.Luminance, useCache)

    if (value.type !== VcpValueType.Continuous) {
      throw new Error('VCP Luminance (brightness) value type not supported')
    }

    return value
  }

  async getBrightnessPercentage(useCache?: boolean): Promise<number> {
    const { currentValue, maximumValue } = await this.getVcpLuminance(useCache)

    return Math.round(currentValue * 100 / maximumValue)
  }

  async setBrightnessPercentage(value: number): Promise<void> {
    const { maximumValue } = await this.getVcpLuminance(true)

    return this.setVcpValue(VCPFeatures.ImageAdjustment.Luminance, Math.round(value * maximumValue / 100))
  }

  clearCache(): void {
    this.cache = {}
  }

  static async list(client: BackendClient, options?: { useCache?: boolean }): Promise<Array<GenericDisplay>> {
    const { useCache = true } = options ?? {}

    if (useCache && cache.has(DISPLAY_LIST_CACHE_KEY)) {
      console.debug('List generic display - CACHE HIT')
      return cache.get(DISPLAY_LIST_CACHE_KEY) as Promise<Array<GenericDisplay>>
    }

    console.debug('List generic display')
    const genericDisplayListPromise = await client.list()
      .then(displayInfoList => {
        return displayInfoList.map(displayInfo => new GenericDisplay(client, displayInfo))
      })

    cache.set(DISPLAY_LIST_CACHE_KEY, genericDisplayListPromise)

    return genericDisplayListPromise
  }
}
