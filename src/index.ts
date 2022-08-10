import { isMainThread } from 'worker_threads'
import workerThread from './workerThread'
import main from './main'

if (isMainThread) {
  main()
} else {
  workerThread()
}