export interface UserProfileDto {
  id: number;
  username: string;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: string;
  owner: boolean;
  subscribed: boolean;
  postsCount: number;
  commentsReceivedCount: number;
}
