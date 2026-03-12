import {Either, right} from '@/core/either'
import {Notification} from '../../enterprise/entities/notification'
import {NotificationsRepository} from '@/domain/notification/application/repositories/notifications-repository'
import {UniqueEntityID} from '@/core/entities/unique-entity-id'

interface SendNotificationUseCaseRequest {
  recipientId: string
  title: string
  content: string
}

type SendNotificationUseCaseResponse = Either<
  null,
  {
    notification: Notification
  }
>

export class SendNotificationUseCase {
  constructor(
    private readonly notificationRepository: NotificationsRepository,
  ) {}

  async execute({
    recipientId,
    title,
    content,
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      recipientId: new UniqueEntityID(recipientId),
      title,
      content,
    })
    await this.notificationRepository.create(notification)

    return right({
      notification,
    })
  }
}
