import http from 'node:http'

const server = http.createServer((req, res) => {
  const {method, url} = req

  if (method === 'GET' && url === '/users') {
    return res.end('Listagem de usuários')
  }

  if (method === 'POST' && url === '/users') {
    return res.end('Criação de usuários')
  }

  res.end('Hello Ignite!')
})

server.listen(3333, () => console.log('Server is running!'))
