import { PostDetail } from '../../../domain/post/entity/PostDetail';
import { PostDetailDto } from '../dto/post-detail.dto';

export function toPostDetailEntity(dto: PostDetailDto): PostDetail {
  return new PostDetail(
    dto.id,
    dto.authorUsername,
    dto.title,
    dto.content,
    dto.mediaUrl,
    dto.mediaType,
    new Date(dto.createdAt),
    new Date(dto.updatedAt),
    dto.owner,
    dto.liked,
    dto.likedCount,
    dto.commentCount ?? 0,
  );
} // <<==>>
