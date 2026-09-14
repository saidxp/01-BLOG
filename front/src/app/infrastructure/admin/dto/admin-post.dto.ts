export interface AdminPostDto {
  id: number;
  title: string;
  authorUsername: string;
  createdAt: string;
}

export interface AdminPostPageDto {
  content: AdminPostDto[];
  totalPages: number;
  number: number;
}
