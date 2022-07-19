export enum VCPValueType {
  CONTINUOUS = 'CONTINUOUS',
  NON_CONTINUOUS = 'NON_CONTINUOUS',
  TABLE = 'TABLE'
}

export interface Continuous {
  currentValue: number;
  maximumValue: number;
  type: VCPValueType.CONTINUOUS;
}

export interface NonContinuous {
  /** The first element is the number representation and the second one is the string representation if existing. */
  currentValue: [number, string | undefined];
  /** This map all possibles values number representation into their string representation if existing. */
  possibleValues: Record<number, string | undefined>;
  type: VCPValueType.NON_CONTINUOUS;
}

export interface Table {
  currentData: ArrayBuffer;
  type: VCPValueType.TABLE;
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
}

export default abstract class AbstractDisplay {
  abstract get info(): DisplayInfo

  abstract supportDDC(): boolean

  abstract getDisplayName(): string

  abstract getVcpValue(featureCode: number): VCPValue

  abstract setVcpValue(featureCode: number, value: number): void

  abstract getVcpLuminance(useCache: boolean): Continuous

  abstract getBrightnessPercentage(): number

  abstract setBrightnessPercentage(value: number): void
}
