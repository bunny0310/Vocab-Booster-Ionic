import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { FormControl, FormGroup } from '@angular/forms';
import { isEmpty } from 'rxjs/operators';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {
  constructor(private apiService: ApiService, private loadingController: LoadingController) { }

  originalFormat: any = {
    name: '',
    meaning: '',
    tag: '',
    sentence: '',
    synonym: '',
    type: ''
  };

  savedData = Object.assign([], this.originalFormat);

  resetFilters() {
    this.savedData = Object.assign([], this.originalFormat);
  }
}
