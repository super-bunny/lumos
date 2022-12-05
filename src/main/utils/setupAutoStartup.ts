import path from 'path'
import { app } from 'electron'

export default function setupAutoStartup(openAtLogin: boolean) {
  const appFolder = path.dirname(process.execPath)
  const updateExe = path.resolve(appFolder, '..', 'Update.exe')
  const exeName = path.basename(process.execPath)

  app.setLoginItemSettings({
    openAtLogin,
    path: updateExe,
    args: [
      '--processStart', `"${ exeName }"`,
      '--process-start-args', `"--hidden"`,
    ],
  })
}
