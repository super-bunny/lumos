// Queue that run sequentially pushed promises
export default class AsyncQueue {
  stack: Array<Promise<any>> = []

  push<T>(fn: (...args: Array<any>) => Promise<T>, delay: number = 0, timer = 60000): Promise<T> {
    if (this.stack.length === 0) {
      const promise = fn().finally(() => this.callback())
      this.stack.push(promise)
      return promise
    }

    const lastPromise = this.stack[this.stack.length - 1]
    const promise = new Promise<T>((resolve, reject) => {
      lastPromise.finally(() => {
        fn()
          .then(resolve)
          .catch(reject)
          .finally(() => this.callback())
      })
    })

    this.stack.push(promise)

    return promise
  }

  protected callback() {
    this.stack.shift()?.then()
  }
}
