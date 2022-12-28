export enum Themes {
  DEFAULT = 'default',
  ORIGIN = 'origin',
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
  enableHttpApi?: boolean
  httpApi?: {
    host?: string,
    port?: number,
  }
  globalShortcuts: Partial<Record<GlobalShortcutsStaticActions | string, string>>
}
