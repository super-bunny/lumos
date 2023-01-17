import EnhancedDisplay, { GetVcpValueOptions } from './EnhancedDisplay'
import { VCPValue, Continuous } from './AbstractDisplay'

export default class DisplayManager {
  constructor(public list: Array<EnhancedDisplay> = []) {
  }

  getDisplayById(id: string): EnhancedDisplay | undefined {
    return this.list.find(display => display.info.displayId === id)
  }

  getDisplayByIdOrThrow(id: string): EnhancedDisplay {
    const display = this.getDisplayById(id)

    if (!display) {
      throw new Error(`Display with id ${ id } not found`)
    }

    return display
  }

  supportDDCById(id: string): Promise<boolean> {
    const display = this.getDisplayByIdOrThrow(id)

    return display.supportDDC()
  }

  getVcpValueById(id: string, featureCode: number, options?: GetVcpValueOptions): Promise<VCPValue> {
    const display = this.getDisplayByIdOrThrow(id)

    return display.getVcpValue(featureCode, options)
  }

  setVcpValueById(id: string, featureCode: number, value: number): Promise<void> {
    const display = this.getDisplayByIdOrThrow(id)

    return display.setVcpValue(featureCode, value)
  }

  getVcpLuminanceById(id: string, useCache: boolean = true): Promise<Continuous> {
    const display = this.getDisplayByIdOrThrow(id)

    return display.getVcpLuminance(useCache)
  }

  getBrightnessPercentageById(id: string, useCache: boolean = true): Promise<number> {
    const display = this.getDisplayByIdOrThrow(id)

    return display.getBrightnessPercentage(useCache)
  }

  setBrightnessPercentageById(id: string, value: number): Promise<void> {
    const display = this.getDisplayByIdOrThrow(id)

    return display.setBrightnessPercentage(value)
  }

  async refresh(): Promise<void> {
    this.list = await EnhancedDisplay.list()
  }
}
