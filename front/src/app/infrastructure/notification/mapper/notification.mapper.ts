import { Notification } from '../../../domain/notification/entity/notification.entity';
import { NotificationDto } from '../dto/notification.dto';

export function toNotificationEntity(dto: NotificationDto): Notification {
  return new Notification(
    dto.id,
    dto.message,
    dto.postId,
    dto.authorUsername,
    dto.authorAvatarUrl,
    dto.read,
    new Date(dto.createdAt)
  );
}