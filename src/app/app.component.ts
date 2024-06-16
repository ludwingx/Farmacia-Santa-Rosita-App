import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { DashboardComponent } from './shared/modules/dashboard/dashboard.component';
import { LoginComponent } from './shared/modules/auth/login/login.component';
import { AuthService } from './core/services/auth/auth.service';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
    SidebarComponent,
    HeaderComponent,
    DashboardComponent,
    LoginComponent,
    LoadingComponent
  ],
  
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'farmacia-santa-rosita-app';
  hideSidebar: boolean = false;
  loading: boolean = true;
  isAuthenticated: boolean = false;
  constructor(private router: Router,
    private authService: AuthService,
  private toast: ToastrService) {
  
  }

  ngOnInit() {
    this.checkAuthentication();
  }

  checkAuthentication(): void {
    console.log('Verificando autenticación...');
    // Verificar el estado de autenticación
    if (this.authService.isAuthenticated()) {
      console.log('Usuario autenticado.');
      this.isAuthenticated = true;
      this.toast.success('Usuario autenticado', '¡Bienvenido de nuevo!');
      // Redirigir al dashboard si el usuario está autenticado
      this.router.navigate(['/dashboard']);
    } else {
      console.log('Usuario no autenticado.');
      // Redirigir al login si el usuario no está autenticado
      this.router.navigate(['/login']);
    }
    // Ocultar la pantalla de carga después de la verificación
    this.loading = false;
  }
}
