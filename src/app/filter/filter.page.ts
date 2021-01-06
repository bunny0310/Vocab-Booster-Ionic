import { Component, OnInit } from '@angular/core';
import { FiltersService } from '../filters.service';
import { PopoverController, LoadingController } from '@ionic/angular';
import { FormGroup, FormControl } from '@angular/forms';
import { EventsService } from '../events.service';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.page.html',
  styleUrls: ['./filter.page.scss'],
})
export class FilterPage implements OnInit {
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

  constructor(
    public filtersService: FiltersService,
    private pc: PopoverController,
    private events: EventsService,
    private loadingController: LoadingController,
    private apiService: ApiService) { }

  ngOnInit() {
      const options: any = this.filtersService.savedData;
      console.log(options);
      if (options.name !== '') {
        this.name = true;
      }
      else {
        this.name = false;
      }
      if (options.meaning !== '') {
        this.meaning = true;
      }
      else {
        this.meaning = false;
      }
      if (options.sentence !== '') {
        this.sentence = true;
      }
      else {
        this.sentence = false;
      }
      if (options.tag !== '') {
        this.tag = true;
      }
      else {
        this.tag = false;
      }
      if (options.synonym !== '') {
        this.synonym = true;
      }
      else {
        this.synonym = false;
      }
      if (options.type !== '') {
        this.type = true;
      }
      else {
        this.type = false;
      }

      this.filterForm.get('name').setValue(options.name);
      this.filterForm.get('meaning').setValue(options.meaning);
      this.filterForm.get('sentence').setValue(options.sentence);
      this.filterForm.get('type').setValue(options.type);
      this.filterForm.get('tag').setValue(options.tag);
      this.filterForm.get('synonym').setValue(options.synonym);
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

  applyFilters() {
      this.loading = true;
      this.presentLoading('Applying filters');

      const options = {
        name: this.filterForm.get('name').value != null ? this.filterForm.get('name').value : '',
        meaning: this.filterForm.get('meaning').value != null ? this.filterForm.get('meaning').value : '',
        type: this.filterForm.get('type').value != null ? this.filterForm.get('type').value : '',
        tag: this.filterForm.get('tag').value != null ? this.filterForm.get('tag').value : '',
        synonym: this.filterForm.get('synonym').value != null ? this.filterForm.get('synonym').value : '',
        sentence: this.filterForm.get('sentence').value != null ? this.filterForm.get('sentence').value : '',
      };

      let isEmpty = false;
      for (const key of Object.keys(options)) {
        if (options[key] !== '') {
          isEmpty = true;
          break;
        }
      }
      this.apiService.getWords({mode: 'search', options});
      this.apiService.getWordsUpdateListener()
      .subscribe((res) => {
        this.events.sendWordsData(res.data, isEmpty);
      });
      this.filtersService.savedData = options;
      this.loading = false;
      this.pc.dismiss();
  }

}
