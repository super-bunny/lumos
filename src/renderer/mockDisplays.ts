import { Backends, VCPValueType } from '../main/classes/AbstractDisplay'
import IpcBackendClient from './classes/IpcBackendClient'

export function mockDisplays(): void {
  IpcBackendClient.prototype.list = () => {
    console.debug('Display.list() mock called')

    return Promise.resolve([
        {
          index: 0,
          backend: Backends.WIN_API,
          displayId: '097JKTT6YDtcnonzdoz753poa',
        },
        {
          index: 1,
          backend: Backends.WIN_API,
          displayId: 'pod8KD9da79j9nf6zdoz753poa',
        },
        {
          index: 2,
          backend: Backends.WIN_API,
          displayId: 'K96G7jda79KL9JIY56D5753poa',
        },
        {
          index: 3,
          backend: Backends.NV_API,
          displayId: 'Sony TV',
        },
        {
          index: 4,
          backend: Backends.NV_API,
          displayId: 'Mi Monitor',
        },
        {
          index: 5,
          backend: Backends.NV_API,
          displayId: '632du689TT6YDtcnonzdoz753poa',
        },
      ],
    )
  }

  IpcBackendClient.prototype.setVcpValue = (...args) => {
    console.debug('Display.setVcpValue() mock called with args:', args)

    return Promise.resolve(undefined)
  }
  IpcBackendClient.prototype.getVcpValue = (...args) => {
    console.debug('Display.getVcpValue() mock called with args:', args)

    const maximum = Math.round(Math.random() * 1000)

    return Promise.resolve({
        type: VCPValueType.CONTINUOUS,
        currentValue: Math.round(Math.random() * maximum),
        maximumValue: maximum,
      },
    )
  }

  IpcBackendClient.prototype.supportDDC = () => {
    console.debug('Display.supportDDC() mock called')

    return Promise.resolve(Math.random() > 0.5)
  }
}
