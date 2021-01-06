import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  selectTabUpdated = new Subject<{msg: string}>();

  constructor() { }

  public selectTab(tab) {
    console.log(tab);
    this.selectTabUpdated.next({msg: tab});
  }
  public selectTabAsObservable() {
    return this.selectTabUpdated.asObservable();
  }
}
