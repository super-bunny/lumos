export enum Themes {
  DEFAULT = 'default',
  ORIGIN = 'origin',
}

export default interface Settings {
  runAppOnStartup?: boolean
  minimizeAppOnStartup?: boolean
  minimizeAppOnWindowClose?: boolean
  theme?: Themes
  httpApi?: {
    host?: string,
    port?: number,
  }
}
