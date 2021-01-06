import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { FormControl, FormGroup } from '@angular/forms';
import { isEmpty } from 'rxjs/operators';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {
  name = false;
  meaning = false;
  sentence = false;
  tag = false;
  type = false;
  synonym = false;
  words: any[] = [];
  loading = false;
  filterForm = new FormGroup({
    name: new FormControl(''),
    sentence: new FormControl(''),
    type: new FormControl(''),
    tag: new FormControl(''),
    synonym: new FormControl(''),
    meaning: new FormControl(''),
  });

  constructor(private apiService: ApiService, private loadingController: LoadingController) { }

  async presentLoading(msg) {
    const loading = await this.loadingController.create({
      message: msg,
      spinner: 'bubbles'
    });
    await loading.present().then(() => {
      console.log('presented');
      if (!this.loading) {
        loading.dismiss().then(() => console.log('abort presenting'));
      }
    });

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

  setName(event) {
    this.name = event.detail.checked;
    if (this.name === false) {
      this.filterForm.get('name').setValue('');
    }
  }
  setMeaning(event) {
    this.meaning = event.detail.checked;
    if (this.meaning === false) {
      this.filterForm.get('meaning').setValue('');
    }
  }
  setSentence(event) {
    this.sentence = event.detail.checked;
    if (this.sentence === false) {
      this.filterForm.get('sentence').setValue('');
    }
  }
  setTag(event) {
    this.tag = event.detail.checked;
    if (this.tag === false) {
      this.filterForm.get('tag').setValue('');
    }
  }
  setSynonym(event) {
    this.synonym = event.detail.checked;
    if (this.synonym === false) {
      this.filterForm.get('synonym').setValue('');
    }
  }
  setType(event) {
    this.type = event.detail.checked;
    if (this.type === false) {
      this.filterForm.get('type').setValue('');
    }
  }

  isEmpty() {
    return ! (this.filterForm.get('name').value ||
    this.filterForm.get('meaning').value ||
    this.filterForm.get('sentence').value || this.filterForm.get('tag').value || this.filterForm.get('type').value || this.filterForm.get('synonym').value);
  }
  applyFilters() {
    this.loading = true;
    this.presentLoading('Applying filters');
    const options = {
      name: this.filterForm.get('name').value,
      meaning: this.filterForm.get('meaning').value,
      type: this.filterForm.get('type').value,
      tag: this.filterForm.get('tag').value,
      synonym: this.filterForm.get('synonym').value,
      sentence: this.filterForm.get('sentence').value,
    };
    console.log(options);
    this.apiService.getWords({mode: 'search', options});
    this.loading = false;
    return this.apiService.getWordsUpdateListener();
  }
}
