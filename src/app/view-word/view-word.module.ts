import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewWordPageRoutingModule } from './view-word-routing.module';

import { ViewWordPage } from './view-word.page';
import { HeaderPageModule } from '../header/header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewWordPageRoutingModule,
    HeaderPageModule
  ],
  declarations: [ViewWordPage]
})
export class ViewWordPageModule {}
