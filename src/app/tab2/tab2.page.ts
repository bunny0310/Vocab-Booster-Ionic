import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ValidatorFn, AbstractControl, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

const url = 'https://vocab-booster.herokuapp.com';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{
  sentences: string[] = [];
  loading = false;
  tags: string[] = [];
  synonyms: string[] = [];
  addWordForm = new FormGroup({
    name: new FormControl('', Validators.required),
    meaning: new FormControl('', Validators.required),
    sentence: new FormControl('', this.emptyArrayValidation(this.sentences)),
    tag: new FormControl(''),
    types: new FormControl('', Validators.required),
    synonym: new FormControl('', this.emptyArrayValidation(this.synonyms))
  });
  constructor(private toastController: ToastController,
              private authService: AuthService,
              private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.addWordForm.reset();
    this.sentences = [];
    this.tags = [];
    this.synonyms = [];
  }

  ionViewWillEnter() {
    this.addWordForm.reset();
    this.sentences = [];
    this.tags = [];
    this.synonyms = [];
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
emptyArrayValidation(arr): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null =>
    arr.length > 0 ? null : {error: control.value};
}

  addSentence(event) {
    if (event.key === 'Enter' && this.addWordForm.get('sentence').value !== '') {
      this.sentences.push(this.addWordForm.get('sentence').value);
      this.addWordForm.get('sentence').reset();
    }
  }
  addTag(event) {
    if (event.key === 'Enter' && this.addWordForm.get('tag').value !== '') {
      this.tags.push(this.addWordForm.get('tag').value);
      this.addWordForm.get('tag').reset();
    }
  }
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

  addWord() {
    const sentences = [];
    for (const sentence of this.sentences) {
      sentences.push({tag: sentence});
    }
    const synonyms = [];
    for (const s of this.synonyms) {
      synonyms.push({tag: s});
    }
    const tags = [];
    for (const t of this.tags) {
      tags.push({tag: t});
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
      const headers = new HttpHeaders({Authorization: 'Bearer ' + localStorage.getItem('user-vb-responsive')});
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
