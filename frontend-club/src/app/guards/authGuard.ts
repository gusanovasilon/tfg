import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/authService';

export const authGuard: CanActivateFn = (route, state) => {

  // Inyectamos servicios
  const authService = inject(AuthService);
  const router = inject(Router);

  // Comprobacion de autenticacion
  if (authService.estaAutenticado) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
