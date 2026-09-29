import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { RolesService } from '../../../core/services/roles/roles.service';
import { IRoles } from '../../../core/interfaces/roles.interface';
import { IStatuses } from '../../../core/interfaces/statuses';
import { StatusesService } from '../../../core/services/statuses/statuses.service';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  get endpoint(): string {
    return environment.endpoint;
  }

  loggedInUser: any;
  roles: IRoles[] = [];
  statuses: IStatuses[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private rolesservices: RolesService,
    private statuseservice: StatusesService
  ) {}

  get isDemoMode(): boolean {
    return this.router.url.startsWith('/demo') || this.authService.isDemoActive();
  }

  getRoute(path: string): string {
    return this.isDemoMode ? '/demo' + path : path;
  }

  ngOnInit(): void {
    this.authService.getLoggedInUserData().subscribe({
      next: (user) => {
        this.loggedInUser = user;
      },
      error: () => {
        // Fallback usuario demo
        this.loggedInUser = {
          name: 'Dra. Rosita Meneses',
          username: 'admin',
          email: 'rosita@farmaciasantarosita.com',
          ci: 8845129,
          role: { id: 1, name: 'Administrador' },
          status: { id: 1, name: 'Activo' }
        };
      }
    });

    this.rolesservices.getRoles().subscribe({
      next: (roles) => (this.roles = roles || []),
      error: () => {}
    });

    this.statuseservice.getStatuses().subscribe({
      next: (statuses) => (this.statuses = statuses || []),
      error: () => {}
    });
  }

  goToDashboard(): void {
    this.router.navigate([this.getRoute('/dashboard')]);
  }

  getRoleName(roleId: any): string {
    if (this.loggedInUser?.role?.name) {
      return this.loggedInUser.role.name;
    }
    const role = this.roles.find(r => r.id == roleId);
    return role ? role.name : 'Administrador';
  }

  getStatusName(statusId: any): string {
    if (this.loggedInUser?.status?.name) {
      return this.loggedInUser.status.name;
    }
    const status = this.statuses.find(s => s.id == statusId);
    return status ? status.name : 'Activo';
  }

  logout(): void {
    this.authService.logout();
  }
}
