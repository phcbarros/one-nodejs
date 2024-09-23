import http from 'node:http'

import {json} from './middlewares/json.js'
import {routes} from './routes.js'

/**
 * Query params
 *  GET http://localhost:3333/users?search=Lucas
 *  URL Stateful => filtros, paginação
 *  dados que modificam a resposta do backend, com dados não sensíveis e não obrigatórios
 *  exposto na url
 *
 * Route params
 *  GET http://localhost:3333/users/1
 *  Params não nomeados => Identificação de recurso
 *  dados não sensíveis
 *  exposto na url
 *
 * Request body
 *  POST http://localhost:3333/users
 *   { name: 'Lucas' }
 *  Envio de informações de um formulário (HTTPS)
 */

const server = http.createServer(async (req, res) => {
  const {method, url} = req

  await json(req, res)

  const route = routes.find((route) => {
    return route.method === method && route.path.test(url)
  })

  if (route) {
    const routeParams = req.url.match(route.path)

    req.params = {...routeParams.groups}

    return route.handler(req, res)
  }

  res.writeHead(404).end()
})

server.listen(3333, () => console.log('Server is running!'))
