import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import jwtDecode from 'jwt-decode';
import { Subject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as moment from 'moment';

const url = 'https://vocab-booster.herokuapp.com';
// const url = 'http://localhost:3000';
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
    return moment().isBefore(this.getExp(token));
  }


  public getUsername(token) {
    const decoded: any = jwtDecode(token);
    return decoded.username;
  }
  public setUserInfo(token) {
    localStorage.setItem('user-vb-responsive', token);
  }
  public getExp(token) {
    const decoded: any = jwtDecode(token);
    return moment().add(decoded.exp, 'second');
  }

  public logout() {
    localStorage.removeItem('user-vb-responsive');
    this.router.navigate(['/login']);
  }

  private handleError(error: HttpErrorResponse) {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
    // Return an observable with a user-facing error message.
    this.setStatus(false);
    return throwError('Error!');
  }
}
