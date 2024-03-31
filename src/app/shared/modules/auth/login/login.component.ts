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
    if(this.form.invalid){
      return;
    }
    console.log(this.form.value);
    this.authService.login(this.form.value).subscribe(
      (response: any) => {
        // Manejo de respuesta exitosa
        this.authService.setToken(response.token);
        this.router.navigate(['/dashboard']); 
       // Redirige al dashboard u otra página
      },
      (error) => {
        console.error('Error en la solicitud:', error); // Mostrar error completo en consola
        // Mostrar un mensaje de error al usuario
        this.errorMessage = 'Error al iniciar sesión. Verifica tus credenciales.';
      }
    );
    
  }

  
}