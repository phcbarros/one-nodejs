import {describe} from 'node:test'
import {app} from '../src/app'
import request from 'supertest'
import {it, beforeAll, afterAll} from 'vitest'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready() // o fastify precisa estar pronto para executar o teste pois todos os plugins são assíncronos
  })

  afterAll(async () => {
    await app.close() // remove a aplicação da memória
  })

  it('should be able to create a new transaction', async () => {
    await request
      .agent(app.server)
      .post('/transactions')
      .send({
        title: 'Salário',
        type: 'credit',
        amount: 8000,
      })
      .expect(201)
  })
})
