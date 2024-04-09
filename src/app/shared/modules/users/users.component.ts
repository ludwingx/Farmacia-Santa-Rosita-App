import { Component, ElementRef, ViewChild  } from '@angular/core';
import { UsersApiService } from '../../../core/services/users/users-api.service';
import { Router } from '@angular/router';
import { IUsers } from '../../../core/interfaces/users.interface';
import { NgClass } from '@angular/common';
import jsPDF from 'jspdf';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [NgClass],
  templateUrl:'./users.component.html',
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
    private router: Router,
    private toaster : ToastrService
    ){
      
  }
  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void{
    this.usersService.getListUsers().subscribe(
      (data: IUsers[]) => {
        // Filtrar los usuarios por status_id igual a 1 o 2
        this.users = data.filter(user => user.status_id === 1 || user.status_id === 2);
      },
      error => {
        console.error('Error al cargar usuarios:', error);
        // Manejar el error apropiadamente
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
        if (newStatusId === 2) {
          this.toaster.warning('ya no podrá acceder al sistema', 'Deshabilitaste la cuenta de ' + user.name);
        } else {
          this.toaster.info('ya podrá acceder al sistema', 'Habilitaste la cuenta de ' + user.name);
        }
        console.log('Usuario cambiado de estado exitosamente');
      },
      error => {
        console.error('Error al cambiar el estado del usuario:', error);
        // Manejar el error apropiadamente
      }
    );
  }
  generatePDF(){
    const doc = new jsPDF();


    doc.setFontSize(10);
    doc.setTextColor(0,0,0); // Color negro

    //logo
    doc.addImage('./assets/img/logo.png', 'PNG', 10, 4, 20, 20);
    doc.text('Farmacia Santa Rosita', 165, 10);
    doc.text('Fecha: ' + new Date().toLocaleDateString(), 165, 15);
    doc.text('Hora: ' + new Date().toLocaleTimeString(), 165, 20);
    // Separador
    doc.setLineWidth(0.5);
    doc.setDrawColor(0);
    doc.line(10, 22, 200, 22);
    // Encabezado
    doc.setFontSize(20);
    doc.text('Lista de Usuarios Activos', 60, 30);
    // Contenido de la lista de usuarios
    let yPosition = 50; // Posición vertical inicial
    const columnHeaders = ['ID', 'Nombre', 'Correo Electrónico']; // Encabezados de columna
    doc.setFontSize(12);
    doc.setTextColor(0); // Color negro
    doc.setFont('helvetica', 'bold'); // Establecer la fuente y el estilo

    // Agregar encabezados de columna
    let xPosition = 10;
    // Ajustar la posición de cada encabezado manualmente para centrarlo
    doc.text(columnHeaders[0], xPosition, yPosition); // ID
    doc.text(columnHeaders[1], xPosition + 10, yPosition); // Nombre
    doc.text(columnHeaders[2], xPosition + 70, yPosition); // Correo Electrónico

    // Separador entre encabezados y datos
    yPosition += 5;
    doc.setLineWidth(0.2);
    doc.setDrawColor(0);
    doc.line(10, yPosition, 200, yPosition);

    // Filtrar usuarios activos (status_id = 1) para imprimir en el PDF
    const activeUsers = this.users.filter(user => user.status_id === 1);

    // Agregar datos de usuarios activos
    activeUsers.forEach(user => {
      yPosition += 10;
      doc.setFont('helvetica', 'normal'); // Establecer la fuente y el estilo
      doc.text(`${user.id}`, 10, yPosition); // ID
      doc.text(user.name, 20, yPosition); // Nombre
      doc.text(user.email, 80, yPosition); // Correo Electrónico
    });

    // Mostrar el PDF
    doc.save('lista-usuarios-activos.pdf');
    this.toaster.success('PDF generado exitosamente', 'Exito');
  }
}
