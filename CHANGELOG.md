# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [0.1.0-alpha.9](https://github.com/super-bunny/lumos/releases/tag/v0.1.0-alpha.9) (2023-01-02)


### Features

* add global shortcuts ([bcf1c27](https://github.com/super-bunny/lumos/commit/bcf1c276e4cbcbdd95130ac78f6960b60441793c))
* add enter animation on settings page ([de35163](https://github.com/super-bunny/lumos/commit/de351635770293d39219dec7f398a6f638194d9b))
* replace settings button in Header by home button on settings page ([2f3ca74](https://github.com/super-bunny/lumos/commit/2f3ca740d016f6aeb8ebf8a5df74389c44968ec6))
* add setting to enable/disable interface animations ([703b18c](https://github.com/super-bunny/lumos/commit/703b18ca6f4c819439b3a51cbbcbd1a7f29ae435))
* add animations on loader ([a8436e1](https://github.com/super-bunny/lumos/commit/a8436e18f9cede8d7ff8030ebab34c50d8f1756a))
* add animation on monitors list ([ea79a83](https://github.com/super-bunny/lumos/commit/ea79a836690c8e36e0cef9eb5c9feecdc7c278b9))
* rework Settings page ([49135d5](https://github.com/super-bunny/lumos/commit/49135d5a58f05b54ab4e1b7abddce2eec31549ea))


### Bug Fixes

* fix bug in display brightness cache logic (back end) ([fa95245](https://github.com/super-bunny/lumos/commit/fa95245d165439079d12c10f419b4b42c0891755))
* fix default color of InfoIcon component ([8dc19a8](https://github.com/super-bunny/lumos/commit/8dc19a84804c241214c5bdce6eb63e4d8191e08c))
* fix fallback theme logic ([ccd90df](https://github.com/super-bunny/lumos/commit/ccd90df2b6ab8fc5ce5dd7ef17a02dc9f40ef4c6))
* handle error for update check ([a4f6ee0](https://github.com/super-bunny/lumos/commit/a4f6ee0c17743847e683bb4a0fc2904e4df22a1b))
* apply animation setting for settings page animation ([60409cb](https://github.com/super-bunny/lumos/commit/60409cb894974ebd84e8b9e1e09fcfefacf19b3f))
* allow loader message to wrap to avoid container overflow ([a097f16](https://github.com/super-bunny/lumos/commit/a097f16fc33dd7be769b289c53e2a18a1774cb60))

### Dependencies

* update material-ui packages  ([497f2fb](https://github.com/super-bunny/lumos/commit/497f2fb3749f30f118badeb56544cbcbac14d519))
* update electron from v18 to v19 ([f29be7d](https://github.com/super-bunny/lumos/commit/f29be7d0c69a3e09740b2fca910c559f20caae63))

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