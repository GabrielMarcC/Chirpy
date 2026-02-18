import { Response, Request } from 'express'
import { config } from '../config.js'

export async function handlerMetrics(_: Request, res: Response) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Cache-Control', 'no-cache')
  res.status(200)

  res.send(`
    <html>
      <body>
        <h1>Welcome, Chirpy Admin</h1>
        <p>Chirpy has been visited ${JSON.stringify(config.fileServerHits)} times!</p>
      </body>
    </html>
    `)
}
