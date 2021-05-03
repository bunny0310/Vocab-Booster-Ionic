import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-view-word',
  templateUrl: './view-word.page.html',
  styleUrls: ['./view-word.page.scss'],
})
export class ViewWordPage implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) { }

  word: {} = null;
  id = '';
  dummyArr = ['', '', '', '', ''];
  loading = true; // boolean to check if the word is being loaded
  ngOnInit() {
    this.route.queryParams
    .subscribe((params) => {
      this.id = params.id;
    });
    this.apiService.getWord(this.id)
    .pipe(delay(1000))
    .subscribe((data) => {
      this.word = data.data;
      this.loading = false;
    });
  }

}
