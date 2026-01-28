import {makeCreateGymUseCase} from '@/use-cases/factories/make-create-gym-use-case'
import {FastifyReply, FastifyRequest} from 'fastify'
import {z} from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createGymBodySchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    phone: z.string().optional(),
    latitude: z.number().refine((val) => Math.abs(val) <= 90, {
      message: 'Latitude must be between -90 and 90',
    }),
    longitude: z.number().refine((val) => Math.abs(val) <= 180, {
      message: 'Longitude must be between -180 and 180',
    }),
  })

  const {title, description, phone, latitude, longitude} =
    createGymBodySchema.parse(request.body)

  const createGymUseCase = makeCreateGymUseCase()
  await createGymUseCase.execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  })

  return reply.status(201).send()
}
