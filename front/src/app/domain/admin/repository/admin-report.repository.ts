import { Observable } from 'rxjs';
import { AdminReport } from '../entity/admin-report.entity';

export interface PagedAdminReports {
  reports: AdminReport[];
  totalPages: number;
  currentPage: number;
}

export abstract class AdminReportRepository {
  abstract getReports(page: number): Observable<PagedAdminReports>;
}