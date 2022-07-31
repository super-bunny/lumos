import Router from '@koa/router'
import { version } from '../../../../package.json'
import GlobalContext from '../types/GlobalContext'
import displays from './displays'

const router = new Router<any, GlobalContext>()

router.use('/', displays.routes(), displays.allowedMethods())


router.get('/', (ctx) => {
  ctx.body = {
    appVersion: version,
    apiVersion: 1,
  }
})

export default router
