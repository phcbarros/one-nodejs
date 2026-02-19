import {InMemoryQuestionsRepository} from 'test/repositories/in-memory-questions-repository'
import {GetQuestionBySlugUseCase} from './get-question-by-slug'
import {Slug} from '@/domain/forum/enterprise/entities/value-objects/slug'
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

    await inMemoryQuestionsRepository.create(newQuestion)

    const result = await sut.execute({
      slug: 'example-question',
    })

    expect(result.value?.question.id).toEqual(newQuestion.id)
    expect(result.value?.question.slug.value).toBe('example-question')
  })
})
