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
      ctx.status = 404
      ctx.body = {
        error: (err as Error).message,
      }
    }
  },
)

router.post(
  '/:id/vpc-value/:featureCode',
  async ctx => {
    const { id } = ctx.params
    const { featureCode } = ctx.body

    try {
      const vpcValue = ctx.displayManager.getVcpValueById(id, featureCode)

      ctx.body = {
        vpcValue,
      }
    } catch (err) {
      ctx.status = 404
      ctx.body = {
        error: (err as Error).message,
      }
    }
  },
)

router.post(
  '/:id/vpc-value',
  async ctx => {
    const { id } = ctx.params
    const { featureCode, value } = ctx.body

    try {
      ctx.displayManager.setVcpValueById(id, featureCode, value)
    } catch (err) {
      ctx.status = 404
      ctx.body = {
        error: (err as Error).message,
      }
    }
  },
)

export default router
