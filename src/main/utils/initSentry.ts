import * as Sentry from '@sentry/electron/main'
import { ElectronMainOptions } from '@sentry/electron/main'
import { sentryBaseDefaultOptions } from '../../shared/utils/sentry'

export default function initSentry(options?: ElectronMainOptions): void {
  Sentry.init({
    ...sentryBaseDefaultOptions,
    ...options,
  })
}