import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';
import { HTTP } from '@ionic-native/http/ngx';
import { ToastController, LoadingController } from '@ionic/angular';

const {Http} = Plugins;
const url = 'https://vocab-booster.herokuapp.com';
// const url = 'http://localhost:3000';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loading = false;
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(5)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });
  constructor(
  private httpClient: HttpClient,
  private router: Router, private http: HTTP,
  private toastController: ToastController, private loadingController: LoadingController) { }

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
    this.loading = true;
    const formData = {
      username: this.loginForm.get('username').value,
      password: this.loginForm.get('password').value
    };
    this.presentLoading('Logging you in!');
    this.httpClient.post(url + '/api/login', formData, {observe: 'response', withCredentials: true})
    .pipe(
      catchError(this.handleError.bind(this))
    )
    .subscribe((response) => {
      // if (error.status === 401) {
      //   this.invalidLogin = true;
      // }
      const jwt: any = response.body;
      console.log(jwt);
      localStorage.setItem('user-vb-responsive', jwt.token);
      this.loading = false;
      this.loadingController.dismiss();
      this.router.navigate([''])
      .then(() => {
        window.location.reload();
      });
    });
   }
   async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
  async presentLoading(msg) {
    const loading = await this.loadingController.create({
      message: msg,
      spinner: 'bubbles'
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }


  private handleError(error: HttpErrorResponse) {
    this.loading = false;
    this.loadingController.dismiss();
    this.presentToast('Invalid login credentials!');
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
    // Return an observable with a user-facing error message.
    return throwError('Error!');
  }

}
