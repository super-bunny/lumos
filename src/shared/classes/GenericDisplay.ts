import VCPFeatures, { PowerMode } from '../../types/VCPFeatures'
import BackendClient from './BackendClient'
import { Continuous, DisplayInfo, VCPValue, VcpValueType } from '../../types/EnhancedDDCDisplay'

export interface GetVcpValueOptions {
  useCache?: boolean
}

export default class GenericDisplay {
  cache: Record<number | string, any> = {}

  alias: string | null = null

  constructor(public client: BackendClient, public info: DisplayInfo) {
  }

  clearCache(): void {
    this.cache = {}
  }

  getDisplayName(): string {
    return this.alias ?? this.info.modelName ?? this.info.displayId
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

  async getLuminance(useCache?: boolean): Promise<Continuous> {
    const value = await this.getVcpValueFromCache(VCPFeatures.ImageAdjustment.Luminance, useCache)

    if (value.type !== VcpValueType.Continuous) {
      throw new Error('VCP Luminance (brightness) value type not supported')
    }

    return value
  }

  async setLuminance(value: number): Promise<void> {
    console.debug(`[GENERIC DISPLAY ${ this.info.displayId }] Set VCP Luminance: ${ value }`)
    return this.setVcpValue(VCPFeatures.ImageAdjustment.Luminance, value)
  }

  async getBrightnessPercentage(useCache?: boolean): Promise<number> {
    const { currentValue, maximumValue } = await this.getLuminance(useCache)

    return Math.round(currentValue * 100 / maximumValue)
  }

  async setBrightnessPercentage(value: number): Promise<Continuous> {
    const { type, maximumValue } = await this.getLuminance(true)
    const rangedValue = Math.min(Math.max(value, 0), 100)
    const brightnessValue = Math.round(rangedValue * maximumValue / 100)

    await this.setLuminance(brightnessValue)

    return { type, maximumValue, currentValue: brightnessValue }
  }

  async getPowerMode(): Promise<PowerMode> {
    const value = await this.getVcpValue(VCPFeatures.DisplayControl.PowerMode)

    if (value.type !== VcpValueType.NonContinuous && value.type !== VcpValueType.Continuous) {
      throw new Error('VCP Power mode value type not supported')
    }

    return value.currentValue
  }

  async setPowerMode(powerMode: PowerMode): Promise<void> {
    console.debug(`[GENERIC DISPLAY ${ this.info.displayId }] Set VCP Power mode: ${ powerMode }`)
    return this.setVcpValue(VCPFeatures.DisplayControl.PowerMode, powerMode)
  }

  static async list(client: BackendClient): Promise<Array<GenericDisplay>> {
    return client.list()
      .then(displayInfoList => {
        return displayInfoList.map(displayInfo => new GenericDisplay(client, displayInfo))
      })
  }

  static async fromId(
    client: BackendClient,
    displayId: string,
  ): Promise<GenericDisplay | undefined> {
    const displayList = await GenericDisplay.list(client)
    return displayList.find(display => display.info.displayId === displayId)
  }
}
