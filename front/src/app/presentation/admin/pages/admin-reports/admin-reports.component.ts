// presentation/admin/pages/admin-reports/admin-reports.component.ts
import { Component, computed, inject, signal, OnInit , HostListener} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GetAdminReportsUseCase } from '../../../../application/admin/use-cases/reports/get-admin-reports.use-case';
import { DeletePostUseCase } from '../../../../application/post/use-cases/delete.post.use-case';
import { AdminReport } from '../../../../domain/admin/entity/admin-report.entity';
import { AuthNavigationService } from '../../../../application/auth/services/auth-navigation.service';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { ToastService } from '../../../../application/auth/services/toast.service'
import { ResolveReportUserUseCase } from '../../../../application/report/use-cases/resolve-report.use-case'
import { ReportStatus } from '../../../../domain/admin/entity/admin-report.entity'

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, RouterLink, ConfirmModalComponent],
  templateUrl: './admin-reports.component.html',
  styleUrl: './admin-reports.component.css',
})
export class AdminReportsComponent implements OnInit {
  private readonly getAdminReportsUseCase = inject(GetAdminReportsUseCase);
  private readonly resolveReportUseCase = inject(ResolveReportUserUseCase)
  private readonly deletePostUseCase = inject(DeletePostUseCase);
  private readonly authNavigation = inject(AuthNavigationService);
  private readonly toast = inject(ToastService);

  readonly reports = signal<AdminReport[]>([]);
  // reporst type fiha status pending / 
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly expandedReportId = signal<number | null>(null);
  readonly pendingDelete = signal<AdminReport | null>(null);

  readonly pendingResolve = signal<AdminReport | null>(null);


readonly reasonReport = signal<AdminReport | null>(null);

openReason(report: AdminReport): void {
  this.reasonReport.set(report);
}

@HostListener('document:keydown.escape')
closeReason(): void {
  this.reasonReport.set(null);
}

  readonly resolveConfirmationMessage = computed(() => {
    const r = this.pendingResolve();
    if (!r) return '';
    return r.postId
      ? `Mark the report on post #${r.postId} by ${r.reportedUsername} as resolved?`
      : `Mark the report on user ${r.reportedUsername} as resolved?`;
  });

  readonly deleteConfirmationMessage = computed(() => {
    const r = this.pendingDelete();
    return r ? `Post #${r.postId} by ${r.reportedUsername} will be permanently deleted.` : '';
  });

  private currentPage = 0;
  private totalPages = 1;

  ngOnInit(): void {
    this.loadReports(0);
  }

  loadMore(): void {
    if (this.isLoading()) return;
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

  // AI => GO TO BACKEND // \\ {} 
 
  //////////////
  requestResolveReport(report: AdminReport): void {
    this.pendingResolve.set(report);
  }

  cancelResolveReport(): void {
    this.pendingResolve.set(null);
  }

  confirmResolveReport(): void {
    const report = this.pendingResolve();
    if (!report) return;
    this.pendingResolve.set(null); // close the modal

    const clickedId = report.id;

    this.resolveReportUseCase.execute(clickedId).subscribe({
      next: () => {
        this.setStatus(clickedId, 'RESOLVED');
        this.toast.success(
          report.postId
            ? `Post report #${clickedId} resolved.`
            : `User report #${clickedId} resolved.`
        );
      },
      error: (err) => {
        if (err.status === 401) {
          this.authNavigation.handle401(err);
          return;
        }
        this.toast.error(err.error?.message ?? 'Could not resolve this report.');
      },
    });
  }


  private setStatus(id: number, status: ReportStatus): void {
    this.reports.update((list) =>
      list.map((r) =>
        r.id === id
          ? new AdminReport(r.id, r.reporterUsername, r.reportedUsername,
            r.postId, r.reason, r.createdAt, status, r.type)
          : r
      )
    );
  }

  requestDeletePost(report: AdminReport): void {
    this.pendingDelete.set(report);
  }

  cancelDeletePost(): void {
    this.pendingDelete.set(null);
  }

  confirmDeletePost(): void {

    const report = this.pendingDelete();
    if (!report?.postId) return;
    this.pendingDelete.set(null);

    this.deletePostUseCase.execute(report.postId).subscribe({
      next: () => {
        // remove every report that points to the deleted post
        this.toast.success('Post deleted.');
      },
      error: (err) => {
        if (err.status === 401) {
          this.authNavigation.handle401(err);
          return;
        }
        this.toast.error(err.error?.message ?? 'Could not delete this post.');
      },
    });
  }

  private loadReports(page: number): void {
    this.isLoading.set(true);
    this.getAdminReportsUseCase.execute(page).subscribe({
      next: (result) => {
        console.log("REPORST'S ===>{}", result);
        this.currentPage = result.currentPage;
        this.totalPages = result.totalPages;
        this.reports.set(page === 0 ? result.reports : [...this.reports(), ...result.reports]);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        if (err.status === 401) {
          this.authNavigation.handle401(err);
          return;
        }
        this.errorMessage.set(err.error?.message ?? 'Could not load reports.');
      },
    });
  }
}