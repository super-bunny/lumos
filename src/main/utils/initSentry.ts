import * as Sentry from '@sentry/electron/main'
import { sentryBaseDefaultOptions } from '../../shared/utils/sentry'

export default function initSentry(): void {
  Sentry.init(sentryBaseDefaultOptions)
}