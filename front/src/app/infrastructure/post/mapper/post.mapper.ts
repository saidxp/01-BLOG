import { Post } from '../../../domain/post/entity/post.entity';
import { PostDto } from '../../post/dto/post.dto';

export function toPostEntity(dto: PostDto): Post {
  return new Post(
    dto.id,
    dto.authorUsername,
    dto.title,
    dto.mediaUrl,
    dto.mediaType,
    new Date(dto.createdAt),
    new Date(dto.updatedAt)
  );
}