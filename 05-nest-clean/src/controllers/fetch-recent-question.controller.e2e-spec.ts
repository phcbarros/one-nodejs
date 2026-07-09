import {AppModule} from '@/app.module'
import {PrismaService} from '@/prisma/prisma.service'
import {INestApplication} from '@nestjs/common'
import {ConfigModule} from '@nestjs/config'
import {Test} from '@nestjs/testing'
import {schemaId} from '@/test/setup-e2e'
import request from 'supertest'
import {JwtService} from '@nestjs/jwt'

describe('Fetch recent question (E2E)', () => {
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

  test('[GET] /questions', async () => {
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

    const question = await prisma.question.createMany({
      data: [
        {
          title: 'Nova pergunta 1',
          content: 'Conteúdo nova pergunta',
          slug: 'nova-pergunta-1',
          authorId: user.id,
        },
        {
          title: 'Nova pergunta 2',
          content: 'Conteúdo nova pergunta 2',
          slug: 'nova-pergunta-2',
          authorId: user.id,
        },
      ],
    })

    const response = await request(app.getHttpServer())
      .get('/questions')
      // .set('Authorization', `Bearer ${access_token}}`)
      .auth(access_token, {type: 'bearer'})
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      questions: [
        expect.objectContaining({title: 'Nova pergunta 1'}),
        expect.objectContaining({title: 'Nova pergunta 2'}),
      ],
    })
  })
})
