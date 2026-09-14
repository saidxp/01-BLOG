import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { AdminReportRepository, PagedAdminReports } from '../../domain/admin/repository/admin-report.repository';
import { AdminReportPageDto } from './dto/admin-report.dto';
import { toAdminReportEntity } from './mapper/admin-report.mapper';
import { environment } from '../../../environments/environment.development';

@Injectable()
export class AdminReportRepositoryImpl extends AdminReportRepository {
  private readonly http = inject(HttpClient);
  
  override getReports(page: number): Observable<PagedAdminReports> {
    const params = new HttpParams().set('page', page).set('size', 20);

    return this.http
      .get<AdminReportPageDto>(`${environment.apiUrl}/api/admin/reports`, { params, withCredentials: true })
      .pipe(
        map((pageDto) => ({
          reports: pageDto.content.map(toAdminReportEntity),
          totalPages: pageDto.totalPages,
          currentPage: pageDto.number,
        })),
        catchError(() => throwError(() => new Error('Failed to load reports.')))
      );
  }
}