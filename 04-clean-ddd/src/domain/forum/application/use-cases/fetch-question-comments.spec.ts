import {UniqueEntityID} from '@/core/entities/unique-entity-id'
import {InMemoryQuestionCommentsRepository} from 'test/repositories/in-memory-question-comments-repository'
import {FetchQuestionCommentsUseCase} from './fetch-question-comments'
import {makeQuestionComment} from 'test/factories/make-question-comment'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch Question Comments', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
  })

  test('it should be able to fetch question comments', async () => {
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({questionId: new UniqueEntityID('question-1')}),
    )
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({questionId: new UniqueEntityID('question-1')}),
    )
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({questionId: new UniqueEntityID('question-3')}),
    )

    const {questionComments} = await sut.execute({
      questionId: 'question-1',
      page: 1,
    })

    expect(questionComments.length).toEqual(2)
  })

  test('it should be able to fetch paginated questions comments', async () => {
    Array.from({length: 22}).forEach(async () => {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({questionId: new UniqueEntityID('question-1')}),
      )
    })

    const {questionComments} = await sut.execute({
      questionId: 'question-1',
      page: 1,
    })

    expect(questionComments).toHaveLength(20)
  })
})
