import { Continuous, DisplayInfo, VCPValue, VCPValueType } from '../../main/classes/AbstractDisplay'
import VCPFeatures from '../../types/VCPFeatures'

export default class Display {
  cache: Record<number, VCPValue | undefined> = {}

  constructor(public info: DisplayInfo) {
  }

  async supportDDC(): Promise<boolean> {
    return window.lumos.display.supportDDC(this.info.displayId)
  }

  getDisplayName(): string {
    return this.info.modelName ?? this.info.displayId
  }

  async getVcpValue(featureCode: number): Promise<VCPValue> {
    return window.lumos.display.getVcpValue(this.info.displayId, featureCode)
  }

  async setVcpValue(featureCode: number, value: number): Promise<void> {
    return window.lumos.display.setVcpValue(this.info.displayId, featureCode, value)
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

  static async list(): Promise<Array<Display>> {
    const displayInfoList = await window.lumos.display.list()

    return displayInfoList.map(displayInfo => new Display(displayInfo))
  }
}
