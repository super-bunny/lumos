export default class Deferred<T = any> {
  readonly promise: Promise<T>
  resolve!: (value: T) => void
  reject!: (reason: any) => void

  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.reject = reject
      this.resolve = resolve
    })
  }
}