export enum VcpValueType {
  Continuous = 0,
  NonContinuous = 1,
  Table = 2
}

export interface Continuous {
  currentValue: number
  maximumValue: number
  type: VcpValueType.Continuous
}

export interface NonContinuous {
  currentValue: number
  currentValueRepresentation?: string
  possibleValues: Record<string, string | undefined | null>
  type: VcpValueType.NonContinuous
}

export interface Table {
  currentData: Array<number>
  type: VcpValueType.Table
}

export declare type VCPValue = Continuous | NonContinuous | Table;

export enum Backends {
  WIN_API = 'winapi',
  NV_API = 'nvapi',
  I2C = 'i2c-dev',
  MAC_OS = 'macos',
}

export interface DisplayInfo {
  index: number
  backend: string
  edidData?: ArrayBuffer
  version?: string
  mccsVersion?: string
  displayId: string
  serial?: number
  serialNumber?: string
  modelId?: number
  modelName?: string
  manufacturerId?: string
  manufactureYear?: number
  manufactureWeek?: number
  capabilities?: string
}

export default abstract class AbstractDisplay {
  abstract get info(): DisplayInfo

  abstract supportDDC(): Promise<boolean>

  abstract getDisplayName(): string

  abstract getVcpValue(featureCode: number): Promise<VCPValue>

  abstract setVcpValue(featureCode: number, value: number): Promise<void>

  abstract getVcpLuminance(useCache: boolean): Promise<Continuous>

  abstract getBrightnessPercentage(): Promise<number>

  abstract setBrightnessPercentage(value: number): Promise<void>
}
