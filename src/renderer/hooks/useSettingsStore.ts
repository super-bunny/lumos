import useSwr from 'swr'
import { useCallback } from 'react'
import Settings from '../../types/Settings'

const KEY = 'settings'

export default function useSettingsStore() {
  const { data, mutate, ...rest } = useSwr(KEY, () => window.lumos.store.getSettings(), {
    revalidateOnReconnect: false,
    revalidateOnFocus: false,
  })

  const updateSettings = useCallback(async (partialSettings: Partial<Settings>) => {
    if (!data) return
    const newSettings = { ...data.settings, ...partialSettings }
    await mutate({ ...data, settings: newSettings }, { revalidate: false })
    return window.lumos.store.setSettings(newSettings)
  }, [data, mutate])

  return {
    settingsStore: data,
    mutate,
    ...rest,
    updateSettings,
  }
}