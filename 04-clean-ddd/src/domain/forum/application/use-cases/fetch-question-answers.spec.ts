import {InMemoryAnswersRepository} from 'test/repositories/in-memory-answers-repository'
import {FetchQuestionAnswersUseCase} from './fetch-question-answers'
import {makeAnswer} from 'test/factories/make-answer'
import {UniqueEntityID} from '@/core/entities/unique-entity-id'
import {InMemoryAnswerAttachmentsRepository} from 'test/repositories/in-memory-answer-attachments-repository'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: FetchQuestionAnswersUseCase

describe('Fetch Question Answers', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )

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

    const result = await sut.execute({
      questionId: 'question-1',
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answers.length).toEqual(2)
  })

  test('it should be able to fetch paginated questions answers', async () => {
    Array.from({length: 22}).forEach(async () => {
      await inMemoryAnswersRepository.create(
        makeAnswer({questionId: new UniqueEntityID('question-1')}),
      )
    })

    const result = await sut.execute({
      questionId: 'question-1',
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answers.length).toEqual(20)
  })
})
