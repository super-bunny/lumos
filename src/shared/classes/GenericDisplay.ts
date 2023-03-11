import VCPFeatures from '../../types/VCPFeatures'
import BackendClient from './BackendClient'
import NodeCache from 'node-cache'
import { Backends, Continuous, DisplayInfo, VCPValue, VcpValueType } from '../../types/EnhancedDDCDisplay'

export interface GetVcpValueOptions {
  useCache?: boolean
}

const cache = new NodeCache({ useClones: false })
const DISPLAY_LIST_CACHE_KEY = 'display-list'

export default class GenericDisplay {
  cache: Record<number | string, any> = {}

  constructor(public client: BackendClient, public info: DisplayInfo) {
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

  async getVcpValue(featureCode: number, options?: GetVcpValueOptions): Promise<VCPValue> {
    const { useCache = false } = options ?? {}

    const cachedValue = this.cache[featureCode]

    if (useCache && cachedValue) {
      return cachedValue as VCPValue
    }

    const value = await this.client.getVcpValue(this.info.displayId, featureCode)

    this.cache[featureCode] = value

    return value
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
    // const { useCache = true } = options ?? {}

    // if (useCache && cache.has(DISPLAY_LIST_CACHE_KEY)) {
    //   console.debug('List generic display - CACHE HIT')
    //   return cache.get(DISPLAY_LIST_CACHE_KEY) as Promise<Array<GenericDisplay>>
    // }

    console.debug('List generic display')
    const genericDisplayListPromise = client.list()
      .then(displayInfoList => {
        return displayInfoList.map(displayInfo => new GenericDisplay(client, displayInfo))
      })

    // cache.set(DISPLAY_LIST_CACHE_KEY, genericDisplayListPromise)

    return genericDisplayListPromise
  }

  static async fromId(
    client: BackendClient,
    displayId: string,
    options?: { useCache?: boolean },
  ): Promise<GenericDisplay | undefined> {
    const { useCache = true } = options ?? {}

    if (useCache && cache.has(DISPLAY_LIST_CACHE_KEY)) {
      console.debug('GenericDisplay.fromId - CACHE HIT')
      const displayList = await (cache.get(DISPLAY_LIST_CACHE_KEY) as Promise<Array<GenericDisplay>>)
      const display = displayList.find(display => display.info.displayId === displayId)

      return display ? new GenericDisplay(client, display.info) : undefined
    }

    console.debug('GenericDisplay.fromId')
    const displayList = await GenericDisplay.list(client, options)
    const display = displayList.find(display => display.info.displayId === displayId)

    return display ? new GenericDisplay(client, display.info) : undefined
  }

  static filterDuplicateDisplay(displayList: Array<GenericDisplay>): Array<GenericDisplay> {
    const backendList = displayList.map(display => display.info.backend)

    // If nvapi backend is detected filter out all other backend to avoid duplicate monitors
    if (backendList.includes(Backends.NV_API)) {
      return displayList.filter(display => display.info.backend === Backends.NV_API)
    }

    return displayList
  }
}