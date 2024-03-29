import { Worker } from 'worker_threads'
import { IpcMessage } from '../../types/Ipc'

export interface BackendWorkerData {
  enableHttpApi: boolean
  httpApiHost: string
  httpApiPort: number
  jwtSecret: string
  sessionJwtSecret: string
  enableAuthentification: boolean
}

export interface BackendWorkerPromises {
}

export default class BackendWorker {
  readonly worker: Worker

  protected promises: BackendWorkerPromises = {}

  constructor(workerData: BackendWorkerData) {
    this.worker = new Worker(__filename, {
      workerData,
    })

    this.initPromises()
    this.initEventHandlers()
  }

  protected initPromises(): void {
  }

  protected initEventHandlers(): void {
    this.worker.on('message', ({ event, payload }: IpcMessage) => {
    })
  }
}