import http from 'node:http'

import {json} from './middlewares/json.js'
import {routes} from './routes.js'

const server = http.createServer(async (req, res) => {
  const {method, url} = req

  await json(req, res)

  const route = routes.find((route) => {
    return route.path === url && route.method === method
  })

  if (route) {
    return route.handler(req, res)
  }

  res.writeHead(404).end()
})

server.listen(3333, () => console.log('Server is running!'))
