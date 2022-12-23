import { Display, DisplayManager, VCPFeatures } from 'ddc-rs'
import AbstractDisplay, { Continuous, DisplayInfo, VCPValue, VCPValueType } from './AbstractDisplay'

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

  supportDDC(useCache: boolean = true): boolean {
    const cachedValue = this.cache['supportDDC']

    if (useCache && cachedValue) {
      return cachedValue as boolean
    }

    try {
      this.display.getVcpFeature(VCPFeatures.DisplayControl.Version)
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

  getVcpValue(featureCode: number, options?: GetVcpValueOptions): VCPValue {
    const { useCache = true } = options ?? {}

    const cachedValue = this.cache[featureCode]

    if (useCache && cachedValue) {
      return cachedValue as VCPValue
    }

    const value = this.display.getVcpFeature(featureCode)

    this.cache[featureCode] = value

    return value
  }

  setVcpValue(featureCode: number, value: number): void {
    const cachedValue = this.cache[featureCode]

    if (typeof cachedValue === 'object' && cachedValue.type === VCPValueType.CONTINUOUS) {
      this.cache[featureCode] = { ...cachedValue, currentValue: value }
    }

    return this.display.setVcpFeature(featureCode, value)
  }

  getVcpLuminance(useCache = true): Continuous {
    const value = this.getVcpValue(VCPFeatures.ImageAdjustment.Luminance, { useCache })

    if (value.type !== VCPValueType.CONTINUOUS) {
      throw new Error('VCP Luminance (brightness) value type not supported')
    }

    return value
  }

  getBrightnessPercentage(useCache = true): number {
    const { currentValue, maximumValue } = this.getVcpLuminance(useCache)

    return Math.round(currentValue * 100 / maximumValue)
  }

  setBrightnessPercentage(value: number): void {
    const { maximumValue } = this.getVcpLuminance(true)

    this.display.setVcpFeature(VCPFeatures.ImageAdjustment.Luminance, Math.round(value * maximumValue / 100))
  }

  clearCache(): void {
    this.cache = {}
  }

  static list(): Array<EnhancedDisplay> {
    const displays = new DisplayManager().list()

    return displays.map(display => new EnhancedDisplay(display))
  }
}
