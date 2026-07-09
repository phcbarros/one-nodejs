import {DomainEvents} from '@/core/events/domain-events'
import {EventHandler} from '@/core/events/event-handler'
import {SendNotificationUseCase} from '../use-cases/send-notification'
import {AnswerCommentCreatedEvent} from '@/domain/forum/enterprise/entities/events/answer-comment-created.event'
import {AnswersRepository} from '@/domain/forum/application/repositories/answers-repository'

export class OnAnswerCommentCreated implements EventHandler {
  constructor(
    private answerRepository: AnswersRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerNotification.bind(this),
      AnswerCommentCreatedEvent.name,
    )
  }

  private async sendNewAnswerNotification({
    answerComment,
  }: AnswerCommentCreatedEvent) {
    const answer = await this.answerRepository.findById(
      answerComment.answerId.toString(),
    )

    if (answer) {
      await this.sendNotification.execute({
        recipientId: answer.authorId.toString(),
        title: `Novo comentário na resposta ${answer.content.substring(0, 40).concat('...')}`,
        content: answerComment.content,
      })
    }
  }
}
