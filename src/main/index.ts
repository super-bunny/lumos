import { app, BrowserWindow, session } from 'electron'
import Store from 'electron-store'
import setupIpc from './contextBridge'
import DisplayManager from './classes/DisplayManager'
import SecretStore from './classes/SecretStore'
import crypto from 'crypto'
import BackendWorker from './classes/BackendWorker'
import generateSessionJwt from './utils/generateSessionJwt'
import SettingsStore from './classes/SettingsStore'
import AppTray from './classes/AppTray'

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

let mainWindow: BrowserWindow | undefined
let settings: SettingsStore | undefined

export default function main() {
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
  if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit()
  }

  const createWindow = (): BrowserWindow => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
      height: 720,
      width: 1280,
      webPreferences: {
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        nodeIntegration: false,
        contextIsolation: true,
      },
    })

    // mainWindow.setMenuBarVisibility(false)

    // and load the index.html of the app.
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

    // Open the DevTools in development.
    if (process.env.NODE_ENV === 'development') {
      mainWindow.webContents.openDevTools()
    }

    return mainWindow
  }

  const onAppOpen = () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createWindow()
    } else {
      mainWindow?.show()
    }
  }

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', () => {
    const displayManager = new DisplayManager()
    settings = new SettingsStore()
    const secretStore = new SecretStore({
      defaults: {
        httpApi: { jwtSecret: crypto.randomBytes(48).toString('base64') },
      },
    })
    const sessionJwtSecret = crypto.randomBytes(48).toString('base64')
    const httpApiPort = settings.store.httpApi?.port ?? 8787
    const httpApiHost = settings.store.httpApi?.host ?? 'localhost'
    const backendWorker = new BackendWorker({
      httpApiHost,
      httpApiPort,
      jwtSecret: secretStore.store.httpApi.jwtSecret,
      sessionJwtSecret,
    })
    const sessionJwt = generateSessionJwt(sessionJwtSecret)

    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': [
            `default-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' https://api.github.com http://localhost:${ httpApiPort };`,
          ],
        },
      })
    })

    Store.initRenderer()
    mainWindow = createWindow()
    setupIpc({ displayManager, sessionJwt, httpApiPort })

    // App tray
    try {
      const appTray = new AppTray()

      appTray.tray.on('double-click', onAppOpen)
      appTray.config.onAppOpen = onAppOpen
      appTray.reloadContextMenu()
    } catch (e) {
      console.log(e)
    }
  })

  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on('window-all-closed', () => {
    if (!settings?.store.minimizeAppOnWindowClose) {
      app.quit()
    }
  })

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    onAppOpen()
  })
}