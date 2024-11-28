import {z} from 'zod'
import {FastifyReply, FastifyRequest} from 'fastify'
import {InvalidCredentialsError} from '@/use-cases/errors/invalid-credentials.error'
import {makeAuthenticateUseCase} from '@/use-cases/factories/make-authenticate-user-case'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const {email, password} = authenticateBodySchema.parse(request.body)

  try {
    // Factory
    const authenticateUseCase = makeAuthenticateUseCase()

    await authenticateUseCase.execute({email, password})
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      reply.status(400).send(error.message)
    }

    throw error
  }

  return reply.status(200).send()
}
