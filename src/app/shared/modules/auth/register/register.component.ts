import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../core/services/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  errorMessage: string = '';
  hidePassword: boolean = true;
  isLoading: boolean = false;

  roles = [
    { id: 1, name: 'Administrador (Control Total)' },
    { id: 2, name: 'Farmacéutico (Inventario y Ventas)' },
    { id: 3, name: 'Cajero (Punto de Venta)' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toast: ToastrService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      ci: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      role_id: [1, [Validators.required]] // Por defecto Administrador como solicitó el usuario
    });
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  togglePassword(): void {
    this.hidePassword = !this.hidePassword;
  }

  register(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.error('Por favor completa todos los campos requeridos correctamente.', 'Formulario Incompleto');
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    const payload = {
      ...this.form.value,
      ci: Number(this.form.value.ci),
      role_id: Number(this.form.value.role_id)
    };

    this.authService.register(payload).subscribe({
      next: (response: any) => {
        sessionStorage.setItem('angular17TokenData', JSON.stringify(response.user));
        this.toast.success('¡Tu cuenta ha sido creada exitosamente!', 'Registro Completado');
        this.router.navigate(['/dashboard']);
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('Error al registrar usuario:', error);
        if (error.status === 0) {
          this.errorMessage = 'No se pudo conectar con el servidor backend. Verifica que esté en ejecución.';
        } else if (error.error && error.error.error) {
          this.errorMessage = error.error.error;
        } else {
          this.errorMessage = 'Ocurrió un error al registrar la cuenta. Intenta de nuevo.';
        }
        this.toast.error(this.errorMessage, 'Error de Registro');
      }
    });
  }
}
