import {makeAnswer} from 'test/factories/make-answer'
import {OnAnswerCreated} from './on-answer-created'
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
import {OnAnswerCommentCreated} from './on-answer-comment-created'
import {InMemoryAnswerCommentsRepository} from 'test/repositories/in-memory-answer-comments-repository'
import {makeAnswerComment} from 'test/factories/make-answer-comment'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecutedSpy: MockInstance<
  (
    request: SendNotificationUseCaseRequest,
  ) => Promise<SendNotificationUseCaseResponse>
>

describe('On Answer Comment Created', () => {
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

    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()

    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )

    sendNotificationExecutedSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnAnswerCommentCreated(
      inMemoryAnswersRepository,
      sendNotificationUseCase,
    )
  })

  test('should send a notification when a new answer comment is created', async () => {
    const answer = makeAnswer()

    inMemoryAnswersRepository.create(answer)

    const answerComment = makeAnswerComment({answerId: answer.id})

    inMemoryAnswerCommentsRepository.create(answerComment)

    await waitFor(() => expect(sendNotificationExecutedSpy).toHaveBeenCalled())
  })
})
