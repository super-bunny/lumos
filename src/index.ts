import { isMainThread } from 'worker_threads'
import workerThread from './workerThread'

if (isMainThread) {
  require('./main')
} else {
  workerThread()
}