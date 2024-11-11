import {z} from 'zod'
import {FastifyReply, FastifyRequest} from 'fastify'
import {PrismaUsersRepository} from '@/repositories/prisma/users.repository'
import {AuthenticateUseCase} from '@/use-cases/authenticate'
import {InvalidCredentialsError} from '@/use-cases/errors/invalide-credentials.error'

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
    const prismaUsersRepository = new PrismaUsersRepository()
    const authenticateUseCase = new AuthenticateUseCase(prismaUsersRepository)

    await authenticateUseCase.execute({email, password})
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      reply.status(400).send(error.message)
    }

    throw error
  }

  return reply.status(200).send()
}
