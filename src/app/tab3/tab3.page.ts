import { Component, OnInit } from '@angular/core';
import { CloudOptions, CloudData } from 'angular-tag-cloud-module';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  typesPieChartBase64 = '';
  tagsPieChartBase64 = '';
  loading = false;
  dashboardForm = new FormGroup({
    options: new FormControl('')
  });
  noWords = 0;
  noTags = 0;
  token = localStorage.getItem('user-vb-responsive');
  username = this.authService.getUsername(this.token);
  sfurl: SafeUrl;
  pcsf1: SafeUrl;
  pcsf2: SafeUrl;
  constructor(private httpClient: HttpClient, private authService: AuthService, private sanitizer: DomSanitizer) {}

  ionViewWillEnter() {
    this.dashboardForm.get('options').setValue('acc-information');
    this.loadAC();
  }

  ngOnInit() {
    this.dashboardForm.get('options').setValue('acc-information');
    this.loadAC();
  }

  onChange(event) {
    const val = event.detail.value;
    val === 'wordcloud' ? this.loadWC() : this.loadAC();
  }

  loadWC() {
    this.loading = true;
    const headers = new HttpHeaders({Authorization: 'Bearer ' + localStorage.getItem('user-vb-responsive')});
    this.httpClient.post(url + '/api/wordcloud', {username: this.username}, {headers})
    .subscribe((res: any) => {
      this.wordCloudBase64 = 'data:image/png;base64, ' + res.msg;
      this.sfurl = this.sanitizer.bypassSecurityTrustUrl(this.wordCloudBase64);
      this.loading = false;
    });
  }
  loadAC() {
    this.loading = true;
    const headers = new HttpHeaders({Authorization: 'Bearer ' + localStorage.getItem('user-vb-responsive')});
    this.httpClient.post(url + '/api/acc-info', {username: this.username, recent: false}, {headers})
    .subscribe((res: any) => {
      // this.wordCloudBase64 = 'data:image/png;base64, ' + res.msg;
      // this.sfurl = this.sanitizer.bypassSecurityTrustUrl(this.wordCloudBase64);
      this.loading = false;
      this.typesPieChartBase64 = 'data:image/png;base64, ' + res.msg.types;
      this.pcsf2 = this.sanitizer.bypassSecurityTrustUrl(this.typesPieChartBase64);
      this.noTags = res.msg.uniqueTags;
      this.noWords = res.msg.wordcount;
    });
    this.httpClient.post(url + '/api/topmost-tags', {username: this.username, recent: false}, {headers})
    .subscribe((res: any) => {
      // this.wordCloudBase64 = 'data:image/png;base64, ' + res.msg;
      // this.sfurl = this.sanitizer.bypassSecurityTrustUrl(this.wordCloudBase64);
      this.loading = false;
      this.tagsPieChartBase64 = 'data:image/png;base64, ' + res.msg;
      this.pcsf1 = this.sanitizer.bypassSecurityTrustUrl(this.tagsPieChartBase64);
      this.loading = false;
    });
  }
}
