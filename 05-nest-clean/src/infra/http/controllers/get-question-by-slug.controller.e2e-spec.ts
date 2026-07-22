import {AppModule} from '@/infra/app.module'
import {PrismaService} from '@/infra/database/prisma/prisma.service'
import {INestApplication} from '@nestjs/common'
import {ConfigModule} from '@nestjs/config'
import {Test} from '@nestjs/testing'
import {schemaId} from '@/test/setup-e2e'
import request from 'supertest'
import {JwtService} from '@nestjs/jwt'
import {StudentFactory} from '@/test/factories/make-student'
import {DatabaseModule} from '@/infra/database/database.module'
import {QuestionFactory} from '@/test/factories/make-question'
import {Slug} from '@/domain/forum/enterprise/entities/value-objects/slug'

describe('Get question by slug (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory

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
      providers: [StudentFactory, QuestionFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)

    await app.init()
  })

  test('[GET] /questions/:slug', async () => {
    const user = await studentFactory.makePrismaStudent()

    const access_token = jwt.sign({sub: user.id.toString()})

    await questionFactory.makePrismaQuestion({
      title: 'Nova pergunta 1',
      content: 'Conteúdo nova pergunta',
      slug: Slug.create('nova-pergunta-1'),
      authorId: user.id,
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
