module.exports = {
  packagerConfig: {
    platform: [
      'darwin',
      'win32',
      'linux',
    ],
    icon: './src/shared/assets/icons/lumos_icon',
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        iconUrl: 'https://github.com/super-bunny/lumos/raw/dev/src/shared/assets/icons/lumos_icon.ico',
        setupIcon: './src/shared/assets/icons/lumos_icon.ico',
      },
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        icon: './src/shared/assets/icons/lumos_icon.icns',
        format: 'ULFO',
        overwrite: true,
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: [
        'darwin',
      ],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        icon: './src/shared/assets/icons/lumos_icon.png',
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-webpack',
      config: {
        devServer: {
          liveReload: false,
        },
        mainConfig: './webpack.main.config.js',
        renderer: {
          config: './webpack.renderer.config.js',
          entryPoints: [
            {
              name: 'main_window',
              html: './src/renderer/index.html',
              js: './src/renderer/index.tsx',
              preload: {
                js: './src/main/preload.ts',
              },
            },
            {
              name: 'overlay_window',
              html: './src/overlay/index.html',
              js: './src/overlay/index.tsx',
              preload: {
                js: './src/main/preload.ts',
              },
            },
          ],
        },
      },
    },
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      platforms: [
        'win32',
        'darwin',
        'linux',
      ],
      config: {
        repository: {
          owner: 'super-bunny',
          name: 'lumos',
        },
      },
    },
  ],
}
