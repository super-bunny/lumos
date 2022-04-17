import Display from 'ddc-enhanced-rs'

export default class DisplayEnhanced extends Display {
  constructor(uuid: string) {
    super(uuid)
  }

  getBrightnessPercentage(): number {
    const { value, maximum } = this.get_brightness()
    return Math.round(value * 100 / maximum)
  }

  setBrightnessPercentage(value: number): void {
    const { maximum } = this.get_brightness()
    this.set_brightness(Math.round(value * maximum / 100))
  }
}
