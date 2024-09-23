import {randomUUID} from 'node:crypto'
import http from 'node:http'
import {Database} from './database.js'
import {json} from './middlewares/json.js'

const database = new Database()

const server = http.createServer(async (req, res) => {
  const {method, url} = req

  await json(req, res)
  console.log(req.body)

  if (method === 'GET' && url === '/users') {
    return res.end(JSON.stringify(database.select('users')))
  }

  if (method === 'POST' && url === '/users') {
    const {name, email} = req.body

    const user = {
      id: randomUUID(),
      name,
      email,
    }

    database.insert('users', user)

    return res.writeHead(201).end()
  }

  res.writeHead(404).end()
})

server.listen(3333, () => console.log('Server is running!'))
