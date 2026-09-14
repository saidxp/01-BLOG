import { Role } from '../../../enum/Role';
import { UserStatus } from '../../../enum/UserStatus';

export class AdminUser {
  constructor(
    public readonly id: number,
    public readonly username: string,
    public readonly email: string,
    public readonly role: Role,
    public readonly status: UserStatus,
    public readonly createdAt: Date
  ) {}
}
