import GenericDisplay from '../../shared/classes/GenericDisplay'
import BackendClient from '../../shared/classes/BackendClient'
import { MonitorAliases } from '../../types/Settings'

export default class GenericDisplayManager {
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
}
