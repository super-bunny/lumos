import EnhancedDisplay from './EnhancedDisplay'
import { Continuous, VCPValue } from 'ddc-rs'

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

  supportDDCById(id: string): boolean {
    const display = this.getDisplayByIdOrThrow(id)

    return display.supportDDC()
  }

  getVcpValueById(id: string, featureCode: number): VCPValue {
    const display = this.getDisplayByIdOrThrow(id)

    return display.getVcpValue(featureCode)
  }

  setVcpValueById(id: string, featureCode: number, value: number): void {
    const display = this.getDisplayByIdOrThrow(id)

    return display.setVcpValue(featureCode, value)
  }

  getVcpLuminanceById(id: string, useCache: boolean = false): Continuous {
    const display = this.getDisplayByIdOrThrow(id)

    return display.getVcpLuminance(useCache)
  }

  getBrightnessPercentageById(id: string): number {
    const display = this.getDisplayByIdOrThrow(id)

    return display.getBrightnessPercentage()
  }

  setBrightnessPercentageById(id: string, value: number): void {
    const display = this.getDisplayByIdOrThrow(id)

    return display.setBrightnessPercentage(value)
  }

  refresh(): void {
    this.list = EnhancedDisplay.list()
  }
}
