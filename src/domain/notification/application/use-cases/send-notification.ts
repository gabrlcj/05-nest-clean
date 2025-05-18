import { UniqueEntityID } from '@/core/entities/value-object/unique-entity-id'
import { Notification } from '../../enterprise/entities/notification'
import { Either, right } from '@/core/either'
import { NotificationsRepository } from '../repositories/notifications-repository'

export interface SendNotificationParams {
  recipientId: string
  title: string
  content: string
}

export type SendNotificationResponse = Either<
  null,
  {
    notification: Notification
  }
>

export class SendNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    recipientId,
    title,
    content,
  }: SendNotificationParams): Promise<SendNotificationResponse> {
    const notification = Notification.create({
      recipientId: new UniqueEntityID(recipientId),
      title,
      content,
    })

    await this.notificationsRepository.create(notification)

    return right({ notification })
  }
}
