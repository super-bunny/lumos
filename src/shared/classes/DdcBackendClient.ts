import BackendClient from '../../shared/classes/BackendClient'
import { DisplayInfo, VCPValue } from '../../main/classes/AbstractDisplay'
import EnhancedDisplay from '../../main/classes/EnhancedDisplay'

export default class DdcBackendClient extends BackendClient {
  displayList: Array<EnhancedDisplay> = []

  refresh(): void {
    this.displayList = EnhancedDisplay.list()
  }

  getDisplayById(id: string): EnhancedDisplay | undefined {
    if (this.displayList.length === 0) {
      this.refresh()
    }

    return this.displayList.find(display => display.info.displayId === id)
  }

  getDisplayByIdOrThrow(id: string): EnhancedDisplay {
    const display = this.getDisplayById(id)

    if (!display) {
      throw new Error(`Display with id ${ id } not found`)
    }

    return display
  }

  async supportDDC(id: string): Promise<boolean> {
    const display = this.getDisplayByIdOrThrow(id)

    return display.supportDDC()
  }

  async getVcpValue(id: string, featureCode: number): Promise<VCPValue> {
    const display = this.getDisplayByIdOrThrow(id)

    return display.getVcpValue(featureCode)
  }

  async setVcpValue(id: string, featureCode: number, value: number): Promise<void> {
    const display = this.getDisplayByIdOrThrow(id)

    return display.setVcpValue(featureCode, value)
  }

  async list(): Promise<Array<DisplayInfo>> {
    const displays = EnhancedDisplay.list()

    return displays.map(display => display.info)
  }
}