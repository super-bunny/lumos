import Conf from 'conf'
import Settings, { Themes } from '../../types/Settings'
import getUserDataPath from '../../shared/utils/getUserDataPath'

export const defaultSettings: Required<Settings> = {
  runAppOnStartup: false,
  minimizeAppOnStartup: false,
  minimizeAppOnWindowClose: true,
  developerMode: false,
  theme: Themes.DEFAULT,
  enableAnimations: true,
  enableErrorReporting: true,
  enableHttpApi: false,
  httpApi: {
    host: 'localhost',
    port: 8787,
  },
  globalShortcuts: {},
  powerOffMonitorOnShutdown: {},
  ignoreWinApi: false,
}

export default class SettingsStore extends Conf<Settings> {
  constructor() {
    super({
      defaults: defaultSettings,
      configName: 'config',
      projectName: 'lumos',
      cwd: getUserDataPath(),
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