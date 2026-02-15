import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/authService';

export const escritorGuard: CanActivateFn = (route, state) => {

  // Inyectamos servicios
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('--- ESCRITOR GUARD ---');
  console.log('Usuario actual:', authService.usuario);
  console.log('Es Escritor?', authService.esEscritor);
  console.log('Es Admin?', authService.esAdmin);

  // Comprobacion de autenticacion
  if (authService.esEscritor || authService.esAdmin) {
    return true;
  } else {
    router.navigate(['/dashboard/perfil']);
    return false;
  }
};
