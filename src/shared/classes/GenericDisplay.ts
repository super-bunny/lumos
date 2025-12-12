import VCPFeatures, { PowerMode } from '../../types/VCPFeatures'
import BackendClient from './BackendClient'
import { Continuous, DisplayInfo, VCPValue, VcpValueType } from '../../types/EnhancedDDCDisplay'

export interface GetVcpValueOptions {
  useCache?: boolean
}

export default class GenericDisplay {
  alias: string | null = null

  constructor(public client: BackendClient, public info: DisplayInfo) {
  }

  /**
   * Return a new instance with a cloned {@link client} without cache. If no cache, return itself
   */
  noCache(): GenericDisplay {
    // if the client does not have cache, return itself
    if (!this.client.cache) return this

    return new GenericDisplay(this.client.clone().destroyCache(), this.info)
  }

  getDisplayName(): string {
    return this.alias ?? this.info.modelName ?? this.info.displayId
  }

  async supportDDC(): Promise<boolean> {
    return this.client.supportDDC(this.info.displayId)
  }

  async getVcpValue(featureCode: number): Promise<VCPValue> {
    return await this.client.getVcpValue(this.info.displayId, featureCode)
  }

  async setVcpValue(featureCode: number, value: number): Promise<void> {
    return this.client.setVcpValue(this.info.displayId, featureCode, value)
  }

  async getVcpValueFromCache(featureCode: number): Promise<VCPValue> {
    return this.getVcpValue(featureCode)
  }

  async getVcpVersion() {
    const value = await this.getVcpValue(VCPFeatures.DisplayControl.Version)

    if (value.type !== VcpValueType.Continuous) {
      throw new Error('VCP Version value type not supported')
    }

    return {
      version: value.currentValue >> 8, // High-order byte of value is the version
      revision: value.currentValue & 0xFF, // Low-order byte of value is the revision
      rawValue: value.currentValue,
    }
  }

  async getLuminance(useCache?: boolean): Promise<Continuous> {
    const value = await this.getVcpValueFromCache(VCPFeatures.ImageAdjustment.Luminance)

    if (value.type !== VcpValueType.Continuous) {
      throw new Error('VCP Luminance (brightness) value type is not supported')
    }

    return value
  }

  async setLuminance(value: number): Promise<void> {
    console.debug(`[GENERIC DISPLAY ${ this.info.displayId }] Set VCP Luminance: ${ value }`)
    return this.setVcpValue(VCPFeatures.ImageAdjustment.Luminance, value)
  }

  async getBrightnessPercentage(): Promise<number> {
    const { currentValue, maximumValue } = await this.getLuminance()

    return Math.round(currentValue * 100 / maximumValue)
  }

  async setBrightnessPercentage(value: number): Promise<Continuous> {
    const { type, maximumValue } = await this.getLuminance(true)
    const rangedValue = Math.min(Math.max(value, 0), 100)
    const brightnessValue = Math.round(rangedValue * maximumValue / 100)

    await this.setLuminance(brightnessValue)

    return { type, maximumValue, currentValue: brightnessValue }
  }

  async setRelativeBrightnessPercentage(relativeValue: number, useCache: boolean = true): Promise<Continuous> {
    const { type, maximumValue, currentValue } = await this.getLuminance(useCache)
    const currentPercentage = Math.round(currentValue * 100 / maximumValue)
    const rangedRelativePercentage = Math.min(Math.max(relativeValue, -100), 100)
    const newPercentage = currentPercentage + rangedRelativePercentage
    const brightnessValue = Math.round(newPercentage * maximumValue / 100)

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
