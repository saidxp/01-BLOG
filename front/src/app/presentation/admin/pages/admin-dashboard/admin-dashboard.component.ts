import { Component, inject, signal, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GetAdminStatsUseCase } from '../../../../application/admin/use-cases/stats/get-admin-stats.use-case';
import { AdminStats } from '../../../../domain/admin/repository/admin-stats.repository';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit {
  private readonly getAdminStatsUseCase = inject(GetAdminStatsUseCase);
  private readonly platformId = inject(PLATFORM_ID);

  readonly stats = signal<AdminStats | null>(null);
  readonly isLoading = signal(true);

  ngOnInit(): void {
    // Fetch only in the browser: during SSR there is no reliable admin session
    // for this endpoint, and the async result wouldn't be reflected anyway.
    if (isPlatformBrowser(this.platformId)) {
      this.loadStats();
    }
  }

  private loadStats(): void {
    this.getAdminStatsUseCase.execute().subscribe({
      next: (data) => {
        this.stats.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }
}
