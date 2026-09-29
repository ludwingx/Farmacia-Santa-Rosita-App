import { Component, Inject, PLATFORM_ID, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { DashboardComponent } from './shared/modules/dashboard/dashboard.component';
import { LoginComponent } from './shared/modules/auth/login/login.component';
import { RegisterComponent } from './shared/modules/auth/register/register.component';
import { AuthService } from './core/services/auth/auth.service';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

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
    RegisterComponent,
    LoadingComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'farmacia-santa-rosita-app';
  loading: boolean = true;
  isAuthenticated: boolean = false;
  isRegisterRoute: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private authService: AuthService,
    private toast: ToastrService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // 1. Escuchar cambios de autenticación emitidos por AuthService
      this.authService.authStatus$
        .pipe(takeUntil(this.destroy$))
        .subscribe((isAuth: boolean) => {
          this.isAuthenticated = isAuth;
          if (!isAuth) {
            document.body.classList.remove('body-pd');
          }
          this.loading = false;
        });

      // 2. Escuchar eventos de navegación del router
      this.router.events
        .pipe(
          filter((event): event is NavigationEnd => event instanceof NavigationEnd),
          takeUntil(this.destroy$)
        )
        .subscribe((event: NavigationEnd) => {
          const currentUrl = event.urlAfterRedirects || event.url;
          const isAuth = this.authService.isAuthenticated();

          this.isRegisterRoute = currentUrl.includes('/register');

          // Manejo especial de MODO DEMOSTRACIÓN (/demo/...)
          if (currentUrl.startsWith('/demo')) {
            this.authService.setDemoMode(true);
            if (!this.authService.isAuthenticated()) {
              this.authService.loginDemo();
            }
            this.isAuthenticated = true;
            this.loading = false;
            return;
          }

          if (currentUrl.includes('/login') || currentUrl.includes('/register')) {
            this.isAuthenticated = false;
            document.body.classList.remove('body-pd');
            if (isAuth) {
              this.router.navigate(['/dashboard']);
            }
          } else {
            this.isAuthenticated = isAuth;
            if (!isAuth) {
              document.body.classList.remove('body-pd');
              this.router.navigate(['/login']);
            }
          }
          this.loading = false;
        });

      this.checkAuthentication();
    } else {
      this.loading = false;
    }
  }

  checkAuthentication(): void {
    const isAuth = this.authService.isAuthenticated();
    const currentUrl = typeof window !== 'undefined' ? window.location.pathname : this.router.url;
    this.isRegisterRoute = currentUrl.includes('/register');

    if (currentUrl.startsWith('/demo')) {
      this.authService.setDemoMode(true);
      if (!isAuth) {
        this.authService.loginDemo();
      }
      this.isAuthenticated = true;
      if (currentUrl === '/demo' || currentUrl === '/demo/') {
        this.router.navigate(['/demo/dashboard']);
      }
      this.loading = false;
      return;
    }

    if (currentUrl.includes('/login') || currentUrl.includes('/register') || currentUrl === '/') {
      if (isAuth) {
        this.isAuthenticated = true;
        this.router.navigate(['/dashboard']);
      } else {
        this.isAuthenticated = false;
        document.body.classList.remove('body-pd');
        if (!currentUrl.includes('/login') && !currentUrl.includes('/register')) {
          this.router.navigate(['/login']);
        }
      }
    } else {
      this.isAuthenticated = isAuth;
      if (!isAuth) {
        document.body.classList.remove('body-pd');
        this.router.navigate(['/login']);
      }
    }
    this.loading = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
