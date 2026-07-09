import {DomainEvents} from '@/core/events/domain-events'
import {EventHandler} from '@/core/events/event-handler'
import {SendNotificationUseCase} from '../use-cases/send-notification'
import {QuestionCommentCreatedEvent} from '@/domain/forum/enterprise/entities/events/question-comment-created.event'
import {QuestionsRepository} from '@/domain/forum/application/repositories/questions-repository'

export class OnQuestionCommentCreated implements EventHandler {
  constructor(
    private questionRepository: QuestionsRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewQuestionNotification.bind(this),
      QuestionCommentCreatedEvent.name,
    )
  }

  private async sendNewQuestionNotification({
    questionComment,
  }: QuestionCommentCreatedEvent) {
    const question = await this.questionRepository.findById(
      questionComment.questionId.toString(),
    )

    if (question) {
      await this.sendNotification.execute({
        recipientId: question.authorId.toString(),
        title: `Novo comentário na pergunta ${question.title.substring(0, 40).concat('...')}`,
        content: questionComment.content,
      })
    }
  }
}
