import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../core/services/api/admin.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  dashboardData: any = {};
  loading = true;
  error: string | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.adminService.getDashboardSummary().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard data:', err);
        this.error = 'No se pudo cargar la información del dashboard';
        this.loading = false;
      }
    });
  }

  getUsageStatsKeys(): string[] {
    if (!this.dashboardData?.usageStats) return [];
    return Object.keys(this.dashboardData.usageStats);
  }

  getRevenueKeys(): string[] {
    if (!this.dashboardData?.monthlyRevenue) return [];
    return Object.keys(this.dashboardData.monthlyRevenue);
  }

  getMaxUsage(): number {
    if (!this.dashboardData?.usageStats) return 0;
    return Math.max(...Object.values(this.dashboardData.usageStats) as number[]);
  }

  getMaxRevenue(): number {
    if (!this.dashboardData?.monthlyRevenue) return 0;
    return Math.max(...Object.values(this.dashboardData.monthlyRevenue) as number[]);
  }

  getPercentage(value: number, max: number): number {
    if (!max) return 0;
    return (value / max) * 100;
  }
}