import { isMainThread } from 'worker_threads'
import workerThread from './workerThread'
import { canEnableSentry } from './shared/utils/sentry'

if (isMainThread) {
  if (canEnableSentry()) {
    console.info('Sentry is enabled')
    require('./main/utils/initSentry').default()
  }

  require('./main').default()
} else {
  workerThread()
}