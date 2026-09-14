import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ReportRepository } from '../../domain/report/repository/report.repository';
import { environment } from '../../../environments/environment.development';

@Injectable() 
export class ReportRepositoryImpl extends ReportRepository {
  private readonly http = inject(HttpClient);

  override reportUser(username: string, reason: string): Observable<void> {
    const params = new HttpParams().set('reason', reason);

    return this.http
      .post<void>(`${environment.apiUrl}/api/users/${username}/report`, null, { params, withCredentials: true })
      .pipe(
        catchError((err: HttpErrorResponse) =>
          throwError(() => new Error(err.error?.message ?? 'Failed to submit report.'))
        )
      );
  }
}