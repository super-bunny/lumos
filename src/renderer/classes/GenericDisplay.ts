import { Continuous, DisplayInfo, VCPValue, VCPValueType } from '../../main/classes/AbstractDisplay'
import VCPFeatures from '../../types/VCPFeatures'
import BackendClient from '../../shared/classes/BackendClient'

export default class GenericDisplay {
  cache: Record<number, VCPValue | undefined> = {}

  protected constructor(public client: BackendClient, public info: DisplayInfo) {
  }

  getDisplayName(): string {
    return this.info.modelName ?? this.info.displayId
  }

  async supportDDC(): Promise<boolean> {
    return this.client.supportDDC(this.info.displayId)
  }

  async getVcpValue(featureCode: number): Promise<VCPValue> {
    return this.client.getVcpValue(this.info.displayId, featureCode)
  }

  async setVcpValue(featureCode: number, value: number): Promise<void> {
    return this.client.setVcpValue(this.info.displayId, featureCode, value)
  }

  async getVcpValueFromCache(featureCode: number, forceRefresh = false): Promise<VCPValue> {
    const cachedValue = this.cache[featureCode]

    if (cachedValue && !forceRefresh) {
      return cachedValue
    }

    const value = await this.getVcpValue(featureCode)

    this.cache[featureCode] = value

    return value
  }

  async getVcpLuminance(useCache = false): Promise<Continuous> {
    const value = await this.getVcpValueFromCache(VCPFeatures.ImageAdjustment.Luminance, !useCache)

    if (value.type !== VCPValueType.CONTINUOUS) {
      throw new Error('VCP Luminance (brightness) value type not supported')
    }

    return value
  }

  async getBrightnessPercentage(): Promise<number> {
    const { currentValue, maximumValue } = await this.getVcpLuminance()

    return Math.round(currentValue * 100 / maximumValue)
  }

  async setBrightnessPercentage(value: number): Promise<void> {
    const { maximumValue } = await this.getVcpLuminance(true)

    return this.setVcpValue(VCPFeatures.ImageAdjustment.Luminance, Math.round(value * maximumValue / 100))
  }

  clearCache(): void {
    this.cache = {}
  }

  static async list(client: BackendClient): Promise<Array<GenericDisplay>> {
    const displayInfoList = await client.list()

    return displayInfoList.map(displayInfo => new GenericDisplay(client, displayInfo))
  }
}
