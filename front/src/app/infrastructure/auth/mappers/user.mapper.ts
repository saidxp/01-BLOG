import { User } from '../../../domain/auth/entities/user.entity';
import { UserDto } from '../dto/user.dto';

export function toUserEntity(dto: UserDto): User {
  return new User(dto.id, dto.email, dto.name, new Date(dto.createdAt));
}