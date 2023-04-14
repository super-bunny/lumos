export enum Themes {
  DEFAULT = 'default',
  MATERIAL_LIGHT = 'materialLight',
}

export enum GlobalShortcutsStaticActions {
  DIM_ALL_DISPLAYS = 'dimAllDisplays',
  BRIGHT_ALL_DISPLAYS = 'brightAllDisplays',
}

export default interface Settings {
  runAppOnStartup?: boolean
  minimizeAppOnStartup?: boolean
  minimizeAppOnWindowClose?: boolean
  theme?: Themes
  enableAnimations?: boolean
  enableErrorReporting?: boolean
  enableHttpApi?: boolean
  httpApi?: {
    host?: string,
    port?: number,
    enableAuthentification?: boolean,
  }
  globalShortcuts: Partial<Record<GlobalShortcutsStaticActions | string, string>>
  developerMode?: boolean
  powerOffMonitorOnShutdown?: Record<string, boolean>
  ignoreWinApi?: boolean
  concurrentDdcRequest?: boolean
  monitorAliases?: Record<string, string | null>
}
