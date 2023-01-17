import { Display, DisplayManager, VCPFeatureCode } from '@ddc-node/ddc-node'
import AbstractDisplay, { DisplayInfo, VCPValue, Continuous, VcpValueType } from './AbstractDisplay'

export interface GetVcpValueOptions {
  useCache?: boolean
}

export default class EnhancedDisplay extends AbstractDisplay {
  cache: Record<number | string, VCPValue | boolean> = {}

  constructor(readonly display: Display) {
    super()
  }

  get info(): DisplayInfo {
    return {
      index: this.display.index,
      backend: this.display.backend,
      edidData: this.display.edidData,
      version: this.display.version,
      mccsVersion: this.display.mccsVersion,
      displayId: this.display.displayId,
      serial: this.display.serial,
      serialNumber: this.display.serialNumber,
      modelId: this.display.modelId,
      modelName: this.display.modelName,
      manufacturerId: this.display.manufacturerId,
      manufactureYear: this.display.manufactureYear,
      manufactureWeek: this.display.manufactureWeek,
    }
  }

  async supportDDC(useCache: boolean = true): Promise<boolean> {
    const cachedValue = this.cache['supportDDC']

    if (useCache && cachedValue) {
      return cachedValue as boolean
    }

    try {
      await this.display.getVcpFeature(VCPFeatureCode.DisplayControl.Version)
      this.cache['supportDDC'] = true
      return true
    } catch (e) {
      this.cache['supportDDC'] = false
      return false
    }
  }

  getDisplayName(): string {
    return this.info.modelName ?? this.info.displayId
  }

  async getVcpValue(featureCode: number, options?: GetVcpValueOptions): Promise<VCPValue> {
    const { useCache = true } = options ?? {}

    const cachedValue = this.cache[featureCode]

    if (useCache && cachedValue) {
      return cachedValue as VCPValue
    }

    const value = await this.display.getVcpFeature(featureCode) as unknown as VCPValue

    this.cache[featureCode] = value

    return value
  }

  async setVcpValue(featureCode: number, value: number): Promise<void> {
    const cachedValue = this.cache[featureCode]

    if (typeof cachedValue === 'object' && cachedValue.type === VcpValueType.Continuous) {
      this.cache[featureCode] = { ...cachedValue, currentValue: value }
    }

    return this.display.setVcpFeature(featureCode, value)
  }

  async getVcpLuminance(useCache = true): Promise<Continuous> {
    const value = await this.getVcpValue(VCPFeatureCode.ImageAdjustment.Luminance, { useCache })

    if (value.type !== VcpValueType.Continuous) {
      throw new Error('VCP Luminance (brightness) value type not supported')
    }

    return value
  }

  async getBrightnessPercentage(useCache = true): Promise<number> {
    const { currentValue, maximumValue } = await this.getVcpLuminance(useCache)

    return Math.round(currentValue * 100 / maximumValue)
  }

  async setBrightnessPercentage(value: number): Promise<void> {
    const { maximumValue } = await this.getVcpLuminance(true)
    const percentage = Math.round(value * maximumValue / 100)

    return this.setVcpValue(VCPFeatureCode.ImageAdjustment.Luminance, Math.max(0, Math.min(percentage, 100)))
  }

  clearCache(): void {
    this.cache = {}
  }

  static async list(): Promise<Array<EnhancedDisplay>> {
    const displays = await (new DisplayManager()).list()

    return displays.map(display => new EnhancedDisplay(display))
  }
}
