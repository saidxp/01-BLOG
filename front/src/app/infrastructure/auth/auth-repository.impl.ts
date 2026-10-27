import { Injectable, inject } from '@angular/core';
import { AuthRepository } from '../../domain/auth/repositories/auth.repository';
import { User } from '../../domain/auth/entities/user.entity';
import { UserDto } from './dto/user.dto';
import { toUserEntity } from './mappers/user.mapper';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, map, catchError, throwError, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable()

export class AuthRepositoryImpl extends AuthRepository {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/auth`;
  private readonly baseUrl1 = `${environment.apiUrl}/api`;

  // <<==>> \\ <<==>> // (!!) \\ (!).  
  override getCurrentUser(): Observable<User | null> {
    return this.http.get<UserDto>(`${this.baseUrl1}/me`, { withCredentials: true }).pipe(
      tap((user) => console.log('Curent User ', user)),
      map(toUserEntity),
      catchError((err: HttpErrorResponse) => {
        console.log('[getCurrentUser] FAILED - status:', err.status, 'message:', err.error?.message || err.message);
        return err.status === 401 ? of(null) : throwError(() => err);
      })
    );
  }

  // <<==>> \\ (<!!>)
  override login(identifier: string, password: string): Observable<User> {
    return this.http
      .post<UserDto>(`${this.baseUrl}/login`, { identifier, password }, { withCredentials: true })
      .pipe(map(toUserEntity));
  }  
  // register method implementation (!!) 
  override register(username: string, email: string, password: string): Observable<User> {
    return this.http
      .post<UserDto>(`${this.baseUrl}/register`, { username, email, password }, { withCredentials: true })
      .pipe(map(toUserEntity));
  }
  // <==>> \\ {} \\ 
  override logout(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/logout`, {}, { withCredentials: true });
  } 
  // <<===>> logout \\ {!!}
}