import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si la ruta pertenece al modo demo (/demo o /demo/...)
  if (state.url.startsWith('/demo')) {
    authService.setDemoMode(true);
    if (!authService.isLoggedIn()) {
      authService.loginDemo();
    }
    return true;
  }

  if (authService.isLoggedIn()) {
    return true;
  } else {
    // Usuario no autenticado, redirige a la página de inicio de sesión
    router.navigate(['/login']);
    return false;
  }
};
