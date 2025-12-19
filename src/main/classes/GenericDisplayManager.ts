import GenericDisplay from '../../shared/classes/GenericDisplay'
import BackendClient from '../../shared/classes/BackendClient'
import { MonitorAliases } from '../../types/Settings'

export default class GenericDisplayManager {
  // TODO: make client readonly. Imply changes in index file
  constructor(public client: BackendClient, public list: Array<GenericDisplay> = []) {
  }

  getDisplayById(id: string): GenericDisplay | undefined {
    return this.list.find(display => display.info.displayId === id)
  }

  getDisplayByIdOrThrow(id: string): GenericDisplay {
    const display = this.getDisplayById(id)

    if (!display) {
      throw new Error(`Display with id ${ id } not found`)
    }

    return display
  }

  setMonitorAliases(aliases: MonitorAliases): void {
    this.list.forEach(display => display.alias = aliases[display.info.displayId] ?? null)
  }

  async refresh(): Promise<void> {
    this.list = await GenericDisplay.list(this.client)
  }

  static async create(client: BackendClient): Promise<GenericDisplayManager> {
    const manager = new GenericDisplayManager(client)
    await manager.refresh()
    return manager
  }
}
