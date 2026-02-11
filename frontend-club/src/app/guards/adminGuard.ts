import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/authService';

export const adminGuard: CanActivateFn = (route, state) => {

  // Inyectamos servicios
  const authService = inject(AuthService);
  const router = inject(Router);

  // Comprobacion de autenticacion
  if (authService.esAdmin) {
    return true;
  } else {
    router.navigate(['/dashboard/perfil']);
    return false;
  }
};
