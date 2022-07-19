import './index.css'
import './root.tsx'

window.lumos.getEnv()
  .then(env => console.debug('Env:', env))
window.lumos.display.list()
  .then(displays => console.info('Monitor list:', displays))

console.log('👋 This message is being logged by "renderer.js", included via webpack')
