import {Readable, Transform, Writable} from 'node:stream'
import {setTimeout} from 'node:timers'

class OneToHundredStream extends Readable {
  index = 1

  _read() {
    const i = this.index++

    setTimeout(() => {
      if (i > 100) {
        this.push(null)
      } else {
        const buf = Buffer.from(String(i))

        this.push(buf)
      }
    }, 1000)
  }
}

class InverseNumbersStream extends Transform {
  _transform(chunk, encoding, callback) {
    const transformed = Number(chunk.toString()) * -1

    callback(null, Buffer.from(String(transformed)))
  }
}

class MultiplyByTenStream extends Writable {
  _write(chunk, encoding, callback) {
    console.log(chunk.toString() * 10)
    callback()
  }
}

new OneToHundredStream() // apenas lê
  .pipe(new InverseNumbersStream()) // precisa ler dados do stream e escreve-los em outro lugar
  .pipe(new MultiplyByTenStream()) // apenas escreve
