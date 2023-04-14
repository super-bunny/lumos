import Conf, { Options } from 'conf'
import { app, safeStorage } from 'electron'

export interface StoreData {
  httpApi: {
    jwtSecret: string
  }
}

export type StoreOptions<T extends Record<string, any>> = Pick<Options<T>, 'defaults'>

export default class SecretStore extends Conf<StoreData> {
  constructor(options?: StoreOptions<StoreData>) {

    super({
      ...options,
      configName: 'secrets',
      fileExtension: '',
      projectName: 'lumos',
      cwd: app.getPath('userData'),
      serialize: SecretStore.serialize,
      deserialize: SecretStore.deserialize,
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