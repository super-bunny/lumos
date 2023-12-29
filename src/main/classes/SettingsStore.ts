import Conf from 'conf'
import Settings from '../../types/Settings'
import getUserDataPath from '../../shared/utils/getUserDataPath'
import constants from '../../shared/utils/contants'
import { UpdateChannels } from '../../types/UpdateChannels'

export const defaultSettings: Required<Settings> = {
  runAppOnStartup: false,
  minimizeAppOnStartup: false,
  minimizeAppOnWindowClose: true,
  developerMode: false,
  theme: constants.defaultTheme,
  enableAnimations: true,
  enableErrorReporting: true,
  enableHttpApi: false,
  httpApi: {
    host: 'localhost',
    port: 8787,
    enableAuthentification: true,
  },
  globalShortcuts: {},
  powerOffMonitorOnShutdown: {},
  monitorAliases: {},
  ignoreWinApi: false,
  concurrentDdcRequest: true,
  overlay: {
    enable: false,
    electronDisplayBindings: {},
    showDisplayId: false,
  },
  updater: {
    enable: true,
    channel: UpdateChannels.STABLE,
  },
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