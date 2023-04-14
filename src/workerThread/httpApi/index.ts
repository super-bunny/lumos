import Koa, { Context, DefaultState } from 'koa'
import cors from '@koa/cors'
import bodyParser from 'koa-bodyparser'
import jwtMiddleware from 'koa-jwt'
import router from './routes'
import GenericDisplayManager from '../../main/classes/GenericDisplayManager'
import GlobalContext from './types/GlobalContext'

export interface InitHttpApiArgs {
  host: string
  port: number
  sessionJwtSecret: string,
  jwtSecret: string,
  context: {
    displayManager: GenericDisplayManager
    enableAuthentification: boolean
  }
}

// Minimal creation date for session token. This prevents old session token to stay valid at long term.
// Minus 2 minutes to handle delay between token creation and api initialization.
const SESSION_JWT_MIN_CREATION_DATE = Date.now() - 1000 * 60 * 2 // 2 minutes

export default function initHttpApi({ host, port, sessionJwtSecret, jwtSecret, context }: InitHttpApiArgs): void {
  const app = new Koa<DefaultState, GlobalContext>()

  // Context
  app.context.displayManager = context.displayManager

// Middlewares
  app
    .use(cors())
    .use(bodyParser())
    .use(
      context.enableAuthentification
        ? jwtMiddleware({
          secret: [jwtSecret, sessionJwtSecret],
          isRevoked: async (ctx: Context, decodedToken: Record<string, any>, token: string): Promise<boolean> => {
            // Check if token has been created on this app session
            return decodedToken.iat * 1000 < SESSION_JWT_MIN_CREATION_DATE
          },
        }).unless({ path: ['/'] })
        : (ctx, next) => next(),
    )
    // Custom error handlers
    .use(async (ctx, next) => {
      try {
        await next()
      } catch (err) {
        // Handle custom errors here

        // Pass error to default handle
        throw err
      }
    })

// Routes
  app
    .use(router.routes())
    .use(router.allowedMethods())

  app.listen({
    host,
    port,
  }, () => console.info(`Http api started, listening on port ${ port }`))
}