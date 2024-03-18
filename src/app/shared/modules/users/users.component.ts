import { Component, ElementRef, ViewChild } from '@angular/core';
import { UsersApiService } from '../../../core/services/users/users-api.service';
import { Router } from '@angular/router';
import { IUsers } from '../../../core/interfaces/users.interface';


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  @ViewChild('deleteConfirmationModal') deleteConfirmationModal!: ElementRef;
  constructor(private usersService: UsersApiService,
    private router: Router){

  }
  users: IUsers[] = [];
  userToDelete: IUsers | null = null;
  ngOnInit(): void {
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
    
  }

  openDeleteConfirmationModal(product: IUsers) {
    this.userToDelete = product; // Guarda el producto a eliminar
    // Muestra el modal de confirmación
    this.deleteConfirmationModal.nativeElement.classList.add('show');
    document.body.classList.add('modal-open');
  }

  closeDeleteConfirmationModal() {
    // Oculta el modal de confirmación
    this.deleteConfirmationModal.nativeElement.classList.remove('show');
    document.body.classList.remove('modal-open');
  }
  confirmDelete() {
    // Lógica para eliminar el producto
    // ...

    // Cierra el modal después de confirmar la eliminación
    this.closeDeleteConfirmationModal();
  }
}
