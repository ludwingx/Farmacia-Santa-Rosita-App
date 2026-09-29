import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { RolesService } from '../../../core/services/roles/roles.service';
import { IRoles } from '../../../core/interfaces/roles.interface';
import { IStatuses } from '../../../core/interfaces/statuses';
import { StatusesService } from '../../../core/services/statuses/statuses.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  loggedInUser: any; // Define una variable para almacenar los datos del usuario autenticado
  roles: IRoles[] = [];
  statuses: IStatuses[]=[];
  constructor(private authService: AuthService,
    private router: Router,
    private rolesservices: RolesService,
    private statuseservice: StatusesService) {}

  ngOnInit(): void {
    this.authService.getLoggedInUserData().subscribe(
      (user) => {
        this.loggedInUser = user; // Asigna los datos del usuario autenticado a la variable
      },
      (error) => {
        console.error('Error al obtener datos del usuario:', error);
      }
    );
    this.rolesservices.getRoles().subscribe(roles => {
      this.roles = roles;
    });
    this.statuseservice.getStatuses().subscribe(statuses => {
      this.statuses = statuses;
    })
  }
  goToDashboard(){
    this.router.navigate(['/dashboard']);
  }

  getRoleName(roleId: any): string {
    if (this.loggedInUser?.role?.name) {
      return this.loggedInUser.role.name;
    }
    const role = this.roles.find(r => r.id == roleId);
    return role ? role.name : 'Personal Farmacia';
  }

  getStatusName(statusId: any): string {
    if (this.loggedInUser?.status?.name) {
      return this.loggedInUser.status.name;
    }
    const status = this.statuses.find(s => s.id == statusId);
    return status ? status.name : 'Activo';
  }
}
