import { Component, OnInit } from '@angular/core';
import { throwError } from 'rxjs';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';

const url = 'https://vocab-booster.herokuapp.com';
// const url = 'http://localhost:3000';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  loading = false;
  registerForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(5)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(5)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', [Validators.required, Validators.minLength(5)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });
  constructor(
  private httpClient: HttpClient,
  private router: Router,
  private toastController: ToastController, private loadingController: LoadingController) { }

  ngOnInit() {
  }

  onSubmit() {
    if (this.registerForm === null) {
      return;
    }
    if (this.registerForm.get('username') === null) {
      return;
    }
    if (this.registerForm.get('password') === null) {
      return;
    }
    this.loading = true;
    const formData = this.registerForm.value;
    // this.presentLoading('Logging you in!');
    this.httpClient.post(url + '/api/register', formData, {observe: 'response', withCredentials: true})
    .pipe(
      catchError(this.handleError.bind(this))
    )
    .subscribe((response) => {
      // if (error.status === 401) {
      //   this.invalidLogin = true;
      // }
      this.presentLoading('Registration successful! Redirecting to Login Page.');
      this.loading = false;
      this.loadingController.dismiss();
      this.router.navigate(['/login-tabs'])
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
      spinner: 'bubbles',
      duration: 3000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }


  private handleError(error: HttpErrorResponse) {
    this.loading = false;
    this.loadingController.dismiss();
    this.presentToast('Registration unsuccessful!');
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
    // Return an observable with a user-facing error message.
    return throwError('Error!');
  }

}

