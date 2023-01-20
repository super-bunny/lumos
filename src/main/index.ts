import { app, BrowserWindow, dialog, globalShortcut, session } from 'electron'
import Store from 'electron-store'
import setupIpc from './contextBridge'
import DisplayManager from './classes/DisplayManager'
import SecretStore from './classes/SecretStore'
import crypto from 'crypto'
import BackendWorker from './classes/BackendWorker'
import generateSessionJwt from './utils/generateSessionJwt'
import SettingsStore, { defaultSettings } from './classes/SettingsStore'
import AppTray from './classes/AppTray'
import setupAutoStartup from './utils/setupAutoStartup'
import { IpcEvents } from '../types/Ipc'
import registerGlobalShortcuts from './utils/registerGlobalShortcuts'

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

const singleInstanceLock = app.requestSingleInstanceLock()
let mainWindow: BrowserWindow | undefined
let settings: SettingsStore | undefined
// Use to handle window hiding/showing without prevent app from quit by closing all windows
let shouldQuit: boolean = false

export default function main() {
  // Handle creating/removing shortcuts on Windows when installing/uninstalling.
  if (require('electron-squirrel-startup')) {
    app.quit()
    return
  }

  // Quit app if another instance is running
  if (!singleInstanceLock) {
    app.quit()
    return
  }

  const createWindow = (): BrowserWindow => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
      height: 720,
      width: 1280,
      show: !settings?.store.minimizeAppOnStartup,
      webPreferences: {
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        nodeIntegration: false,
        contextIsolation: true,
      },
    })

    // mainWindow.setMenuBarVisibility(false)

    // and load the index.html of the app.
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
      .then()

    // Open the DevTools in development.
    if (process.env.NODE_ENV === 'development') {
      mainWindow.webContents.openDevTools()
    }

    mainWindow.on('close', (event) => {
      if (!shouldQuit && settings?.store.minimizeAppOnWindowClose) {
        event.preventDefault()
        mainWindow?.hide()
      }
    })

    mainWindow.webContents.on('did-finish-load', () => {
      mainWindow.webContents.send(IpcEvents.PING, 'pong')
    })

    return mainWindow
  }

  const onAppOpen = () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createWindow()
    } else {
      mainWindow?.show()
    }
  }

  // Return validated settings or alert user with error and quit app.
  const getSettingsStore = (): SettingsStore | undefined => {
    let settingsStore: SettingsStore | undefined
    try {
      settingsStore = new SettingsStore()
      settingsStore.validate()
      return settingsStore
    } catch (e) {
      dialog.showErrorBox('Invalid settings', [
        e instanceof Error ? e.message : 'Unknown error',
        `Try to edit or delete your settings file: ${ settingsStore?.path }`,
      ].join('\n'))
      app.quit()
      return undefined
    }
  }

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', () => {
    const displayManager = new DisplayManager()

    settings = getSettingsStore()
    if (!settings) return

    const secretStore = new SecretStore({
      defaults: {
        httpApi: { jwtSecret: crypto.randomBytes(48).toString('base64') },
      },
    })
    const sessionJwtSecret = crypto.randomBytes(48).toString('base64')
    const httpApiPort = settings.store.httpApi?.port ?? 8787
    const httpApiHost = settings.store.httpApi?.host ?? 'localhost'
    const backendWorker = new BackendWorker({
      enableHttpApi: settings.store.enableHttpApi ?? defaultSettings.enableHttpApi,
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

    setupAutoStartup(settings.store.runAppOnStartup ?? defaultSettings.runAppOnStartup)
    Store.initRenderer()
    mainWindow = createWindow()
    setupIpc({ mainWindow, displayManager, sessionJwt, httpApiPort })
    registerGlobalShortcuts(settings.store.globalShortcuts, displayManager, mainWindow)

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

  app.on('second-instance', () => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore()
        mainWindow.focus()
      }
      if (!mainWindow.isVisible()) mainWindow.show()
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

  app.on('before-quit', () => {
    shouldQuit = true
  })

  app.on('will-quit', () => {
    globalShortcut.unregisterAll()
  })
}