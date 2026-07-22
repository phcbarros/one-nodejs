import {AppModule} from '@/infra/app.module'
import {PrismaService} from '@/infra/database/prisma/prisma.service'
import {INestApplication} from '@nestjs/common'
import {ConfigModule} from '@nestjs/config'
import {Test} from '@nestjs/testing'
import {schemaId} from '@/test/setup-e2e'
import request from 'supertest'
import {JwtService} from '@nestjs/jwt'
import {DatabaseModule} from '@/infra/database/database.module'
import {StudentFactory} from '@/test/factories/make-student'

describe('Fetch recent question (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let studentFactory: StudentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        AppModule,
        DatabaseModule,
        ConfigModule.forRoot({
          load: [
            () => ({
              DATABASE_SCHEMA: schemaId,
            }),
          ],
        }),
      ],
      providers: [StudentFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)

    await app.init()
  })

  test('[GET] /questions', async () => {
    const user = await studentFactory.makePrismaStudent()

    const access_token = jwt.sign({sub: user.id.toString()})

    await prisma.question.createMany({
      data: [
        {
          title: 'Nova pergunta 1',
          content: 'Conteúdo nova pergunta',
          slug: 'nova-pergunta-1',
          authorId: user.id.toString(),
        },
        {
          title: 'Nova pergunta 2',
          content: 'Conteúdo nova pergunta 2',
          slug: 'nova-pergunta-2',
          authorId: user.id.toString(),
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
