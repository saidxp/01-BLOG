import { AdminPost } from '../../../domain/admin/entity/admin-post.entity';
import { AdminPostDto } from '../dto/admin-post.dto';

export function toAdminPostEntity(dto: AdminPostDto): AdminPost {
  return new AdminPost(dto.id, dto.title, dto.authorUsername, new Date(dto.createdAt));
}