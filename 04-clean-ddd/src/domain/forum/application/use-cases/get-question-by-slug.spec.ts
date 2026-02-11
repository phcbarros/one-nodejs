import {CreateQuestionUseCase} from './create-question'
import {InMemoryQuestionsRepository} from 'test/repositories/in-memory-questions-repository'
import {GetQuestionBySlugUseCase} from './get-question-by-slug'
import {Slug} from '@/domain/forum/enterprise/entities/value-objects/slug'
import {Question} from '@/domain/forum/enterprise/entities/question'
import {UniqueEntityID} from '@/core/entities/unique-entity-id'
import {makeQuestion} from 'test/factories/make-question'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: GetQuestionBySlugUseCase

describe('Get Question By Slug', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
  })

  test('it should be able to fetch an question by slug', async () => {
    // usou a entidade Question para criar a pergunta e depois inseriu direto no banco em memory
    const newQuestion = makeQuestion({
      slug: Slug.create('example-question'),
    })

    inMemoryQuestionsRepository.create(newQuestion)

    const {question} = await sut.execute({
      slug: 'example-question',
    })

    expect(question.slug.value).toBe('example-question')
  })
})
