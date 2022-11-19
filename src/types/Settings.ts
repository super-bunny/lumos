export enum Themes {
  DEFAULT = 'default',
  ORIGIN = 'origin',
}

export default interface Settings {
  minimizeAppOnWindowClose?: boolean
  theme?: Themes
  httpApi?: {
    host?: string,
    port?: number,
  }
}
