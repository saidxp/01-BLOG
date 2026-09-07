 
import { MediaType } from "../../../enum/MediaType";

export class Post {
  constructor(
    public readonly id: number,
    public readonly authorUsername: string,
    public readonly title: string,
    public readonly mediaUrl: string,
    public readonly mediaType: MediaType,
    public readonly createdAt: Date,
    public readonly updateAt : Date
  ) {}
}
// <<==>> \\ (!!)
