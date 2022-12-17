export default function sleepPromise(timeout: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, timeout))
}