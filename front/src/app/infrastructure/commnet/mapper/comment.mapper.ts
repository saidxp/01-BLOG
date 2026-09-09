import { Comment } from '../../../domain/comment/entity/comment.entity';
import { CommentDto } from '../dto/comment.dto';

export function toCommentEntity(dto: CommentDto): Comment {
  return new Comment(dto.id, dto.authorUsername, dto.content, new Date(dto.createdAt));
}