import axios from 'axios'
import semver from 'semver'

export interface GithubRelease {
  assets: [
    {
      browser_download_url: string,
      content_type: string,
      created_at: string,
      download_count: number,
      id: number,
      label: string,
      name: string,
      node_id: string,
      size: number,
      state: string,
      updated_at: string,
      uploader: {
        avatar_url: string,
        events_url: string,
        followers_url: string,
        following_url: string,
        gists_url: string,
        gravatar_id: string,
        html_url: string,
        id: number,
        login: string,
        node_id: string,
        organizations_url: string,
        received_events_url: string,
        repos_url: string,
        site_admin: boolean,
        starred_url: string,
        subscriptions_url: string,
        type: string,
        url: string
      },
      url: string
    },
  ],
  assets_url: string,
  author: {
    avatar_url: string,
    events_url: string,
    followers_url: string,
    following_url: string,
    gists_url: string,
    gravatar_id: string,
    html_url: string,
    id: number,
    login: string,
    node_id: string,
    organizations_url: string,
    received_events_url: string,
    repos_url: string,
    site_admin: boolean,
    starred_url: string,
    subscriptions_url: string,
    type: string,
    url: string
  },
  body: string,
  created_at: string,
  draft: boolean,
  html_url: string,
  id: number,
  name: string,
  node_id: string,
  prerelease: boolean,
  published_at: string,
  tag_name: string,
  tarball_url: string,
  target_commitish: string,
  upload_url: string,
  url: string,
  zipball_url: string
}

export default class AppVersionManager {
  constructor(public currentVersion: string) {
  }

  async getUpdate(): Promise<GithubRelease | null> {
    const latestRelease = await this.getLatestVersion()

    if (semver.lt(this.currentVersion, latestRelease.tag_name)) {
      return latestRelease
    }

    return null
  }

  async checkForUpdate(): Promise<boolean> {
    const latestRelease = await this.getLatestVersion()

    return semver.lt(this.currentVersion, latestRelease.tag_name)
  }

  async getLatestVersion(): Promise<GithubRelease> {
    const response = await axios('https://api.github.com/repos/super-bunny/lumos/releases', {
      params: {
        per_page: '1',
      },
    })

    return response.data[0] as GithubRelease
  }
}