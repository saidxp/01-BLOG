import { MediaType } from '../../../enum/MediaType';

export interface PostDetailDto {
  id: number;
  authorUsername: string;
  title: string;
  content: string;
  mediaUrl: string | null;   
  mediaType: MediaType;
  createdAt: string;
  updatedAt: string; 
  owner : boolean; 
  liked : boolean;
  likedCount : number;
}

