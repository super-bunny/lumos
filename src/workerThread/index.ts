import { workerData } from 'worker_threads'
import GenericDisplayManager from '../main/classes/GenericDisplayManager'
import initHttpApi from './httpApi'
import { BackendWorkerData } from '../main/classes/BackendWorker'
import DdcBackendClient from '../shared/classes/DdcBackendClient'

export default function workerThread(): void {
  const { enableHttpApi, httpApiPort, httpApiHost, jwtSecret, sessionJwtSecret } = workerData as BackendWorkerData
  const displayManager = new GenericDisplayManager(new DdcBackendClient())

  displayManager.refresh().then()

  if (enableHttpApi) {
    initHttpApi({
      host: httpApiHost,
      port: httpApiPort ?? 8787,
      jwtSecret,
      sessionJwtSecret,
      context: { displayManager },
    })
  }
}