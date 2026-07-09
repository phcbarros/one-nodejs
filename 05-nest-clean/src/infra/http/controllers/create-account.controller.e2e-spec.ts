import {AppModule} from '@/infra/app.module'
import {PrismaService} from '@/infra/database/prisma/prisma.service'
import {INestApplication} from '@nestjs/common'
import {ConfigModule} from '@nestjs/config'
import {Test} from '@nestjs/testing'
import {schemaId} from '@/test/setup-e2e'

import request from 'supertest'
describe('Create account (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        AppModule,
        ConfigModule.forRoot({
          load: [
            () => ({
              DATABASE_SCHEMA: schemaId,
            }),
          ],
        }),
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /account', async () => {
    const email = 'john.doe@example.com'
    const response = await request(app.getHttpServer()).post('/accounts').send({
      name: 'John Doe',
      email,
      password: '123456',
    })

    expect(response.statusCode).toBe(201)

    const userOnDatabase = await prisma.user.findUnique({where: {email}})
    expect(userOnDatabase).toBeTruthy()
  })
})
