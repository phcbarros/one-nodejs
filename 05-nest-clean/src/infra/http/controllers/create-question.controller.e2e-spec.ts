import {AppModule} from '@/infra/app.module'
import {PrismaService} from '@/infra/database/prisma/prisma.service'
import {INestApplication} from '@nestjs/common'
import {ConfigModule} from '@nestjs/config'
import {Test} from '@nestjs/testing'
import {schemaId} from '@/test/setup-e2e'
import request from 'supertest'
import {JwtService} from '@nestjs/jwt'

describe('Create question (E2E)', () => {
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

  test('[POST] /questions', async () => {
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

    const response = await request(app.getHttpServer())
      .post('/questions')
      // .set('Authorization', `Bearer ${access_token}}`)
      .auth(access_token, {type: 'bearer'})
      .send({
        title: 'Nova pergunta',
        content: 'Conteúdo nova pergunta',
      })

    expect(response.statusCode).toBe(201)

    const questionInDatabase = prisma.question.findFirst({
      where: {
        title: 'Nova pergunta',
      },
    })

    expect(questionInDatabase).toBeTruthy()
  })
})
