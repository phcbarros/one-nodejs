import {createServer} from 'node:http'

import {Transform} from 'node:stream'

class InverseNumbersStream extends Transform {
  _transform(chunk, encoding, callback) {
    const transformed = Number(chunk.toString()) * -1

    console.log(transformed)

    callback(null, Buffer.from(String(transformed)))
  }
}

const server = createServer(async (req, res) => {
  const buffers = []

  // consome todos os dados da stream de leitura
  for await (const chunk of req) {
    buffers.push(chunk)
  }

  const fullStreamContent = Buffer.concat(buffers).toString()
  console.log(fullStreamContent)

  res.end(fullStreamContent)

  //return req.pipe(new InverseNumbersStream()).pipe(res)
})

server.listen(3334, () => console.log('Server is running!'))
