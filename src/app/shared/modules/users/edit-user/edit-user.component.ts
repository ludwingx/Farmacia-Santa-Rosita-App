import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UsersApiService } from '../../../../core/services/users/users-api.service';
import { IUsers } from '../../../../core/interfaces/users.interface';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IRoles } from '../../../../core/interfaces/roles.interface';
import { RolesService } from '../../../../core/services/roles/roles.service';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss'
})
export class EditUserComponent implements OnInit {
  get endpoint(): string {
    return environment.endpoint;
  }

  userId!: number;
  form: FormGroup;
  roles: IRoles[] = [];
  selectedUser: IUsers | undefined;
  newImage!: File;
  previewImage: any = null;
  currentImageSource: string = 'assets/img/logo.png';
  isSubmitting: boolean = false;

  constructor(
    private userService: UsersApiService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private rolesservices: RolesService,
    private sanitizer: DomSanitizer
  ) {
    this.userId = 0;
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      name: ['', [Validators.required]],
      ci: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      confirm_password: [''],
      role_id: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  get isDemoMode(): boolean {
    return this.router.url.startsWith('/demo') || this.authService.isDemoActive();
  }

  getRoute(path: string): string {
    return this.isDemoMode ? '/demo' + path : path;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = +params['id'];
      this.loadUser();
      this.getRoleslist();
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

  loadUser(): void {
    this.userService.getUser(this.userId).subscribe({
      next: (data) => {
        this.selectedUser = data;
        this.currentImageSource = data.image ? `${this.endpoint}/${data.image}` : 'assets/img/logo.png';

        this.form.patchValue({
          username: data.username,
          name: data.name,
          ci: data.ci,
          email: data.email,
          role_id: data.role?.id || data.role_id || 1
        });
      },
      error: (error) => {
        console.error('Error al obtener el usuario:', error);
        this.toastr.error('No se pudo cargar la información del usuario');
      }
    });
  }

  getRoleslist(): void {
    this.rolesservices.getRoles().subscribe({
      next: (data) => {
        this.roles = data || [];
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

  goToUserList(): void {
    this.router.navigate([this.getRoute('/users')]).then(() => {
      window.scrollTo(0, 0);
    });
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

  updateUser(): void {
    if (this.form.invalid) {
      this.toastr.error('Por favor completa todos los campos obligatorios requeridos');
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const userData = { ...this.form.value };
    delete userData.confirm_password;
    if (!userData.password) {
      delete userData.password;
    }

    this.userService.updateUser(this.userId, userData).subscribe({
      next: (data) => {
        this.toastr.success('Usuario actualizado correctamente', 'Cambios Guardados');
        if (this.newImage) {
          this.uploadImage(userData);
        } else {
          this.isSubmitting = false;
          this.goToUserList();
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error al actualizar el usuario:', error);
        this.toastr.error('Error al actualizar los datos del usuario');
      }
    });
  }

  uploadImage(userData: any): void {
    const formData = new FormData();
    formData.append('image', this.newImage);
    this.userService.uploadImage(this.userId, formData).subscribe({
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
