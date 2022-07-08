import { Continuous, Display, VCPFeatures, VCPValueType } from 'ddc-rs'

export interface DisplayInfo {
  index: number
  backend: string
  edidData?: ArrayBuffer
  version?: string
  mccsVersion?: string
  displayId: string
  serial?: number
  serialNumber?: string
  modelId?: number
  modelName?: string
  manufacturerId?: string
  manufactureYear?: number
  manufactureWeek?: number
}

export default class EnhancedDisplay {
  constructor(readonly display: Display) {
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
    return this.info.modelName ?? this.display.displayId
  }

  getVcpLuminance(): Continuous {
    const value = this.display.getVcpFeature(VCPFeatures.ImageAdjustment.Luminance)

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
    const { maximumValue } = this.getVcpLuminance()

    this.display.setVcpFeature(VCPFeatures.ImageAdjustment.Luminance, Math.round(value * maximumValue / 100))
  }
}
