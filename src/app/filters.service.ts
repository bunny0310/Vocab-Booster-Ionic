import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {
  random = true;
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

  constructor(private apiService: ApiService) { }

  setRandom(event) {
    this.random = event.detail.checked;
  }
  setName(event) {
    this.name = event.detail.checked;
    this.random = false;
  }
  setMeaning(event) {
    this.meaning = event.detail.checked;
    this.random = false;
  }
  setSentence(event) {
    this.sentence = event.detail.checked;
    this.random = false;
  }
  setTag(event) {
    this.tag = event.detail.checked;
    this.random = false;
  }
  setSynonym(event) {
    this.synonym = event.detail.checked;
    this.random = false;
  }
  setType(event) {
    this.type = event.detail.checked;
    this.random = false;
  }

  applyFilters() {
    const options = {
      name: this.filterForm.get('name').value,
      meaning: this.filterForm.get('meaning').value,
      type: this.filterForm.get('type').value,
      tag: this.filterForm.get('tag').value,
      synonym: this.filterForm.get('synonym').value,
      sentence: this.filterForm.get('sentence').value,
    };
  }
}
