import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RolesService } from '../../../../core/services/roles/roles.service';
import { IRoles } from '../../../../core/interfaces/roles.interface';
import { UsersApiService } from '../../../../core/services/users/users-api.service';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IUsers } from '../../../../core/interfaces/users.interface';

@Component({
  selector: 'app-new-user',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './new-user.component.html',
  styleUrl: './new-user.component.scss'
})
export class NewUserComponent {
  newImage!: File ; 
  previewImage: any = null;
  currentImageSource: any;
  roles: IRoles[] = [];
  form: FormGroup;
  
  constructor(private router: Router, 
    private sanitizer: DomSanitizer,
    private rolesservices: RolesService,
    private usersServices: UsersApiService,
    private fb: FormBuilder){
      this.form = this.fb.group({
        username: ['', [Validators.required]],
        image: [''],
        name: [''],
        ci: [''],
        email: [''],
        password: [''],
        confirm_password: ['', [Validators.required, this.passwordMatchValidator.bind(this)]], 
        role_id: [''],
        status_id: ['1']
      });
  }
  ngOnInit(){
    this.currentImageSource = 'https://th.bing.com/th/id/OIP.B0i24_Lna8GxdB3yDClP3wHaHa?w=256&h=256&rs=1&pid=ImgDetMain';
    this.getRoleslist()
  }
  goToUserList(){
    this.router.navigate(['users']).then(() => {
      window.scrollTo(0, 0);
    })
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
        console.error('The selected file is not an image.');
      }
    }
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
  createUser() {
    if (this.form.valid) {
      const userData = this.form.value;
      const imageName = this.newImage ? this.newImage.name : '';
      // Actualizar el valor de la imagen en userData
      userData.image = imageName;
      
      this.usersServices.createUser(userData).subscribe(
        (createdUser: IUsers) => {
          console.log('Usuario creado:', createdUser);
          if (this.newImage) {
            this.uploadImage(createdUser);
          } else {
            this.goToUserList();
          }
        },
        (error) => {
          console.error('Error al crear el usuario:', error);
        }
      );
    }
  } 
  
  uploadImage(user: IUsers) {
    const formData = new FormData();
    formData.append('image', this.newImage);
    
    this.usersServices.uploadImage(user.id, formData).subscribe(
      (data) => {
        console.log('Imagen subida:', data);
        this.goToUserList();
      },
      (error) => {
        console.error('Error al subir la imagen:', error);
      }
    );
  }
}