import useSwr from 'swr'
import GenericDisplay from '../../shared/classes/GenericDisplay'
import IpcBackendClient from '../classes/IpcBackendClient'
import { useMemo } from 'react'
import { Backends } from '../../types/EnhancedDDCDisplay'
import useSettingsStore from './useSettingsStore'

export default function useMonitors() {
  const { settingsStore } = useSettingsStore()
  const { ignoreWinApi, monitorAliases } = settingsStore?.settings ?? {}

  const swrResponse = useSwr(settingsStore ? 'monitors' : null, () => GenericDisplay.list(new IpcBackendClient(false)), {
    revalidateOnReconnect: false,
    revalidateOnFocus: false,
    revalidateIfStale: false,
  })

  const processedMonitors = useMemo(() => {
    let monitors = swrResponse.data

    if (ignoreWinApi) {
      monitors = monitors?.filter(display => display.info.backend !== Backends.WIN_API)
    }
    if (monitorAliases) {
      monitors?.forEach(display => display.alias = monitorAliases[display.info.displayId] ?? null)
    }

    return monitors
  }, [ignoreWinApi, monitorAliases, swrResponse.data])

  return {
    monitors: processedMonitors,
    refreshMonitors: () => swrResponse.mutate(),
    ...swrResponse,
  }
}