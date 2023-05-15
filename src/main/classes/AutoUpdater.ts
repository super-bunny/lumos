import UpdateServer from './UpdateServer/UpdateServer'
import { app, autoUpdater, dialog } from 'electron'
import WithRequired from '../../types/WithRequired'

export interface Options {
  ignorePreRelease?: boolean
  updateServerPort?: number
  onUpdateAvailable?: () => void
  onUpdateDownloaded?: (releaseNotes: string, releaseName: string, releaseDate: Date, updateURL: string) => void
}

export default class AutoUpdater {
  options: WithRequired<Options, 'ignorePreRelease' | 'updateServerPort'> = {
    ignorePreRelease: true,
    updateServerPort: 0,
  }
  updateServer: UpdateServer

  constructor(options?: Options) {
    if (options) this.options = { ...this.options, ...options }

    this.updateServer = new UpdateServer({
      ignorePreRelease: this.options.ignorePreRelease,
    })
  }

  get updateServerPort(): number | undefined {
    const address = this.updateServer.server?.address()
    return address && typeof address === 'object' ? address.port : undefined
  }

  async init(): Promise<this> {
    if (this.updateServer.server) return this

    const server = await this.updateServer.listen(this.options.updateServerPort)

    const address = server.address()
    const port = address && typeof address === 'object' ? address.port : undefined

    console.info('[Auto Updater] Update server started on port:', port ?? address)

    const host = `http://localhost:${ port }`
    const repo = 'super-bunny/lumos'
    const autoUpdaterUrl = `${ host }/${ repo }/${ process.platform }-${ process.arch }/${ app.getVersion() }`

    console.info('[Auto Updater] Url:', autoUpdaterUrl)

    autoUpdater.setFeedURL({
      url: autoUpdaterUrl,
    })
    autoUpdater.on('error', error => {
      console.info('[Auto Updater] Error:', error.message)
    })
    autoUpdater.on('update-not-available', () => {
      console.info('[Auto Updater] Update not available')
    })
    autoUpdater.on('update-available', () => {
      console.info('[Auto Updater] Update available')
      this.options.onUpdateAvailable?.()
    })
    autoUpdater.on('update-downloaded', (event, ...args) => {
      console.info('[Auto Updater] Update downloaded')
      this.options.onUpdateDownloaded?.(...args)
    })

    AutoUpdater.checkForUpdates()

    return this
  }

  static checkForUpdates(): void {
    autoUpdater.checkForUpdates()
  }

  static quitAndInstall(): void {
    autoUpdater.quitAndInstall()
  }
}