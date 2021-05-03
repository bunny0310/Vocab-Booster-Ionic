import { Component, OnInit, OnChanges } from '@angular/core';
import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';
import { PopoverController, ModalController, NavController } from '@ionic/angular';
import { FilterPage } from '../filter/filter.page';
import { Router } from '@angular/router';
import { FilterModalPage } from '../filter-modal/filter-modal.page';
import { delay } from 'q';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit, OnChanges{
  loading = false;
  randomFeature = true; // boolean for random toggle
  sorted = false;
  words: any[] = [];
  allWords: any[] = [];
  skeletonArray: number[] = [1, 1, 1, 1, 1];
  constructor(
    private APIService: ApiService,
    public authService: AuthService,
    private navController: NavController,
    private router: Router,
    private modalController: ModalController) {}
  ngOnInit() {
    this.getWords(null, this.randomFeature ? 'r' : '');
  }

  sort() {
    this.sorted = !this.sorted;
  }

  navigate(id) {
    this.navController.navigateForward('view-word', {queryParams: {id}});
  }
  ngOnChanges() {
    this.getWords(null);
  }

  doRefresh(event) {
    this.getWords(event, this.randomFeature ? 'r' : '');
  }
  getWords(event, mode = '', filter = {}) {
    this.loading = true;
    this.APIService.getWords({mode, filter: {tag: 'Pakman'}, offset: 0})
    .subscribe((data) => {
      this.words = data.data;
      this.loading = false;
    });
    if (event) {
      event.target.complete();
    }
  }

  loadMore(event) {
      setTimeout(() => {
        if (!this.randomFeature) {
          const idx = this.words.length;
          this.APIService.getWords({mode: '', filter: {}, offset: idx})
          .subscribe((data) => {
            if (data.data.length === 0) {
              event.target.complete();
              return;
            }
            this.words = this.words.concat(data.data);
            event.target.complete();
          });
        }

        // App logic to determine if all data is loaded
        // and disable the infinite scroll
        if (this.randomFeature) {
          event.target.disabled = true;
        }
      }, 500);
  }

  randomize() {
    this.randomFeature = !this.randomFeature;
    this.getWords(event, this.randomFeature ? 'r' : '');
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: FilterModalPage,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }

}
