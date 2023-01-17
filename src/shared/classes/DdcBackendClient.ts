import BackendClient from '../../shared/classes/BackendClient'
import { DisplayInfo, VCPValue } from '../../main/classes/AbstractDisplay'
import EnhancedDisplay from '../../main/classes/EnhancedDisplay'

export default class DdcBackendClient extends BackendClient {
  displayList: Array<EnhancedDisplay> = []

  async refresh(): Promise<void> {
    this.displayList = await EnhancedDisplay.list()
  }

  async getDisplayById(id: string): Promise<EnhancedDisplay | undefined> {
    if (this.displayList.length === 0) {
      await this.refresh()
    }

    return this.displayList.find(display => display.info.displayId === id)
  }

  async getDisplayByIdOrThrow(id: string): Promise<EnhancedDisplay> {
    const display = await this.getDisplayById(id)

    if (!display) {
      throw new Error(`Display with id ${ id } not found`)
    }

    return display
  }

  async supportDDC(id: string): Promise<boolean> {
    const display = await this.getDisplayByIdOrThrow(id)

    return display.supportDDC()
  }

  async getVcpValue(id: string, featureCode: number): Promise<VCPValue> {
    const display = await this.getDisplayByIdOrThrow(id)

    return display.getVcpValue(featureCode)
  }

  async setVcpValue(id: string, featureCode: number, value: number): Promise<void> {
    const display = await this.getDisplayByIdOrThrow(id)

    return display.setVcpValue(featureCode, value)
  }

  async list(): Promise<Array<DisplayInfo>> {
    const displays = await EnhancedDisplay.list()

    return displays.map(display => display.info)
  }
}