// Must be modified later !! 
import { Role } from "../../../enum/Role";
export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly username: string, 
    public readonly avatarUrl : string,
    public readonly role : Role,
  ) {}
}