import { Observable } from 'rxjs';
import { UserProfile } from '../entity/user-profile.entity';

export abstract class UserProfileRepository {
  abstract getProfile(username: string): Observable<UserProfile>;
}