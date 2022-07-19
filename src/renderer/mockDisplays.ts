import Display from './classes/Display'
import { Backends, VCPValueType } from '../main/classes/AbstractDisplay'

export function mockDisplays(): void {
  Display.list = () => {
    console.debug('Display.list() mock called')

    return Promise.resolve([
        new Display(
          {
            index: 0,
            backend: Backends.WIN_API,
            displayId: '097JKTT6YDtcnonzdoz753poa',
          },
        ),
        new Display(
          {
            index: 1,
            backend: Backends.WIN_API,
            displayId: 'pod8KD9da79j9nf6zdoz753poa',
          },
        ),
        new Display(
          {
            index: 2,
            backend: Backends.WIN_API,
            displayId: 'K96G7jda79KL9JIY56D5753poa',
          },
        ),
        new Display(
          {
            index: 3,
            backend: Backends.NV_API,
            displayId: 'Sony TV',
          },
        ),
        new Display(
          {
            index: 4,
            backend: Backends.NV_API,
            displayId: 'Mi Monitor',
          },
        ),
        new Display(
          {
            index: 5,
            backend: Backends.NV_API,
            displayId: '632du689TT6YDtcnonzdoz753poa',
          },
        ),
      ],
    )
  }

  Display.prototype.setVcpValue = (...args) => {
    console.debug('Display.setVcpValue() mock called with args:', args)

    return Promise.resolve(undefined)
  }
  Display.prototype.getVcpValue = (...args) => {
    console.debug('Display.getVcpValue() mock called with args:', args)

    const maximum = Math.round(Math.random() * 1000)

    return Promise.resolve({
        type: VCPValueType.CONTINUOUS,
        currentValue: Math.round(Math.random() * maximum),
        maximumValue: maximum,
      },
    )
  }

  Display.prototype.supportDDC = () => {
    console.debug('Display.supportDDC() mock called')

    return Promise.resolve(Math.random() > 0.5)
  }
}
