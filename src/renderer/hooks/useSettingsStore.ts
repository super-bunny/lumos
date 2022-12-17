import useSwr from 'swr'

const KEY = 'settings'

export default function useSettingsStore() {
  const { data, ...rest } = useSwr(KEY, () => window.lumos.store.getSettings(), {
    revalidateOnReconnect: false,
    revalidateOnFocus: false,
  })

  return {
    settingsStore: data,
    ...rest,
  }
}