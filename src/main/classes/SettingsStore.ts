import ElectronStore from 'electron-store'
import Settings, { Themes } from '../../types/Settings'

export const defaultSettings: Required<Settings> = {
  runAppOnStartup: false,
  minimizeAppOnStartup: true,
  minimizeAppOnWindowClose: true,
  theme: Themes.DEFAULT,
  httpApi: {
    host: 'localhost',
    port: 8787,
  },
}

export default class SettingsStore extends ElectronStore<Settings> {
  constructor() {
    super({
      defaults: defaultSettings,
    })
  }
}