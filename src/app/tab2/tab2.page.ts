import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  addWordForm = new FormGroup({
    sentence: new FormControl('')
  });
  sentences: number[] = [];
  constructor() {}

  addSentence(event) {
    if (event.key === 'Enter' && this.addWordForm.get('sentence').value !== '') {
      this.sentences.push(this.addWordForm.get('sentence').value);
      this.addWordForm.get('sentence').reset();
    }
  }
  removeSentence(i) {
    this.sentences.splice(i, 1);
  }
}
