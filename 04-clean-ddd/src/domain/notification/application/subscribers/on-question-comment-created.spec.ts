import {InMemoryAnswersRepository} from 'test/repositories/in-memory-answers-repository'
import {InMemoryAnswerAttachmentsRepository} from 'test/repositories/in-memory-answer-attachments-repository'
import {InMemoryQuestionsRepository} from 'test/repositories/in-memory-questions-repository'
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification'
import {InMemoryQuestionAttachmentsRepository} from 'test/repositories/in-memory-question-attachments-repository'
import {InMemoryNotificationsRepository} from 'test/repositories/in-memory-notifications-repository'
import {MockInstance} from 'vitest'
import {waitFor} from 'test/utils/wait-for'
import {OnQuestionCommentCreated} from './on-question-comment-created'
import {makeQuestion} from 'test/factories/make-question'
import {makeQuestionComment} from 'test/factories/make-question-comment'
import {InMemoryQuestionCommentsRepository} from 'test/repositories/in-memory-question-comments-repository'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecutedSpy: MockInstance<
  (
    request: SendNotificationUseCaseRequest,
  ) => Promise<SendNotificationUseCaseResponse>
>

describe('On Question Comment Created', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )

    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()

    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()

    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )

    sendNotificationExecutedSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnQuestionCommentCreated(
      inMemoryQuestionsRepository,
      sendNotificationUseCase,
    )
  })

  test('should send a notification when a new question comment is created', async () => {
    const question = makeQuestion()

    inMemoryQuestionsRepository.create(question)

    const questionComment = makeQuestionComment({questionId: question.id})

    inMemoryQuestionCommentsRepository.create(questionComment)

    await waitFor(() => expect(sendNotificationExecutedSpy).toHaveBeenCalled())
    await waitFor(() =>
      expect(sendNotificationExecutedSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          recipientId: question.authorId.toString(),
          title: `Novo comentário na pergunta ${question.title.substring(0, 40).concat('...')}`,
          content: questionComment.content,
        }),
      ),
    )
  })
})
