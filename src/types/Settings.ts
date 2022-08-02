export enum Themes {
  DEFAULT = 'default',
  ORIGIN = 'origin',
}

export default interface Settings {
  theme?: Themes
  httpApi?: {
    host?: string,
    port?: number,
  }
}
