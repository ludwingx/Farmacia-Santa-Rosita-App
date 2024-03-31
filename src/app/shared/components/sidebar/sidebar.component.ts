import { Component, Inject} from '@angular/core';

import { DOCUMENT, NgClass } from '@angular/common';
import {  NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth/auth.service';
import { UsersApiService } from '../../../core/services/users/users-api.service';
import { IUsers } from '../../../core/interfaces/users.interface';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgClass, RouterLink, RouterOutlet],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  isAuthenticated = false;
  loggedInUser: IUsers | null = null;
  constructor(private router: Router,
     @Inject(DOCUMENT) private document: Document,
     private authService : AuthService,
     private userService : UsersApiService) {
     }

  currentRoute: string = '';
  ngOnInit() {
    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(() => {
      this.currentRoute = this.getActiveRoute(this.router.url);
      this.checkActiveLinks();
    });
    this.isAuthenticated = this.authService.isAuthenticated();
    console.log('¿Está autenticado?', this.isAuthenticated);
    this.getLoggedInUserData();
  }
  getActiveRoute(url: string): string {
    // Lógica para obtener la parte de la ruta que quieres destacar
    // Puedes personalizar esto según tu estructura de URL
    const parts = url.split('/');
    return parts[parts.length - 1];
  }

  isLinkActive(route: string): boolean {
    return this.currentRoute === route;
  }

  loadProducts(): void {
    // Navegación programática
    this.router.navigate(['/inventory']);
  }
  loadUsers(){
    this.router.navigate(['/users']);
  }
  checkActiveLinks(): void {
    const links = this.document.querySelectorAll('.nav_link');

    if (links && typeof links.forEach === 'function') {
      links.forEach(link => {
        const route = link.getAttribute('data-route');
        if (route && this.isLinkActive(route)) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirige al componente de inicio de sesión
  }
  getLoggedInUserData(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      this.loggedInUser = this.authService.getLoggedInUser();
      console.log('User:', this.loggedInUser);
    } else {
      console.log('Usuario no autenticado.');
      // Aquí puedes manejar el caso de usuario no autenticado según tus necesidades
    }
  }
  


}
