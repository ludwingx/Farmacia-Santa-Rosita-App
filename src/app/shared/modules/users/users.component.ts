import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UsersApiService } from '../../../core/services/users/users-api.service';
import { Router, RouterLink } from '@angular/router';
import { IUsers } from '../../../core/interfaces/users.interface';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, NgClass, RouterLink],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  get endpoint(): string {
    return environment.endpoint;
  }

  users: IUsers[] = [];
  filteredUsers: IUsers[] = [];
  searchTerm: string = '';
  selectedUser: IUsers | null = null;
  loading: boolean = true;

  @ViewChild('verPerfilModal') verPerfilModal!: ElementRef;

  constructor(
    private usersService: UsersApiService,
    private authService: AuthService,
    private router: Router,
    private toaster: ToastrService
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
        // Filtrar usuarios activos e inactivos
        this.users = (data || []).filter(user => user.status_id === 1 || user.status_id === 2);
        this.applyFilter();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredUsers = [...this.users];
      return;
    }
    this.filteredUsers = this.users.filter(u =>
      (u.name && u.name.toLowerCase().includes(term)) ||
      (u.username && u.username.toLowerCase().includes(term)) ||
      (u.email && u.email.toLowerCase().includes(term)) ||
      (u.ci && u.ci.toString().includes(term)) ||
      (u.role?.name && u.role.name.toLowerCase().includes(term))
    );
  }

  newUser(): void {
    this.router.navigate([this.getRoute('/users/new-user')]).then(() => {
      window.scrollTo(0, 0);
    });
  }

  editUser(user: IUsers): void {
    this.router.navigate([this.getRoute('/users/edit-user/' + user.id)]).then(() => {
      window.scrollTo(0, 0);
    });
  }

  goToDeletedUsers(): void {
    this.router.navigate([this.getRoute('/users/deleted-users-list')]).then(() => {
      window.scrollTo(0, 0);
    });
  }

  openUserProfileModal(user: IUsers): void {
    this.selectedUser = user;
  }

  toggleUserStatus(user: IUsers): void {
    const newStatusId = user.status?.id === 1 ? 2 : 1;
    this.usersService.deleteUser(user.id, newStatusId).subscribe({
      next: () => {
        this.loadUsers();
        if (newStatusId === 2) {
          this.toaster.warning('Ya no podrá acceder al sistema', 'Cuenta suspendida: ' + user.name);
        } else {
          this.toaster.success('El usuario ya puede acceder al sistema', 'Cuenta habilitada: ' + user.name);
        }
      },
      error: (error) => {
        console.error('Error al cambiar el estado del usuario:', error);
        this.toaster.error('No se pudo actualizar el estado del usuario');
      }
    });
  }

  getRoleBadgeClass(roleName: string | undefined): string {
    switch ((roleName || '').toLowerCase()) {
      case 'administrador':
        return 'badge-role-admin';
      case 'farmacéutico':
      case 'farmaceutico':
        return 'badge-role-pharma';
      case 'cajero':
        return 'badge-role-cashier';
      default:
        return 'badge-role-default';
    }
  }

  generatePDF(): void {
    const doc = new jsPDF();

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    // Encabezado
    doc.addImage('./assets/img/logo.png', 'PNG', 14, 8, 16, 16);
    doc.setFont('helvetica', 'bold');
    doc.text('FARMACIA SANTA ROSITA', 35, 14);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Listado Oficial de Personal y Usuarios del Sistema', 35, 20);
    doc.text(`Generado: ${new Date().toLocaleDateString()} a las ${new Date().toLocaleTimeString()}`, 130, 20);

    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 146, 32);
    doc.line(14, 26, 196, 26);

    let yPosition = 36;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('ID', 14, yPosition);
    doc.text('Usuario', 26, yPosition);
    doc.text('Nombre Completo', 55, yPosition);
    doc.text('Rol / Cargo', 115, yPosition);
    doc.text('Cédula (CI)', 150, yPosition);
    doc.text('Estado', 180, yPosition);

    yPosition += 4;
    doc.setLineWidth(0.2);
    doc.setDrawColor(200, 200, 200);
    doc.line(14, yPosition, 196, yPosition);

    yPosition += 6;
    doc.setFont('helvetica', 'normal');

    this.filteredUsers.forEach(user => {
      if (yPosition > 275) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(`${user.id}`, 14, yPosition);
      doc.text(`${user.username}`, 26, yPosition);
      doc.text(`${user.name || '-'}`, 55, yPosition);
      doc.text(`${user.role?.name || 'Personal'}`, 115, yPosition);
      doc.text(`${user.ci || '-'}`, 150, yPosition);
      doc.text(`${user.status?.id === 1 ? 'Activo' : 'Inactivo'}`, 180, yPosition);
      yPosition += 8;
    });

    doc.save('farmacia-santa-rosita-usuarios.pdf');
    this.toaster.success('Reporte de usuarios en PDF generado exitosamente', 'Descarga Lista');
  }
}
