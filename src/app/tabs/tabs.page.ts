import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ToastController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit{

  constructor(
        private authService: AuthService,
        private toastController: ToastController,
        private navController: NavController) {
  }

  ngOnInit() {
    if (!this.isLoggedIn()) {
      this.presentToast('You have been logged out!');
      this.authService.logout();
    }
  }

  ionViewWillEnter() {
    if (!this.isLoggedIn()) {
      this.presentToast('You have been logged out!');
      this.authService.logout();
    }
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  isLoggedIn() {
    return this.authService.isAuthenticated();
  }

}
