import {createServer} from 'node:http'

import {Transform} from 'node:stream'

class InverseNumbersStream extends Transform {
  _transform(chunk, encoding, callback) {
    const transformed = Number(chunk.toString()) * -1

    console.log(transformed)

    callback(null, Buffer.from(String(transformed)))
  }
}

const server = createServer((req, res) => {
  return req.pipe(new InverseNumbersStream()).pipe(res)
})

server.listen(3334, () => console.log('Server is running!'))
