import { Component, HostListener } from '@angular/core';
import { AuthService } from '../../services/authService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent {


  isScrolled: boolean = false;
  isMenuOpen = false;

  constructor(public auth: AuthService, private router: Router) {}

menuItems = [
  { nombre: 'INICIO', ruta: '/',  fragmento: 'inicio' },
  { nombre: 'CLUB', ruta: '/',  fragmento: 'club' },
  { nombre: 'NOTICIAS', ruta: '/',  fragmento: 'noticias' },
  { nombre: 'HORARIOS', ruta: '/',  fragmento: 'horarios' },
  { nombre: 'CONTACTO', ruta: '/',  fragmento: undefined },
];

  /* Hostlistener es un decorador que nos ayuda a escuhcar eventos que vienen del navegador */
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }


  closeMenu() {
    this.isMenuOpen = false;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
