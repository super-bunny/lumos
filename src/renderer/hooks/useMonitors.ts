import useSwr from 'swr'
import GenericDisplay from '../../shared/classes/GenericDisplay'
import IpcBackendClient from '../classes/IpcBackendClient'
import { useMemo } from 'react'
import { Backends } from '../../types/EnhancedDDCDisplay'

export interface Options {
  ignoreWinApi?: boolean
}

export default function useMonitors(options?: Options) {
  const { ignoreWinApi = false } = options ?? {}

  const swrResponse = useSwr('monitors', () => GenericDisplay.list(new IpcBackendClient()), {
    revalidateOnReconnect: false,
    revalidateOnFocus: false,
    revalidateIfStale: false,
  })

  const processedMonitors = useMemo(() => {
    if (ignoreWinApi) return swrResponse.data?.filter(display => display.info.backend !== Backends.WIN_API)

    return swrResponse?.data
  }, [ignoreWinApi, swrResponse.data])

  return {
    monitors: processedMonitors,
    refreshMonitors: () => swrResponse.mutate(),
    ...swrResponse,
  }
}