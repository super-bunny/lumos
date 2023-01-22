import ElectronStore from 'electron-store'
import Settings, { Themes } from '../../types/Settings'

export const defaultSettings: Required<Settings> = {
  runAppOnStartup: false,
  minimizeAppOnStartup: false,
  minimizeAppOnWindowClose: true,
  developerMode: false,
  theme: Themes.DEFAULT,
  enableAnimations: true,
  enableHttpApi: false,
  httpApi: {
    host: 'localhost',
    port: 8787,
  },
  globalShortcuts: {},
}

export default class SettingsStore extends ElectronStore<Settings> {
  constructor() {
    super({
      defaults: defaultSettings,
    })
  }

  validate() {
    const { globalShortcuts } = this.store
    const globalShortcutsValues = Object.values(globalShortcuts)

    for (const [index, globalShortcutsValue] of globalShortcutsValues.entries()) {
      if (index !== globalShortcutsValues.lastIndexOf(globalShortcutsValue)) {
        throw new Error(`Duplicate global shortcut: ${ globalShortcutsValue }`)
      }
    }
  }
}