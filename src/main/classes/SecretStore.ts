import ElectronStore, { Options } from 'electron-store'
import { safeStorage } from 'electron'

export interface StoreData {
  httpApi: {
    jwtSecret: string
  }
}

export type StoreOptions<T> = Pick<Options<T>, 'defaults'>

export default class SecretStore extends ElectronStore<StoreData> {
  constructor(options?: StoreOptions<StoreData>) {

    super({
      ...options,
      name: 'secrets',
      serialize: SecretStore.serialize,
      deserialize: SecretStore.deserialize,
      fileExtension: '',
      watch: false,
      clearInvalidConfig: true,
    })
  }

  static serialize<T = any>(value: T): string {
    const json = JSON.stringify(value, null, '\t')
    const encryptedValue = safeStorage.encryptString(json)

    return encryptedValue.toString('binary')
  }

  static deserialize<T>(value: string): T {
    try {
      const decryptedValue = safeStorage.decryptString(Buffer.from(value, 'binary'))
      return JSON.parse(decryptedValue)
    } catch (e) {
      throw new SyntaxError((e as Error).message)
    }
  }
}