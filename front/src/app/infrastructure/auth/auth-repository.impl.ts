import { Injectable, inject } from '@angular/core';
import { AuthRepository } from '../../domain/auth/repositories/auth.repository';
import { User } from '../../domain/auth/entities/user.entity';
import { UserDto } from './dto/user.dto';
import { toUserEntity } from './mappers/user.mapper';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { InvalidCredentialsError, AuthServerError } from '../../domain/auth/errors/auth.errors';

@Injectable()
export class AuthRepositoryImpl extends AuthRepository {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/auth'; // Temporary : later add env !
  
 override login(email: string, password: string): Observable<User> {
  return this.http
    .post<UserDto>(`${this.baseUrl}/login`, { email, password }, { withCredentials: true })
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
}