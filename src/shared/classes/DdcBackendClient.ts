import BackendClient from '../../shared/classes/BackendClient'
import EnhancedDDCDisplay from './EnhancedDDCDisplay'
import { DisplayInfo, VCPValue } from '../../types/EnhancedDDCDisplay'
import AsyncQueue from './AsyncQueue'
import BackendClientCache from './BackendClientCache'

export interface Options {
  name?: string
  // TODO: invert and enable cache by default
  withCache?: boolean
}

// Backend client for the DDC library. Keep an internal DDC display list updated at each list method call.
export default class DdcBackendClient extends BackendClient {
  public readonly name?: string

  protected displayList: Array<EnhancedDDCDisplay> | null = null
  protected listPromise: Promise<EnhancedDDCDisplay[]> | undefined = undefined

  constructor(public asyncQueue?: AsyncQueue, options?: Options) {
    super()

    if (options?.name) this.name = options.name
    if (options?.withCache) this.cache = new BackendClientCache()
  }

  clone(): DdcBackendClient {
    const client = new DdcBackendClient(this.asyncQueue, { name: this.name })
    client.cache = this.cache
    client.displayList = this.displayList
    client.listPromise = this.listPromise
    return client
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
    if (this.hasCache()) this.resetCache()
  }

  async supportDDC(id: string): Promise<boolean> {
    const cache = this.cache?.display(id)
    const cachedValue = cache?.['supportDDC']
    if (cachedValue) {
      console.debug(`[DdcBackendClient / ${ id }] Support DDC - CACHE HIT`)
      return cachedValue
    }
    if (cache) console.debug(`[DdcBackendClient / ${ id }] Support DDC - CACHE MISS`)

    const display = await this.getDisplayByIdOrThrow(id)
    const promise: Promise<boolean> = this.asyncQueue
      ? this.asyncQueue.push(() => display.supportDDC())
      : display.supportDDC()

    return promise
      .then(value => {
        if (cache) cache['supportDDC'] = value
        return value
      })
  }

  async getVcpValue(id: string, featureCode: number): Promise<VCPValue> {
    const cache = this.cache?.display(id)
    const cachedValue = cache?.[featureCode]
    if (cachedValue) {
      console.debug(`[DdcBackendClient / ${ id }] Get VCP feature: ${ featureCode } - CACHE HIT`)
      return cachedValue
    }
    if (cache) console.debug(`[DdcBackendClient / ${ id }] Get VCP feature: ${ featureCode } - CACHE MISS`)

    const display = await this.getDisplayByIdOrThrow(id)
    const promise: Promise<VCPValue> = this.asyncQueue
      ? this.asyncQueue.push(() => display.getVcpValue(featureCode))
      : display.getVcpValue(featureCode)

    return promise
      .then(value => {
        if (cache) cache[featureCode] = value
        return value
      })
  }

  async setVcpValue(id: string, featureCode: number, value: number): Promise<void> {
    const cache = this.cache?.display(id)
    const display = await this.getDisplayByIdOrThrow(id)

    if (this.asyncQueue) await this.asyncQueue.push(() => display.setVcpValue(featureCode, value))
    else await display.setVcpValue(featureCode, value)

    if (!cache) return

    this.cache?.setValue(id, featureCode, value)
  }

  async list(): Promise<Array<DisplayInfo>> {
    await this.refresh()
    return this.displayList!.map(display => display.info)
  }
}