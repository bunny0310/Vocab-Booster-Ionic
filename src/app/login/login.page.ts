import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';
import { HTTP } from '@ionic-native/http/ngx';
import { ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

const {Http} = Plugins;
const url = environment.apiUrl;

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
  constructor(private httpClient: HttpClient, private router: Router, private http: HTTP, private toastController: ToastController) { }

  ngOnInit() {
  }

  onSubmit() {
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
      const jwt: any = response.body.token;
      localStorage.setItem('user-vb-responsive', jwt);
      this.router.navigate(['']);
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
   async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  private handleError(error: HttpErrorResponse) {
    this.presentToast('Invalid login credentials!');
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
    // Return an observable with a user-facing error message.
    return throwError('Error!');
  }

}
