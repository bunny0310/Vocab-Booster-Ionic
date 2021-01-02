import { Component, OnInit, OnChanges } from '@angular/core';
import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';
import { FormGroup, FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import { PopoverController } from '@ionic/angular';
import { FilterPage } from '../filter/filter.page';
import { FiltersService } from '../filters.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit, OnChanges{
  loading = false;
  randomFeature = true;
  sorted = false;
  words: any[] = [];
  allWords: any[] = [];
  skeletonArray: number[] = [1, 1, 1, 1, 1];
  constructor(
    private APIService: ApiService,
    public authService: AuthService,
    private popoverController: PopoverController,
    private filtersService: FiltersService) {}
  ngOnInit() {
    this.getWords(null);
  }

  sort() {
    this.sorted = !this.sorted;
  }
  ngOnChanges() {
    this.getWords(null);
  }

  doRefresh(event) {
    console.log('Begin async operation');
    this.getWords(event);
  }
  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: FilterPage,
      cssClass: 'popover',
      event: ev,
      translucent: true
    });
    return await popover.present();
  }
  getWords(event) {
    this.loading = true;
    this.filtersService.applyFilters()
    .subscribe((res) => {
      this.allWords = res.data;
      if (this.randomFeature) {
        this.words = this.shuffle(this.allWords);
      }
      else {
        this.words = this.allWords.splice(0, 5);
      }
      this.loading = false;
      if (event) {
        event.target.complete();
      }
    });
  }

  shuffle(arr: any[]) {
    for (let i = 0; i < arr.length; ++i) {
      const idx = Math.floor(Math.random() * (arr.length - i) + i);
      const temp = arr[i];
      arr[i] = arr[idx];
      arr[idx] = temp;
    }
    return arr.slice(0, 5);
  }

  randomize(event) {
    this.randomFeature = event.detail.checked;
    if (this.randomFeature) {
      this.words = this.shuffle(this.allWords);
    } else {
      this.getWords(null);
    }
  }

  loadMore(event) {
      setTimeout(() => {
        if (!this.randomFeature) {
          const idx = this.words.length;
          for (let i = idx; i < idx + 5; i++) {
            this.words.push(this.allWords[i]);
          }
        }
        event.target.complete();

        // App logic to determine if all data is loaded
        // and disable the infinite scroll
        if (this.randomFeature || this.words.length === this.allWords.length) {
          event.target.disabled = true;
          console.log('loaded everything');
        }
      }, 500);
  }
}
