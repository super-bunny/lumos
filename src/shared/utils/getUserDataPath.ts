import process from 'process'
import { app, ipcRenderer } from 'electron'
import { IpcEvents } from '../../types/Ipc'

// Get the user data path from main or renderer process.
// To allow execution from renderer process, synchronous IPC is used.
// WARNING: If used in renderer it will freeze the process until IPC response is received.
export default function getUserDataPath(): string {
  if (process?.type === 'renderer') {
    return ipcRenderer.sendSync(IpcEvents.GET_USER_DATA_PATH_SYNC)
  }

  return app.getPath('userData')
}