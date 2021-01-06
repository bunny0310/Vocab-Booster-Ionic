import { Component, OnInit, OnChanges, ViewChild } from '@angular/core';
import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';
import { FormGroup, FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import { PopoverController, IonContent} from '@ionic/angular';
import { FilterPage } from '../filter/filter.page';
import { FiltersService } from '../filters.service';
import { Subject, Observable } from 'rxjs';
import { EventsService } from '../events.service';

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
  previousWords: any[] = [];
  skeletonArray: number[] = [1, 1, 1, 1, 1];
  @ViewChild(IonContent, { static: false }) private content: IonContent;
  constructor(
    private APIService: ApiService,
    public authService: AuthService,
    private popoverController: PopoverController,
    public filtersService: FiltersService,
    private events: EventsService
    ) {}
  ngOnInit() {
    this.getWords(null);
  }
  ionViewWillEnter() {
    this.events.selectTabAsObservable()
    .subscribe((res) => {
      if (res.msg === 'tab1') {
        console.log('scrolling');
        this.content.scrollToTop(1000);
      }
    });
  }
  ionViewDidLeave() {
  }
  resetForm() {
    this.filtersService.filterForm.setValue({
      name: '',
      meaning: '',
      sentence: '',
      tag: '',
      synonym: '',
      type: ''
    });
    this.sorted = false;
    this.getWords(null);
  }

  sort() {
    this.sorted = !this.sorted;
    if (this.sorted) {
      this.previousWords = this.randomFeature ? this.words.slice() : this.allWords.slice();
      if (this.randomFeature) {
        this.words = this.words.sort((a, b) => {
          const d1 = new Date(a.createdAt);
          const d2 = new Date(b.createdAt);
          return d2.getTime() - d1.getTime();
        });
      }
      else {
        this.words = this.allWords.sort((a, b) => {
          console.log(a.name);
          const d1 = new Date(a.createdAt);
          const d2 = new Date(b.createdAt);
          return d2.getTime() - d1.getTime();
        }).slice(0, 5);
      }
    }
    else {
      this.allWords = this.previousWords;
      this.words = this.allWords.slice(0, 5);
    }
  }
  ngOnChanges() {
    this.getWords(null);
  }

  doRefresh(event) {
    console.log('Begin async operation');
    this.sorted = false;
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
    if (this.filtersService.isEmpty) {
      this.APIService.getWords({mode: null});
      this.APIService.getWordsUpdateListener()
      .subscribe((res) => {
        this.allWords = res.data;
        if (this.randomFeature) {
          this.words = this.shuffle(this.allWords);
        }
        else {
          this.words = this.allWords.slice(0, 5);
        }
      });
    }
    else {
      this.filtersService.applyFilters()
      .subscribe((res) => {
        console.log(res.data);
        this.allWords = res.data;
        if (this.randomFeature) {
          this.words = this.shuffle(this.allWords);
        }
        else {
          this.words = this.allWords.slice(0, 5);
        }
      });
    }
    this.loading = false;
    if (event) {
      event.target.complete();
    }
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
      this.sorted = false;
      this.getWords(null);
    }
  }

  loadMore(event) {
      setTimeout(() => {
        if (!this.randomFeature) {
          console.log('abcd');
          const idx = this.words.length;
          for (let i = idx; i < idx + 5; i++) {
            this.words.push(this.allWords[i]);
          }
        }
        event.target.complete();

        // App logic to determine if all data is loaded
        // and disable the infinite scroll
        if (this.randomFeature || this.words.length === this.allWords.length) {
        } else {
          event.target.disabled = false;
        }
      }, 500);
  }
}
