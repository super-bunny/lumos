import { workerData } from 'worker_threads'
import DisplayManager from '../main/classes/DisplayManager'
import initHttpApi from './httpApi'
import { BackendWorkerData } from '../main/classes/BackendWorker'

export default function workerThread(): void {
  const { httpApiPort, httpApiHost, jwtSecret, sessionJwtSecret } = workerData as BackendWorkerData
  const displayManager = new DisplayManager()

  displayManager.refresh()

  initHttpApi({
    host: httpApiHost,
    port: httpApiPort ?? 8787,
    jwtSecret,
    sessionJwtSecret,
    context: { displayManager },
  })
}