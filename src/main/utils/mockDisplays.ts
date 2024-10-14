import DdcBackendClient from '../../shared/classes/DdcBackendClient'
import { Backends, VcpValueType } from '../../types/EnhancedDDCDisplay'
import VCPFeatures from '../../types/VCPFeatures'

export function mockDisplays(): void {
  DdcBackendClient.prototype.list = async () => {
    console.debug('Display.list() mock called')

    await new Promise(resolve => setTimeout(resolve, Math.random() * 3000))

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
          backend: Backends.NV_API,
          displayId: 'AOC',
          capabilities: '(vcp(02 04 05 08 10 12 14(01 05 06 08 0B) 16 18 1A 60(01 03)62 6C 6E 70 C8 C9 B0 B6 D6 DF F8)prot(monitor)type(LCD)cmds(01 02 03 07 0C F3)mccs_ver(2.1)asset_eep(64)mpu_ver(001)model(I2490PXQU)mswhql(1))',
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
          capabilities: '(prot(monitor)type(LCD)model(550)mccs_ver(2.0)vcp(04 05 08 10 12 14(03 04 02 07 08 0B) 16 18 1A 60(01 05 06) 87 B0(01 02) B6 C6 C8 C9 D6(01 04) DC(01 02 03 04 05 06 F0 F1 F2 F9 FA FB) DB(00 04 FD FE) DF EB(00 01 09 FD) EC(00 01 02 03 04 06 05) F2 F3(00 01 02) F6 F7(00 02 03) )mswhql(1))',
        },
      ],
    )
  }

  DdcBackendClient.prototype.setVcpValue = (...args) => {
    console.debug('Display.setVcpValue() mock called with args:', args)

    return Promise.resolve(undefined)
  }
  DdcBackendClient.prototype.getVcpValue = async (...args) => {
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

  DdcBackendClient.prototype.supportDDC = (id) => {
    console.debug('Display.supportDDC() mock called')

    if (id === 'Mi Monitor') return Promise.resolve(true)

    return Promise.resolve(Math.random() > 0.5)
  }
}
