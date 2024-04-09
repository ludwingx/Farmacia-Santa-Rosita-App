import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { RolesService } from '../services/roles/roles.service';

export const authGuardGuard: CanActivateFn = (route, state) => {
  
  // Implementar la lógica de autenticación aquí
  const authService = inject (AuthService);
  const router = inject (Router);
  const rolesservices = inject (RolesService);
  
  if (authService.isLoggedIn()) {
    return true; // Permite la activación de la ruta
  } else {
    // Usuario no autenticado, redirige a la página de inicio de sesión
    router.navigate(['/login']);
    return false; // No permite la activación de la ruta
  }

}



