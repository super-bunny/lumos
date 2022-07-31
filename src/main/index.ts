import { app, BrowserWindow, session } from 'electron'
import Store from 'electron-store'
import setupIpc from './contextBridge'
import DisplayManager from './classes/DisplayManager'
import SecretStore from './classes/SecretStore'
import crypto from 'crypto'
import BackendWorker from './classes/BackendWorker'
import generateSessionJwt from './utils/generateSessionJwt'

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit()
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
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
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  const displayManager = new DisplayManager()
  const secretStore = new SecretStore({
    defaults: {
      httpApi: { jwtSecret: crypto.randomBytes(48).toString('base64') },
    },
  })
  const sessionJwtSecret = crypto.randomBytes(48).toString('base64')
  const httpApiPort = 8787
  const backendWorker = new BackendWorker({
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
  createWindow()
  setupIpc({ displayManager, sessionJwt, httpApiPort })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})