import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Subject } from 'rxjs';

const url = 'https://vocab-booster.herokuapp.com';
// const url = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  words: [] = [];
  wordsUpdated = new Subject<{data: []}>();
  constructor(private http: HttpClient, private authService: AuthService) { }

  public getWords(mode, keyword = null, type = null) {
    let endpoint = '/api/words';
    if (mode === 'random') {
      endpoint = '/api/random-words';
    } else if (mode === 'search') {
      endpoint = '/api/search-words';
    }
    const username = this.authService.isAuthenticated() ? this.authService.getUsername(localStorage.getItem('user-vb-responsive') ) : '';
    console.log(username);
    if (username !== '') {
      const headers = new HttpHeaders({Authorization: 'Bearer ' + localStorage.getItem('user-vb-responsive')});
      this.http.post<[]>(url + endpoint, {username, keyword, type}, {withCredentials: true, headers})
      .subscribe((res: any) => {
        this.words = res.data;
        this.wordsUpdated.next({data: res.data});
      });
    }
  }

  public getWordsUpdateListener() {
    return this.wordsUpdated.asObservable();
  }
}
