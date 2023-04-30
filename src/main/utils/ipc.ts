import { BrowserWindow } from 'electron'
import { IpcEvents } from '../../types/Ipc'
import { VCPFeaturesCode } from '../../types/VCPFeatures'
import { DisplayInfo, VCPValue } from '../../types/EnhancedDDCDisplay'

export interface IpcDisplayUpdateArgs {
  displayId: DisplayInfo['displayId']
  vcpFeature: VCPFeaturesCode
  vcpValue?: VCPValue
}

export function sendIpcDisplayUpdate(browserWindows: Array<BrowserWindow>, args: IpcDisplayUpdateArgs) {
  browserWindows.forEach(browserWindow => browserWindow.webContents.send(IpcEvents.DISPLAY_UPDATE, args))
}