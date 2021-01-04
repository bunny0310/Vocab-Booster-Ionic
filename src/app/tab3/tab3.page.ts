import { Component, OnInit } from '@angular/core';
import { CloudOptions, CloudData } from 'angular-tag-cloud-module';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import { FormGroup, FormControl } from '@angular/forms';

const url = 'https://vocab-booster.herokuapp.com';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{

  wordCloudBase64 = '';
  loading = false;
  dashboardForm = new FormGroup({
    options: new FormControl('')
  });
  token = localStorage.getItem('user-vb-responsive');
  username = this.authService.getUsername(this.token);
  sfurl: SafeUrl;
  constructor(private httpClient: HttpClient, private authService: AuthService, private sanitizer: DomSanitizer) {}

  ionViewWillEnter() {
    this.dashboardForm.get('options').setValue('wordcloud');
    this.loadWC();
  }

  ngOnInit() {
    this.dashboardForm.get('options').setValue('wordcloud');
    this.loadWC();
  }

  loadWC() {
    this.loading = true;
    this.httpClient.post(url + '/api/wordcloud', {username: this.username})
    .subscribe((res: any) => {
      this.wordCloudBase64 = 'data:image/png;base64, ' + res.msg;
      this.sfurl = this.sanitizer.bypassSecurityTrustUrl(this.wordCloudBase64);
      this.loading = false;
    });
  }
}
