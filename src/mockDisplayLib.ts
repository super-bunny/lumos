import { Display, VCPValueType } from 'ddc-rs'

export function mockDisplayLib(): void {
  // DisplayManager.prototype.list = () => [
  //   {
  //     index: 0,
  //     backend: 'test_backend_1',
  //     displayId: '097JKTT6YDtcnonzdoz753poa',
  //   },
  //   {
  //     index: 1,
  //     backend: 'test_backend_1',
  //     displayId: 'pojaojda79jononzdoz753poa',
  //   },
  //   {
  //     index: 2,
  //     backend: 'test_backend_1',
  //     displayId: 'pod8KD9da79j9nf6zdoz753poa',
  //   },
  //   {
  //     index: 3,
  //     backend: 'test_backend_2',
  //     displayId: 'K96G7jda79KL9JIY56D5753poa',
  //   },
  //   {
  //     index: 4,
  //     backend: 'test_backend_2',
  //     displayId: 'K96G7jda79KL9JIY56D5753poa',
  //   },
  //   {
  //     index: 5,
  //     backend: 'test_backend_2',
  //     displayId: 'K96G7jda79KL9JIY56D5753poa',
  //   },
  // ]

  Display.prototype.setTableVcpFeature = () => undefined
  Display.prototype.setVcpFeature = () => undefined
  Display.prototype.getVcpFeature = () => {
    const maximum = Math.round(Math.random() * 1000)

    return {
      type: VCPValueType.CONTINUOUS,
      currentValue: Math.round(Math.random() * maximum),
      value: Math.round(Math.random() * maximum),
      maximumValue: maximum,
    }
  }
}
