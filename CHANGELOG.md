# Changelog

## [Unreleased](https://github.com/super-bunny/lumos/tree/dev)

None

## [0.1.0-alpha.8](https://github.com/super-bunny/lumos/releases/tag/v0.1.0-alpha.8) (2022-12-13)

- Set default setting for "minimize app on startup" to false
- Remove potentially dangerous api exposed to renderer process
- Expose static env var to renderer process instead of getter method
- Makefile now delete artifact directory before build
- Remove useless mock call code in MonitorList component
- Add cache on monitor list and features
- Add brightness refresh button on monitor cards
- Add setting to enable HTTP API (default to false)
- Add Sentry monitoring

## [0.1.0-alpha.7](https://github.com/super-bunny/lumos/releases/tag/v0.1.0-alpha.7) (2022-12-6)

### Features

- Add option to minimize app on close
- Add option to start app on login

### Bug Fixes

- Fix UI theme setup on app windows opening

### Others

- Add Dockerfile to build windows installer