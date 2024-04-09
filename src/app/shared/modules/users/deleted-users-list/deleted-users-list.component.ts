import { Component } from '@angular/core';
import { UsersApiService } from '../../../../core/services/users/users-api.service';
import { Router } from '@angular/router';
import { IUsers } from '../../../../core/interfaces/users.interface';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-deleted-users-list',
  standalone: true,
  imports: [NgClass],
  templateUrl: './deleted-users-list.component.html',
  styleUrl: './deleted-users-list.component.scss'
})
export class DeletedUsersListComponent {
  users : IUsers[] = []
  selectedUser: IUsers | null = null;
  constructor(private usersService: UsersApiService,
    private router: Router,
    ){
      
  }
  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void{
    this.usersService.getListUsers().subscribe(
      (data: IUsers[]) => {
        // Filtrar los usuarios por status_id igual a 1 o 2
        this.users = data.filter(user => user.status_id === 2 );
      },
      error => {
        console.error('Error al cargar usuarios:', error);
        // Manejar el error apropiadamente
      }
    );
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
  goToUserList(){
    this.router.navigate(['users']);
  }
  openUserProfileModal(user: IUsers){
    this.selectedUser = user; // Guarda el usuario seleccionado
    // Verifica si verPerfilModal está definido
  }
}
