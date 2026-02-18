import type { Request, Response } from 'express'

export const handlerReadiness = (_: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader('Cache-Control', 'no-cache')
  res.status(200)
  res.send('OK')
}
