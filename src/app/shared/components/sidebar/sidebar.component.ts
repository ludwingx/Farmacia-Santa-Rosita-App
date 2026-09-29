import { Component, Inject} from '@angular/core';
import { DOCUMENT, NgClass } from '@angular/common';
import {  NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth/auth.service';
import { UsersApiService } from '../../../core/services/users/users-api.service';
import { IUsers } from '../../../core/interfaces/users.interface';
import { LoadingComponent } from '../loading/loading.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgClass, RouterLink, RouterLinkActive, RouterOutlet, LoadingComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  isAuthenticated = false;
  loggedInUser: IUsers | null = null;
  loading: boolean = true;
  isNavbarShown: boolean = false;

  get endpoint(): string {
    return environment.endpoint;
  }

  constructor(
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    private authService: AuthService,
    private userService: UsersApiService
  ) {}

  currentRoute: string = '';

  ngOnInit() {
    this.isAuthenticated = this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      this.authService.getLoggedInUserData().subscribe(
        user => {
          this.loggedInUser = user;
          console.log('User:', this.loggedInUser);
          this.loading = false;
        },
        error => {
          console.error('Error obteniendo datos del usuario:', error);
          this.loading = false;
        }
      );
    }

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.currentRoute = this.getActiveRoute(this.router.url);
        this.checkActiveLinks();
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
          this.isNavbarShown = false;
        }
      });
  }

  toggleNavbar(): void {
    this.isNavbarShown = !this.isNavbarShown;
  }

  closeNavbar(): void {
    this.isNavbarShown = false;
  }

  getActiveRoute(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 1];
  }

  isLinkActive(route: string): boolean {
    return this.currentRoute === route;
  }

  get isDemoMode(): boolean {
    return this.router.url.startsWith('/demo') || this.authService.isDemoActive();
  }

  get routePrefix(): string {
    return this.isDemoMode ? '/demo' : '';
  }

  getDashboardRoute(): string {
    return this.isDemoMode ? '/demo/dashboard' : '/dashboard';
  }

  getInventoryRoute(): string {
    return this.isDemoMode ? '/demo/inventory' : '/inventory';
  }

  getSalesRoute(): string {
    return this.isDemoMode ? '/demo/sales' : '/sales';
  }

  getPurchasesRoute(): string {
    return this.isDemoMode ? '/demo/purchases' : '/purchases';
  }

  getReportsRoute(): string {
    return this.isDemoMode ? '/demo/reports' : '/reports';
  }

  getUsersRoute(): string {
    return this.isDemoMode ? '/demo/users' : '/users';
  }

  getProfileRoute(): string {
    return this.isDemoMode ? '/demo/profile' : '/profile';
  }

  loadProducts(): void {
    this.router.navigate([this.getInventoryRoute()]);
  }

  loadUsers() {
    this.router.navigate([this.getUsersRoute()]);
  }

  loadProfile(){
    this.router.navigate([this.getProfileRoute()]);
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
  getFirstName(fullName: string): string {
    if (!fullName) {
      return '';
    }
    return fullName.split(' ')[0];
  }
  logout() {

    this.authService.logout();


  }
}
