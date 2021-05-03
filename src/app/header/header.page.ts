import { Component, OnInit, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.page.html',
  styleUrls: ['./header.page.scss'],
})
export class HeaderPage implements OnInit {

  @Input() title;
  constructor(
    public authService: AuthService,
    public router: Router,
    public navController: NavController,
    public location: Location
    ) { }

    user;

  ngOnInit() {
    this.user = this.authService.getUserInfo(localStorage.getItem('user-vb-responsive'));
  }

  public goBack() {
    this.navController.back();
  }

  testURL() {
    const regex = /^(\/tabs)/;
    return regex.test(this.router.url);
  }

}
