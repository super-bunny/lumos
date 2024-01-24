# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [0.2.0](https://github.com/super-bunny/lumos/releases/tag/v0.2.0) (2024-01-24)


### Features

* add custom style for scrollbars in app ([8ca605d](https://github.com/super-bunny/lumos/commit/8ca605d5c67ae5aef64c51df375313895213efcb))
* add a setting to hide monitors from monitor list ([5bfbbb8](https://github.com/super-bunny/lumos/commit/5bfbbb8d4b3f920097d3c75778daeecff1c04f6a))
* add in app changelog ([c76ab87](https://github.com/super-bunny/lumos/commit/c76ab871e24e1cfe468ca0848da43e83edd5f544))
* throttle brightness change ([75041f2](https://github.com/super-bunny/lumos/commit/75041f2062539c1102e67751258f97c82eb30ced))
* throttle global shortcut handlers ([b046664](https://github.com/super-bunny/lumos/commit/b0466644f22bef18d5127554dd4620545c1eb5d2))
* add restart action in app tray menu ([d818788](https://github.com/super-bunny/lumos/commit/d818788b968f7674d629156a98e0d3dd5eb51eca))
* **overlay:** add fade in/out animation for overlay ([90d97fa](https://github.com/super-bunny/lumos/commit/90d97fae86881bc59d858ffc7634119a65607ea0))


### Bug Fixes

* fix missing app window icon on windows os ([926640f](https://github.com/super-bunny/lumos/commit/926640fc1e8837da9ed6c5022657ea241015d531))
* avoid concurrent monitor listing across processes ([7482ef1](https://github.com/super-bunny/lumos/commit/7482ef14ea0a4cfc69a12c61f4ee9577d99039cd))
* **overlay:** make overlay visible on all workspaces ([760be73](https://github.com/super-bunny/lumos/commit/760be73c72746c0e7254f2a48d4adf46356c1a01))
* **overlay:** reduce size of brightness value ([61e3783](https://github.com/super-bunny/lumos/commit/61e3783d674345877edee449d9d8accc21cad124))


### Dependencies

* update react related npm packages ([db577de](https://github.com/super-bunny/lumos/commit/db577dec1402467da4ec5c9f50a8c601576bc130))
* update eslint npm packages ([2c58753](https://github.com/super-bunny/lumos/commit/2c5875381cf6e08f8174fef399a67f027411ac4e))
* update build related deps like electron forge and webpack plugins ([60a52d3](https://github.com/super-bunny/lumos/commit/60a52d399af3e044a1959f11e61ed28dbbf1a519))
* update jsonwebtoken npm package ([a787703](https://github.com/super-bunny/lumos/commit/a78770379b36438c9262f2ff8f166514ed1ac7bb))
* update typescript npm package ([2690fd3](https://github.com/super-bunny/lumos/commit/2690fd382761d45d99e24a96acff9d11a6c11f96))

## [0.2.0-beta.1](https://github.com/super-bunny/lumos/releases/tag/v0.2.0-beta.1) (2023-06-06)


### Features

* add material dark theme and set light theme as default ([6d95558](https://github.com/super-bunny/lumos/commit/6d955580201a120ba57a9d660e75ff9902438966))
* add auto updater ([be6a9dc](https://github.com/super-bunny/lumos/commit/be6a9dc7b284e76aade654aad5199d033f4616b1))


### Bug Fixes

* **overlay:** prevent out of range brightness values in overlay ([02c8e67](https://github.com/super-bunny/lumos/commit/02c8e67c8931352afc25641a47e48e991fed4ebe))
* fix bad behavior of app minimizing on startup ([31f81f4](https://github.com/super-bunny/lumos/commit/31f81f49369ba8dea3cfb6a54777df3f3885b412))
* remove duplicate display list refresh on startup ([aadc66e](https://github.com/super-bunny/lumos/commit/aadc66eb3fc1cf7b31b3785da1b703ff89bfccda))


### Dependencies

* update swr npm packages ([f3ef211](https://github.com/super-bunny/lumos/commit/f3ef211d3071cc6d3967b583cf2a1f1f0ad5ee58))

## [0.2.0-beta.0](https://github.com/super-bunny/lumos/releases/tag/v0.2.0-beta.0) (2023-05-03)


### Features

* add overlay to show brightness change ([8b347ba](https://github.com/super-bunny/lumos/commit/8b347ba337c2a35b9f14f42c3b7a4fc71e99cd6f))
* auto hide menu bar on app window ([826c192](https://github.com/super-bunny/lumos/commit/826c1924f5a6a60bcbf5f374c2134b6ef18988d0))

### [0.1.1](https://github.com/super-bunny/lumos/releases/tag/v0.1.1) (2023-04-14)


### Features

* add option to disable http api authentification ([8d996a0](https://github.com/super-bunny/lumos/commit/8d996a0cda87c52478489da83af22115782fd1e8))
* add debug option to copy http api session token to clipboard  ([177ba0e](https://github.com/super-bunny/lumos/commit/177ba0e5118e16f87248666c93bd2b56bece97aa))
* allow to set an alias for each monitor ([f095105](https://github.com/super-bunny/lumos/commit/f095105092acc4456978e381014869809053fc6d))
* improve VCP debug tool with a vcp feature selector ([9d71a52](https://github.com/super-bunny/lumos/commit/9d71a52a2599ae54f6a1ecc2c1e68974e5ed0a74))


### Bug Fixes

* ask for app restart on concurrent DDC request setting change ([bdd443c](https://github.com/super-bunny/lumos/commit/bdd443c95a2ea47be3d247c735b7f27b8e93da57))
* fix vcp value input in <VcpDevTool/> ([7ec5522](https://github.com/super-bunny/lumos/commit/7ec552236ef1e359e476254771adf77d9fe98225))


### Dependencies

* update mui packages ([799b4ca](https://github.com/super-bunny/lumos/commit/799b4ca0697f6cfb34b0589e5f0a25ab67cbf06c))

### [0.1.1-alpha.3](https://github.com/super-bunny/lumos/releases/tag/v0.1.1-alpha.3) (2023-04-12)


### Features

* add VCP dev tool in settings ([24890a1](https://github.com/super-bunny/lumos/commit/24890a1ff73beee18521c8319e1e26dfa95a3222))
* add debug action to list Electron monitors ([620d570](https://github.com/super-bunny/lumos/commit/620d5704a27630caf0aef39091a6551fbd30da4e))

### [0.1.1-alpha.2](https://github.com/super-bunny/lumos/releases/tag/v0.1.1-alpha.2) (2023-04-02)


### Features

* add option to delay ddc support request  ([63f921e](https://github.com/super-bunny/lumos/commit/63f921e992e4698975076063f9e1f01eacfdaf87))
* add a retry button to check if monitor support DDC ([bb725a3](https://github.com/super-bunny/lumos/commit/bb725a362147c4bf14f83c1bdff35cd0b2775b76))
* stop deduplicate monitors and add an option to ignore windows api  ([e462298](https://github.com/super-bunny/lumos/commit/e462298e5ee97665efd19c1673ddc21a7f6edfce))
* show monitor backend only in developer mode ([5aa33c1](https://github.com/super-bunny/lumos/commit/5aa33c16d84e24a8cf4108a2d883128fa9527b34))
* improve design of settings pages ([ca04c9e](https://github.com/super-bunny/lumos/commit/ca04c9e49cc968f46f5acf65781d5dcbd6224c2c))


### Bug Fixes

* clear cache for DDC support check on monitor list refresh ([be204d5](https://github.com/super-bunny/lumos/commit/be204d5ff90ef4e6bf1fe3d2f6541b44c1a5ffcd))
* remove unexpected cache on monitor DDC support check ([e39ab3b](https://github.com/super-bunny/lumos/commit/e39ab3bf7b0e01db1896982e268518e321aa010d))
* use index in display id if monitor is provider by winApi backend ([44ebbfd](https://github.com/super-bunny/lumos/commit/44ebbfd502e8d1007605ea45c07f029d848317f9))
* toast error if fail to set monitor brightness ([f490e76](https://github.com/super-bunny/lumos/commit/f490e765de6180e51356ab209375245b611506b0))
* disable cache on monitor ddc support  ([117f315](https://github.com/super-bunny/lumos/commit/117f31593bb1a517b15f625c75b4119626103605))
* show backend name even if monitor is marked as not support ([5458444](https://github.com/super-bunny/lumos/commit/5458444fff88d9bd846d0a602826c206111f153d))

### [0.1.1-alpha.1](https://github.com/super-bunny/lumos/releases/tag/v0.1.1-alpha.1) (2023-03-25)


### Features

* **settings:** rework debug zone in advanced setting ([e1d6c16](https://github.com/super-bunny/lumos/commit/e1d6c16b05d6b7fd83c0989326036ea3b132868d))


### Bug Fixes

* restore cache on monitor list ([cf3eb16](https://github.com/super-bunny/lumos/commit/cf3eb163def720c1e2ecb93102c557497e12a2a2))
* make update checker ignore pre-release ([2f9a821](https://github.com/super-bunny/lumos/commit/2f9a8219e1b15df6532ee2f1b6848e3b3fb7fc0d))

### [0.1.1-alpha.0](https://github.com/super-bunny/lumos/releases/tag/v0.1.1-alpha.0) (2023-03-16)


### Features

* add developer test zone in advanced settings ([44171db](https://github.com/super-bunny/lumos/commit/44171dbcdcd6015786d3ea433d01e2a435741e1e))
* add option to power a monitor on system shutdown  ([36c46cc](https://github.com/super-bunny/lumos/commit/36c46cc107b902bc68dcf329a79d6bc61a220e77))
* add update method to settings store hook ([eb2902f](https://github.com/super-bunny/lumos/commit/eb2902f39c622ea29fefe45e32aa26a00379af43))

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