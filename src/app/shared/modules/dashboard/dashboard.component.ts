import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { UsersApiService } from '../../../core/services/users/users-api.service';
import { ReportsApiService } from '../../../core/services/reports/reports-api.service';
import { IDashboardSummary } from '../../../core/interfaces/reports.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  loggedInUserName: string = '';
  summary: IDashboardSummary | null = null;
  loading: boolean = true;

  constructor(
    private authService: AuthService,
    private userService: UsersApiService,
    private reportsService: ReportsApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loggedInUserName = this.userService.getLoggedInUserName() || 'Usuario';
    this.loadSummary();
  }

  loadSummary(): void {
    this.reportsService.getDashboardSummary().subscribe({
      next: (data) => {
        this.summary = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar datos del dashboard:', err);
        this.loading = false;
      }
    });
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
