import {UniqueEntityID} from '@/core/entities/unique-entity-id'
import {makeAnswerComment} from 'test/factories/make-answer-comment'
import {InMemoryAnswersCommentsRepository} from 'test/repositories/in-memory-answer-comments-repository'
import {DeleteAnswerCommentUseCase} from './delete-answer-comment'

let inMemoryAnswerCommentsRepository: InMemoryAnswersCommentsRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete Answer Comment', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswersCommentsRepository()
    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository)
  })

  test('it should be able to delete a answer comment', async () => {
    const answerComment = makeAnswerComment()

    await inMemoryAnswerCommentsRepository.create(answerComment)

    await sut.execute({
      answerCommendId: answerComment.id.toString(),
      authorId: answerComment.authorId.toString(),
    })

    expect(inMemoryAnswerCommentsRepository.items.length).toBe(0)
  })

  test('it should not be able to delete a answer comment from another user', async () => {
    const answerComment = makeAnswerComment({
      authorId: new UniqueEntityID('author-1'),
    })

    await inMemoryAnswerCommentsRepository.create(answerComment)

    await expect(() =>
      sut.execute({
        answerCommendId: answerComment.id.toString(),
        authorId: 'author-2',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
