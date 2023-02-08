import type { ClientOptions } from '@sentry/types/types/options'
import packageJson from '../../../package.json'

// Must be a function to allow this file to be import in renderer process.
// The "process" global is not defined in renderer process.
export function envVarAllowSentry(): boolean {
  return process.env.NODE_ENV === 'production' && process.env.ENABLE_SENTRY === 'true'
}

export const sentryBaseDefaultOptions: Partial<ClientOptions> = {
  dsn: 'https://9deeaf05c9e94e56b00a9b1f21b629ff@o4504311830806528.ingest.sentry.io/4504311833952256',
  environment: process.env.NODE_ENV,
  release: packageJson.version,
}

