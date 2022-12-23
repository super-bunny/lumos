import { BrowserWindow } from 'electron'
import { IpcEvents } from '../../types/Ipc'
import { DisplayInfo, VCPValue } from '../classes/AbstractDisplay'
import { VCPFeatureCode } from 'ddc-rs'

export interface IpcDisplayUpdateArgs {
  displayId: DisplayInfo['displayId']
  vcpFeature: VCPFeatureCode
  vcpValue?: VCPValue
}

export function sendIpcDisplayUpdate(browserWindow: BrowserWindow, args: IpcDisplayUpdateArgs) {
  browserWindow.webContents.send(IpcEvents.DISPLAY_UPDATE, args)

}