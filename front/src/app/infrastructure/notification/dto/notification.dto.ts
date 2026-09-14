export interface NotificationDto {
  id: number;
  message: string;
  postId: number;
  authorUsername: string;
  authorAvatarUrl: string | null;
  read: boolean;
  createdAt: string;
}

export interface NotificationPageDto {
  content: NotificationDto[];
  totalPages: number;
  number: number;
}