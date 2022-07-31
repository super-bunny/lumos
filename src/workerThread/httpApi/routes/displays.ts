import Router from '@koa/router'
import { DefaultState } from 'koa'
import GlobalContext from '../types/GlobalContext'

const router = new Router<DefaultState, GlobalContext>({
  prefix: 'displays',
})

router.get(
  '/',
  async ctx => {
    if (ctx.displayManager.list.length === 0) {
      ctx.displayManager.refresh()
    }

    const displays = ctx.displayManager.list.map(display => display.info)

    ctx.body = {
      displays,
    }
  },
)

router.post(
  '/support-ddc',
  async ctx => {
    const { id } = ctx.body

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

router.post(
  '/get-vcp-feature/',
  async ctx => {
    const { id, featureCode } = ctx.body

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
  '/set-vcp-feature',
  async ctx => {
    const { id, featureCode, value } = ctx.body

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
