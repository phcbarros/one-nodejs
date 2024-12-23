import {FastifyInstance} from 'fastify'
import {randomUUID} from 'node:crypto'
import {z} from 'zod'
import {knex} from '../database'
import {checkSessionIdExists} from '../../middlewares/check-session-id-exists'

const COOKIE_MAX_AGE_SEVEN_DAYS = 60 * 60 * 24 * 7

// Unitários: unidade da sua aplicação
// Integração: comunicação entre os componentes da sua aplicação
// e2e - ponta a ponta: simulam usuário operando a aplicação

// frontend: abre a página de login, digite o texto paulo.barros@teste.com no campo email e clique no botão
// backend: chamadas HTTP, websockets

export async function transactionsRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const sessionId = request.cookies.sessionId
      console.log(sessionId)

      const transactions = await knex('transactions')
        .where('session_id', sessionId)
        .select('*')

      return {
        transactions,
      }
    },
  )

  app.get('/:id', {preHandler: [checkSessionIdExists]}, async (request) => {
    const sessionId = request.cookies.sessionId

    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const {id} = getTransactionParamsSchema.parse(request.params)
    const transaction = await knex('transactions')
      .where({
        session_id: sessionId,
        id,
      })
      .first()

    return {
      transaction,
    }
  })

  app.get('/summary', {preHandler: [checkSessionIdExists]}, async (request) => {
    const sessionId = request.cookies.sessionId

    const summary = await knex('transactions')
      .where('session_id', sessionId)
      .sum('amount', {as: 'amount'})
      .first()

    return {summary}
  })

  app.post('/', async (request, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const {title, amount, type} = createTransactionBodySchema.parse(
      request.body,
    )

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: COOKIE_MAX_AGE_SEVEN_DAYS,
      })
    }

    console.log(sessionId)

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    })

    return reply.status(201).send()
  })
}
