import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ToastController, LoadingController } from '@ionic/angular';
import { EventsService } from '../events.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit{

  constructor(
    private authService: AuthService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private events: EventsService) {
  }

  ngOnInit() {
    if (!this.isLoggedIn()) {
      console.log(this.isLoggedIn());
      this.presentToast('You have been logged out!');
      this.authService.logout();
    }
    console.log(this.isLoggedIn());
    this.authService.getUsername(localStorage.getItem('user-vb-responsive'));
  }

  tabButtonClicked(tabNumber: string) {
    if (tabNumber === 'tab1') {
        this.events.selectTab(tabNumber);
    }
}

  ionViewWillEnter() {
    if (!this.isLoggedIn()) {
      this.presentToast('You have been logged out!');
      this.authService.logout();
    }
    this.authService.getUsername(localStorage.getItem('user-vb-responsive'));
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
