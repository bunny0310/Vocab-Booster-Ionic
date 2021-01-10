import { Component, OnInit, OnChanges, ViewChild } from '@angular/core';
import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';
import { FormGroup, FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import { PopoverController, IonContent, LoadingController} from '@ionic/angular';
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
  sorting = false;
  randomizing = false;
  words: any[] = [];
  allWords: any[] = [];
  previousWords: any[] = [];
  skeletonArray: number[] = [1, 1, 1, 1, 1];
  alphabets: string[] = 'abcdefghijklmnopqrstuvwzyz'.split('');
  aStyles: string[] = this.alphabets.slice();
  selectedAButtons: boolean[] = [];
  selectedAlphabet = new Set();
  filtered = false;

  @ViewChild(IonContent, { static: false }) private content: IonContent;
  constructor(
    private APIService: ApiService,
    public authService: AuthService,
    private popoverController: PopoverController,
    public filtersService: FiltersService,
    private events: EventsService,
    private loadingController: LoadingController
    ) {}
  ngOnInit() {
    this.getWords(null);
    this.aStyles.fill('#cc0000', 0, this.aStyles.length);
    for (let i = 0; i < this.aStyles.length; ++i) {
      this.selectedAButtons[i] = false;
    }
  }
  ionViewWillEnter() {
    this.events.selectTabAsObservable()
    .subscribe((res) => {
      if (res.msg === 'tab1') {
        console.log('scrolling');
        this.content.scrollToTop(1000);
      }
    });

    this.events.sendWordsDataAsObservable()
    .subscribe((res) => {
      this.allWords = res.msg;
      console.log(res.filtersApplied);
      this.filtered = res.filtersApplied;
    });
  }

  async presentLoading(msg) {
    const loading = await this.loadingController.create({
      message: msg,
      spinner: 'bubbles'
    });
    await loading.present().then(() => {
      console.log('presented');
      if (!this.sorting && !this.randomizing) {
        loading.dismiss().then(() => console.log('abort presenting'));
      }
    });

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }
  resetForm() {
    this.filtersService.resetFilters();
    this.sorted = false;
    this.filtered = false;
    this.events.sendWordsData([], false);
    this.getWords(null);
  }

  sort() {
    this.events.selectTab('tab1');
    this.sorting = true;
    this.presentLoading('Sorting');
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
    this.sorting = false;
    this.loadingController.dismiss();
  }
  ngOnChanges() {
    this.getWords(null);
  }

  doRefresh(event) {
    console.log('Begin async operation');
    this.sorted = false;
    this.loading = true;
    if (this.filtered) {
      this.APIService.getWords({mode: 'search', options: this.filtersService.savedData});
      this.APIService.getWordsUpdateListener()
      .subscribe((res) => {
        this.events.sendWordsData(res.data, true);
        this.loading = false;
      });
    } else {
      this.getWords(event);
      this.loading = false;
    }
    if (event !== null) {
      event.target.complete();
    }
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
    this.APIService.getWords({mode: null});
    this.APIService.getWordsUpdateListener()
    .subscribe((res) => {
      this.allWords = res.data;
      this.filtered = false;
      if (this.randomFeature) {
        this.words = this.shuffle(this.allWords);
      }
      else {
        this.words = this.allWords.slice(0, 5);
      }
    });
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
    this.events.selectTab('tab1');
    this.randomFeature = event.detail.checked;
    this.randomizing = true;
    this.presentLoading('Shuffling');
    if (this.randomFeature) {
      this.words = this.shuffle(this.allWords);
    } else {
      this.sorted = false;
      this.words = this.allWords.slice(0, 5);
    }
    this.randomizing = false;
  }

  loadMore(event) {
      setTimeout(() => {
        if (!this.randomFeature) {
          const idx = this.words.length;
          for (let i = idx; i < this.allWords.length && i < idx + 5; i++) {
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

  filterByLetter(letter) {
    if (this.previousWords.length !== 0) {
      this.allWords = this.previousWords.slice();
    }

    this.selectedAlphabet.clear();
    this.events.selectTab('tab1');
    const idx = letter.charCodeAt(0) - 97;

    if (this.selectedAButtons[idx] === false) {
      this.selectedAlphabet.add(letter);
    }

    this.aStyles.fill('#cc0000', 0, this.aStyles.length);
    this.selectedAButtons[idx] = !this.selectedAButtons[idx];
    this.aStyles[idx] = this.selectedAButtons[idx] ? 'black' : '#cc0000';
    for (let i = 0; i < this.selectedAButtons.length; ++i) {
      if (i !== letter.charCodeAt(0) - 97) {
        this.selectedAButtons[i] = false;
      }
    }

    if (this.selectedAButtons[idx]) {
      console.log(this.allWords);
      this.previousWords = this.allWords.slice();
      this.allWords = this.allWords.filter((word: any) => {
        return word.name.toLowerCase()[0] === letter;
      });
      this.words = this.allWords.slice(0, 5);
    }
    else {
      this.allWords = this.previousWords;
      this.words = this.allWords.slice(0, 5);
    }

  }
}
