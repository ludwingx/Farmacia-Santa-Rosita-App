import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { RolesService } from '../../../../core/services/roles/roles.service';
import { IRoles } from '../../../../core/interfaces/roles.interface';
import { UsersApiService } from '../../../../core/services/users/users-api.service';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IUsers } from '../../../../core/interfaces/users.interface';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './new-user.component.html',
  styleUrl: './new-user.component.scss'
})
export class NewUserComponent implements OnInit {
  newImage!: File;
  previewImage: any = null;
  currentImageSource: string = 'assets/img/logo.png';
  roles: IRoles[] = [];
  form: FormGroup;
  isSubmitting: boolean = false;

  constructor(
    private router: Router,
    private sanitizer: DomSanitizer,
    private rolesservices: RolesService,
    private usersServices: UsersApiService,
    private authService: AuthService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      name: ['', [Validators.required]],
      ci: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirm_password: ['', [Validators.required]],
      role_id: ['', [Validators.required]],
      status_id: ['1']
    }, { validators: this.passwordMatchValidator });
  }

  get isDemoMode(): boolean {
    return this.router.url.startsWith('/demo') || this.authService.isDemoActive();
  }

  getRoute(path: string): string {
    return this.isDemoMode ? '/demo' + path : path;
  }

  ngOnInit(): void {
    this.getRoleslist();
  }

  goToUserList(): void {
    this.router.navigate([this.getRoute('/users')]).then(() => {
      window.scrollTo(0, 0);
    });
  }

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirm_password = control.get('confirm_password')?.value;
    if (password && confirm_password && password !== confirm_password) {
      control.get('confirm_password')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onImageChange(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        this.newImage = file;
        const reader = new FileReader();
        reader.onload = () => {
          this.previewImage = reader.result;
        };
        reader.readAsDataURL(this.newImage);
      } else {
        this.toastr.warning('Por favor selecciona un archivo de imagen válido');
      }
    }
  }

  getRoleslist(): void {
    this.rolesservices.getRoles().subscribe({
      next: (data) => {
        this.roles = data || [];
        // Default a Administrador si esta vacio
        if (this.roles.length === 0) {
          this.roles = [
            { id: 1, name: 'Administrador' },
            { id: 2, name: 'Farmacéutico' },
            { id: 3, name: 'Cajero' }
          ];
        }
      },
      error: (error) => {
        console.error('Error al obtener los roles:', error);
        this.roles = [
          { id: 1, name: 'Administrador' },
          { id: 2, name: 'Farmacéutico' },
          { id: 3, name: 'Cajero' }
        ];
      }
    });
  }

  createUser(): void {
    if (this.form.invalid) {
      this.toastr.error('Por favor completa todos los campos obligatorios', 'Formulario Incompleto');
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const userData = { ...this.form.value };
    delete userData.confirm_password;

    this.usersServices.createUser(userData).subscribe({
      next: (createdUser: any) => {
        this.toastr.success(`Usuario @${userData.username} registrado correctamente`, 'Registro Exitoso');
        if (this.newImage && createdUser?.id) {
          this.uploadImage(createdUser);
        } else {
          this.isSubmitting = false;
          this.goToUserList();
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error al crear el usuario:', error);
        this.toastr.error('Error al registrar el usuario en el sistema');
      }
    });
  }

  uploadImage(user: any): void {
    const formData = new FormData();
    formData.append('image', this.newImage);

    this.usersServices.uploadImage(user.id, formData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.goToUserList();
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error al subir la imagen:', error);
        this.goToUserList();
      }
    });
  }
}