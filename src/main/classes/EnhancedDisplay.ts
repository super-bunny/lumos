import { Display, DisplayManager, VCPFeatures } from 'ddc-rs'
import AbstractDisplay, { Continuous, DisplayInfo, VCPValue, VCPValueType } from './AbstractDisplay'

export default class EnhancedDisplay extends AbstractDisplay {
  cache: Record<number, VCPValue | undefined> = {}

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

  supportDDC(): boolean {
    try {
      this.display.getVcpFeature(VCPFeatures.DisplayControl.Version)
      return true
    } catch (e) {
      return false
    }
  }

  getDisplayName(): string {
    return this.info.modelName ?? this.info.displayId
  }

  getVcpValue(featureCode: number): VCPValue {
    return this.display.getVcpFeature(featureCode)
  }

  setVcpValue(featureCode: number, value: number): void {
    return this.display.setVcpFeature(featureCode, value)
  }

  getVcpValueFromCache(featureCode: number, forceRefresh = false): VCPValue {
    const cachedValue = this.cache[featureCode]

    if (cachedValue && !forceRefresh) {
      return cachedValue
    }

    const value = this.getVcpValue(featureCode)

    this.cache[featureCode] = value

    return value
  }

  getVcpLuminance(useCache = false): Continuous {
    const value = this.getVcpValueFromCache(VCPFeatures.ImageAdjustment.Luminance, !useCache)

    if (value.type !== VCPValueType.CONTINUOUS) {
      throw new Error('VCP Luminance (brightness) value type not supported')
    }

    return value
  }

  getBrightnessPercentage(): number {
    const { currentValue, maximumValue } = this.getVcpLuminance()

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
