import jwt from 'jsonwebtoken'

export default function generateSessionJwt(sessionJwtSecret: string): string {
  return jwt.sign({}, sessionJwtSecret, {
    issuer: 'lumos-app',
    audience: 'session',
  })
}