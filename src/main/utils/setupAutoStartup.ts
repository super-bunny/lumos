import path from 'path'
import { app } from 'electron'

function getLoginItemArgs() {
  const appFolder = path.dirname(process.execPath)
  const updateExe = path.resolve(appFolder, '..', 'Update.exe')
  const exeName = path.basename(process.execPath)

  return {
    path: updateExe,
    args: [
      '--processStart', `"${ exeName }"`,
      '--process-start-args', `"--hidden"`,
    ],
  }
}

export function getAutoStartupSettings(): Electron.LoginItemSettings {
  return app.getLoginItemSettings(getLoginItemArgs())
}

export default function setupAutoStartup(openAtLogin: boolean): void {
  app.setLoginItemSettings({
    openAtLogin,
    ...getLoginItemArgs(),
  })
}
