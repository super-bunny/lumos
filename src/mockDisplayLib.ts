import { Display, DisplayManager, VCPValueType } from 'ddc-rs'
import EnhancedDisplay, { Backends } from './classes/EnhancedDisplay'

export function mockDisplayLib(): void {
  DisplayManager.prototype.list = () => [
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
  ]

  Display.prototype.setTableVcpFeature = () => undefined
  Display.prototype.setVcpFeature = () => undefined
  Display.prototype.getVcpFeature = () => {
    const maximum = Math.round(Math.random() * 1000)

    return {
      type: VCPValueType.CONTINUOUS,
      currentValue: Math.round(Math.random() * maximum),
      maximumValue: maximum,
    }
  }

  EnhancedDisplay.prototype.supportDDC = () => Math.random() > 0.5
}
