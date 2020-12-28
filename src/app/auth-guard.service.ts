import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate() {
    if (this.authService.isAuthenticated()) {
      return true;
    }
    console.log('not logged in');
    this.router.navigate(['login']);
    return false;
  }
}
