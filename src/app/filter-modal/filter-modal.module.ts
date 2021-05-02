import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FilterModalPageRoutingModule } from './filter-modal-routing.module';

import { FilterModalPage } from './filter-modal.page';
import { HeaderPageModule } from '../header/header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FilterModalPageRoutingModule,
    HeaderPageModule
  ],
  declarations: [FilterModalPage]
})
export class FilterModalPageModule {}
