import { Injectable, inject } from '@angular/core';
import { AuthRepository } from '../../domain/auth/repositories/auth.repository';
import { User } from '../../domain/auth/entities/user.entity';
import { UserDto } from './dto/user.dto';
import { toUserEntity } from './mappers/user.mapper';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { InvalidCredentialsError, AuthServerError } from '../../domain/auth/errors/auth.errors';
import { environment } from '../../../environments/environment.development';

@Injectable()

export class AuthRepositoryImpl extends AuthRepository {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/auth`;
  // <<==>> \\ <<==>> \\ (!!)  
  override me(): Observable<User> {
    return this.http.get<UserDto>(`${this.baseUrl}/me`, { withCredentials: true }).pipe(
      map(toUserEntity),
      catchError((err: HttpErrorResponse) => {
        const backendMessage = err.error?.message;
        return throwError(() => new AuthServerError(backendMessage));
      })
    );
  }
  
  override login(identifier: string, password: string): Observable<User> {
    return this.http
      .post<UserDto>(`${this.baseUrl}/login`, { identifier, password }, { withCredentials: true })
      .pipe(
        map(toUserEntity),
        catchError((err: HttpErrorResponse) => {
          const backendMessage = err.error?.message;
          if (err.status === 401) {
            return throwError(() => new InvalidCredentialsError(backendMessage));
          }
          return throwError(() => new AuthServerError(backendMessage));
        })
      );
  }
  // register method implementation (!!) 
  override register(username: string, email: string, password: string): Observable<User> {
    return this.http
      .post<UserDto>(`${this.baseUrl}/register`, { username, email, password }, { withCredentials: true })
      .pipe(
        map(toUserEntity),
        catchError((err: HttpErrorResponse) => {
          const backendMessage = err.error?.message;
          
          console.error('Register error:', backendMessage);
          return throwError(() => new AuthServerError(backendMessage));
        })
      );
  }
}