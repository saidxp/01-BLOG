import { Post } from '../../../domain/home/entity/post.entity';
import { PostDto } from '../dto/post.dto';

export function toPostEntity(dto: PostDto): Post {
  return new Post(
    dto.id,
    dto.authorUsername,
    dto.description,
    dto.mediaUrl,
    dto.mediaType,
    new Date(dto.createdAt),
    new Date(dto.updatedAt)
  );
}