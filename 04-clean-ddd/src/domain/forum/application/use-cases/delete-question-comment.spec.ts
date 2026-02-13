import {UniqueEntityID} from '@/core/entities/unique-entity-id'
import {makeQuestionComment} from 'test/factories/maker-question-comment'
import {InMemoryQuestionsCommentsRepository} from 'test/repositories/in-memory-question-comments-repository'
import {DeleteQuestionCommentUseCase} from './delete-question-comment'

let inMemoryQuestionCommentsRepository: InMemoryQuestionsCommentsRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete Question Comment', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionsCommentsRepository()
    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository)
  })

  test('it should be able to delete a question comment', async () => {
    const questionComment = makeQuestionComment()

    await inMemoryQuestionCommentsRepository.create(questionComment)

    await sut.execute({
      questionCommendId: questionComment.id.toString(),
      authorId: questionComment.authorId.toString(),
    })

    expect(inMemoryQuestionCommentsRepository.items.length).toBe(0)
  })

  test('it should not be able to delete a question comment from another user', async () => {
    const questionComment = makeQuestionComment({
      authorId: new UniqueEntityID('author-1'),
    })

    await inMemoryQuestionCommentsRepository.create(questionComment)

    await expect(() =>
      sut.execute({
        questionCommendId: questionComment.id.toString(),
        authorId: 'author-2',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
