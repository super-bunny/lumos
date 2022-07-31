import { LumosApi } from './main/preload'

declare global {
  interface Window {
    lumos: typeof LumosApi
  }
}
