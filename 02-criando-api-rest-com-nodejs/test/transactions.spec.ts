import {beforeEach, describe} from 'node:test'
import {app} from '../src/app'
import request from 'supertest'
import {it, beforeAll, afterAll, expect} from 'vitest'
import {execSync} from 'node:child_process'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready() // o fastify precisa estar pronto para executar o teste pois todos os plugins são assíncronos
  })

  afterAll(async () => {
    await app.close() // remove a aplicação da memória
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new transaction', async () => {
    await request
      .agent(app.server)
      .post('/transactions')
      .send({
        title: 'New Transaction',
        type: 'credit',
        amount: 8000,
      })
      .expect(201)
  })

  // jamais criar um teste que dependa de outro teste
  // os testes e2e precisam ser abster de qualquer contexto
  it('should be able to list all transactions', async () => {
    // criar uma transação
    const createTransactionResponse = await request
      .agent(app.server)
      .post('/transactions')
      .send({
        title: 'New Transaction',
        type: 'credit',
        amount: 5000,
      })
    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionsResponse = await request
      .agent(app.server)
      .get('/transactions')
      .set('Cookie', cookies!)
      .expect(200)

    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'New Transaction',
        amount: 5000,
      }),
    ])
  })
})
