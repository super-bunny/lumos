import useSwr, { mutate, SWRConfiguration } from 'swr'
import { useCallback } from 'react'
import Settings from '../../types/Settings'
import { IpcEvents } from '../../types/Ipc'

const KEY = 'settings'

export interface Options {
  swrConfig?: SWRConfiguration
}

window.lumos.ipc.on(IpcEvents.SETTINGS_UPDATE, () => {
  console.debug('[useSettingsStore] Received settings update')
  mutate(KEY).then()
})

export default function useSettingsStore(options?: Options) {
  const { swrConfig } = options ?? {}

  const { data, mutate, ...rest } = useSwr(KEY, () => window.lumos.store.getSettings(), {
    revalidateOnReconnect: false,
    revalidateOnFocus: false,
    ...swrConfig,
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