export interface CommentDto {
  id: number;
  authorUsername: string;
  content: string;
  createdAt: string;
  canDelete : boolean;
}

// generitic type for generate Page who it's come from springboot mvc ! 
export interface PageDto<T> {
  content: T[];
  totalPages: number;
  number: number; // index of curent page who i fetch InTil Know 
}