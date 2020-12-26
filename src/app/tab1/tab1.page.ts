import { Component, OnInit, OnChanges } from '@angular/core';
import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';
import { FormGroup, FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit, OnChanges{
  loading = false;
  words: any[] = [];
  skeletonArray: number[] = [1, 1, 1, 1, 1];
  filtered = false;
  filtersApplied = false;
  constructor(private APIService: ApiService, public authService: AuthService) {}
  type = new FormControl('');
  keyword = new FormControl('');
  public sections: any = {
    first: 'no-filter',
    second: 'filter',
    sectionSelected: 'no-filter'
  };
  ngOnInit() {
    this.getWords(null);
  }

  ngOnChanges() {
    this.getWords(null);
  }
  doRefresh(event) {
    console.log('Begin async operation');
    if (this.filtered) {
      this.getFilteredWords(event);
    }
    else {
      this.getWords(event);
    }
  }

  segmentChanged(ev) {
    if (ev.detail.value === 'filter') {
      this.filtered = true;
      this.filtersApplied = false;
      this.keyword.setValue('');
      this.type.setValue('');
    } else {
      this.filtered = false;
      this.filtersApplied = false;
    }
    console.log(ev);
  }

  clearFilter() {
    this.filtersApplied = false;
    this.filtered = false;
    this.sections.sectionSelected = this.sections.first;
    this.keyword.setValue('');
    this.type.setValue('');
    this.getWords(null);
  }


  applyFilters() {
    if (this.keyword.value === '' && this.type.value === '') {
      return;
    }
    this.getFilteredWords(null);
  }

  getFilteredWords(event) {
    this.APIService.getWords('search', this.keyword.value, this.type.value);
    this.loading = true;
    this.APIService.getWordsUpdateListener()
    .subscribe(res => {
      this.words = res.data;
      let i = 0;
      for (const word of this.words) {
        const idx = Math.floor(Math.random() * (this.words.length - 1 - i + 1) + i);
        const temp = this.words[i];
        this.words[i] = this.words[idx];
        this.words[idx] = temp;
        i++;
      }
      this.words = this.words.slice(0, 5);
      this.filtersApplied = true;
      this.loading = false;
      if (event) {
        event.target.complete();
      }
    });
  }
  getWords(event) {
    this.APIService.getWords('random');
    this.loading = true;
    this.APIService.getWordsUpdateListener()
    .subscribe(response => {
    this.words = response.data;
    console.log(response.data);
    const arr: any[] = [];
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
