export enum PresetOperation {
  CodePage = 0,
  RestoreFactoryColorDefaults = 8,
  RestoreFactoryDefaults = 4,
  RestoreFactoryGeometryDefaults = 6,
  RestoreFactoryLuminanceContrastDefaults = 5,
  RestoreFactoryTvDefaults = 10,
  SaveRestoreSettings = 176
}

export enum ImageAdjustment {
  SixAxisHueControlBlue = 159,
  SixAxisHueControlCyan = 158,
  SixAxisHueControlGreen = 157,
  SixAxisHueControlMagenta = 160,
  SixAxisHueControlRed = 155,
  SixAxisHueControlYellow = 156,
  SixAxisSaturationControlBlue = 93,
  SixAxisSaturationControlCyan = 92,
  SixAxisSaturationControlGreen = 91,
  SixAxisSaturationControlMagenta = 94,
  SixAxisSaturationControlRed = 89,
  SixAxisSaturationControlYellow = 90,
  AdjustZoom = 124,
  AutoColorSetup = 31,
  AutoSetup = 30,
  AutoSetupOnOff = 162,
  BacklightControl = 19,
  BacklightLevelBlue = 113,
  BacklightLevelGreen = 111,
  BacklightLevelRed = 109,
  BacklightLevelWhite = 107,
  BlockLutOperation = 117,
  Clock = 14,
  ClockPhase = 62,
  ColorSaturation = 138,
  ColorTemperatureIncrement = 11,
  ColorTemperatureRequest = 12,
  Contrast = 18,
  DisplayApplication = 220,
  FleshToneEnhancement = 17,
  Focus = 28,
  Gamma = 114,
  GrayScaleExpansion = 46,
  HorizontalMoire = 86,
  Hue = 144,
  Luminance = 16,
  LutSize = 115,
  ScreenOrientation = 170,
  SelectColorPreset = 20,
  Sharpness = 135,
  SinglePointLutOperation = 116,
  StereoVideoMode = 212,
  TvBlackLevelLuminance = 146,
  TvContrast = 142,
  TvSharpness = 140,
  UserColorVisionCompensation = 23,
  VelocityScanModulation = 136,
  VerticalMoire = 88,
  VideoBlackLevelBlue = 112,
  VideoBlackLevelGreen = 110,
  VideoBlackLevelRed = 108,
  VideoGainBlue = 26,
  VideoGainGreen = 24,
  VideoGainRed = 22,
  WindowBackground = 154,
  WindowControlOnOff = 164,
  WindowSelect = 165,
  WindowSize = 166,
  WindowTransparency = 167
}

export enum DisplayControl {
  DisplayControllerId = 200,
  DisplayFirmwareLevel = 201,
  DisplayUsageTime = 198,
  HorizontalFrequency = 172,
  ImageMode = 219,
  OsdButtonLevelControl = 202,
  OsdLanguage = 204,
  PowerMode = 214,
  SourceColorCoding = 181,
  SourceTimingMode = 180,
  Version = 223,
  VerticalFrequency = 174
}

export enum Geometry {
  BottomCornerFlare = 74,
  BottomCornerHook = 76,
  DisplayScaling = 134,
  HorizontalConvergenceMG = 41,
  HorizontalConvergenceRB = 40,
  HorizontalKeystone = 66,
  HorizontalLinearity = 42,
  HorizontalLinearityBalance = 44,
  HorizontalMirror = 130,
  HorizontalParallelogram = 64,
  HorizontalPincushion = 36,
  HorizontalPincushionBalance = 38,
  HorizontalPosition = 32,
  HorizontalSize = 34,
  Rotation = 68,
  ScanMode = 218,
  TopCornerFlare = 70,
  TopCornerHook = 72,
  VerticalConvergenceMG = 57,
  VerticalConvergenceRB = 56,
  VerticalKeystone = 67,
  VerticalLinearity = 58,
  VerticalLinearityBalance = 60,
  VerticalMirror = 132,
  VerticalParallelogram = 65,
  VerticalPincushion = 52,
  VerticalPincushionBalance = 54,
  VerticalPosition = 48,
  VerticalSize = 50,
  WindowPositionBrX = 151,
  WindowPositionBrY = 152,
  WindowPositionTlX = 149,
  WindowPositionTlY = 150
}

export enum Miscellaneous {
  ActiveControl = 82,
  AmbientLightSensor = 102,
  ApplicationEnableKey = 198,
  AssetTag = 210,
  AuxiliaryDisplayData = 207,
  AuxiliaryDisplaySize = 206,
  AuxiliaryPowerOutput = 215,
  Degauss = 1,
  DisplayDescriptorLength = 194,
  DisplayIdentificationDataOperation = 135,
  DisplayTechnologyType = 182,
  EnableDisplayOfDisplayDescriptor = 196,
  FlatPanelSubPixelLayout = 178,
  InputSource = 96,
  NewControlValue = 2,
  OutputSelect = 208,
  PerformancePreservation = 84,
  RemoteProcedureCall = 118,
  ScratchPad = 222,
  SoftControls = 3,
  StatusIndicators = 205,
  TransmitDisplayDescriptor = 195,
  TvChannelUpDown = 139
}

export enum Audio {
  AudioBalanceLR = 147,
  AudioBass = 145,
  AudioJackConnectionStatus = 101,
  AudioMicrophoneVolume = 100,
  AudioMute = 141,
  AudioProcessorMode = 148,
  AudioSpeakerSelect = 99,
  AudioSpeakerVolume = 98,
  AudioTreble = 143
}

export enum DigitalPacketVideoLink {
  BodyCrcErrorCount = 188,
  ClientId = 189,
  HeaderErrorCount = 187,
  LinkControl = 190,
  MonitorStatus = 183,
  MonitorXOrigin = 185,
  MonitorYOrigin = 186,
  PacketCount = 184
}

export enum PowerMode {
  ON = 0x01,
  STANDBY = 0x02,
  SUSPEND = 0x03,
  OFF = 0x04,
  POWER_OFF = 0x05,
}

const VCPFeatures = {
  PresetOperation,
  ImageAdjustment,
  DisplayControl,
  Geometry,
  Miscellaneous,
  Audio,
  DigitalPacketVideoLink,
}

export type VCPFeaturesCode =
  Audio
  | DisplayControl
  | Geometry
  | Miscellaneous
  | ImageAdjustment
  | DigitalPacketVideoLink
  | PresetOperation

export default VCPFeatures
