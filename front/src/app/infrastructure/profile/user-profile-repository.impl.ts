import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, map, catchError, throwError, tap } from 'rxjs';
import { UserProfileRepository } from '../../domain/profile/repository/user-profile.repository';
import { UserProfile } from '../../domain/profile/entity/user-profile.entity';
import { UserProfileDto } from './dto/user-profile.dto';
import { toUserProfileEntity } from './mapper/user-profile.mapper';
import { environment } from '../../../environments/environment.development';

@Injectable() // <<==>> \\ {<=> (!!)}
export class UserProfileRepositoryImpl extends UserProfileRepository {

  private readonly http = inject(HttpClient);

  override getProfile(username: string): Observable<UserProfile> {
    return this.http
      .get<UserProfileDto>(`${environment.apiUrl}/api/users/${username}`, { withCredentials: true })
      .pipe(tap(post => { console.log("The Post It's Come Her", post) }),
        map(toUserProfileEntity),
        catchError((err: HttpErrorResponse) => {
          if (err.status === 404) {
            return throwError(() => new Error('User not found.'));
          }
          return throwError(() => new Error('Failed to load profile.'));
        })
      );
  }
  // <<==>> \\ 
  override updateProfile(bio: string, avatar: File | null): Observable<UserProfile> {
    const formData = new FormData();
    formData.append('bio', bio);
    if (avatar) {
      formData.append('avatar', avatar);
    }
    return this.http
      .put<UserProfileDto>(`${environment.apiUrl}/api/users/me`, formData, { withCredentials: true })
      .pipe(
        map(toUserProfileEntity),
        catchError(() => throwError(() => new Error('Failed to update profile.')))
      ); 
  } // <<==>> {<!-!>}
}