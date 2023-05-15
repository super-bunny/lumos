import assetPlatform from './assetPlatform'
import { PLATFORM, PLATFORM_ARCH, PLATFORM_ARCHS } from './constants'
import semver from 'semver'
import assert from 'assert'
import http from 'http'
import { fetch } from 'undici'

const { NODE_ENV } = process.env

export interface Options {
  githubToken?: string
  ignorePreRelease: boolean
}

export default class UpdateServer {
  githubToken?: string
  ignorePrerelease: boolean = true
  server?: http.Server

  constructor(options?: Options) {
    this.githubToken = options?.githubToken
    if (options?.ignorePreRelease !== undefined) this.ignorePrerelease = options.ignorePreRelease
  }

  get logger(): Pick<Console, 'info' | 'warn' | 'error' | 'debug'> {
    const prefix = '[Update Server]'

    return {
      info: (...args) => console.info(prefix, ...args),
      warn: (...args) => console.warn(prefix, ...args),
      error: (...args) => console.error(prefix, ...args),
      debug: (...args) => console.debug(prefix, ...args),
    }
  }

  async listen(port: number): Promise<http.Server> {
    this.server = http.createServer((req, res) => {
      const start = new Date()

      this.handle(req, res)
        .catch((err) => {
          const msg = NODE_ENV === 'production' ? 'Internal Server Error' : err.stack
          this.logger.error(err)
          res.statusCode = err.statusCode || 500
          res.end(msg)
        })
        .then(() => {
          this.logger.info('Request',
            {
              method: req.method,
              url: req.url,
              status: res.statusCode,
              duration: new Date().valueOf() - start.valueOf(),
            },
          )
        })
    })

    return new Promise((resolve) => {
      this.server!.listen(port, '127.0.0.1', () => resolve(this.server!),
      )
    })
  }

  async close(): Promise<void> {
    if (!this.server) return

    return new Promise<void>((resolve, reject) => {
      this.server!.close(error => error ? reject(error) : resolve())
    })
      .then(() => {
        this.server = undefined
      })
  }

  async handle(req: http.IncomingMessage, res: http.ServerResponse) {
    const segments = req.url?.split(/[/?]/).filter(Boolean) ?? []
    const [account, repository, , version, file] = segments
    let platform = segments[2]

    if (platform === PLATFORM.WIN32) platform = PLATFORM_ARCH.WIN_X64
    if (platform === PLATFORM.DARWIN) platform = PLATFORM_ARCH.DARWIN_X64

    if (!account || !repository || !platform || !version) {
      badRequest(res, 'At least one of required path parameters is missing')
    } else if (!PLATFORM_ARCHS.includes(platform)) {
      const message = `Unsupported platform: "${ platform }". Supported: ${ PLATFORM_ARCHS.join(
        ', ',
      ) }.`
      notFound(res, message)
    } else if (version && !semver.valid(version)) {
      badRequest(res, `Invalid SemVer: "${ version }"`)
    } else if (file === 'RELEASES') {
      await this.handleReleases(res, account, repository, platform)
    } else {
      await this.handleUpdate(res, account, repository, platform, version)
    }
  }

  async handleReleases(res: http.ServerResponse, account: string, repository: string, platform: string) {
    const latest = await this.getLatestForPlatform(account, repository, platform)
    if (!latest || !latest.RELEASES) return notFound(res)
    res.end(latest.RELEASES)
  }

  async handleUpdate(
    res: http.ServerResponse,
    account: string,
    repository: string,
    platform: string,
    version: string,
  ) {
    const latest = await this.getLatestForPlatform(account, repository, platform)

    if (!latest) {
      const message = platform.includes(PLATFORM.DARWIN)
        ? 'No updates found (needs asset matching *(mac|darwin|osx).*(-arm).*.zip in public repository)'
        : 'No updates found (needs asset containing win32-{x64,ia32,arm64} or .exe in public repository)'
      notFound(res, message)
    } else if (semver.lte(latest.version, version)) {
      this.logger.info('Up to date', { account, repository, platform, version })
      noContent(res)
    } else {
      this.logger.info(
        'Update available',
        {
          account,
          repository,
          platform,
          version,
          latest: latest.name || latest.version,
        },
      )
      json(res, {
        name: latest.name || latest.version,
        notes: latest.notes,
        url: latest.url,
      })
    }
  }

  async getLatestForPlatform(account: string, repository: string, platform: string) {
    const latest = await this.getLatest(account, repository)

    return latest && latest[platform]
  }

  async getLatest(account: string, repository: string) {
    account = encodeURIComponent(account)
    repository = encodeURIComponent(repository)
    const url = `https://api.github.com/repos/${ account }/${ repository }/releases?per_page=100`
    const headers: Record<string, string> = { Accept: 'application/vnd.github.preview' }
    if (this.githubToken) headers.Authorization = `token ${ this.githubToken }`
    const res = await fetch(url, { headers })
    this.logger.info(
      'Github releases api',
      { account, repository, status: res.status },
    )

    if (res.status === 403) {
      this.logger.error('Fail to get Github releases: Rate Limited!')
      return
    }

    if (res.status >= 400) {
      this.logger.error('Fail to get Github releases:', res.status, await res.json().catch(() => 'Fail to parse body'))
      return
    }

    const latest: Record<string, any> = {}

    const releases: any = await res.json()
    for (const release of releases) {
      if (
        !semver.valid(release.tag_name) ||
        release.draft ||
        (this.ignorePrerelease && release.prerelease)
      ) {
        continue
      }

      for (const asset of release.assets) {
        const platform = assetPlatform(asset.name)
        if (platform && !latest[platform]) {
          latest[platform] = {
            name: release.name,
            version: release.tag_name,
            url: asset.browser_download_url,
            notes: release.body,
          }
        }
        if (hasAllAssets(latest)) {
          break
        }
      }

      if (hasAllAssets(latest)) {
        break
      }
    }

    for (const key of [
      PLATFORM_ARCH.WIN_X64,
      PLATFORM_ARCH.WIN_IA32,
      PLATFORM_ARCH.WIN_ARM64,
    ]) {
      if (latest[key]) {
        const releasesUrl = `https://github.com/${ account }/${ repository }/releases/download/${ latest[key].version }/RELEASES`
        const releasesRes = await fetch(releasesUrl)
        if (releasesRes.status < 400) {
          const body = await releasesRes.text()
          const matches = body.match(/[^ ]*\.nupkg/gim)
          assert(matches)
          const nuPKG = releasesUrl.replace('RELEASES', matches[0])
          latest[key].RELEASES = body.replace(matches[0], nuPKG)
        }
      }
    }

    return hasAnyAsset(latest) ? latest : null
  }
}

const hasAllAssets = (latest: Record<string, any>) => {
  return !!(
    latest[PLATFORM_ARCH.DARWIN_X64] &&
    latest[PLATFORM_ARCH.DARWIN_ARM64] &&
    latest[PLATFORM_ARCH.WIN_X64] &&
    latest[PLATFORM_ARCH.WIN_IA32] &&
    latest[PLATFORM_ARCH.WIN_ARM64]
  )
}

const hasAnyAsset = (latest: Record<string, any>) => {
  return !!(
    latest[PLATFORM_ARCH.DARWIN_X64] ||
    latest[PLATFORM_ARCH.DARWIN_ARM64] ||
    latest[PLATFORM_ARCH.WIN_X64] ||
    latest[PLATFORM_ARCH.WIN_IA32] ||
    latest[PLATFORM_ARCH.WIN_ARM64]
  )
}

const notFound = (res: http.ServerResponse, message = 'Not found') => {
  res.statusCode = 404
  res.end(message)
}

const badRequest = (res: http.ServerResponse, message: string) => {
  res.statusCode = 400
  res.end(message)
}

const noContent = (res: http.ServerResponse) => {
  res.statusCode = 204
  res.end()
}

const json = (res: http.ServerResponse, obj: object) => {
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(obj))
}