import { Component, OnInit, OnChanges } from '@angular/core';
import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';
import { FormGroup, FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import { PopoverController } from '@ionic/angular';
import { FilterComponent } from '../filter/filter.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit, OnChanges{
  loading = false;
  words: any[] = [];
  skeletonArray: number[] = [1, 1, 1, 1, 1];
  constructor(private APIService: ApiService, public authService: AuthService, private popoverController: PopoverController) {}
  ngOnInit() {
    this.getWords(null);
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
      component: FilterComponent,
      cssClass: 'popover',
      event: ev,
      translucent: true
    });
    return await popover.present();
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
