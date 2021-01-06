import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  selectTabUpdated = new Subject<{msg: string}>();
  wordsDataUpdated = new Subject<{msg: [], filtersApplied: boolean}>();
  clearFormMessage = new Subject<{msg: string}>();
  filterFormStatus = new Subject<{msg: {}}>();

  constructor() { }

  public selectTab(tab) {
    console.log(tab);
    this.selectTabUpdated.next({msg: tab});
  }
  public selectTabAsObservable() {
    return this.selectTabUpdated.asObservable();
  }

  public sendFilterFormStatus(data) {
    this.filterFormStatus.next({msg: data});
  }

  public sendFilterFormStatusAsObservable() {
    return this.filterFormStatus.asObservable();
  }

  public sendWordsData(data, status) {
    this.wordsDataUpdated.next({msg: data, filtersApplied: status});
  }

  public sendWordsDataAsObservable() {
    return this.wordsDataUpdated.asObservable();
  }

  public clearForm() {
    this.clearFormMessage.next({msg: 'clear'});
  }

  public clearFormAsObservable() {
    return this.clearFormMessage.asObservable();
  }
}
