import { Component } from '@angular/core';
import { AuthService } from '../../../services/authService';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  constructor(public auth: AuthService, private router: Router) {}

  imgUrl:string = environment.imgBaseUrl;
  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }

}
