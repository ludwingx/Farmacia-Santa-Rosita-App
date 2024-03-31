import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { DashboardComponent } from './shared/modules/dashboard/dashboard.component';
import { LoginComponent } from './shared/modules/auth/login/login.component';
import { AuthService } from './core/services/auth/auth.service';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
    SidebarComponent,
    HeaderComponent,
    DashboardComponent,
    LoginComponent
 
  ],
  
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'farmacia-santa-rosita-app';
  hideSidebar: boolean = false;

  constructor(private router: Router,
    private authService: AuthService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Verificar si la ruta actual es la página de login
        this.hideSidebar = event.url === '/login';
      }
    });
  }

  ngOnInit(){
    this.authService.getLoggedInUserData();
  }  
}
