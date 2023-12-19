import BackendClient from '../../shared/classes/BackendClient'
import EnhancedDDCDisplay from './EnhancedDDCDisplay'
import { DisplayInfo, VCPValue } from '../../types/EnhancedDDCDisplay'
import AsyncQueue from './AsyncQueue'

export interface Options {
  name?: string
}

// Backend client for DDC library. Keep an internal DDC display list updated at each list method call.
export default class DdcBackendClient extends BackendClient {
  public readonly name?: string

  protected displayList: Array<EnhancedDDCDisplay> | null = null
  protected listPromise: Promise<EnhancedDDCDisplay[]> | undefined = undefined

  constructor(public asyncQueue?: AsyncQueue, options?: Options) {
    super()

    if (options?.name) this.name = options.name
  }

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
    if (this.listPromise) {
      console.debug(`[DdcBackendClient: ${ this.name }] refresh() called, a promise is already pending skipping.`)
      await this.listPromise
      return
    }

    console.debug(`[DdcBackendClient: ${ this.name }] refresh() called`)

    const promise = EnhancedDDCDisplay.list()

    this.listPromise = promise
    this.displayList = await promise
    this.listPromise = undefined
    console.debug(`[DdcBackendClient: ${ this.name }] refresh() sub promise EnhancedDDCDisplay.list() done`)
  }

  async supportDDC(id: string): Promise<boolean> {
    const display = await this.getDisplayByIdOrThrow(id)

    if (this.asyncQueue) {
      return this.asyncQueue.push(() => display.supportDDC())
    }

    return display.supportDDC()
  }

  async getVcpValue(id: string, featureCode: number): Promise<VCPValue> {
    const display = await this.getDisplayByIdOrThrow(id)

    if (this.asyncQueue) {
      return this.asyncQueue.push(() => display.getVcpValue(featureCode))
    }

    return display.getVcpValue(featureCode)
  }

  async setVcpValue(id: string, featureCode: number, value: number): Promise<void> {
    const display = await this.getDisplayByIdOrThrow(id)

    if (this.asyncQueue) {
      return this.asyncQueue.push(() => display.setVcpValue(featureCode, value))
    }

    return display.setVcpValue(featureCode, value)
  }

  async list(): Promise<Array<DisplayInfo>> {
    await this.refresh()
    return this.displayList!.map(display => display.info)
  }
}