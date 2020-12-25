import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';
import { HTTP } from '@ionic-native/http/ngx';

const {Http} = Plugins;
const url = 'https://vocab-booster.herokuapp.com';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(5)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });
  constructor(private httpClient: HttpClient, private router: Router, private http: HTTP) { }

  ngOnInit() {
  }

  onSubmit() {
    console.log(this.loginForm);
    if (this.loginForm === null) {
      return;
    }
    if (this.loginForm.get('username') === null) {
      return;
    }
    if (this.loginForm.get('password') === null) {
      return;
    }
    const formData = {
      username: this.loginForm.get('username').value,
      password: this.loginForm.get('password').value
    };

    this.httpClient.post(url + '/api/login', formData, {observe: 'response', withCredentials: true})
    .pipe(
      catchError(this.handleError.bind(this))
    )
    .subscribe((response) => {
      // if (error.status === 401) {
      //   this.invalidLogin = true;
      // }
      const user: any = response.body;
      localStorage.setItem('user-vb-responsive', user.username);
      console.log('setting');
      this.router.navigate(['/']);
    });



    // const headers = new Headers();
    // headers.append('Content-Type', 'application/json');
    // const options = {headers};
    // this.http.post(url + '/api/login', formData, options)
    // .then((res) => {
    //   console.log('running on a simulator');
    //   const user: any = res;
    //   localStorage.setItem('user-vb-responsive', user.username);
    //   console.log(res);
    //   this.router.navigate(['/']);
    // }).catch((err) => {
    //   console.log(err);
    // });

  //   Http.request({
  //     method: 'post',
  //     url: url + '/api/login',
  //     data: formData,
  //     headers: {
  //       'Content-Type': 'application/json'
  //     }
  //   }).then((data) => {
  //     console.log(data)
  //   })
   }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
    }
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
    // Return an observable with a user-facing error message.
    return throwError('Error!');
  }

}
