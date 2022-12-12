import { isMainThread } from 'worker_threads'
import workerThread from './workerThread'
import { sentryIsEnabled } from './shared/utils/sentry'

if (isMainThread) {
  if (sentryIsEnabled()) {
    console.info('Sentry is enabled')
    require('./main/utils/initSentry').default()
  }

  require('./main').default()
} else {
  workerThread()
}