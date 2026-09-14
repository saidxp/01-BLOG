import { Role } from "../../../enum/Role"; 
export interface UserDto {
  id: string;
  email: string;
  username: string;
  avatarUrl : string;
  role : Role;
}