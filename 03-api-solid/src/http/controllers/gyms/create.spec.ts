import {expect, test, describe, beforeAll, afterAll} from 'vitest'
import request from 'supertest'
import {app} from '@/app'
import {createAndAuthenticateUser} from '@/utils/test/create-and-authenticate-user'

describe('Create Gym E2E', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('should be able to create a gym', async () => {
    const {token} = await createAndAuthenticateUser(app)

    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Gym 1',
        description: 'Description of Gym 1',
        phone: '11999999999',
        latitude: -27.2092052,
        longitude: -46.6401091,
      })

    expect(response.statusCode).toEqual(201)
  })
})
