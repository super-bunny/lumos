import Router from '@koa/router'
import { DefaultState } from 'koa'
import GlobalContext from '../types/GlobalContext'

const router = new Router<DefaultState, GlobalContext>({
  prefix: 'displays',
})

router.get(
  '/',
  async ctx => {
    ctx.displayManager.refresh()
    const displays = ctx.displayManager.list.map(display => display.info)

    ctx.body = {
      displays,
    }
  },
)

router.get(
  '/:id/support-ddc',
  async ctx => {
    const { id } = ctx.params

    try {
      const supportDDC = ctx.displayManager.supportDDCById(id)

      ctx.body = {
        supportDDC,
      }
    } catch (err) {
      console.debug(err)
      ctx.status = 404
      ctx.body = {
        error: (err as Error).message,
      }
    }
  },
)

router.get(
  '/:id/vcp-feature/:featureCode',
  async ctx => {
    const { id, featureCode: featureCodeStr } = ctx.params
    const featureCode = parseInt(featureCodeStr, 10)

    try {
      const vpcValue = ctx.displayManager.getVcpValueById(id, featureCode)

      ctx.body = {
        vpcValue,
      }
    } catch (err) {
      console.debug(err)
      ctx.status = 404
      ctx.body = {
        error: (err as Error).message,
      }
    }
  },
)

router.post(
  '/:id/vcp-feature',
  async ctx => {
    const { id } = ctx.params
    const { featureCode, value } = ctx.body

    try {
      ctx.displayManager.setVcpValueById(id, featureCode, value)
    } catch (err) {
      console.debug(err)
      ctx.status = 404
      ctx.body = {
        error: (err as Error).message,
      }
    }
  },
)

export default router
