import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ValidatorFn, AbstractControl, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

// onst url = 'https://vocab-booster.herokuapp.com';
const url = 'http://localhost:3000';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{
  sentences: string[] = [];
  loading = false;
  tags: string[] = [];
  loadedTags: any[] = [];
  synonyms: string[] = [];
  areTagsAvailable = false; // to check if there are unique tags available
  isUnique = true; // boolean to check if the word typed in unique
  addWordForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    meaning: new FormControl('', Validators.required),
    sentence: new FormControl('', this.emptyArrayValidation(this.sentences)),
    tag: new FormControl(''),
    types: new FormControl('', Validators.required),
    synonym: new FormControl('', this.emptyArrayValidation(this.synonyms))
  });
  loadingTags = false; // boolean to check whether the distinct set of tags is being loaded or not
  checkingForUniqueness = false; // boolean to check whether the word is being checked for duplicacy or not
  constructor(private toastController: ToastController,
              private authService: AuthService,
              private http: HttpClient, private router: Router,
              private apiService: ApiService
              ) {}

  ngOnInit() {
    this.addWordForm.reset();
  }

  ionViewWillEnter() {
    this.addWordForm.reset();
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  // method to validate an empty array
  emptyArrayValidation(arr): ValidatorFn {
      return (control: AbstractControl): { [key: string]: any } | null =>
      arr.length > 0 ? null : {error: control.value};
  }

  // check word for duplicacy
  checkWordForDuplicacy() {
    const val = this.addWordForm.get('name').value;
    if (val === '' || !(/\S/.test(val))) {
      return;
    }
    this.checkingForUniqueness = true;
    this.apiService.getWordUniquenessStatus(val)
    .subscribe((data) => {
      this.isUnique = data.status;
      if (!data.status) {
        this.addWordForm.get('name').setErrors({duplicate: true});
      } else {
        this.addWordForm.get('name').setErrors(null);
      }
      this.checkingForUniqueness = false;
    });
  }
  // method to add a sentence
  addSentence(event) {
    if (event.key === 'Enter' && this.addWordForm.get('sentence').value !== '') {
      this.sentences.push(this.addWordForm.get('sentence').value);
      this.addWordForm.get('sentence').reset();
    }
  }

  // method to add and search for tags
  addSearchTag(event) {
    const val = this.addWordForm.get('tag').value;
    if (val === '' || !(/\S/.test(val))) {
      this.areTagsAvailable = false;
      return;
    }
    this.loadedTags = [];
    this.loadedTags.push(val);
    this.searchTags(val);
  }

  // method to append the tag to the list of tags 
  addTag(item) {
    this.tags.push(item);
    // this.addWordForm.get('tag').reset();
  }

  // method to add a synonym
  addSynonym(event) {
    if (event.key === 'Enter' && this.addWordForm.get('synonym').value !== '') {
      this.synonyms.push(this.addWordForm.get('synonym').value);
      this.addWordForm.get('synonym').reset();
    }
  }

  removeSentence(i) {
    this.sentences.splice(i, 1);
  }
  removeTag(i) {
    this.tags.splice(i, 1);
  }
  removeSynonym(i) {
    this.synonyms.splice(i, 1);
  }

  // search for tags
  searchTags(keyword) {
    this.loadingTags = true;
    this.apiService.getTags(keyword)
    .subscribe((data) => {
      for (const tag of data.data) {
        this.appendTag(tag);
      }
      this.areTagsAvailable = this.loadedTags.length >= 1;
      this.loadingTags = false;
    });
  }

  appendTag(tag) {
    this.loadedTags.push(tag);
  }
  addWord() {
    const sentences = [];
    for (const sentence of this.sentences) {
      sentences.push(sentence);
    }
    const synonyms = [];
    for (const s of this.synonyms) {
      synonyms.push(s);
    }
    const tags = [];
    for (const t of this.tags) {
      tags.push(t);
    }
    const types = [];
    for (const t of this.addWordForm.get('types').value) {
      types.push(t);
    }
    const word = {
      name: this.addWordForm.get('name').value,
      meaning: this.addWordForm.get('meaning').value,
      sentence: sentences,
      tags,
      types,
      synonyms
    };
    const username = this.authService.isAuthenticated() ? this.authService.getUsername(localStorage.getItem('user-vb-responsive') ) : '';
    if (username !== null) {
      this.loading = true;
      const headers = new HttpHeaders({Authorization: localStorage.getItem('user-vb-responsive')});
      this.http.post(url + '/api/add-word', {word: JSON.stringify(word).replace('\'', '"'), username}, {observe: 'response', headers}).
      subscribe((response) => {
        if (response.status === 200) {
          this.presentToast('Your word has been added!');
          this.loading = false;
          this.router.navigate(['']);
        } else {
          this.presentToast('Internal Server Error');
          this.loading = false;
        }
      });
    }
  }
}
