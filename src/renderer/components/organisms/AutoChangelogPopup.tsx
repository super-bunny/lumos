import React, { useCallback, useEffect, useState } from 'react'
import ChangelogDialog from '../molecules/dialogs/ChangelogDialog'
import packageJson from '../../../../package.json'
import useSwr from 'swr'
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

  const { data } = useSWRImmutable(
    // Waiting for update channel from settings
    updateChannel ? ['getChangelog', APP_VERSION, updateChannel, FALLBACK_LOCALE] : null,
    () => getChangelog(APP_VERSION, updateChannel!, FALLBACK_LOCALE),
    { errorRetryCount: 1 },
  )

  const onClose = useCallback(() => {
    setShow(false)
    localStorage.setItem(LOCAL_STORAGE_KEY, data?.version!)
  }, [data?.version])

  useEffect(() => {
    const lastShownVersion = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (data && semver.lte(data.version, APP_VERSION) && lastShownVersion !== data.version) setShow(true)
  }, [data])

  return (
    <ChangelogDialog open={ show } onClose={ onClose }/>
  )
}