import {AppModule} from '@/infra/app.module'
import {PrismaService} from '@/infra/database/prisma/prisma.service'
import {INestApplication} from '@nestjs/common'
import {ConfigModule} from '@nestjs/config'
import {Test} from '@nestjs/testing'
import {schemaId} from '@/test/setup-e2e'
import request from 'supertest'
import {JwtService} from '@nestjs/jwt'

describe('Get question by slug (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

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
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test.only('[GET] /questions/:slug', async () => {
    const email = 'john.doe@example.com'
    const password = '123456'

    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email,
        password,
      },
    })

    const access_token = jwt.sign({sub: user.id})

    await prisma.question.create({
      data: {
        title: 'Nova pergunta 1',
        content: 'Conteúdo nova pergunta',
        slug: 'nova-pergunta-1',
        authorId: user.id,
      },
    })

    const response = await request(app.getHttpServer())
      .get('/questions/nova-pergunta-1')
      .auth(access_token, {type: 'bearer'})
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      question: expect.objectContaining({title: 'Nova pergunta 1'}),
    })
  })
})
