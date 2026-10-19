import { UserSearchResultDto } from '../dto/user-search.dto';
import { UserSearchResult } from '../../../domain/profile/entity/user-search-result.entity';

export function toUserSearchResultEntity(
  dto: UserSearchResultDto,
): UserSearchResult {
  return {
    id: dto.id,
    username: dto.username,
    avatarUrl: dto.avatarUrl,
  };
}