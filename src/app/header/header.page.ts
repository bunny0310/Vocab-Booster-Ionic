import { Component, OnInit, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.page.html',
  styleUrls: ['./header.page.scss'],
})
export class HeaderPage implements OnInit {

  @Input() title;
  constructor(public authService: AuthService) { }

  ngOnInit() {
    console.log('title ' + this.title);
  }

}
