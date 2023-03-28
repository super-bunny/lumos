import { Display, DisplayManager, VCPFeatureCode } from '@ddc-node/ddc-node'
import { Backends, DisplayInfo, VCPValue } from '../../types/EnhancedDDCDisplay'

// Light utility wrapper around Display class from @ddc-node/ddc-node
export default class EnhancedDDCDisplay {
  constructor(readonly display: Display) {
  }

  get info(): DisplayInfo {
    return {
      index: this.display.index,
      backend: this.display.backend,
      edidData: this.display.edidData,
      version: this.display.version,
      mccsVersion: this.display.mccsVersion,
      displayId: this.display.backend === Backends.WIN_API
        ? `${ this.display.displayId }-${ this.display.index }`
        : this.display.displayId,
      serial: this.display.serial,
      serialNumber: this.display.serialNumber,
      modelId: this.display.modelId,
      modelName: this.display.modelName,
      manufacturerId: this.display.manufacturerId,
      manufactureYear: this.display.manufactureYear,
      manufactureWeek: this.display.manufactureWeek,
      capabilities: this.display.capabilities,
    }
  }

  async supportDDC(): Promise<boolean> {
    return this.display.getVcpFeature(VCPFeatureCode.DisplayControl.Version)
      .then(() => true)
      .catch(() => false)
  }

  async getVcpValue(featureCode: number): Promise<VCPValue> {
    return await this.display.getVcpFeature(featureCode) as unknown as VCPValue
  }

  async setVcpValue(featureCode: number, value: number): Promise<void> {
    return this.display.setVcpFeature(featureCode, value)
  }

  static async list(): Promise<Array<EnhancedDDCDisplay>> {
    return new DisplayManager().list()
      .then(displayList => displayList.map(display => new EnhancedDDCDisplay(display)))
  }
}
