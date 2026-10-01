import { UserProfile } from '../../../domain/profile/entity/user-profile.entity';
import { UserProfileDto } from '../dto/user-profile.dto';

export function toUserProfileEntity(dto: UserProfileDto): UserProfile {
  return new UserProfile(
    dto.id,
    dto.username,
    dto.bio,
    dto.avatarUrl,
    new Date(dto.createdAt),
    dto.owner,
    dto.subscribed,
    dto.postsCount,
    dto.commentsReceivedCount
  );
}
// <<==>> \\ (<!!>)
