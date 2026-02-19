import {InMemoryAnswersRepository} from 'test/repositories/in-memory-answers-repository'
import {AnswerQuestionUseCase} from './answer-question'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: AnswerQuestionUseCase

describe('Answer Question', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new AnswerQuestionUseCase(inMemoryAnswersRepository)
  })

  test('should be able to create an answer', async () => {
    const result = await sut.execute({
      instructorId: 'instructor-1',
      questionId: 'question-1',
      content: 'This is an answer',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryAnswersRepository.items[0]).toEqual(result.value?.answer)
  })
})
