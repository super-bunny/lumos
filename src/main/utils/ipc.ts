import { BrowserWindow } from 'electron'
import { IpcEvents } from '../../types/Ipc'
import { DisplayInfo, VCPValue } from '../classes/AbstractDisplay'
import { VCPFeaturesCode } from '../../types/VCPFeatures'

export interface IpcDisplayUpdateArgs {
  displayId: DisplayInfo['displayId']
  vcpFeature: VCPFeaturesCode
  vcpValue?: VCPValue
}

export function sendIpcDisplayUpdate(browserWindow: BrowserWindow, args: IpcDisplayUpdateArgs) {
  browserWindow.webContents.send(IpcEvents.DISPLAY_UPDATE, args)

}