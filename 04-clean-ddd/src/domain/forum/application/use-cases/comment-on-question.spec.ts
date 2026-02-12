import {InMemoryQuestionsRepository} from 'test/repositories/in-memory-questions-repository'
import {CommentOnQuestionUseCase} from './comment-on-question'
import {InMemoryQuestionsCommentsRepository} from 'test/repositories/in-memory-question-comments-repository'
import {makeQuestion} from 'test/factories/make-question'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionCommentsRepository: InMemoryQuestionsCommentsRepository
let sut: CommentOnQuestionUseCase

describe('Comment on question ', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionsCommentsRepository()
    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionCommentsRepository,
    )
  })

  test('it should be able to comment on question', async () => {
    const question = makeQuestion()

    await inMemoryQuestionsRepository.create(question)

    await sut.execute({
      questionId: question.id.toString(),
      authorId: question.authorId.toString(),
      content: 'Comment content',
    })

    expect(inMemoryQuestionCommentsRepository.items[0].content).toEqual(
      'Comment content',
    )
  })
})
