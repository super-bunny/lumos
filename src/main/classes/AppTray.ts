import { Menu, MenuItem, MenuItemConstructorOptions, Tray } from 'electron'
import { version } from '../../../package.json'
import * as path from 'path'

export interface Config {
  onAppOpen?: () => void
}

export default class AppTray {
  readonly tray: Tray
  config: Config

  constructor(config?: Config) {
    this.config = config ?? {}
    this.tray = new Tray(this.getIconPath())
    this.tray.setToolTip('Lumos')
    this.reloadContextMenu()
  }

  protected getIconPath(): string {
    switch (process.platform) {
      case 'win32':
        return path.resolve(__dirname, '..', 'shared/assets/icons/lumos_icon.ico')
      case 'darwin':
        return path.resolve(__dirname, '..', 'shared/assets/icons/lumos_icon.icns')
      default:
        return path.resolve(__dirname, '..', 'shared/assets/icons/lumos_icon.png')
    }
  }

  reloadContextMenu() {
    const template: Array<MenuItemConstructorOptions | MenuItem> = [
      { label: `Lumos v${ version }`, type: 'normal', enabled: false },
      { type: 'separator' },
      {
        label: `Open Lumos`,
        type: 'normal',
        click: this.config?.onAppOpen,
        visible: this.config?.onAppOpen !== undefined,
      },
      { label: 'Quit', type: 'normal', role: 'quit' },
    ]

    const contextMenu = Menu.buildFromTemplate(template)

    this.tray.setContextMenu(contextMenu)
  }
}