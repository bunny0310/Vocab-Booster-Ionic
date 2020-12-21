import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  loading = false;
  words: [] = [];
  skeletonArray: number[] = [1, 1, 1, 1, 1];
  constructor(private APIService: ApiService, public authService: AuthService) {}
  ngOnInit() {
    this.getWords(null);
  }
  doRefresh(event) {
    console.log('Begin async operation');
    this.getWords(event);
  }

  getWords(event) {
    this.APIService.getWords('random');
    this.loading = true;
    this.APIService.getWordsUpdateListener()
    .subscribe(response => {
    this.words = response.data;
    console.log(response.data);
    const arr: [] = [];
    for (const word of this.words) {
    arr.push(word);
    }
    this.loading = false;
    if (event) {
      event.target.complete();
    }
    });
  }
}
