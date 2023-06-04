// Return current platform and some utility booleans
export default function usePlatform() {
  return {
    platform: window.lumos.platform,
    isWindows: window.lumos.platform === 'win32',
    isMac: window.lumos.platform === 'darwin',
    isLinux: window.lumos.platform === 'linux',
  }
}