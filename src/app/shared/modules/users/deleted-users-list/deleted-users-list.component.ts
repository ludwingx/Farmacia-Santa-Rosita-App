import { Component, OnInit } from '@angular/core';
import { UsersApiService } from '../../../../core/services/users/users-api.service';
import { Router, RouterLink } from '@angular/router';
import { IUsers } from '../../../../core/interfaces/users.interface';
import { CommonModule, NgClass } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-deleted-users-list',
  standalone: true,
  imports: [CommonModule, NgClass, RouterLink],
  templateUrl: './deleted-users-list.component.html',
  styleUrl: './deleted-users-list.component.scss'
})
export class DeletedUsersListComponent implements OnInit {
  get endpoint(): string {
    return environment.endpoint;
  }

  users: IUsers[] = [];
  selectedUser: IUsers | null = null;
  loading: boolean = true;

  constructor(
    private usersService: UsersApiService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  get isDemoMode(): boolean {
    return this.router.url.startsWith('/demo') || this.authService.isDemoActive();
  }

  getRoute(path: string): string {
    return this.isDemoMode ? '/demo' + path : path;
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.usersService.getListUsers().subscribe({
      next: (data: IUsers[]) => {
        // Filtrar los usuarios inactivos
        this.users = (data || []).filter(user => user.status_id === 2);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.loading = false;
      }
    });
  }

  toggleUserStatus(user: IUsers): void {
    this.usersService.deleteUser(user.id, 1).subscribe({
      next: () => {
        this.toastr.success(`La cuenta de ${user.name} ha sido reactivada`, 'Usuario Restaurado');
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error al reactivar usuario:', error);
        this.toastr.error('Error al reactivar la cuenta de usuario');
      }
    });
  }

  goToUserList(): void {
    this.router.navigate([this.getRoute('/users')]).then(() => {
      window.scrollTo(0, 0);
    });
  }

  openUserProfileModal(user: IUsers): void {
    this.selectedUser = user;
  }
}
