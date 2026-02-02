import {expect, test, describe, beforeAll, afterAll} from 'vitest'
import request from 'supertest'
import {app} from '@/app'
import {createAndAuthenticateUser} from '@/utils/test/create-and-authenticate-user'
import {prisma} from '@/lib/prisma'

describe('Valide Check-In E2E', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('should be able to validate a check-in', async () => {
    const {token} = await createAndAuthenticateUser(app, true)

    const user = await prisma.user.findFirstOrThrow()

    const gym = await prisma.gym.create({
      data: {
        title: 'Gym 1',
        latitude: -27.2092052,
        longitude: -46.6401091,
      },
    })

    const checkIn = await prisma.checkIn.create({
      data: {
        gym_id: gym.id,
        user_id: user.id,
      },
    })

    const response = await request(app.server)
      .patch(`/check-ins/${checkIn.id}/validate`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(204)

    const checkInValidated = await prisma.checkIn.findUniqueOrThrow({
      where: {
        id: checkIn.id,
      },
    })

    expect(checkInValidated.validated_at).toEqual(expect.any(Date))
  })
})
