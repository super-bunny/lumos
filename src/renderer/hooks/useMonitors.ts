import useSwr from 'swr'
import GenericDisplay from '../../shared/classes/GenericDisplay'
import IpcBackendClient from '../classes/IpcBackendClient'

export default function useMonitors() {
  const swrResponse = useSwr('monitors', () => {
    return GenericDisplay.list(new IpcBackendClient())
      .then(monitors => GenericDisplay.filterDuplicateDisplay(monitors))
  }, {
    revalidateOnReconnect: false,
    revalidateOnFocus: false,
    revalidateIfStale: false,
  })

  return {
    monitors: swrResponse.data,
    refreshMonitors: () => swrResponse.mutate(),
    ...swrResponse,
  }
}