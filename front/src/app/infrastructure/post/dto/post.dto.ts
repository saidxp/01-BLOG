import { MediaType } from "../../../enum/MediaType"; 

export interface PostDto {
  id: number;
  authorUsername: string;
  avatarUrl : string;
  title: string;
  mediaUrl: string;
  mediaType: MediaType;
  createdAt: string;
  updatedAt : string;
  likesCount: number;
  commentsCount : number;
}

export interface PostPageDto {
  content: PostDto[];
  totalPages: number;
  number: number;
}
