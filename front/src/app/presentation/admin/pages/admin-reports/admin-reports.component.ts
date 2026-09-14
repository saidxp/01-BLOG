// presentation/admin/pages/admin-reports/admin-reports.component.ts
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetAdminReportsUseCase } from '../../../../application/admin/use-cases/reports/get-admin-reports.use-case';
import { AdminReport } from '../../../../domain/admin/entity/admin-report.entity';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-reports.component.html',
  styleUrl: './admin-reports.component.css',
})
export class AdminReportsComponent implements OnInit {
  private readonly getAdminReportsUseCase = inject(GetAdminReportsUseCase);

  readonly reports = signal<AdminReport[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly expandedReportId = signal<number | null>(null);

  private currentPage = 0;
  private totalPages = 1;

  ngOnInit(): void {
    this.loadReports(0);
  }

  loadMore(): void {
    if (this.currentPage + 1 < this.totalPages) {
      this.loadReports(this.currentPage + 1);
    }
  }

  get hasMore(): boolean {
    return this.currentPage + 1 < this.totalPages;
  }

  toggleReason(id: number): void {
    this.expandedReportId.update((current) => (current === id ? null : id));
  }

  private loadReports(page: number): void {
    this.isLoading.set(true);
    this.getAdminReportsUseCase.execute(page).subscribe({
      next: (result) => {
        this.currentPage = result.currentPage;
        this.totalPages = result.totalPages;
        this.reports.set(page === 0 ? result.reports : [...this.reports(), ...result.reports]);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.message);
        this.isLoading.set(false);
      },
    });
  }
}