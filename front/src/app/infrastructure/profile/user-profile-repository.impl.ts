import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { UserProfileRepository } from '../../domain/profile/repository/user-profile.repository';
import { UserProfile } from '../../domain/profile/entity/user-profile.entity';
import { UserProfileDto } from './dto/user-profile.dto';
import { toUserProfileEntity } from './mapper/user-profile.mapper';
import { environment } from '../../../environments/environment.development';
import { UserSearchResult } from '../../domain/profile/entity/user-search-result.entity';
import { UserSearchResultDto } from '../../infrastructure/profile/dto/user-search.dto'
import {toUserSearchResultEntity} from '../profile/mapper/user-search-result.mapper'

@Injectable() // <<==>> \\ {<=> (!!)}
export class UserProfileRepositoryImpl extends UserProfileRepository {

  private readonly http = inject(HttpClient);

  override getProfile(username: string): Observable<UserProfile> {
    return this.http
      .get<UserProfileDto>(`${environment.apiUrl}/api/users/${username}`, { withCredentials: true })
      .pipe(map(toUserProfileEntity));
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
      );
  } // <<==>> {<!-!>} 

  // <= { Search , Users, } => \\ 
  override searchUsers(query: string): Observable<UserSearchResult[]> {
    return this.http.get<UserSearchResultDto[]>(
      `${environment.apiUrl}/api/users/search`,
      {
        params: { q: query },
        withCredentials: true,
      }
    ).pipe(
       map(users => users.map(toUserSearchResultEntity)),
    );
  }
}