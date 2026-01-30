import {expect, test, describe, beforeAll, afterAll} from 'vitest'
import request from 'supertest'
import {app} from '@/app'
import {createAndAuthenticateUser} from '@/utils/test/create-and-authenticate-user'

describe('Nearby Gym E2E', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('should be able to list nearby gyms', async () => {
    const {token} = await createAndAuthenticateUser(app)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JavaScript Gym',
        description: 'Description of JavaScript Gym',
        phone: '11999999999',
        latitude: -27.2092052,
        longitude: -46.6401091,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'TypeScript Gym',
        description: 'Description of TypeScript Gym',
        phone: '11999999999',
        latitude: -27.2092052,
        longitude: -49.6401091,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -27.2092052,
        longitude: -46.6401091,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    console.log(response.body)

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    // expect(response.body.gyms).toEqual([
    //   expect.objectContaining({title: 'JavaScript Gym'}),
    // ])
  })
})
