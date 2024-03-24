import { Component, ElementRef, ViewChild  } from '@angular/core';
import { UsersApiService } from '../../../core/services/users/users-api.service';
import { Router } from '@angular/router';
import { IUsers } from '../../../core/interfaces/users.interface';
import { NgClass } from '@angular/common';


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [NgClass],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  users: IUsers[] = [];
  selectedUser: IUsers | null = null;
  showEditButton: boolean = false;
  userToDelete: IUsers | null = null;
  @ViewChild('verPerfilModal') verPerfilModal!: ElementRef;
  @ViewChild('deleteUserConfirmationModal') deleteUserConfirmationModal!: ElementRef;

  
  constructor(private usersService: UsersApiService,
    private router: Router){

  }
  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void{
    this.usersService.getListUsers().subscribe(
      (data: IUsers[]) => {
        this.users = data;

      }

    );
  }
  newUser(){
    this.router.navigate(['users/new-user']).then(() => {
      window.scrollTo(0, 0);
    })
  }
  editUser(user: IUsers){
    this.router.navigate(['users/edit-user/', user.id]).then(() => {
      window.scrollTo(0, 0);
    })
  }
  openUserProfileModal(user: IUsers){
    this.selectedUser = user; // Guarda el usuario seleccionado
    // Verifica si verPerfilModal está definido
  }
  toggleUserStatus(user: IUsers): void {
    const newStatusId = user.status.id === 1 ? 2 : 1; // Alternar entre estado activo (1) e inactivo (2)
    this.usersService.deleteUser(user.id, newStatusId).subscribe(
      () => {
        // Actualizar la lista de usuarios o realizar cualquier otra acción necesaria
        this.loadUsers();
        console.log('Usuario cambiado de estado exitosamente');
      },
      error => {
        console.error('Error al cambiar el estado del usuario:', error);
        // Manejar el error apropiadamente
      }
    );
  }

}
