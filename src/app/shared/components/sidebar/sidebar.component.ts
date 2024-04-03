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
    this.isAuthenticated = this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      this.authService.getLoggedInUserData().subscribe(
        user => {
          this.loggedInUser = user;
          console.log('User:', this.loggedInUser);
        },
        error => {
          console.error('Error obteniendo datos del usuario:', error);
        }
      );
    }
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.currentRoute = this.getActiveRoute(this.router.url);
        this.checkActiveLinks();
      });
  }

  getActiveRoute(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 1];
  }

  isLinkActive(route: string): boolean {
    return this.currentRoute === route;
  }

  loadProducts(): void {
    this.router.navigate(['/inventory']);
  }

  loadUsers() {
    this.router.navigate(['/users']);
  }
  loadProfile(){
    this.router.navigate(['/profile']); // Navegar al componente de perfil
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
    this.router.navigate(['/login']);
  }
}
