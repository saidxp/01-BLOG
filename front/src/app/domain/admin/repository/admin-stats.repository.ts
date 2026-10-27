import { Observable } from 'rxjs';

export interface TopUser {
  username: string;
  count: number;
}

export interface TopPost {
  id: number;
  title: string;
  count: number;
}

export interface AdminStats {
  totalUsers: number;
  totalPosts: number;
  pendingReports: number;
  mostReportedUser: TopUser | null;
  mostLikedPost: TopPost | null;
  mostCommentedPost: TopPost | null;
}

export abstract class AdminStatsRepository {
  abstract getStats(): Observable<AdminStats>;
}
