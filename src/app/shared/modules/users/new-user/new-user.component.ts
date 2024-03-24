import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RolesService } from '../../../../core/services/roles/roles.service';
import { IRoles } from '../../../../core/interfaces/roles.interface';
import { UsersApiService } from '../../../../core/services/users/users-api.service';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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
        status_id: ['']
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
        this.newImage = files[0];
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
    const formDataToSend: FormData = new FormData();
    formDataToSend.append('username', this.form.get('username')!.value);
    formDataToSend.append('ci', this.form.get('ci')!.value);
    formDataToSend.append('name', this.form.get('name')!.value);
    formDataToSend.append('email', this.form.get('email')!.value);
    formDataToSend.append('password', this.form.get('password')!.value);
    formDataToSend.append('role_id', this.form.get('role_id')!.value);
    formDataToSend.append('status_id', this.form.get('status_id')!.value);

    // Agregar otros campos del usuario al FormData

  if (this.newImage) {
      formDataToSend.append('profileImage', this.newImage, this.newImage.name);
    }
    const userData: any = {};
    formDataToSend.forEach((value, key) => {
      userData[key] = value;
    });
  
    // Enviar el FormData al servicio para crear un nuevo usuario
    this.usersServices.createUser(userData).subscribe(
      (data) => {
        console.log('Usuario creado:', data);
        // Mostrar mensaje de éxito al usuario
      },
      (error) => {
        console.error('Error al crear el usuario:', error);
        // Mostrar mensaje de error al usuario
      }
    );
  }
}
