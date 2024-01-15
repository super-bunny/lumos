import { marked } from 'marked'
import React from 'react'
import Loader from '../atoms/Loader'
import { baseUrl } from 'marked-base-url'
import ChangelogManifest from '../../../types/ChangelogManifest'
import { UpdateChannels } from '../../../types/UpdateChannels'
import useSettingsStore from '../../hooks/useSettingsStore'
import Center from '../atoms/Center'
import semver from 'semver'
import deduplicateArray from '../../../shared/utils/deduplicateArray'
import useSWRImmutable from 'swr/immutable'
import { styled } from '@mui/material'

interface Props {
  version: string
  locale?: string
}

const BASE_URL = 'https://raw.githubusercontent.com/super-bunny/lumos/dev/changelogs'
export const FALLBACK_LOCALE = 'en_us'

async function requestChangelog(version: string, locale: string): Promise<string | null> {
  return fetch(`${ BASE_URL }/v${ version }/${ locale }.md`)
    .then(response => response.ok ? response.text() : null)
    .catch(() => null)
}

const StyledChangelog = styled('div')`
  h1 {
    margin-top: 0;
  }
`

export async function getChangelog(appVersion: string, updateChannel: UpdateChannels, locale: string): Promise<{
  version: string,
  content: string,
  locale: string
}> {
  const manifest: ChangelogManifest | null = await fetch(`${ BASE_URL }/latest.json`)
    .then(response => response.json())
    .catch(() => null)

  const versionToTry: Array<string> = deduplicateArray(
    [
      appVersion,
      manifest?.v1[updateChannel],
      manifest?.v1[UpdateChannels.STABLE],
    ]
      .filter((version): version is string => !!version && semver.lte(version, appVersion)),
    // .sort((a, b) => semver.valid(a) && semver.valid(b) ? semver.compare(b, a) : 0),
  )

  for (const key in versionToTry) {
    const version = versionToTry[key]

    const content = await requestChangelog(version, locale)
    if (content) return {
      version,
      locale,
      content,
    }

    if (locale === FALLBACK_LOCALE) continue

    const fallbackContent = await requestChangelog(version, FALLBACK_LOCALE)
    if (fallbackContent) return {
      version,
      locale: FALLBACK_LOCALE,
      content: fallbackContent,
    }
  }

  throw new Error('All changelog sources have failed')
}

export default function ChangelogViewer({ version, locale = FALLBACK_LOCALE }: Props) {
  marked.use(baseUrl(`${ BASE_URL }/${ version }`))

  const { settingsStore } = useSettingsStore()
  const updateChannel = settingsStore?.settings.updater?.channel

  const {
    data,
    isLoading,
    error,
  } = useSWRImmutable(
    // Waiting for update channel from settings
    updateChannel ? ['getChangelog', version, updateChannel, locale] : null,
    () => getChangelog(version, updateChannel!, locale),
    { errorRetryCount: 1 },
  )

  if (isLoading) return <Loader/>

  if (error) return (
    <Center>
      <div>Fail to retrieve content: { error.message }</div>
    </Center>
  )

  return (
    <div>
      <StyledChangelog dangerouslySetInnerHTML={ { __html: marked.parse(data?.content ?? '') } }/>
      <div
        style={ {
          marginBottom: 12,
          fontSize: '0.8em',
        } }
      >
        v{ data?.version } ({ data?.locale.toLowerCase() })
      </div>
    </div>
  )
}