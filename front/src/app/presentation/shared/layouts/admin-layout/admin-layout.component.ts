import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { GetAdminStatsUseCase } from '../../../../application/admin/use-cases/stats/get-admin-stats.use-case';
import { AdminStats } from '../../../../domain/admin/repository/admin-stats.repository';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css',
})
export class AdminLayoutComponent implements OnInit {
  private readonly getAdminStatsUseCase = inject(GetAdminStatsUseCase);

  readonly stats = signal<AdminStats | null>(null);
  readonly isLoading = signal(true);

  ngOnInit(): void {
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
