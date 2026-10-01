import { MediaType } from "../../../enum/MediaType"; 

export class PostDetail {
  constructor(
    public readonly id: number,
    public readonly authorUsername: string,
    public readonly title: string,
    public readonly content: string,
    public readonly mediaUrl: string | null,
    public readonly mediaType: MediaType,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly owner : boolean,
    public readonly liked : boolean,
    public readonly likedCount : number,
    public readonly commentCount : number
  ) {}
}

