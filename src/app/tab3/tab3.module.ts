import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab3PageRoutingModule } from './tab3-routing.module';
import { HeaderPageModule } from '../header/header.module';
import { TagCloudModule } from 'angular-tag-cloud-module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    ExploreContainerComponentModule,
    Tab3PageRoutingModule,
    HeaderPageModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  declarations: [Tab3Page]
})
export class Tab3PageModule {}
