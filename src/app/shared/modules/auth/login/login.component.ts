import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  errorMessage = '';
  form: FormGroup;
  hidePassword: boolean = true;
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private toast: ToastrService
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
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

  login(): void {
    if (this.form.invalid) {
      this.toast.error('Por favor, completa todos los campos requeridos.', 'Formulario Incompleto');
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    const credentials = this.form.value;

    this.authService.login(credentials).subscribe({
      next: (response: any) => {
        sessionStorage.setItem('angular17TokenData', JSON.stringify(response.data));
        this.authService.getLoggedInUserData().subscribe({
          next: () => {
            this.toast.success('¡Bienvenido al sistema!', 'Sesión Iniciada');
            this.router.navigate(['/dashboard']);
          },
          error: () => {
            this.router.navigate(['/dashboard']);
          }
        });
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('Error en la solicitud:', error);
        if (error.status === 0) {
          this.errorMessage = 'No se pudo conectar con el servidor backend. Verifica que esté en ejecución.';
          this.toast.error('No se pudo establecer conexión con el servidor.', 'Error de Conexión');
        } else {
          this.errorMessage = 'Nombre de usuario o contraseña incorrectos.';
          this.toast.error('Credenciales incorrectas.', 'Error de Autenticación');
        }
      }
    });
  }

  enterDemoMode(): void {
    this.authService.loginDemo();
    this.toast.info('Ingresando al modo demostración interactivo para portafolio...', 'Modo Demo');
    this.router.navigate(['/demo/dashboard']);
  }
}