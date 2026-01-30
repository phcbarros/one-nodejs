import {makeCheckInUseCase} from '@/use-cases/factories/make-check-in-use-case'
import {FastifyReply, FastifyRequest} from 'fastify'
import {z} from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createCheckInParamsSchema = z.object({
    gymId: z.string().uuid(),
  })

  const createCheckInBodySchema = z.object({
    latitude: z.coerce.number().refine((val) => Math.abs(val) <= 90, {
      message: 'Latitude must be between -90 and 90',
    }),
    longitude: z.coerce.number().refine((val) => Math.abs(val) <= 180, {
      message: 'Longitude must be between -180 and 180',
    }),
  })

  const {gymId} = createCheckInParamsSchema.parse(request.params)
  const {latitude, longitude} = createCheckInBodySchema.parse(request.body)

  const createCheckInUseCase = makeCheckInUseCase()
  await createCheckInUseCase.execute({
    userId: request.user.sub,
    gymId: gymId,
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.status(201).send()
}
