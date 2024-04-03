import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  loggedInUser: any; // Define una variable para almacenar los datos del usuario autenticado

  constructor(private authService: AuthService,
    private router: Router) {}

  ngOnInit(): void {
    this.authService.getLoggedInUserData().subscribe(
      (user) => {
        this.loggedInUser = user; // Asigna los datos del usuario autenticado a la variable
      },
      (error) => {
        console.error('Error al obtener datos del usuario:', error);
      }
    );
  }
  goToDashboard(){
    this.router.navigate(['/dashboard']);
  }
}
