import fastify from 'fastify'
import {transactionsRoutes} from './routes/transactions'

const app = fastify()

app.register(transactionsRoutes)

app.listen({port: 3333}).then(() => {
  console.log('HTTP server running on http://localhost:3333')
})
