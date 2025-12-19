import React, { useCallback, useEffect, useState } from 'react'
import ChangelogDialog from '../molecules/dialogs/ChangelogDialog'
import packageJson from '../../../../package.json'
import useSettingsStore from '../../hooks/useSettingsStore'
import { FALLBACK_LOCALE, getChangelog } from '../molecules/ChangelogViewer'
import semver from 'semver/preload'
import useSWRImmutable from 'swr/immutable'


const LOCAL_STORAGE_KEY = 'auto-changelog-popup'
const APP_VERSION = packageJson.version

export default function AutoChangelogPopup() {
  const [show, setShow] = useState<boolean>(false)

  const { settingsStore } = useSettingsStore()
  const updateChannel = settingsStore?.settings.updater?.channel

  const { data: changelog } = useSWRImmutable(
    // Waiting for update channel from settings
    updateChannel ? [getChangelog, APP_VERSION, updateChannel, FALLBACK_LOCALE] : null,
    () => getChangelog(APP_VERSION, updateChannel!, FALLBACK_LOCALE),
    { errorRetryCount: 1 },
  )

  const onClose = useCallback(() => {
    setShow(false)
    localStorage.setItem(LOCAL_STORAGE_KEY, changelog?.version!)
  }, [changelog?.version])

  useEffect(() => {
    const lastShownVersion = localStorage.getItem(LOCAL_STORAGE_KEY)

    // Prevent changelog display on the first app startup by saving the current version to localStorage
    if (!lastShownVersion) {
      localStorage.setItem(LOCAL_STORAGE_KEY, APP_VERSION)
      return
    }

    if (
      changelog
      && semver.lte(changelog.version, APP_VERSION)
      && lastShownVersion
      && semver.gt(changelog.version, lastShownVersion)
    ) {
      setShow(true)
    }
  }, [changelog])

  return (
    <ChangelogDialog open={ show } onClose={ onClose }/>
  )
}