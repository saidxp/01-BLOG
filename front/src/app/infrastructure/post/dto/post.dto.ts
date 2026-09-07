import { MediaType } from "../../../enum/MediaType"; 

export interface PostDto {
  id: number;
  authorUsername: string;
  title: string;
  mediaUrl: string;
  mediaType: MediaType;
  createdAt: string;
  updatedAt : string;
}
