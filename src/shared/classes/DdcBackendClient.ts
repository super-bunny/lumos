import BackendClient from '../../shared/classes/BackendClient'
import EnhancedDDCDisplay from './EnhancedDDCDisplay'
import { DisplayInfo, VCPValue } from '../../types/EnhancedDDCDisplay'

// Backend client for DDC library. Keep an internal DDC display list updated at each list method call.
export default class DdcBackendClient extends BackendClient {
  protected displayList: Array<EnhancedDDCDisplay> | null = null

  protected async getDisplayById(id: string): Promise<EnhancedDDCDisplay | undefined> {
    return this.displayList?.find(display => display.info.displayId === id)
  }

  protected async getDisplayByIdOrThrow(id: string): Promise<EnhancedDDCDisplay> {
    const display = await this.getDisplayById(id)

    if (!display) {
      throw new Error(`Display with id ${ id } not found`)
    }

    return display
  }

  async refresh(): Promise<void> {
    this.displayList = await EnhancedDDCDisplay.list()
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
    await this.refresh()
    return this.displayList!.map(display => display.info)
  }
}