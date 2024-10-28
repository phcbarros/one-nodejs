import {app} from '../src/app'
import request from 'supertest'
import {test, beforeAll, afterAll} from 'vitest'

beforeAll(async () => {
  await app.ready() // o fastify precisa estar pronto para executar o teste pois todos os plugins são assíncronos
})

afterAll(async () => {
  await app.close() // remove a aplicação da memória
})

test('should create a new transaction', async () => {
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
