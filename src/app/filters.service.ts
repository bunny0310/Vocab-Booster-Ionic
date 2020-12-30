import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {
  random = true;
  name = false;
  constructor() { }
  setRandom(event) {
    this.random = event.detail.checked;
  }
  setName(event) {
    this.name = event.detail.checked;
  }
  getName() {
    return this.name;
  }
}
