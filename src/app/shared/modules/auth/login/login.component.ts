import { Component } from '@angular/core';
import { IAuthUser } from '../../../../core/interfaces/users.interface';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  errorMessage = '';
  form: FormGroup;
  hidePassword: boolean = true;
  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }
  ngOnInit(){
    console.log('¿Autenticado?', this.authService.isAuthenticated());
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }else{
      this.router.navigate(['/login']);
    }
}
login() {
  if (this.form.invalid) {
    return;
  }

  this.authService.login(this.form.value).subscribe(
    (response: any) => {
      // Manejo de respuesta exitosa
      // Almacenar el token de manera segura, por ejemplo, en sessionStorage
      sessionStorage.setItem('angular17TokenData', JSON.stringify(response.data));

      // Obtener los datos del usuario autenticado y redirigir
      this.authService.getLoggedInUserData().subscribe(
        user => {
          console.log('Datos del usuario autenticado:', user);
          // Puedes redirigir a otra página aquí si es necesario
          this.router.navigate(['/dashboard']);
          window.location.reload();
        },
        error => {
          console.error('Error al obtener datos del usuario autenticado:', error);
          // Redirigir a la página de inicio si no se pueden obtener los datos del usuario
          this.router.navigate(['/']);
        }
      );
    },
    (error) => {
      console.error('Error en la solicitud:', error); // Mostrar error completo en consola
      // Mostrar un mensaje de error al usuario
      this.errorMessage = 'Error al iniciar sesión. Verifica tus credenciales.';
    }
  );
}

  
}