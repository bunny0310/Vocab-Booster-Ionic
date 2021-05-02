import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import jwtDecode from 'jwt-decode';
import { Subject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// const url = 'https://vocab-booster.herokuapp.com';
const url = 'http://localhost:3000';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  status = true;
  constructor(private router: Router, private http: HttpClient) { }
  public getStatus() {
    return this.status;
  }

  public setStatus(status) {
    this.status = status;
  }
  public isAuthenticated(): boolean {
    const token = localStorage.getItem('user-vb-responsive');
    if (!token) {
      return false;
    }
    return true;
  }


  public getUserInfo(token) {
    const decoded: any = jwtDecode(token);
    return decoded;
  }
  public setUserInfo(token) {
    localStorage.setItem('user-vb-responsive', token);
  }

  public logout() {
    localStorage.removeItem('user-vb-responsive');
    this.router.navigate(['/login']);
  }
}
