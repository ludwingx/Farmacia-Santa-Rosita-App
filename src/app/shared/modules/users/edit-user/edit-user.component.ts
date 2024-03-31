import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersApiService } from '../../../../core/services/users/users-api.service';
import { IUsers } from '../../../../core/interfaces/users.interface';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IRoles } from '../../../../core/interfaces/roles.interface';
import { RolesService } from '../../../../core/services/roles/roles.service';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss'
})
export class EditUserComponent {
  userId!: number;
  user!: IUsers | undefined;
  form: FormGroup;
  roles: IRoles[] = [];
  selectedUser : IUsers | undefined;
  newImage!: File ; 
  previewImage: any = null;
  currentImageSource: any;
  constructor(
    private userService: UsersApiService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,

    private rolesservices: RolesService,
    private sanitizer: DomSanitizer
  ){
    this.userId = 0; 
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      image: [''],
      name: [''],
      ci: [''],
      email: [''],
      password: [''],
      confirm_password: ['', [Validators.required, this.passwordMatchValidator.bind(this)]], 
      role_id: ['']
    });
  }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = +params['id']; // Convertir a número
      // Cargar el usuario una vez que se haya obtenido el userId
      this.currentImageSource = 'https://th.bing.com/th/id/OIP.B0i24_Lna8GxdB3yDClP3wHaHa?w=256&h=256&rs=1&pid=ImgDetMain';
      this.loadUser();
      this.getRoleslist();
    });
  }
  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirm_password = control.get('confirm_password')?.value;
    if (password !== confirm_password) {
        control.get('confirm_password')?.setErrors({ passwordMismatch: true });
    } else {
        return null;
    }
    return null; // Agregar esta línea
  }
  loadUser() {

    this.userService.getUser(this.userId).subscribe(
      (data) => {
        this.currentImageSource = data.image;
        this.selectedUser = data;

        // Llenar el formulario con los datos del usuario seleccionado
        this.form.patchValue({
          username: this.selectedUser.username,
          password: this.selectedUser.password,
          confirm_password: this.selectedUser.password,
          name: this.selectedUser.name,
          ci: this.selectedUser.ci,
          email: this.selectedUser.email,
          image: this.selectedUser.image,
          role_id: this.selectedUser.role.id
        });
      },
      (error) => {
        console.error('Error al obtener el usuario:', error);
      }
    );
  }
  getRoleslist() {
    this.rolesservices.getRoles().subscribe(
      (data) => {
        this.roles = data;
      },
      (error) => {
        console.error('Error al obtener los roles:', error);
      }
    );
  }
  goToUserList(){
    this.router.navigate(['users']);
  }
  onImageChange(event: any): void {
    const files = event.target.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        this.newImage = file;
        const reader = new FileReader();
        reader.onload = () => {
          this.previewImage = reader.result;
        };
        reader.readAsDataURL(this.newImage);
      } else {
        console.error('El archivo seleccionado no es una imagen.');
      }
    }
  }

  updateUser() {
    if (this.form.valid) {
      const userData = this.form.value;
      const imageName = this.newImage ? this.newImage.name : '';
    // Actualizar el valor de la imagen en userData
    userData.image = imageName;
      this.userService.updateUser(this.userId, userData).subscribe(
        (data) => {
          console.log('Usuario actualizado:', data);
          if (this.newImage) {
            this.uploadImage(data);
          } else {
            this.goToUserList();
          }
        },
        (error) => {
          console.error('Error al actualizar el usuario:', error);
        }
      );
    } else {
      console.error('Formulario inválido. Revise los campos.');
    }
  }

  uploadImage(userData: any) {
    const formData = new FormData();
    formData.append('image', this.newImage);
    this.userService.uploadImage(this.userId, formData).subscribe(
      (data) => {
        console.log('Imagen subida:', data);
        // Actualizar userData con el nombre de la imagen
        userData.image = data.fileName; // Suponiendo que el nombre de la imagen devuelto por el servidor es fileName
        this.userService.updateUser(this.userId, userData).subscribe(
          (updatedUser) => {
            console.log('Usuario actualizado con imagen:', updatedUser);
            this.goToUserList();
          },
          (error) => {
            console.error('Error al actualizar el usuario con imagen:', error);
          }
        );
      },
      (error) => {
        console.error('Error al subir la imagen:', error);
      }
    );
  }
}
