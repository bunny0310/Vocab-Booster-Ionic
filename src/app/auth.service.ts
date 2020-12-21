import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }

  public isAuthenticated(): boolean {
    const userData = localStorage.getItem('user-vb-responsive');
    if (userData) {
      return true;
    }
    return false;
  }

  public setUserInfo(user) {
    localStorage.setItem('user-vb-responsive', JSON.stringify(user));
  }

  public logout() {
    localStorage.removeItem('user-vb-responsive');
    this.router.navigate(['/login']);
  }
}
