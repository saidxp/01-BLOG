import { Role } from "../../../enum/Role"; 
import {UserStatus} from "../../../enum/UserStatus" 

export interface AdminUserDto {
  id: number;
  username: string;
  email: string;
  role: Role;
  status: UserStatus;
  createdAt: string;
}

export interface AdminUserPageDto {
  content: AdminUserDto[];
  totalPages: number;
  number: number;
}