import { Observable } from 'rxjs';
import { UserProfile } from '../entity/user-profile.entity';
import { UserSearchResult } from '../entity/user-search-result.entity';


export abstract class UserProfileRepository {
  abstract getProfile(username: string): Observable<UserProfile>;
  abstract updateProfile(bio: string, avatar: File | null): Observable<UserProfile>;
  abstract searchUsers(query: string): Observable<UserSearchResult[]>;
}