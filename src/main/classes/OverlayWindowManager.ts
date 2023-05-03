import Settings from '../../types/Settings'
import { BrowserWindow, screen } from 'electron'
import overlayConstants from '../../overlay/constants'
import { IpcEvents } from '../../types/Ipc'

declare const OVERLAY_WINDOW_WEBPACK_ENTRY: string
declare const OVERLAY_WINDOW_PRELOAD_WEBPACK_ENTRY: string

export default class OverlayWindowManager {
  browserWindows: Array<BrowserWindow> = []

  constructor(public settings: Settings['overlay']) {
  }

  init() {
    this.clear()

    if (!this.settings.enable) return

    const electronDisplays = screen.getAllDisplays()

    for (const [electronDisplayId, displayId] of Object.entries(this.settings.electronDisplayBindings)) {
      if (!electronDisplayId) continue

      const electronDisplay = electronDisplays.find(display => display.id.toString() === electronDisplayId)

      if (!electronDisplay) continue

      const overlayWindow = OverlayWindowManager.createOverlayWindow(electronDisplay)

      overlayWindow.webContents.on('did-finish-load', () => {
        overlayWindow.webContents.send(IpcEvents.SET_OVERLAY_INFO, { displayId })
      })

      this.browserWindows.push(overlayWindow)
    }
  }

  clear() {
    this.browserWindows.forEach(overlayWindow => overlayWindow.close())
    this.browserWindows = []
  }

  static createOverlayWindow(targetDisplay: Electron.Display): BrowserWindow {
    const devOverlay = process.env.DEV_OVERLAY === 'true'
    const height = devOverlay ? 720 : overlayConstants.overlayHeight
    const width = devOverlay ? 1280 : overlayConstants.overlayWidth
    const x = targetDisplay.bounds.x + targetDisplay.bounds.width * 0.5 - (overlayConstants.overlayWidth / 2)
    const y = targetDisplay.bounds.y + targetDisplay.bounds.height * 0.9 - (overlayConstants.overlayHeight / 2)

    const overlayWindow = new BrowserWindow({
      x,
      y,
      height,
      width,
      show: process.env.FORCE_SHOW_OVERLAY === 'true' ? true : devOverlay,
      focusable: devOverlay,
      resizable: devOverlay,
      maximizable: devOverlay,
      frame: devOverlay,
      alwaysOnTop: !devOverlay,
      transparent: !devOverlay,
      webPreferences: {
        preload: OVERLAY_WINDOW_PRELOAD_WEBPACK_ENTRY,
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: false,
      },
    })

    overlayWindow.loadURL(OVERLAY_WINDOW_WEBPACK_ENTRY)
      .then()


    if (process.env.OVERLAY_DEV_TOOLS === 'true') {
      overlayWindow.webContents.openDevTools({ mode: !devOverlay ? 'undocked' : 'right' })
    }
    if (!devOverlay) {
      OverlayWindowManager.setWindowAlwaysOnTop(overlayWindow)
      overlayWindow.setMenuBarVisibility(false)
    } else {
      overlayWindow.center()
    }

    overlayWindow.webContents.on('did-finish-load', () => {
      overlayWindow.webContents.send(IpcEvents.PING, 'pong')
    })

    return overlayWindow
  }

  static setWindowAlwaysOnTop(window: BrowserWindow) {
    window.setAlwaysOnTop(true, 'pop-up-menu', 1)
  }
}