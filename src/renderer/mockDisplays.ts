import IpcBackendClient from './classes/IpcBackendClient'
import VCPFeatures from '../types/VCPFeatures'
import { Backends, VcpValueType } from '../types/EnhancedDDCDisplay'

export function mockDisplays(): void {
  IpcBackendClient.prototype.list = async () => {
    console.debug('Display.list() mock called')

    await new Promise(resolve => setTimeout(resolve, Math.random() * 5000))

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
          capabilities: '(prot(monitor)type(lcd)MStarcmds(01 02 03 07 0C E3 F3)vcp(02 04 05 08 10 12 14(05 08 0B 0C) 16 18 1A 52 60( 11 12 0F) AA(01 02) AC AE B2 B6 C6 C8 C9 D6(01 04 05) DC(00 02 03 05 ) DF FD)mccs_ver(2.1)mswhql(1))',
        },
        {
          index: 5,
          backend: Backends.NV_API,
          displayId: '632du689TT6YDtcnonzdoz753poa',
          capabilities: '(prot(monitor)type(lcd)MStarcmds(01 02 03 07 0C E3 F3)vcp(02 04 05 08 10 12 14(05 08 0B 0C) 16 18 1A 52 60( 11 12 0F) AA(01 02) AC AE B2 B6 C6 C8 C9 D6(01 04 05) DC(00 02 03 05 ) DF FD)mccs_ver(2.1)mswhql(1))',
        },
      ],
    )
  }

  IpcBackendClient.prototype.setVcpValue = (...args) => {
    console.debug('Display.setVcpValue() mock called with args:', args)

    return Promise.resolve(undefined)
  }
  IpcBackendClient.prototype.getVcpValue = async (...args) => {
    console.debug('Display.getVcpValue() mock called with args:', args)
    const [, vcpCode] = args

    if (vcpCode === VCPFeatures.DisplayControl.Version) {
      return Promise.resolve({
        type: VcpValueType.Continuous,
        currentValue: 513,
        maximumValue: 255,
      })
    }

    const maximum = Math.round(Math.random() * 1000)

    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000))

    return Promise.resolve({
        type: VcpValueType.Continuous,
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
