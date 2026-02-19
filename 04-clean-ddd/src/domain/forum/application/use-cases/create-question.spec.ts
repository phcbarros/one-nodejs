import {CreateQuestionUseCase} from './create-question'
import {InMemoryQuestionsRepository} from 'test/repositories/in-memory-questions-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
// system under test - SUT
let sut: CreateQuestionUseCase

describe('Create Question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new CreateQuestionUseCase(inMemoryQuestionsRepository)
  })

  test('it should be able to create an question', async () => {
    const result = await sut.execute({
      authorId: 'author-1',
      title: 'Title',
      content: 'content',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryQuestionsRepository.items[0]).toEqual(result.value?.question)
  })
})
