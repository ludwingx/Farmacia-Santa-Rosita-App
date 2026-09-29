import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsApiService } from '../../../core/services/reports/reports-api.service';
import { IDashboardSummary } from '../../../core/interfaces/reports.interface';
import { IProductsList } from '../../../core/interfaces/products.interface';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit {
  summary: IDashboardSummary | null = null;
  criticalStock: IProductsList[] = [];
  loading: boolean = true;
  activeReportTab: 'vencimientos' | 'stock' = 'vencimientos';

  constructor(private reportsService: ReportsApiService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.reportsService.getDashboardSummary().subscribe({
      next: (data) => {
        this.summary = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar reporte de dashboard:', err);
        this.loading = false;
      }
    });

    this.reportsService.getCriticalStock().subscribe({
      next: (data) => {
        this.criticalStock = data || [];
      },
      error: (err) => {
        console.error('Error al cargar stock crítico:', err);
      }
    });
  }

  getDaysUntilExpiration(dateStr: Date | string | undefined): number {
    if (!dateStr) return 999;
    const expDate = new Date(dateStr);
    const today = new Date();
    const diffTime = expDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  printReport(): void {
    window.print();
  }
}
