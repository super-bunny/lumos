import ElectronStore from 'electron-store'
import Settings, { Themes } from '../../types/Settings'

export default class SettingsStore extends ElectronStore<Settings> {
  constructor() {
    super({
      defaults: {
        minimizeAppOnWindowClose: true,
        theme: Themes.DEFAULT,
        httpApi: {
          host: 'localhost',
          port: 8787,
        },
      },
    })
  }
}