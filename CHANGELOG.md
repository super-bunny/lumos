# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [0.1.0](https://github.com/super-bunny/lumos/releases/tag/v0.1.0) (2023-02-18)


### Features

* add option to disable sentry error reporting ([04794cb](https://github.com/super-bunny/lumos/commit/04794cb2e5bbe34aaae1fe6e4b1d52ee485372c8))
* delay display of refresh brightness button tooltip (500ms) ([fb0feb4](https://github.com/super-bunny/lumos/commit/fb0feb4951d88bc94ba1da1ac3d00e95478585ac))
* add developer mode setting ([1d87af9](https://github.com/super-bunny/lumos/commit/1d87af9817aab452d3ef7866366bba8d77012b53))
* add "more menu" on monitor brightness card ([3385c76](https://github.com/super-bunny/lumos/commit/3385c76e090146b28b1f56a288c50866cc858119))
* add method to get vcp version from monitor ([511055a](https://github.com/super-bunny/lumos/commit/511055a4e28ed0427132df4bcba7d6c72961c253))
* make backend return capability string in monitor info ([8de72ab](https://github.com/super-bunny/lumos/commit/8de72abbe490de4b1e52b6e0d2a90cd0272027b6))
* replace old synchronous ddc/ci library by a new asynchronous
  one ([4a224d](https://github.com/super-bunny/lumos/commit/4a224de85386c3ddda28d4adde138f6726688799))


### Bug Fixes

* allow non unique shortcuts to be set multiple times ([85fc725](https://github.com/super-bunny/lumos/commit/85fc725fd5f4b82501250d01f2b7d4278b5a566a))
* remove duplicates from monitor list on settings shortcut page  ([1a7be49](https://github.com/super-bunny/lumos/commit/1a7be496d2ab43052ac71a85f111428a7d3e99aa))
* handle brightness refresh error  ([5b39583](https://github.com/super-bunny/lumos/commit/5b395839ad4f9e2d1821a2e56d9cf7366f34a99e))


### Dependencies

* update electron from v19 to v22 ([368e9fa](https://github.com/super-bunny/lumos/commit/368e9fa4d61f807d970477026198370949015377))
* add notistack npm package ([14b3263](https://github.com/super-bunny/lumos/commit/14b32639a9b63ee06c2e6143afb0954681d911ff))

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