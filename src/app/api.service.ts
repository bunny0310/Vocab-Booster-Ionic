import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const url = environment.apiUrl;
const headers = new HttpHeaders({Authorization: localStorage.getItem('user-vb-responsive')});

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router) { }

  public getWords({mode, filter, offset}) {
    if (filter == null) {
      filter = {
      };
    }
    const endpoint = `/api/words?mode=${mode}&filterName=${filter.name == null ? '' : filter.name}&filterMeaning=${filter.meaning == null ? '' : filter.meaning}&filterSentence=${filter.sentence == null ? '' : filter.sentence}&filterType=${filter.type == null ? '' : filter.type}&filterTag=${filter.tag == null ? '' : filter.tag}&filterSynonym=${filter.synonym == null ? '' : filter.synonym}&offset=${offset}`;
    return this.http.
    get<any>(url + endpoint, {withCredentials: true, headers})
    .pipe(
      catchError(error => {
          if (error.status === 401) {
            localStorage.removeItem('user-vb-responsive');
            this.router.navigate(['/login']);
          }
          return throwError(`${JSON.stringify(error)}`);
      }))
      .pipe(delay(1000));
  }
  public getTags(keyword) {
    return this.http.get<any>(`${url}/api/tags?keyword=${keyword}`, {withCredentials: true, headers})
    .pipe(
      catchError(error => {
          if (error.status === 401) {
            localStorage.removeItem('user-vb-responsive');
            this.router.navigate(['/login']);
          }
          return throwError(`${JSON.stringify(error)}`);
      }))
      .pipe(delay(100));
  }
  public getWordUniquenessStatus(name) {
    return this.http.get<any>(`${url}/api/uniqueName?name=${name}`, {withCredentials: true, headers})
    .pipe(
      catchError(error => {
          if (error.status === 401) {
            localStorage.removeItem('user-vb-responsive');
            this.router.navigate(['/login']);
          }
          return throwError(`${JSON.stringify(error)}`);
      }))
      .pipe(delay(100));
  }
  public getWord(id: string) {
    return this.http.get<any>(`${url}/api/words/${id}`, {withCredentials: true, headers})
    .pipe(
      catchError(error => {
          if (error.status === 401) {
            localStorage.removeItem('user-vb-responsive');
            this.router.navigate(['/login']);
          }
          return throwError(`${JSON.stringify(error)}`);
      }))
      .pipe(delay(1000));
  }

  public getAnalyticalTool(endpoint) {
    return this.http.post<any>(`${url}${endpoint}`, {}, {withCredentials: true, headers})
    .pipe(
      catchError(error => {
          if (error.status === 401) {
            localStorage.removeItem('user-vb-responsive');
            this.router.navigate(['/login']);
          }
          return throwError(`${JSON.stringify(error)}`);
      }))
      .pipe(delay(1000));
  }
}
