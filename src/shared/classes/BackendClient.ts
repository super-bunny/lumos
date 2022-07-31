import { DisplayInfo, VCPValue } from '../../main/classes/AbstractDisplay'

export default abstract class BackendClient {
  abstract supportDDC(id: string): Promise<boolean>

  abstract getVcpValue(id: string, featureCode: number): Promise<VCPValue>

  abstract setVcpValue(id: string, featureCode: number, value: number): Promise<void>

  abstract list(): Promise<Array<DisplayInfo>>
}