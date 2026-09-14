import { AdminUser } from '../../../domain/admin/entity/admin-user.entity';

import { AdminUserDto } from '../dto/admin-user.dto';

export function toAdminUserEntity(dto: AdminUserDto): AdminUser {
  return new AdminUser(dto.id, dto.username, dto.email, dto.role, dto.status, new Date(dto.createdAt));
}