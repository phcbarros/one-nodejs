import {InMemoryAnswersRepository} from 'test/repositories/in-memory-answers-repository'
import {FetchQuestionAnswersUseCase} from './fetch-question-answers'
import {InMemoryQuestionsRepository} from 'test/repositories/in-memory-questions-repository'
import {makeAnswer} from 'test/factories/make-answer'
import {UniqueEntityID} from '@/core/entities/unique-entity-id'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: FetchQuestionAnswersUseCase

describe('Fetch Question Answers', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository)
  })

  test('it should be able to fetch question answers', async () => {
    await inMemoryAnswersRepository.create(
      makeAnswer({questionId: new UniqueEntityID('question-1')}),
    )
    await inMemoryAnswersRepository.create(
      makeAnswer({questionId: new UniqueEntityID('question-1')}),
    )
    await inMemoryAnswersRepository.create(
      makeAnswer({questionId: new UniqueEntityID('question-3')}),
    )

    const {answers} = await sut.execute({
      questionId: 'question-1',
      page: 1,
    })

    expect(answers.length).toEqual(2)
  })

  test('it should be able to fetch paginated questions answers', async () => {
    Array.from({length: 22}).forEach(async () => {
      await inMemoryAnswersRepository.create(
        makeAnswer({questionId: new UniqueEntityID('question-1')}),
      )
    })

    const {answers} = await sut.execute({
      questionId: 'question-1',
      page: 1,
    })

    expect(answers).toHaveLength(20)
  })
})
